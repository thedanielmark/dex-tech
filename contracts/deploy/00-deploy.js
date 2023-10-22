const verify = require("../utils/verify")

const { ethers } = require("hardhat")

const developmentChains = ["localhost", "hardhat"]

const deployFactory = async function (hre) {
    // @ts-ignore
    const { getNamedAccounts, deployments, network } = hre
    const { deploy, log } = deployments
    const { deployer, alpha } = await getNamedAccounts()

    // Deploy the FactoryContract
    const FactoryContract = await ethers.getContractFactory("TraderTokenFactory");
    const factory = await FactoryContract.deploy();
    await factory.deployed();
    console.log("FactoryContract deployed to:", factory.address);

    // Create a TraderToken
    // const traderName = "Trader1"; // Replace with the trader's name
    // const traderSymbol = "TT1"; // Replace with the trader's symbol
    // const chatId = "123456789"; // Replace with the chatId
    // const factoryContract = await ethers.getContractAt("FactoryContract", factory.address)
    // const createTraderTokenTx = await factoryContract.createTraderToken(traderName, traderSymbol, chatId);
    // await createTraderTokenTx.wait(1);
    // console.log("TraderToken created");

    // // Get the address of the TraderToken
    // const traderTokenAddress = await factoryContract.getTraderContract(deployer);
    // console.log(`TraderToken address: ${traderTokenAddress}`);

    // // Mint a token to another user
    // const mintTokenForCustomerTx = await factoryContract.mintTokenForCustomer(deployer, alpha);
    // await mintTokenForCustomerTx.wait(1);
    // console.log(`Minted a token to ${alpha}`);

    // // Get the chatID of the TraderToken
    // const chatIdTx = await factoryContract.getChatIDForTrader(traderTokenAddress)
    // // await chatIdTx.wait(1);
    // console.log(`ChatID: ${chatIdTx}`);

}

module.exports = deployFactory
deployFactory.tags = ["all", "factory"]
