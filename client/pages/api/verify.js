import axios from "axios";
import * as util from "ethereumjs-util";
import {ethers} from "ethers";
import { v4 as uuidv4 } from 'uuid';
import { withIronSession } from 'next-iron-session';
const abi = require("../../NFTLands.json").abi;
//const contractAddress = "0xac18c8f477E0B86BEc4aD053be7f67132310A397"; //RINKEBY
const contractAddress = "0x67beb2f756f9a0191b79b6997005272f149bcb9F"; //Mumbai 
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const urlV2API = `https://managed.mypinata.cloud/api/v1`;
const API_KEY = process.env.PINATA_V2_API_KEY;
//const CID = "bafybeieurcyxmx5giqxk4nyg4cx6iztkbu7wp4lfgjuqwggsmrkwnglfdu"; //top level folder in Pinata - Submarined
const CID = "bafybeigsh3r3hdjflwe4tzwsz4pggmnd6ogrx65vlwqeyrwnmk2ykaqyr4";
const GATEWAY_URL = "https://nft_lands.mypinata.cloud";

function withSession(handler) {
  return withIronSession(handler, {
    password: process.env.SECRET_COOKIE_PASSWORD,
    cookieName: 'web3-auth-session',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production' ? true : false,
    },
  })
}

export default withSession(async (req, res) => {
  if(req.method === "POST") {
    try {         
      const message = req.session.get('message-session');
      //const provider = await new ethers.providers.JsonRpcProvider(`https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_API_KEY}`);
      const provider = await new ethers.providers.JsonRpcProvider(`https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`);
      const contract = await new ethers.Contract( contractAddress , abi , provider );      
      let nonce = "\x19Ethereum Signed Message:\n" + JSON.stringify(message).length + JSON.stringify(message)
      nonce = util.keccak(Buffer.from(nonce, "utf-8"))
      const { v, r, s } = util.fromRpcSig(req.body.signature)
      const pubKey = util.ecrecover(util.toBuffer(nonce), v, r, s)
      const addrBuf = util.pubToAddress(pubKey)
      const addr = util.bufferToHex(addrBuf)
      if(req.body.address === addr) {
        const balance = await contract.balanceOf(addr);
        if(balance.toString() !== "0") {
          const config = {
            headers: {
              "x-api-key": `${API_KEY}`, 
              'Content-Type': 'application/json'
            }
          }

          //Returns a BigNum, so to use it in for loop we need to convert to Number
          const totalSupplyVal = await contract.totalSupply(); //TODO: of course make this more - using max 10 for test
          const totalMinted = Number(totalSupplyVal);

          //Should we add a function to the contract to return the tokens owned given an address?
          //TODO: if there a multiple tokens owned by 1 owner, display them all.
          let displayIndex = 1;
          for(let idx=1; idx<=totalMinted; idx++){
            const owner = await contract.ownerOf(idx);
            if(addr.toLowerCase() === owner.toLowerCase()){
              displayIndex = idx;
              break;
            }
          }

          //  Generate Access Token
          const content = await axios.get(`${urlV2API}/content`, config)
          //console.log(content);
          
          const { data } = content;
          const { items } = data;
          const item = items.find(i => i.cid === CID);
          //console.log(item);
          const folderID = item.id;
          let idForDisplay = "";
          if(folderID != null) {
             const contentFolderItems = await axios.get(`${urlV2API}/content/${folderID}/list`, config);
             //console.log(contentFolderItems);
             const { data } = contentFolderItems;
             const { items } = data;
             //console.log(items);
             //originalname: 'images/SampleTreasureMap3.png',
             idForDisplay = items.find(i => i.originalname === `images/SampleTreasureMap${displayIndex}.png`);
             //console.log(idForDisplay);
          }
          const body = {
            timeoutSeconds: 3600, 
            contentIds: [idForDisplay.id] 
          }
          //console.log(body);
          const token = await axios.post(`${urlV2API}/auth/content/jwt`, body, config);
	        //console.log(token);
          return res.send(`${GATEWAY_URL}/ipfs/${CID}/SampleTreasureMap${displayIndex}.png?accessToken=${token.data}`);
        } else {
          return res.status(401).send("You aren't an NFT Lands Owner");
        }
      } else {
        return res.status(401).send("Invalid signature");
      }
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }    
  } 
  else if(req.method === "GET") {
   try {
     const message = { contractAddress, id: uuidv4() };
     req.session.set('message-session', message)
     await req.session.save()
     res.json(message)
   } catch (error) {
     console.log(error);
     const { response: fetchResponse } = error
     res.status(fetchResponse?.status || 500).json(error.data)
   }
  } 
  else {
    res.status(200).json({ message: 'This is the way...wait, no it is not. What are you doing here?' })
  }
})
