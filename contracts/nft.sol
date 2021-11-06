// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract nft is ERC721Enumerable{
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    address public auctionplace;

    struct nftItem {
        uint256 id;
        string name;
        string description;
        address creator;
        string hash;
        history[] his;
    }
    struct history {
        uint256 owntime;
        address owner;
    }
    nftItem[] public nftItems;

    constructor() ERC721("nft", "NFT") {
        nftItems.push();
    }

    function mint(string calldata hash, string calldata name, string calldata description) public returns (uint256){
        _tokenIds.increment();
        uint256 newId = _tokenIds.current();
        _safeMint(msg.sender, newId);
        approve(auctionplace, newId);
        nftItems.push();

        nftItems[newId].id = newId;
        nftItems[newId].name = name;
        nftItems[newId].description = description;
        nftItems[newId].creator = msg.sender; 
        nftItems[newId].hash = hash;
        nftItems[newId].his.push();
        nftItems[newId].his[0].owntime = block.timestamp;
        nftItems[newId].his[0].owner = msg.sender; 
        
        return newId;
    }


    function setAuctionplace(address auction) public {
        auctionplace = auction;
    }


    function ownerchange(uint256 id, address newowner) public {
        nftItems[id].his.push();
        uint len = nftItems[id].his.length;
        nftItems[id].his[len - 1].owntime = block.timestamp;
        nftItems[id].his[len - 1].owner = newowner;


    }
    function getallnft() external returns(nftItem[] memory) {
        return nftItems;
    } 




}