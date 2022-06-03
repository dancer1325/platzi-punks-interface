import { useMemo } from "react";
import { useWeb3React } from "@web3-react/core";
import { PlatziPunks } from "../../config/web3/contracts";

const { abi, address } = PlatziPunks;

const usePlatziPunks = () => {
  // If you are using Hooks and you want to access context variables
  // https://github.com/NoahZinsmeister/web3-react/tree/v6/docs#useweb3react
  const { active, library, chainId } = useWeb3React();

  const platziPunks = useMemo(() => {
    // https://web3js.readthedocs.io/en/v1.7.1/web3-eth-contract.html#new-contract
    // abi jsonInterface about the respective smart contract
    if (active) return new library.eth.Contract(abi, address[chainId]);
  }, [library?.eth?.Contract, active, chainId]);

  return platziPunks;
};

export default usePlatziPunks;
