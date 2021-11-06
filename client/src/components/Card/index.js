import React from "react";
import { Link } from "react-router-dom";

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import Chip from "@material-ui/core/Chip";
import SvgIcon from "@material-ui/core/SvgIcon";
import Divider from "@material-ui/core/Divider";

import Web3 from "web3";
import CardActionArea from "@material-ui/core/CardActionArea";

import { useStyles } from "./styles.js";
import { ReactComponent as logoether } from "../../assets/logo_ether.svg";

const MyCard = ({ tokenId, name, imghash, price}) => {
    const classes = useStyles();
    const wei = (price) ? Web3.utils.fromWei(String(price)): "";

    return (
      
      <Card className={classes.root}>
        <Link to={`/nft/${tokenId}`} className={classes.link}>
          <CardActionArea>
            <CardMedia
              className={classes.media}
              image={"http://localhost:8080/ipfs/" + imghash}
              title={name}
            />
            <CardContent className={classes.content}>
              <Typography variant="h5" component="h2">
                  <span className={classes.name}>
                    {name}
                  </span>
                  <span className={classes.price}>   
                    <SvgIcon
                      component={logoether}
                      viewBox="0 0 400 426.6"
                      titleAccess="ETH"
                      className={classes.logo}
                    />
                    {wei}
                  </span>
              </Typography> 
              
            </CardContent>
          </CardActionArea> 
        </Link>         
      </Card>
      
    );
  };
  
  export default MyCard;