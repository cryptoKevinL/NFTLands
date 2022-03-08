const hre = require("hardhat");

async function main() {

  const NFTLand = await hre.ethers.getContractFactory("NFTLands");
  const contract = NFTLand.attach("0x849a25c7B475D68c897A33B25cd2E41B58E2C391");
  const mintedNft = await contract.mintTo("0x35f71FEf659f3bC898433603D575DceCD6e7663c");

  console.log("token minted", mintedNft);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
  
