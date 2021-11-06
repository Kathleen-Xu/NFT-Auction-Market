import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";


// import web3
import getWeb3 from "../../utils/getWeb3";

// import contracts
import nft from "../../contracts/nft.json";
import Auction from "../../contracts/Auction.json";

// import redux
import {
  setNFT,
  setAccount,
  setNFTContract,
  setAuctionContract
} from "../../store/action";

// import component
import MyCard from "../../components/Card/index";
//import DropZone from "../../components/DropZone";

import { useStyles } from "./styles";


const Main = () => {
  const classes = useStyles();
  const state = useSelector(state => {return state});
  console.log(state);
  const dispatch = useDispatch();
  
  useEffect(() => {
    let nftlist = [];
    const init = async () => {
      try {
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();

        if (typeof accounts == undefined) {
          alert("Please login with Metamask!");
        }

        const networkId = await web3.eth.net.getId();
        try {
          const NFTContract = new web3.eth.Contract(
            nft.abi,
            nft.networks[networkId].address
          );
          console.log(NFTContract);
          const AuctionContract = new web3.eth.Contract(
            Auction.abi,
            Auction.networks[networkId].address 
          );
          const totalNFT = await NFTContract.methods
            .totalSupply()
            .call();
          const totalAuction = await AuctionContract.methods
            .totalForAuction()
            .call();

          let items = await NFTContract.methods.getallnft().call();
          for (var tokenId = 1; tokenId <= totalNFT; tokenId++) {
            //let item = await NFTContract.methods.nftItems(tokenId).call();
            let item = items[tokenId];
            let owner = await NFTContract.methods.ownerOf(tokenId).call();

            nftlist.push({
              tokenId: item.id,
              name: item.name,
              creator: item.creator,
              owner: owner,
              hash: item.hash,
              description: item.description,
              isForAuc: false,
              ownhistory: item.his,
              aucId: null,
              aucEnd: null,
              startPrice: null,
              higBidder: null,
              higBid: null,
              ended: null,
              haveBid: null,
              bidhistory: null
              
            });
          }
          if (totalAuction > 0) {
            let items = await AuctionContract.methods.getallauction().call();
            for (var aucId = 0; aucId < totalAuction; aucId++) {
              //let item = await AuctionContract.methods.aucItem(aucId).call();
              let item = items[aucId];
              let isactive = await AuctionContract.methods.activeItems(item.tokenId).call();
              //console.log(item.bidhis);
              let nftListIndex = nftlist.findIndex(
                (i) => i.tokenId === item.tokenId
              );

              nftlist[nftListIndex] = {
                ...nftlist[nftListIndex],
                isForAuc: isactive,
                aucId: item.id,
                aucEnd: item.auctionEnd,
                startPrice: item.startPrice,
                higBidder: item.highestBidder,
                higBid: item.highestBid,
                ended: item.ended,
                haveBid: item.haveBid,
                bidhistory: item.bidhis

              };
            }
          }
          dispatch(setAccount(accounts[0]));
          dispatch(setNFTContract(NFTContract));
          dispatch(setAuctionContract(AuctionContract));
          dispatch(setNFT(nftlist));              
        } catch (error) {
          console.error("Error", error);
          alert(
            "Contracts not deployed to the current network " +
              networkId.toString()
          );
        }                
      } catch (error) {
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.` +
            error
        );
        console.error(error);
      }
    };
    init();
  }, [dispatch]);

  //console.log("Nft :", nftnft);

  const nftItem = useSelector((state) => state.allNft.nft);
  console.log(nftItem);
  const acc = useSelector((state) => state.allNft.account);
  return (
    <div>
      {nftItem && 
      <section>
        {/*<Typography className={classes.title}>NFTs On Auction</Typography>*/}
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          className={classes.nfts}
        >
          {nftItem.map((nft) => {
            if(nft.isForAuc) {
              return (
                <Grid item className={classes.nft}  key={nft.tokenId}>
                  <MyCard 
                    tokenId={nft.tokenId} 
                    name={nft.name} 
                    imghash={nft.hash} 
                    price={nft.startPrice}
                    
                  />
                </Grid>

              );
            }

          })}
            
            
        </Grid>
          </section>}

    </div>
    
  );
    



}

export default Main;

