import { ListItem } from '@material-ui/core';
import { createTheme, withStyles, makeStyles, ThemeProvider  } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: "80%",
    marginTop: "5rem",
    marginLeft: "10%",
    marginRight: "10%",

  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  content: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  dropzone: {
    width: "50%",
  },
  text: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    minInlineSize: "auto",
    width: "50%",
    marginLeft: "2rem",
    
  },
  item: {
    marginTop: "1rem",
  },
  
  


}));

export { useStyles };