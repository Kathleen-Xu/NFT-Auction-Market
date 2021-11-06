import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

//import Header from "./components/Header/index";

import clsx from 'clsx';
import { useDispatch, useSelector } from "react-redux";
import {useTheme } from '@material-ui/core/styles';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import FormGroup from '@material-ui/core/FormGroup';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExploreIcon from '@material-ui/icons/Explore';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AlbumIcon from '@material-ui/icons/Album';
import CollectionsIcon from '@material-ui/icons/Collections';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { useStyles} from "./styles.js";

import Main from "./pages/Main/index";
import Created from "./pages/Home/Created";
import Collected from "./pages/Home/Collected";
import NewNFT from "./pages/NewNFT/index";
import SingleNFT from "./pages/SingleNFT/index";



import "./App.css";


const App = () => {
  const classes = useStyles();
  const theme = useTheme();


  const [openleft, setOpen] = React.useState(false);
  const account = useSelector((state) => state.allNft.account);
  const AuctionContract = useSelector((state) => state.allNft.AuctionContract); 

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  
  async function withdraw() {
    try {
        const receipt = await AuctionContract.methods
            .withdraw()
            .send({gas: 210000, from: account});
        console.log(receipt);
    } catch (error) {
        console.error("Error: ", error);
    }            
}

  

  return (        
    <React.Fragment>
      <Router> 
      <CssBaseline />
      
      <AppBar position="static"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: openleft,
        })}>
        <Toolbar>
            <IconButton 
              edge="start" 
              className={classes.menuButton} 
              onClick={handleDrawerOpen} 
              className={clsx(classes.menuButton, openleft && classes.hide)} 
              color="inherit" aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
          <Typography 
            variant="h6" noWrap className={classes.title}>
              NFT&nbsp;&nbsp;Auction&nbsp;&nbsp;Market
          </Typography>                  
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={withdraw}
            >
            Withdraw
          </Button>
          
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={openleft}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          <Link to='/' className={classes.link}>
            <ListItem button key={'Explore NFT'}>
              <ListItemIcon><ExploreIcon /></ListItemIcon>
              <ListItemText primary={'Explore NFT'} />
            </ListItem>
          </Link>
          <Link to='/new-nft' className={classes.link}>
            <ListItem button key={'Mint NFT'}>
              <ListItemIcon><AddCircleIcon /></ListItemIcon>
              <ListItemText primary={'Mint NFT'} />
            </ListItem>
          </Link>
        </List>
        <Divider />
        <List>
          <Link to='/created' className={classes.link}>
            <ListItem button key={'Created'}>
              <ListItemIcon><AlbumIcon /></ListItemIcon>
              <ListItemText primary={'Created'} />
            </ListItem>
          </Link>
          <Link to='/collected' className={classes.link}>
            <ListItem button key={'Collected'}>
              <ListItemIcon><CollectionsIcon /></ListItemIcon>
              <ListItemText primary={'Collected'} />
            </ListItem>
          </Link>
        </List>
      </Drawer>
    
      <div  className={clsx(classes.content, {
          [classes.contentShift]: openleft,
        })}>

          <Switch>
            <Route path="/" exact component={Main} />
            <Route path="/new-nft" component={NewNFT} />
            <Route path="/created" component={Created} />
            <Route path="/collected" component={Collected} />
            <Route path="/nft/:nftId" component={SingleNFT} />
            <Route>404 Not Found!</Route>
          </Switch>
        
      </div>
      </Router>
    </React.Fragment>
  );
}

export default App;