const PinataJWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI2NDBhOTM5Ni1lYzE3LTQ5MWEtYmY4YS1jNDJiMmNiY2VjZjMiLCJlbWFpbCI6ImVtYWlsa2V2aW5sYXJzb25AZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZX0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjMyODhmMDI5NzViODAzMDA2NWQzIiwic2NvcGVkS2V5U2VjcmV0IjoiYmYxZTdkZTk0ODZkNTM0MTk3MjRjZTFmODdjNWJiYWQ2ODFiZWQ1NjI0NGIyMjhkY2JlOWVmMmE0M2U1NjdmZiIsImlhdCI6MTY0NjYyNDk3OX0.32932lVRbXTzxdjWqRfreospQePefFHO-BqJu-_asLA"
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const recursive = require("recursive-fs");
const basePathConverter = require("base-path-converter");

async function main() {
  try {
    //const path = "./treasuremaps";
    const path = "./metadata";
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    recursive.readdirr(path, function (err, dirs, files) {
      let data = new FormData();
      files.forEach((file) => {
        data.append(`file`, fs.createReadStream(file), {
          filepath: basePathConverter(path, file),
        });
      });

      const metadata = JSON.stringify({
        name: "Pinatas",
      });
      data.append("pinataMetadata", metadata);

      return axios
        .post(url, data, {
          maxBodyLength: "Infinity",
          headers: {
            "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
            Authorization: `Bearer ${PinataJWT}`,
          },
        })
        .then(function (response) {
          console.log(response.data);
          process.exit(0);
        })
        .catch(function (error) {
          throw error;
        });
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

main(); 
