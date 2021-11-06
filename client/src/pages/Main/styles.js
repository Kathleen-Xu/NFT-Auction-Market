import { createTheme, withStyles, makeStyles, ThemeProvider  } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  header: {
    flexGrow: 1,
  },
  nfts: {
    justifyContent: "left",
    display: "flex",
    flexDirection: "row",

  },
  nft: {
  },
  


}));

export { useStyles };