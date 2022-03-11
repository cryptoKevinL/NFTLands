const hre = require("hardhat");

//currently we only have 4 Tresure Maps saved in Pinata, just for demo anyway!
const friends = [
    "0x0Db0448c95cad6D82695aC27022D20633C81b387",
    "0xAdC530A7eC7541ECB936aea46B66769365777c10",
    "0x35f71FEf659f3bC898433603D575DceCD6e7663c",
    "0xb795f78b01c53B8C73667A38AECA30ae1D978C70"
];

async function main() {
  const NFTLand = await hre.ethers.getContractFactory("NFTLands");
  const contract = NFTLand.attach("0x55935118d9c83430653146485Df9ecB3F977e1F0");

  //const signer0 = await ethers.provider.getSigner(0);
  //const nonce = await signer0.getTransactionCount();
  for(let i = 0; i < friends.length; i++) {
    const mintedNft = await contract.mintTo(friends[i]);
    //const tokenURI = 
    //await nft.awardItem(friends[i], tokenURI,  {
    //  nonce: nonce + i
    //});
  }

  console.log("Minting is complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
