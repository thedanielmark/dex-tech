// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./TraderToken.sol";

contract TraderTokenFactory {
    address public owner;

    mapping(address => address) public traderContracts;
    mapping(address => address[]) public userTraders; // New mapping to store trader addresses for users
    mapping(address => address[]) public customerTraders; // New mapping to store trader addresses for customers

    event TraderTokenCreated(address indexed trader, address tokenAddress);
    event TokenMinted(address indexed trader, address customer);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    function createTraderToken(
        string memory contractName,
        string memory contractSymbol
    ) public returns (address) {
        require(
            traderContracts[msg.sender] == address(0),
            "Trader contract already exists"
        );

        TraderToken newToken = new TraderToken(contractName, contractSymbol, msg.sender);
        address traderAddress = address(newToken);
        traderContracts[msg.sender] = traderAddress;
        userTraders[msg.sender].push(traderAddress); // Add the trader address to the user's list

        emit TraderTokenCreated(msg.sender, traderAddress);
        return traderAddress;
    }

    function mintTokenForCustomer(address trader, address customer, uint256 keyFee)
        public
        payable
    {
        address traderContract = traderContracts[trader];
        require(traderContract != address(0), "Trader contract does not exist");

        emit TokenMinted(trader, customer);
        TraderToken(traderContract).mintToken{value: msg.value}(customer, keyFee);
        customerTraders[customer].push(trader); // Add the trader contract to the customer's list
    }

    function getTraderContract(address trader) public view returns (address) {
        return traderContracts[trader];
    }

    function getUserTraders(address user)
        public
        view
        returns (address[] memory)
    {
        return userTraders[user];
    }

    function getCustomerTraders(address customer)
        public
        view
        returns (address[] memory)
    {
        return customerTraders[customer];
    }

    function withdrawFunds() public onlyOwner {
        uint256 contractBalance = address(this).balance;
        require(contractBalance > 0, "Contract has no balance to withdraw");

        uint256 ownerShare = (contractBalance * 90) / 100;
        payable(owner).transfer(ownerShare);
    }

    function checkTrader(address trader) public view returns (bool) {
        address traderContract = traderContracts[trader];
        return (traderContract != address(0));
    }
}
