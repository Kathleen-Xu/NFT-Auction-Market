var nft = artifacts.require("./nft.sol");
var Auction = artifacts.require("./Auction.sol");


module.exports = async function(deployer) {
  await deployer.deploy(nft);
  var token = await nft.deployed()
  await deployer.deploy(Auction, token.address);
  var auctionplace = await Auction.deployed()
  await token.setAuctionplace(auctionplace.address);
};
