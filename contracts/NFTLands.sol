// contracts/NFTLands.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract NFTLands is ERC721Enumerable {
    using Strings for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    string private baseURI;
    constructor(string memory baseUri) ERC721("NFTLands", "NFTL") {
        baseURI = baseUri;
    }

    function tokenURI(uint256 tokenId) override view public returns (string memory) {
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString())) : "";
    }

    function mintTo(address receiver)
        public
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _safeMint(receiver, newItemId);        
        return newItemId;
    }

    // event Edit(uint256 tokenId, string cid);
    // function editPlot(uint256 tokenId, string memory cid) public returns (uint256) {
    //     if (_exists(tokenId) && ownerOf(tokenId) == msg.sender) {
    //         _setTokenURI(tokenId, cid);
    //     } else {
    //         _safeMint(msg.sender, tokenId);
    //         _setTokenURI(tokenId, cid);
    //     }
    //     emit Edit(tokenId, cid);
        
    //     return tokenId;
    // }
}
