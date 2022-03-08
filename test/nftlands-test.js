const { expect } = require("chai");
const { ethers } = require("hardhat");
const BASE_URI = "ipfs://FAKE_IPFS_CID/";
const TEST_WALLET = "0x243dc2F47EC5A0693C5c7bD39b31561cCd4B0e97";

describe("NFTLands", function () {
  it("Should mint a new token", async function () {
    const NFTLands = await ethers.getContractFactory("NFTLands");
    const nftLands = await NFTLands.deploy(BASE_URI);
    await nftLands.deployed();
    await nftLands.mintTo(TEST_WALLET);
    expect(await nftLands.ownerOf(1)).to.equal(TEST_WALLET);
  });
  it("Should return a valid token URI", async function () {
    const NFTLands = await ethers.getContractFactory("NFTLands");
    const nftLands = await NFTLands.deploy(BASE_URI);
    await nftLands.deployed(BASE_URI);
    await nftLands.mintTo(TEST_WALLET);
    expect(await nftLands.ownerOf(1)).to.equal(TEST_WALLET);
    expect(await nftLands.tokenURI(1)).to.equal(`${BASE_URI}1`);
  });
});
