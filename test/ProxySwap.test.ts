import { IERC20__factory } from '../typechain-types/index.ts';
import { loadFixture, ethers, expect } from './setup.ts';

describe("test swap functions", async function() {

    async function deploy() {
        //63.7 eth
        const ethUser = await ethers.getImpersonatedSigner("0x93793Bd1f3e35a0Efd098c30e486A860A0ef7551");
        //25000
        const usdcUser = await  ethers.getImpersonatedSigner("0xD1Fa51f2dB23A9FA9d7bb8437b89FB2E70c60cB7");

        const factory = await ethers.getContractFactory("ProxySwap", ethUser)
        const contract = await factory.deploy("0x065e3DbaFCb2C26A978720f9eB4Bce6aD9D644a1")
        await contract.waitForDeployment();

        return {ethUser, usdcUser, contract};
    }

    it("should swap", async function() {
        const {ethUser, usdcUser, contract} = await loadFixture(deploy)

        const eth = await IERC20__factory.connect("0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", usdcUser);//abi erc20
        const usdc = await IERC20__factory.connect("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", usdcUser);
        
        //send 1 eth expect min 2600 usdc
        const change_one_eth_to_usdc_tx = await contract.connect(ethUser).swapExactInput(ethers.parseUnits("1", 18), 2600, eth.getAddress(), usdc.getAddress());
        
        expect(change_one_eth_to_usdc_tx).to.changeEtherBalance(ethUser, -10)
    })
})
