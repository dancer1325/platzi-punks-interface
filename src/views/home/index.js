import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useState } from "react";
import usePlatziPunks from "../../hooks/usePlatziPunks";

const Home = () => {
  const { active } = useWeb3React();
  const [maxSupply, setMaxSupply] = useState(0);

  const platziPunks = usePlatziPunks();

  const getMaxSupply = useCallback(async () => {
    if (platziPunks) {
      const result = await platziPunks.methods.maxSupply().call();
      setMaxSupply(result);
    }
  }, [platziPunks]);

  useEffect(() => {
    getMaxSupply();
  }, [getMaxSupply]);

  if (!active) return "Conecta tu wallet";

  return (
    <>
      <p>Max Supply: {maxSupply}</p>
    </>
  );
};

export default Home;
