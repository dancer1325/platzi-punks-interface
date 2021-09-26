import { useMemo } from "react";
import { useWeb3React } from "@web3-react/core";
import { PlatziPunks } from "../../config/web3/contracts";

const { abi, address } = PlatziPunks;

const usePlatziPunks = () => {
  const { active, library, chainId } = useWeb3React();

  const platziPunks = useMemo(() => {
    if (active) return new library.eth.Contract(abi, address[chainId]);
  }, [library?.eth?.Contract, active, chainId]);

  return platziPunks;
};

export default usePlatziPunks;
