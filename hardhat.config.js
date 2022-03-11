require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("balance", "Prints an account's balance")
  .addParam("account", "The account's address")
  .setAction(async (taskArgs) => {
    const account = web3.utils.toChecksumAddress(taskArgs.account);
    const balance = await web3.eth.getBalance(account);

    console.log(web3.utils.fromWei(balance, "ether"), "ETH");
  });


module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      id: 4,
      url: process.env.RINKEBY_URL,
      accounts: [process.env.RINKEBY_PRIVATE_KEY],
      gasMultiplier: 2
    },
    mumbai: {
      url: process.env.POLYGON_URL,
      accounts: [process.env.POLYGON_PRIVATE_KEY]
    }
  },
  etherscan: {
    //apiKey: {
      //rinkeby: process.env.ETHERSCAN_API_KEY,
    //}
    apiKey: process.env.POLYSCAN_API_KEY
  }
};
