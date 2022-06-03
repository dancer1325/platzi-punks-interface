import Web3 from "web3";
import { InjectedConnector } from "@web3-react/injected-connector";

// Configurable the supported nets
// TODO: Find this information
const supportedChainIds = [
  1,  // Corresponding to the Mainnet
  3,  // Corresponding to Ropsten
  4,  // Corresponding to Rinkeby
  5,  // Corresponding to Goerli
  2018,  // Corresponding to Dev
  61,  // Corresponding to Classic
  63,  // Corresponding to Mordor
  6,  // Corresponding to Kotti
  212,  // Corresponding to Astor
];

const getLibrary = (provider) => new Web3(provider);
// Alternative
// 1) Use directly window.ethereum
// Example: Check in the branch "Section2"
// 2) Use ethers.js

// Instantiate the injected connector
// https://github.com/NoahZinsmeister/web3-react/blob/v6/docs/connectors/injected.md#example
const connector = new InjectedConnector({
  supportedChainIds,
});

export { connector, getLibrary };
