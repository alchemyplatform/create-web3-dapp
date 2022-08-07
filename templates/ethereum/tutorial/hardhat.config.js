require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  paths: {
    artifacts: "./backend/artifacts",
    sources: "./backend/contracts",
    tests: "./backend/test"
  },
};
