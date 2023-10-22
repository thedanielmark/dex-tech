// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TraderToken is ERC721, Ownable {
    uint256 private _nextTokenId;

    // Mapping to keep track of how many NFTs each user has minted
    mapping(address => uint256) public mintedCount;

    struct MintInfo {
        address minter;
        uint256 tokenId;
        uint256 mintValue;
    }

    MintInfo[] public mintedTokens;

    constructor(string memory contractName, string memory contractSymbol, address initialOwner)
        ERC721(contractName, contractSymbol)
        Ownable()
        {}

    function mintToken(address customer, uint256 keyFee) public payable {
        require(msg.value >= keyFee, "Insufficient funds to mint NFT");
        uint256 tokenId = _nextTokenId++;
        _safeMint(customer, tokenId);
        mintedCount[customer]++;
        
        // Store minting information
        mintedTokens.push(MintInfo(customer, tokenId, msg.value));
    }

    // Withdraw accumulated ETH balance
    function withdrawBalance() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
