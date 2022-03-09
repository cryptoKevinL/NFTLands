const hre = require("hardhat");

async function main() {

  const NFTLand = await hre.ethers.getContractFactory("NFTLands");
  const contract = NFTLand.attach("0xac18c8f477E0B86BEc4aD053be7f67132310A397");
  const mintedNft = await contract.mintTo("0xAdC530A7eC7541ECB936aea46B66769365777c10");

  console.log("token minted", mintedNft);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
  
