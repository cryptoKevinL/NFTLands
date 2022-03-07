const hre = require("hardhat");

async function main() {

  const PFPinata = await hre.ethers.getContractFactory("PFPinatas");
  const contract = PFPinata.attach("0xaECD51d963f2299F9d4DE58B184191789C03Fff1");
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
