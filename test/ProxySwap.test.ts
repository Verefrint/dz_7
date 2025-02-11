import { IERC20__factory } from '../typechain-types/index.ts';
import { loadFixture, ethers, expect } from './setup.ts';

describe("test swap functions", async function() {

    async function deploy() {
        //63.7 eth
        const ethUser = await ethers.getImpersonatedSigner("0x6B44ba0a126a2A1a8aa6cD1AdeeD002e141Bcd44");

        const factory = await ethers.getContractFactory("ProxySwap", ethUser)
        const contract = await factory.deploy("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D")
        await contract.waitForDeployment();

        return {ethUser, contract};
    }

    it("should swap 1 eth to usdc", async function() {
        const {ethUser, contract} = await loadFixture(deploy)

        const weth = await IERC20__factory.connect("0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", ethUser);
        const usdc = await IERC20__factory.connect("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", ethUser)

        const tr = await weth.approve(contract.getAddress(), ethers.parseUnits("1", 18));

        const initialUSDCBalance = await usdc.balanceOf(ethUser.getAddress());

        console.log(initialUSDCBalance)
        
        //send 1 eth expect min 2600 usdc
        const change_one_eth_to_usdc_tx = await contract.connect(ethUser).swapExactInput(ethers.parseUnits("1", 18), 2600, weth.getAddress(), usdc.getAddress());

        const finalUSDCBalance = await usdc.balanceOf(ethUser.getAddress());

        console.log(finalUSDCBalance)
        
        expect(finalUSDCBalance).to.be.gt(initialUSDCBalance);
    })

    it("should return 1000 usdc", async function() {
        const {ethUser, contract} = await loadFixture(deploy)

        const weth = await IERC20__factory.connect("0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", ethUser);
        const usdc = await IERC20__factory.connect("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", ethUser)

        await weth.approve(contract.getAddress(), ethers.parseUnits("1", 18));

        const initialUSDCBalance = await usdc.balanceOf(ethUser.getAddress());

        console.log(initialUSDCBalance)
        
        //send 1 eth expect min 2600 usdc
        const change_one_eth_to_usdc_tx = await contract.connect(ethUser).swapExactOutput(1000, ethers.parseUnits("1", 18), weth.getAddress(), usdc.getAddress());

        const finalUSDCBalance = await usdc.balanceOf(ethUser.getAddress());

        console.log(finalUSDCBalance)
        
        expect(finalUSDCBalance).to.be.eq(1000);
    })
})
