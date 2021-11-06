// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;
import "./nft.sol";

contract Auction {
    // 导入nft的集合
    nft private nftset;

    // 单项拍卖的信息
    struct AuctionItem {   
        // 该项拍卖的uid
        uint256 id;
        // 拍卖基本信息
        address payable beneficiary; //受益人，即拍卖发起者
        uint256 tokenId;             //所拍卖的 NFT id   
        uint auctionEnd;             // 拍卖截止时间
        uint startPrice;             // 起拍价
        // 拍卖的当前状态
        address highestBidder;   //当前最高出价者
        uint highestBid;         //当前最高出价值
        bool ended;              // 拍卖结束后设为 true，将禁止所有的变更
        bool haveBid;            // 判断是否有人进行出价，有人出价后设为 true，允许转账授权等操作  
        bidhistory[] bidhis;
        
    } 

    //拍卖的历史记录(由触发事件HighestBidIncreased进行记录) 
    struct bidhistory {
        address bidder;      //所有历史竞拍者数组
        uint bid;            //所有历史竞拍者的出价       
    }
    //可以取回的之前的出价
    mapping(address => uint) public pendingReturns;   
    AuctionItem[] public aucItem;
    mapping(uint256 => bool) public activeItems;

    // 变更触发的事件
    event AuctionAdded(uint256 id, uint256 tokenId, uint auctionEnd, uint startPrice);
    event HighestBidIncreased(uint256 id, address bidder, uint amount);
    event AuctionEnded(uint256 id, address winner, uint amount);

    constructor(nft _nftset) {
        nftset = _nftset;
    }

    modifier OnlyOwner(uint256 tokenId) {
        require(nftset.ownerOf(tokenId) == msg.sender, "Sender does not own the item");
        _;
    }

    modifier HasTransferApproval(uint256 tokenId) {
        require(nftset.getApproved(tokenId) == address(this), "Auction is not approved");
        _;
    }
    //modifier HasTransferApproval(uint256 tokenId) {
    //    require(nftset.getApproved(tokenId) == msg.sender, "Auction is not approved");
    //    _;
    //}

    modifier ItemExists(uint256 id) {
        require(id < aucItem.length && aucItem[id].id == id, "Could not find item");
        _;
    }

    modifier IsActive(uint256 id) {
        require(block.timestamp <= aucItem[id].auctionEnd, "Auction time is over.");
        _;
    }
    modifier IsnotActive(uint256 id) {
        require(block.timestamp > aucItem[id].auctionEnd, "Auction hasn't finished yet.");
        _;
    }
    modifier IsNotEnded(uint256 id) {
        require(!aucItem[id].ended, "Action is over");
        _;
    }
    modifier AbleFetch(uint256 id) {
        require(!aucItem[id].haveBid, "You cannot fetch the nft.");
        _;
    }

    modifier AbleClaim(uint256 id) {
        require(
            aucItem[id].haveBid && aucItem[id].highestBidder == msg.sender, 
            "You cannot claim the nft."
        );
        _;
    }


    /// 为 id 为 `_tokenId` 的 NFT 创建一个拍卖，
    /// 拍卖时间为 `_biddingTime` 秒，
    /// 起拍价为 `_startPrice`
    function AuctionAdd(uint256 _tokenId, uint _biddingTime, uint _startPrice) 
        OnlyOwner(_tokenId)        
        ///HasTransferApproval(tokenId)
        external
        returns (uint256) {
            require(!activeItems[_tokenId], "This nft is already put up for auctioned");
            uint256 newId = aucItem.length;
            aucItem.push();
            aucItem[newId].id = newId;
            aucItem[newId].beneficiary = payable(msg.sender);
            aucItem[newId].tokenId = _tokenId;
            aucItem[newId].auctionEnd = block.timestamp + _biddingTime;
            aucItem[newId].startPrice = _startPrice;
            aucItem[newId].highestBidder = msg.sender;  
            aucItem[newId].highestBid = 0;
            aucItem[newId].ended = false; 
            aucItem[newId].haveBid = false;
            
            activeItems[_tokenId] = true;

            assert(aucItem[newId].id == newId);
            emit AuctionAdded(newId, _tokenId, block.timestamp + _biddingTime, _startPrice);
            return newId;
            
        }

    /// 对拍卖进行出价，具体的出价随交易一起发送。
    /// 如果没有在拍卖中胜出，则返还出价。
    function bid(uint256 id) 
        ItemExists(id)
        IsNotEnded(id)
        IsActive(id)
        ///HasTransferApproval(aucItem[id].tokenId)
        payable 
        external {

            // 如果出价低于起拍价，返还你的钱
            require(
                msg.value >= aucItem[id].startPrice, 
                "Your bid is below the starting price."
            );      
            // 如果出价不够高，返还你的钱
            require(
                msg.value > aucItem[id].highestBid,
                "There already is a higher bid."
            );
            // 拍卖发起者不能自己参与拍卖
            require(
                msg.sender != aucItem[id].beneficiary,
                "You cannot bid in the auction you initiate."
            );

            if (aucItem[id].highestBid != 0) {
                // 返还出价时，简单地直接调用 highestBidder.send(highestBid) 函数，
                // 是有安全风险的，因为它有可能执行一个非信任合约。
                // 更为安全的做法是让接收方自己提取金钱。
                pendingReturns[aucItem[id].highestBidder] += aucItem[id].highestBid;
            }
            aucItem[id].highestBidder = msg.sender;
            aucItem[id].highestBid = msg.value;
            if (!aucItem[id].haveBid)
                aucItem[id].haveBid = true;
            
            aucItem[id].bidhis.push();
            uint len = aucItem[id].bidhis.length;
            aucItem[id].bidhis[len - 1].bidder = msg.sender;
            aucItem[id].bidhis[len - 1].bid = msg.value;
            //aucItem[id].beneficiary.transfer(msg.value);

            emit HighestBidIncreased(id, msg.sender, msg.value);
        }

    /// 取回出价（当该出价已被超越）
    function withdraw() 
    external
    returns (bool) {
        require(
            pendingReturns[msg.sender] > 0, 
            "You have no money to withdraw."
        );
        uint amount = pendingReturns[msg.sender];
        bool isReturned;
        
        pendingReturns[msg.sender] = 0;
        isReturned = (payable(msg.sender)).send(amount);
        if (!isReturned) {
            // 这里不需抛出异常，只需重置未付款
            pendingReturns[msg.sender] = amount;
            return false;
        }
        return true;
    }

    function fetch(uint256 id)
    ItemExists(id)
    IsnotActive(id)
    AbleFetch(id)
    HasTransferApproval(aucItem[id].tokenId)
    external {
        aucItem[id].ended = true;
        activeItems[aucItem[id].tokenId] = false;        
    }


    function claim(uint256 id)
    ItemExists(id)
    IsnotActive(id)
    AbleClaim(id)
    HasTransferApproval(aucItem[id].tokenId)
    external {
        aucItem[id].ended = true;
        activeItems[aucItem[id].tokenId] = false; 
        nftset.safeTransferFrom(aucItem[id].beneficiary, msg.sender, aucItem[id].tokenId);
        nftset.ownerchange(aucItem[id].tokenId, msg.sender);
        aucItem[id].beneficiary.transfer(aucItem[id].highestBid);
        emit AuctionEnded(id, aucItem[id].highestBidder, aucItem[id].highestBid);          
    }

    function totalForAuction() external view returns(uint256) {
        return aucItem.length;
    }

    function getallauction() external returns(AuctionItem[] memory) {
        return aucItem;
    } 

}