require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-etherscan");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
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

const ALCHEMY_API_KEY = "_mbjGkZuVjRdK2jOsPjPUS01C8Htm4QL";
const RINKEBY_PRIVATE_KEY = "1351f14ba3bbd3db97911587ed75f9cc5f0f3c7597a24cac0b874d1c91219a3d";

module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      id: 4,
      url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [`0x${RINKEBY_PRIVATE_KEY}`],
      gasMultiplier: 2
    },
  },
  etherscan: {
    apiKey: {
      rinkeby: '1P9ACBZNGRVMPW5EA892D4MMGQ37FEM4TV'
    }
  }
};
