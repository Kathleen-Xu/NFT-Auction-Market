import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
      //maxWidth: 345,
        width: "15rem",
        minWidth:200,
        borderRadius: "0.6rem",
        margin: theme.spacing(2),
        transition: "0.3s",
        boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
        "&:hover": {
        boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)",
        },
    },
    media: {
      //height: 0,
      paddingTop: '15rem', // 16:9
    },
    content: {
      //height: "30px",
      //padding: 0,
    },
    name: {
        //width: "15rem",
        margin: "0em",
        marginLeft: "0.1em",
        //marginTop: "0em",
        //marginBottom: "0em", 
        flexGrow: 1,
        //float: "left",
    },
    price: {
        float: "right",
        //right: 0,
        //top: 0,

        margin: "0em",
        marginRight: "0.1em",
        //_position:'relative'
    },
    logo: {
        paddingTop: "0.25em",
    },
    link: {
        color: "#000",
        textDecoration: "none",

    }

  }));

  export { useStyles };
  