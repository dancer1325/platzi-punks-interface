require("dotenv").config();     // By default it looks for the file '.env'

// Classes start with capital letter
const Web3 = require('web3');


// Instantiate an object
// InfuraURL to which one to connect. Got it from // other project which creates the smart contract 
const web3 = new Web3(`https://rinkeby.infura.io/v3/${process.env.INFURA_PROJECT_ID}`);

console.log(web3);

// returns the current block number
web3.eth.getBlockNumber().then(number => {
    console.log(number);
    // You can check the value in etherscan.io
});

// Alternative to manage promises
web3.eth.getBlockNumber().then(
    console.log
    // You can check the value in etherscan.io
);