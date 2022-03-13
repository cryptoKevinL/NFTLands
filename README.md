# NFT Worlds Land Parceling, and Content Access With Exclusive Ownership Content
Minecraft development work was done under the repository at: https://github.com/iamcryptoboi/NFTLands

This Repository handles the Web functionality for the NFT Lands EthGlobal BuildQuest project.

Keep in mind that a .env file is needed with API private keys, we use Alchemy here. 
API Keys for the Professional Pinata Plan which includes Submarine functionality is required to run the server.

Public facing website for demo in the 2022 EthGlobal BuildQuest:
https://nft-lands-g5c8o.ondigitalocean.app/

NFT Lands Web Build/Test Instructions:

Initial contract, Verify UI and Piñata Submarine functionality based on this article:
https://medium.com/pinata/how-to-manage-nft-visibility-18e9b7a76b8c

Using our project:
1. git clone https://github.com/cryptoKevinL/NFTLands
    1. npm install
    2. npm install dotenv
    3. .env file must have:
        1. POLYGON_PRIVATE_KEY
        2. POLYGON_URL=https://polygon-mumbai.g.alchemy.com/v2/{your_api_key}
        3. PINATA_V2_API_KEY
        4. PINATA_JWT - for Piñata Submarine (Paid Subscription Only)
        5. POLYSCAN_API_KEY (optional - for code verify)
2. npx hardhat run scripts/deploy.js --network mumbai
3.  npx hardhat run scripts/mint_mumbai.js --network mumbai
    1. Addresses in mint script should be your own, for use with Metamask
    2. Otherwise, these can be minted from game with /buyplot (Working?)
4. Verify code if you like, so you can interact with the contract on etherscan/polyscan
    1. npx hardhat verify --network mumbai <contract addr> "https://<your_gateway>.mypinata.cloud/ipfs/<Submarined Folder CID>/"
5. cd /client
6. Make sure new contract address of deployed contract is in pages/api/verify.js
7. .env file here needs PINATA_V2_API_KEY, ALCHEMY_API_KEY (polygon), SECRET_COOKIE_PASSWORD=<random 32 chars>(not sure what this is)
8. npm run dev
9. Browse to localhost:3000 if running locally
10. Click the only button
11. Verify with MetaMask (from an address that was used in Mint Script, or /buyplot)
12. Currently 10 Treasure Maps are stored in Piñata Submarine, so for demo purposes unique data for the first 10 minters.
