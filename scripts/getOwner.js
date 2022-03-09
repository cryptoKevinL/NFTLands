const hre = require("hardhat");

async function main() {

  const NFTLand = await hre.ethers.getContractFactory("NFTLands");
  const contract = NFTLand.attach("0xac18c8f477E0B86BEc4aD053be7f67132310A397");
  const uri = await contract.tokenURI(1);
  const owner = await contract.ownerOf(1);

  console.log({uri});
  console.log({owner});
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
