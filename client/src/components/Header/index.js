import React from "react";
import clsx from 'clsx';
import { useSelector } from "react-redux";
import { Link, Router } from "react-router-dom";
import {useTheme } from '@material-ui/core/styles';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Switch from '@material-ui/core/Switch';
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

import Web3 from "web3";

import { useStyles} from "./styles.js";

const Header = () => {
  const classes = useStyles();
  const _auth = useSelector((state) => {return (!state.allNft.account)? false:true});
  console.log("header");
  console.log(_auth);
  const [auth, setAuth] = React.useState(_auth);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);  
  const theme = useTheme();

  const handleChange = (event) => {
    //登出
    setAuth(event.target.checked);
  };
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [openleft, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <CssBaseline />
      
      <AppBar position="static"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: openleft,
        })}>
        <Toolbar>
          <Link to="/">
            <IconButton 
              edge="start" 
              className={classes.menuButton} 
              onClick={handleDrawerOpen} 
              className={clsx(classes.menuButton, openleft && classes.hide)} 
              color="inherit" aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
          </Link>
          <Typography 
            variant="h6" noWrap className={classes.title}>
              NFT&nbsp;&nbsp;Auction&nbsp;&nbsp;Market
          </Typography>
          <ButtonGroup variant="text" className={classes.buttons} aria-label="text primary button group">
            <Link to="/">
              <Button className={classes.button}>Explore</Button>
            </Link>
            <Link to="/new-nft">
              <Button className={classes.button}>Create</Button>
            </Link>
          </ButtonGroup>
          <FormControlLabel
            control={<Switch checked={auth} onChange={handleChange} aria-label="login switch" />}
            label={auth ? 'Logout' : 'Login'}
            labelPlacement="start" />
          { auth && (
              <div>    
                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit" 
                  className={classes.icon}             
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={handleClose}
                >
                  {/*<MenuItem onClick={handleClose}>Profile</MenuItem>*/}
                  <MenuItem onClick={handleClose}>My Home</MenuItem>
                </Menu>

              </div>
          )}
          
          
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
          {['Explore NFT', 'Mint NFT'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <ExploreIcon /> : <AddCircleIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['Created', 'Collected'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <AlbumIcon /> : <CollectionsIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </React.Fragment>
  )
}

export default Header;