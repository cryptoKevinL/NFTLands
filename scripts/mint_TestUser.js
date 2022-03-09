const hre = require("hardhat");

async function main() {

  const NFTLand = await hre.ethers.getContractFactory("NFTLands");
  const contract = NFTLand.attach("0xac18c8f477E0B86BEc4aD053be7f67132310A397");
  const mintedNft = await contract.mintTo("0x0Db0448c95cad6D82695aC27022D20633C81b387");

  console.log("token minted", mintedNft);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
  
