// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const BASE_URI = "https://nft_lands.mypinata.cloud/ipfs/QmcCnEEmuMvxKeLmG4Qhos8HwLzeWSW8wWbpnM68XmjzrJ/";

async function main() {
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const NFTLand = await hre.ethers.getContractFactory("NFTLands");
  const nftLands = await NFTLand.deploy(BASE_URI);

  await nftLands.deployed();

  console.log("NFTLands deployed to:", nftLands.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
  
