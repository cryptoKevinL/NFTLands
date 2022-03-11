const hre = require("hardhat");

async function main() {

  const NFTLand = await hre.ethers.getContractFactory("NFTLands");
  const contract = NFTLand.attach("0xac18c8f477E0B86BEc4aD053be7f67132310A397");
  const mintedNft = await contract.mintTo("0xb795f78b01c53B8C73667A38AECA30ae1D978C70");

  console.log("token minted", mintedNft);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
  
