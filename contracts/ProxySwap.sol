// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract ProxySwap {

    IUniswapV2Router private router;

    constructor(address _uniswapRouter) {
        require(_uniswapRouter != address(0), "Invalid Uni router address");

        router = IUniswapV2Router(_uniswapRouter);
    }

    function swapExactInput(uint _tokenIn_amount, uint _tokenOutMin_amount, address _tokenIn, address _tokenOut) external returns (uint amountOut) {
        IERC20 tokenIn = IERC20(_tokenIn);

        tokenIn.transferFrom(msg.sender, address(this), _tokenIn_amount);
        tokenIn.approve(address(router), _tokenIn_amount);

        address[] memory _path = new address[](2);
        _path[0] = _tokenIn;
        _path[1] = _tokenOut;

        uint256[] memory _result = router.swapExactTokensForTokens(
            _tokenIn_amount, _tokenOutMin_amount, _path, msg.sender, block.timestamp
        );

        return _result[1];
    } 

    function swapExactOutput(uint _tokenOut_amount, uint _maxInToken_amount, address _tokenIn, address _tokenOut) external returns (uint amountOut) {
        IERC20 tokenIn = IERC20(_tokenIn);

        tokenIn.transferFrom(msg.sender, address(this), _maxInToken_amount);
        tokenIn.approve(address(router), _maxInToken_amount);

        address[] memory _path = new address[](2);
        _path[0] = _tokenIn;
        _path[1] = _tokenOut;

        uint256[] memory _result = router.swapTokensForExactTokens(
            _tokenOut_amount, _maxInToken_amount, _path, msg.sender, block.timestamp
        );

        // Refund _maxInToken_amount to msg.sender
        if (_result[0] < _maxInToken_amount) {
            tokenIn.transfer(msg.sender, _maxInToken_amount - _result[0]);
        }

        return _result[1];
    }
}

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount)
        external
        returns (bool);
    function allowance(address owner, address spender)
        external
        view
        returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount)
        external
        returns (bool);
}

interface IUniswapV2Router {
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function swapTokensForExactTokens(
        uint256 amountOut,
        uint256 amountInMax,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);
}