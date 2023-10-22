require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("@nomiclabs/hardhat-ethers")
require("hardhat-gas-reporter")
require("dotenv/config")
require("solidity-coverage")
require("hardhat-deploy")
const { HardhatUserConfig } = require("hardhat/config")

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || ""
const SEPOLIA_RPC_URL =
    process.env.SEPOLIA_RPC_URL || "https://eth-sepolia.g.alchemy.com/v2/YOUR-API-KEY"
const PRIVATE_KEY = process.env.PRIVATE_KEY || "privateKey"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""

const config = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
            allowUnlimitedContractSize: true
        },
        localhost: {
            chainId: 31337,
            allowUnlimitedContractSize: true
        },
        polygonMumbai: {
            chainId: 80001,
            allowUnlimitedContractSize: true,
            gas: 2100000,
            gasPrice: 8000000000,
            url: "https://polygon-mumbai-bor.publicnode.com	",
            accounts: [process.env.PRIVATE_KEY || ""],
        },
        scrollSepolia: {
            url: 'https://sepolia-rpc.scroll.io' || '',
            accounts:
                process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
        },
        mantleTest: {
            url: "https://rpc.testnet.mantle.xyz" || '', // testnet
            accounts:
                [process.env.PRIVATE_KEY || '']
        }
    },
    etherscan: {
        // yarn hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
        apiKey: {

        },
        customChains: [
            {
                network: 'scrollSepolia',
                chainId: 534351,
                urls: {
                    apiURL: 'https://sepolia-blockscout.scroll.io/api',
                    browserURL: 'https://sepolia-blockscout.scroll.io/',
                },
            },
        ],
    },
    solidity: "0.8.19",
    gasReporter: {
        enabled: true,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
        // coinmarketcap: COINMARKETCAP_API_KEY,
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        alpha: {
            default: 1,
        },
        beta: {
            default: 2,
        },
        charlie: {
            default: 3,
        },
        delta: {
            default: 4,
        },
        echo: {
            default: 5,
        }
    },
    mocha: {
        timeout: 200000, // 200 seconds max for running tests
    },
}

module.exports = config