const hre = require("hardhat");

async function main() {

  const NFTLand = await hre.ethers.getContractFactory("NFTLands");
  const contract = NFTLand.attach("0x849a25c7B475D68c897A33B25cd2E41B58E2C391");
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
