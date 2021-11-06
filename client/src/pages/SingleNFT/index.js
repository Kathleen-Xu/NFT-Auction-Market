// import

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";

import Countdown from 'react-countdown';
import moment from 'moment';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from "@material-ui/core/Typography";
import InputAdornment from "@material-ui/core/InputAdornment";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import Web3 from "web3";
import getWeb3 from "../../utils/getWeb3";

import nft from "../../contracts/nft.json";
import Auction from "../../contracts/Auction.json";


import { 
    setNFT,
    setAccount,
    setNFTContract,
    setAuctionContract,
    selectNFT, 
    removeNFT } from "../../store/action";

import { useStyles } from "./styles.js";

const SingleNFT = () => {
    
    const classes = useStyles();

    const {nftId} = useParams();

    const [formData, setFormData] = useState({
        startPrice: "",
        aucTime: "",
    });
    const [formData2, setFormData2] = useState({
        bidprice: "",
    });

    const dispatch = useDispatch();
    useEffect(() => {
        if (nftId && nftId !== "" && nftItem) dispatch(selectNFT(nftItem[0]));
        return () => {
            dispatch(removeNFT());
        };
    }, [nftId]);


    function handleInputChange(event) {
        let { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }
    
    function handleInputChange2(event) {
        let { name, value } = event.target;
        setFormData2({ ...formData2, [name]: value });
    }

    useEffect(() => {
        let nftlist = [];
        let hisbidders = [];
        let hisbids = [];
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
              //setover((nftsingle && Date.now() > nftsingle.aucEnd * 1000) ? true:false);
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
    
    const account = useSelector((state) => state.allNft.account);
    const AuctionContract = useSelector((state) => state.allNft.AuctionContract);    
    const nftselect = useSelector((state) => state.nft);
    const nftItems = useSelector((state) => state.allNft.nft);
    const nftItem = useSelector((state) => ((typeof(nftItems)==="undefined") ? []:(state.allNft.nft.filter((nft) => nft.tokenId === nftId))));

    const nftsingle = (nftItem.length === 0) ? '':nftItem[0];
    //console.log(nft);
    console.log(nftItem);
    console.log(nftItem);
    console.log(nftsingle);

    //const [over, setover] = useState(false);






    // 1. AuctionAdd
    async function putForAuc(event) {
        event.preventDefault();
        try {
            //调用函数
            const { startPrice, aucTime } = formData;
            const id = nftItem[0].tokenId;
            console.log(id);
            const sec = parseInt(aucTime*24*60*60);
            const wei = Web3.utils.toWei(startPrice);
            const receipt = await AuctionContract.methods
              .AuctionAdd(id, sec, wei)
              .send({gas: 210000, from: account});
            console.log(receipt);

        } catch (error) {
            console.error("Error, puting for sale: ", error);
            alert("Error while puting for sale!");
        }

    }
    // 2. bid
    async function bid(event) {
        event.preventDefault();
        try {
            //调用函数
            const {bidprice} = formData2;
            const aucid = nftItem[0].aucId;
            const wei = Web3.utils.toWei(bidprice);
            const receipt = await AuctionContract.methods
              .bid(aucid)
              .send({gas: 210000, value: wei, from: account});
            console.log(receipt);


        } catch (error) {
            console.error("Error, bidding: ", error);
            alert("Error while bidding!");
        }

    }
    // 3. withdraw

    // 4. claim
    async function claim() {
        try {
            const receipt = await AuctionContract.methods
                .claim(nftsingle.aucId)
                .send({gas: 210000, from: account});
                console.log(receipt);
        } catch (error) {
            console.error("Error: ", error);
        }            
    }
    // 5. auctionOver

    async function fetch() {
        try {
            const receipt = await AuctionContract.methods
                .fetch(nftsingle.aucId)
                .send({gas: 210000, from: account});
                console.log(receipt);
        } catch (error) {
            console.error("Error: ", error);
        }            
    }



    

    return (
        <div  className={classes.root}>
            {(Object.keys(nftselect).length === 0 || (nftsingle === '')) ? (
                <div>Loading...</div>
            ) : (
                <div className={classes.content}>        
                    <div className={classes.dropzone}>
                        <img className="img" src={"http://localhost:8080/ipfs/" + nftsingle.hash} />
                    </div>
                    <div className={classes.text}>
                        <div className={classes.info}>
                            <Typography className={classes.title} variant="h4" componet="h2">
                                {nftsingle.name}
                            </Typography>
                            <Typography className={classes.item} color="textSecondary">
                                Owner:&nbsp;&nbsp;{nftsingle.owner}
                            </Typography>
                            <Typography className={classes.item} color="textSecondary">
                                Creator:&nbsp;{nftsingle.creator}
                            </Typography>
                            <Typography className={classes.subitem} variant="body2" component="p" color="textSecondary">
                                Description:&nbsp;{nftsingle.description}
                            </Typography>
                            {(nftsingle.isForAuc) ? (
                                <div>
                                    <Typography className={classes.subitem} variant="h6">
                                        Time Left:&nbsp;
                                        <Countdown date={nftsingle.aucEnd * 1000} />
                                    </Typography>
                                    <Typography className={classes.subitem} variant="h6">
                                        Start Price:&nbsp;{Web3.utils.fromWei(String(nftsingle.startPrice))}&nbsp;Ether
                                    </Typography>
                                    <Typography className={classes.subitem} variant="h6">
                                        Current Highest Bid:&nbsp;{Web3.utils.fromWei(String(nftsingle.higBid))}&nbsp;Ether
                                    </Typography>
                                </div>
                                ):(<div></div>)}
                        </div>
                        <div className={classes.op}>                                                 
                            {nftsingle.owner === account && !nftsingle.isForAuc && (
                                <form className={classes.form} onSubmit={putForAuc}> 
                                    <TextField
                                        className={classes.input}
                                        label="StartPrice"
                                        name="startPrice"
                                        type="number"
                                        variant="filled"
                                        required
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">ether</InputAdornment>,
                                        }}
                                        value={formData.startPrice}
                                        onChange={handleInputChange}                                        
                                        />
                                    <TextField
                                        className={classes.input}
                                        label="AucTime"
                                        name="aucTime"
                                        type="number"
                                        variant="filled"
                                        required
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">day</InputAdornment>,
                                        }}
                                        value={formData.aucTime}
                                        onChange={handleInputChange}                                        
                                        />                              
                                    <Button
                                        className={classes.button}
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                    >
                                        Put it on Auction
                                    </Button>
                                </form>
                            )}

                            {nftsingle.owner === account && (Date.now() >= nftsingle.aucEnd * 1000) 
                                && nftsingle.isForAuc && (!nftsingle.haveBid) &&(
                                <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                onClick={fetch}
                                >
                                    Fetch
                                </Button>
                            )}

                            {nftsingle.owner !== account && (Date.now() < nftsingle.aucEnd * 1000) && (
                                <form className={classes.form} onSubmit={bid}> 
                                    <TextField
                                        className={classes.input}
                                        label="Bid"
                                        name="bidprice"
                                        type="number"
                                        variant="filled"
                                        required
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">ether</InputAdornment>,
                                        }}
                                        value={formData2.bidprice}
                                        onChange={handleInputChange2}                                        
                                        />
                                    <Button
                                        className={classes.button_v2}
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        >
                                        Bid
                                    </Button>

                                </form>                               
                            )}

                            {nftsingle.owner !== account && (Date.now() >= nftsingle.aucEnd * 1000) 
                                && nftsingle.isForAuc && (nftsingle.haveBid) && nftsingle.higBidder === account && (
                                <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                onClick={claim}
                                >
                                    Claim
                                </Button>   


                            )}
                            {nftsingle.owner !== account && (Date.now() >= nftsingle.aucEnd * 1000) 
                                && nftsingle.isForAuc && nftsingle.higBidder !== account && (
                                    <div>The Auction is Over.</div>

                            )}                        
                        </div>
                    </div>
                    

                    
                    {nftsingle.isForAuc &&
                    <TableContainer component={Paper} className={classes.table} >
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left" colSpan={2}>
                                        <Typography  variant="h6" componet="h4">
                                            History of Auction
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="left">Bidder</TableCell>
                                    <TableCell align="left">Bid Price (ether)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>                            
                                {nftsingle.bidhistory.map((row) => (
                                    <TableRow>
                                        <TableCell align="left">{row.bidder}</TableCell>
                                        <TableCell align="left">{Web3.utils.fromWei(String(row.bid))}</TableCell>
                                    </TableRow>

                                ))}        
                            </TableBody>
                        </Table>
                    </TableContainer>
                    } 


                    <TableContainer component={Paper} className={classes.table} >
                        <Table aria-label="simple table">
                            <TableHead>
                            <TableRow>
                                <TableCell align="left" colSpan={2}>
                                    
                                    <Typography  variant="h6" componet="h4">
                                        History of Ownership
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="left">Owner</TableCell>
                                <TableCell align="left">Time (start)</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                                {nftsingle.ownhistory.map((row) => (
                                    <TableRow>
                                        <TableCell align="left">{row.owner}</TableCell>
                                        <TableCell align="left">{moment(row.owntime*1000).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
                                    </TableRow>

                                ))}                            
                                
                            </TableBody>
                        </Table>
                    </TableContainer>                  
                </div>
 
            )}
        </div>

    );
    






};

export default SingleNFT;
