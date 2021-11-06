import React from "react";
import { useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";

import MyCard from "../../components/Card/index";

import { useStyles } from "./styles";

const Created = () => {
    const classes = useStyles();
    const account = useSelector((state) => state.allNft.account);
    const nftset = useSelector((state) => state.allNft.nft);

    console.log(account);
    console.log(nftset);

    const nfts = useSelector((state) => state.allNft.nft);

    return (
        <div>
          {nfts && 
          <section>
            {/*<Typography className={classes.title}>NFTs On Auction</Typography> */}
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={2}
              className={classes.nfts}
            >
              {nfts.map((nft) => {
                if(nft.creator === account) {
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
export default Created;