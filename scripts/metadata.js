const fs = require("fs");
const faker = require('faker');
const TOTAL = 4;
//const baseCID = "bafybeigsh3r3hdjflwe4tzwsz4pggmnd6ogrx65vlwqeyrwnmk2ykaqyr4";
const baseCID = "QmZ6MKWDTYEANVpp9c2TaozBQGPAcbwDxjRkY49SM9LGBY";
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
