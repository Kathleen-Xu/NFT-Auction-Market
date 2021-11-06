import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  dropzone: {
    height: "350px",
    background: "#e1E4F2",
    borderRadius: "2px",
    //border: "4px dashed #fafafa"
  
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: theme.spacing(2),
    outline: "0",
    
    '& img': {
      width: "100%",
      height: "100%",
      objectFit: "contain",
    },
  
    '& p': {
      width: "calc(100% - 60px)",
      height:" calc(100% - 60px)",
      borderRadius: "2px",
      border: "4px dashed #fafafa",      
    
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      color: "#bdbdbd",
    }
  },
  text: {
    padding: "1em",

  },
}));

export { useStyles };