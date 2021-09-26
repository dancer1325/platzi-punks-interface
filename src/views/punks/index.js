import { useWeb3React } from "@web3-react/core";
import { Grid } from "@chakra-ui/react";
import { usePunksData } from "../../hooks/usePunksData";
import RequestAccess from "../../components/request-access";
import Loading from "../../components/loading";
import PunkCard from "../../components/punk-card";

const Punks = () => {
  const { active } = useWeb3React();
  const { punks, loading } = usePunksData();

  if (!active) return <RequestAccess />;

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
          {punks.map(({ name, image, tokenId }) => (
            <PunkCard key={tokenId} name={name} image={image} />
          ))}
        </Grid>
      )}
    </>
  );
};

export default Punks;
