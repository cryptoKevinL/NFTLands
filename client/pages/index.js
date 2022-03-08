import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [ethereum, setEthereum] = useState(null);
  const [isNFTLand, setIsNFTLand] = useState(null);
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
    console.log(account);
    const signedData = await ethereum.request({
      method: "personal_sign",
      params: [JSON.stringify(messageToSign.data), account, messageToSign.data.id],
    });
    try {
      const res = await axios.post("/api/verify", {
        address: account,
        signature: signedData
      });
      const url = res.data;
      console.log(url);
      setIsNFTLand(true);
      setSecretUrl(url);
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 401) {
        setIsNFTLand(false);
      }
    }
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
        {isNFTLand === false ? (
          <div>
            <h4>Please purchase an NFT Land plot to gain access personalized content!</h4>
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

