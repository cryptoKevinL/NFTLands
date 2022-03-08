require("dotenv").config();
const fs = require("fs");
const faker = require('faker');
const TOTAL = 4;
const baseCID = process.env.BASE_CID;
const gatewayCustomDomain = "nft_lands.mypinata.cloud"

const generateRandomMetadata = (id) => {
  return {
    name: faker.name.findName(), 
    description: faker.lorem.sentences(), 
    image: `${gatewayCustomDomain}/ipfs/${baseCID}/${id}`
  }
}
(async () => {
  for(let i=1; i < TOTAL + 1; i++) {
    const metadata = generateRandomMetadata(i)
    fs.writeFileSync(`./metadata/${i}`, JSON.stringify(metadata));
  }
  console.log("Done!");
})();
