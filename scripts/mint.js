const hre = require("hardhat");

async function main() {

  const PFPinata = await hre.ethers.getContractFactory("PFPinatas");
  const contract = PFPinata.attach("0xBE1df589c84008ec2bf828Fc8F2a3116Aee79D8f");
  const mintedNft = await contract.mintTo("0x35f71FEf659f3bC898433603D575DceCD6e7663c");

  console.log("token minted", mintedNft);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
  
