import Web3 from "web3";
import { InjectedConnector } from "@web3-react/injected-connector";

const supportedChainIds = [
  4, // Rinkeby
];

const getLibrary = (provider) => new Web3(provider);
// Alternative
// 1) Use directly window.ethereum
// Example: Check in the branch "Section2"

const connector = new InjectedConnector({
  supportedChainIds,
});

export { connector, getLibrary };
