import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import * as util from "ethereumjs-util";
import {ethers} from "ethers";
import { v4 as uuidv4 } from 'uuid';
import { withIronSession } from 'next-iron-session';
const contractAddress = "0x67beb2f756f9a0191b79b6997005272f149bcb9F"; //Mumbai 
const ALCHEMY_API_KEY = "DFKhc69D-dGOhQrquSITTV3cs7Jt8dwU" //process.env.ALCHEMY_API_KEY;
const urlV2API = `https://managed.mypinata.cloud/api/v1`;
const API_KEY = "a2afIH1YdXSYciCoJRE9QKca3cr3FfyL";
const CID = "bafybeigsh3r3hdjflwe4tzwsz4pggmnd6ogrx65vlwqeyrwnmk2ykaqyr4";
const GATEWAY_URL = "https://nft_lands.mypinata.cloud";
const abi = require("../NFTLands.json").abi;

export default function Home() {
  const [ethereum, setEthereum] = useState(null);
  const [isNFTLand, setIsNFTLand] = useState(null);
  const [isOwnPlot, setIsOwnPlot] = useState(null);
  const [plotUrl, setPlotUrl] = useState(null);
  const [secretUrl, setSecretUrl] = useState(null);
  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      console.log("MetaMask is installed!");
      setEthereum(window.ethereum);
    }
    if (ethereum) {
      ethereum.request({ method: "eth_requestAccounts" });
    }
  }, [ethereum]);
  const handleProveIt = async () => {
    //  First we get the message to sign back from the server
    const messageToSign = await axios.get("/api/verify");
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    const account = accounts[0];
    //console.log(account);
    const signedData = await ethereum.request({
      method: "personal_sign",
      params: [JSON.stringify(messageToSign.data), account, messageToSign.data.id],
    });
    try {
      // const res = await axios.post("/api/verify", {
      //   address: account,
      //   signature: signedData
      // });
      // const url = res.data;

      //not sure why apis aren't working when deployed
      // const message = req.session.get('message-session');
      //console.log(`${ALCHEMY_API_KEY}`);
      const provider = await new ethers.providers.JsonRpcProvider(`https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`);
      const contract = await new ethers.Contract( contractAddress , abi , provider );      
      // let nonce = "\x19Ethereum Signed Message:\n" + JSON.stringify(message).length + JSON.stringify(message)
      // nonce = util.keccak(Buffer.from(nonce, "utf-8"))
      // const { v, r, s } = util.fromRpcSig(signedData.signature)
      // const pubKey = util.ecrecover(util.toBuffer(nonce), v, r, s)
      // const addrBuf = util.pubToAddress(pubKey)
      // const addr = util.bufferToHex(addrBuf)
      // if(req.body.address === addr) {
        //console.log(account);
        const balance = await contract.balanceOf(account);
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
            if(account.toLowerCase() === owner.toLowerCase()){
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
          const url = `${GATEWAY_URL}/ipfs/${CID}/SampleTreasureMap${displayIndex}.png?accessToken=${token.data}`;

          console.log(url);
          setIsNFTLand(true);
          setSecretUrl(url);
        }
      }
    //} 
    catch (error) {
      console.log(error);
      if (error.response && error.response.status === 401) {
        setIsNFTLand(false);
      }
    }
  };
  const handleBuyPlot = async () => {
    
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const nftContract = new ethers.Contract(
      contractAddress,
      abi,
      signer
    );

    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    const account = accounts[0];
    let nftTx = await nftContract.mintTo(account);
    console.log('Mining....', nftTx.hash);
    let tx = await nftTx.wait();
    console.log('Mined!', tx)
    let event = tx.events[0]
    let value = event.args[2]
    let tokenId = value.toNumber();

    console.log(
      `Mined, see transaction: https://mumbai.polyscan.com/tx/${nftTx.hash}`
    )

    const url = "https://testnets.opensea.io/assets/mumbai/" + contractAddress + "/" + tokenId;
    console.log("view your new land on OpenSea! - " + url);
    setIsOwnPlot(true);
    setPlotUrl(url);
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Welcome, NFT Land Enthusiast</title>
        <meta name="description" content="NFT Lands Members Only Content" />
        <link rel="icon" href="/logo.svg" />
      </Head>

      <main className={styles.main}>
        <h1>Hey! Are you an NFT Lands Owner?</h1>
        <p>
          Members get access to a Treasure Map!
          Please sign the MetaMask verification to prove ownership.
        </p>
        {isOwnPlot === false ? (
          <div>
            <h4>Purchase an NFT Land plot to gain access to personalized content!</h4>
            <img
              src="https://media.giphy.com/media/SWwXbEiVJ5z1gsjf5N/giphy.gif"
              alt="No NFT Land Owned"
            />
          </div>
        ) : isOwnPlot === true ? (
          <div style={{textAlign: "center"}}>
            <h4>Enjoy Your New Land Purchase!</h4>
            <a href={plotUrl}>Click Here to View Your New Plot of Land on OpenSea</a>
            <div></div>
          </div>
        ) : (
          <button className={styles.btn} onClick={handleBuyPlot}>
            Buy Next Plot
          </button>
        )}
        {isNFTLand === false ? (
          <div>
            <h4>Purchase an NFT Land plot to gain access to personalized content!</h4>
            <img
              src="https://media.giphy.com/media/SWwXbEiVJ5z1gsjf5N/giphy.gif"
              alt="No NFT Land Owned"
            />
          </div>
        ) : isNFTLand === true ? (
          <div style={{textAlign: "center"}}>
            <h4>Here is your personalized Treasure Map:</h4>
            <img style={{maxWidth: "90%"}} src={secretUrl} alt="Thanks for being a member." />
          </div>
        ) : (
          <button className={styles.btn} onClick={handleProveIt}>
            Verify I own an NFT Land Parcel
          </button>
        )}
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  );
}

