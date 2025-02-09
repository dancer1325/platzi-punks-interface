import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { HashRouter as Router } from "react-router-dom";            // UI -- via has portion of the URL is in sync with -- URL
import { Web3ReactProvider } from "@web3-react/core";
import { getLibrary } from "./config/web3";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <ChakraProvider>  {/* Set up ChakraProvider at the root of the application */}
        <Web3ReactProvider getLibrary={getLibrary}>
        {/* https://github.com/NoahZinsmeister/web3-react/tree/v6/docs#web3reactprovider */}
        {/* Instantiate a web3 library object from a low-level provider */}
          <App />
        </Web3ReactProvider>
      </ChakraProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
