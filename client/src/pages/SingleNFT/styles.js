import { createTheme, withStyles, makeStyles, ThemeProvider  } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        width: "80%",
        marginTop: "5rem",
        marginLeft: "10%",
        marginRight: "10%",
    
      },
      form: {
        flexDirection: "column",
        width:"100%",
      },
      content: {
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
        justifyContent: "center",
      },
      dropzone: {
        maxWidth: "30rem",
        minWidth: "15rem",
        '& img': {
            width: "100%",
            objectFit: "contain",
          },
        flexGrow: "2",
      },

      text: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        minInlineSize: "auto",
        marginLeft: "2rem",
        flexGrow: "1",
        
      },
      info :{
          alignSelf: "flex:start",
      },
      title: {
        margin: "1rem",
        marginLeft: "0rem",
      },
      item: {
        marginTop: "0rem",
      },
      subitem: {
        marginTop: "0.5rem",
      },

      op: {
        marginTop: "1rem",
        alignSelf: "flex:end",
      },
      input: {
          marginTop: "0.25rem",
          width: "100%",
          
      },
      button:{
        width: "100%",
        marginTop:"0.5rem",
      },
      button_v2:{
        width: "100%",
        marginTop:"0.5rem",
      },

      table: {
        //width: "60%",
        display: "flex",
        flexGrow: "1",
        margin: "0.5rem",
      },

  

}));

export { useStyles };