# PlatziPunksInterface

Platzi Punks are randomized Avataaars stored on chain to teach DApp development on Platzi
* It's common the pattern for the name of the repo's
  * "...."
    * BE repo
  * "...-interface"
    * FE repo


# How has the project been created?
* `npx create-react-app my-app`
  * Create a sample react app based on a template
* `yarn add react-router`
* `yarn web3-react`
* `yarn @chakra-ui/react`

# Notes
* 'react-router-dom'
* '@web3-react'
  * It can be used with any wrapper
    * Unnecessary to use web3
* '@web3-react/injected-connector'
  * Handle injected connectors with web3
* '@chakra-ui/react'
  * Make easier to add components
  * 'layouts' folder
    * come from Chakra
  * 'toast'
    * show alerts on top of an overlay
* `window.ethereum`
  * In the browser's console
  * Exposure of the RPC's method, thanks to Metamask
* `window.ethereum.request({method:'eth_requestAccounts'})`
  * Invoke to JSON RPC's method
  * Intercepted by MetaMask

# How to execute / run?
* `yarn install`
* `yarn start`