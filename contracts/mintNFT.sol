// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract StackUpNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // Mapping from token ID to token URI
    mapping(uint256 => string) private _tokenURIs;

    constructor(address initialOwner)
        ERC721URIStorage()
        ERC721("StackUp x DeFiChain Campaign", "SUDC")
        Ownable(initialOwner)
    {}

    function mint(string memory tokenURI) public {
        _tokenIdCounter.increment();
        uint256 newTokenId = _tokenIdCounter.current();
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
    }

    function getLastTokenId() external view returns (uint256) {
        return _tokenIdCounter.current();
    }
}
