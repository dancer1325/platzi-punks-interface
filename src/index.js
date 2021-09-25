import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { HashRouter as Router } from "react-router-dom";
import { Web3ReactProvider } from "@web3-react/core";
import { getLibrary } from "./config/web3";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <ChakraProvider>
        <Web3ReactProvider getLibrary={getLibrary}>
          <App />
        </Web3ReactProvider>
      </ChakraProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
