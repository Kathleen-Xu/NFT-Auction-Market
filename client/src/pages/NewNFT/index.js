import React,{useState, useRef, useEffect} from 'react'
import { useSelector } from 'react-redux';
import { Link, useHistory } from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';


import DropZone from '../../components/DropZone';




// import web3
import Web3 from "web3";


import { useStyles } from "./styles.js";
const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI({host:'localhost', port:'5001', protocol:'http'});




let saveImageOnIpfs = (reader) => {
  return new Promise(function(resolve,reject){
    const buffer = Buffer.from(reader.result);
    
    ipfs.add(buffer).then((response) => {
      console.log(response)
      resolve(response[0].hash);
    }).catch((err) => {
      console.error(err)
      reject(err);
    })
  })
}




const NewNFT = () => {
  const classes = useStyles();
  const history = useHistory();
  const account = useSelector((state) => state.allNft.account);
  const NFTContract = useSelector((state) => state.allNft.NFTContract);

  const [file, selectfile] = useState(0);
  const [test, selcecttest] = useState(false);
  const [hashvalue, selecthashvalue] = useState();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  console.log(NFTContract);
  console.log(account);
  //console.log(hashvalue);
  //console.log(test);

  function handleInputChange(event) {
    let { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

 

  //上传图片
  const handleUp = (event) => {
    event.preventDefault();
    const { name, description } = formData;
    var reader = new FileReader();

    if(!file){
      alert("No NFT uploaded!");      
    }
    else {
      try {
        reader.readAsArrayBuffer(file)
        reader.onloadend = (e) =>{
          console.log(reader);
          saveImageOnIpfs(reader).then((hash) => {
            console.log(hash);
            selecthashvalue(hash);
            mint(hash, name, description);
          });
        }        
      } catch (error) {
        console.log(error);
      }   
    }

  } 

  async function mint(hash, name, description) {
    try {
      console.log(hash+'---'+name+'---'+description);
      //let hashuint = Web3.utils.toHex(hash);
      
      const receipt = await NFTContract.methods
        .mint(hash, name, description)
        .send({from: account});
      
      console.log(receipt);
      console.log(receipt.events.Transfer.returnValues.tokenId);
      //history.push('/');
    } catch (error) {
      console.log(error);
      alert("Error while minting!");
    }
  }


    return (
      <div className={classes.root}>
        <form className={classes.form} onSubmit={handleUp} >
          <div className={classes.content}>        
            <div className={classes.dropzone}>
              <DropZone onFileUploaded={selectfile} />
            </div>
            <div className={classes.text}>
              <div>
                <TextField
                  className={classes.item}
                  label="Name"
                  name="name"
                  variant="filled"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  fullWidth
                  
                />
            
                <TextField
                  className={classes.item}
                  label="Description"
                  multiline
                  name="description"
                  variant="filled"
                  value={formData.description}
                  onChange={handleInputChange}
                  fullWidth
                />
              </div>
              
              <Button variant="contained" color="primary" type="submit">
                Mint Your NFT
              </Button>
            </div>

          </div>

        </form>




      </div>
    );


  

}

export default NewNFT;