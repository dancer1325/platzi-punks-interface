import { useWeb3React } from "@web3-react/core";
import {
  Grid,
  InputGroup,
  InputLeftElement,
  Input,
  InputRightElement,
  Button,
  FormHelperText,
  FormControl,
} from "@chakra-ui/react";
import { usePunksData } from "../../hooks/usePunksData";
import RequestAccess from "../../components/request-access";
import Loading from "../../components/loading";
import PunkCard from "../../components/punk-card";
import { Link, useLocation, useHistory } from "react-router-dom";
import { useState } from "react";
import { SearchIcon } from "@chakra-ui/icons";

// View to list all Punks
const Punks = () => {
  const { search } = useLocation();
  const { push } = useHistory();
  const [validAddress, setValidAddress] = useState(true);
  const [submitted, setSubmitted] = useState(true);
  const [address, setAddress] = useState(
    new URLSearchParams(search).get("address")
  );
  const { active, library } = useWeb3React();
  // Place outside this file in order not to overload it
  const { punks, loading } = usePunksData({
    owner: submitted && validAddress ? address : null,
  });

  const handleAddressChange = ({ target: { value } }) => {
    setAddress(value);
    setValidAddress(false);
    setSubmitted(false);
  };

  const submit = (event) => {
    event.preventDefault();
    if (address) {
      const isValid = library.utils.isAddress(address);
      setValidAddress(isValid);
      setSubmitted(true);
      if (isValid) push(`/punks?address=${address}`);
    } else {
      push("/punks");
    }
  };

  // In case the user hasn't logged in
  if (!active) return <RequestAccess />;

  return (
    <>
      <form onSubmit={submit}>
        <FormControl>
          <InputGroup mb={3}>
            <InputLeftElement
              pointerEvents="none"
              children={<SearchIcon color="gray.300" />}
            />
            <Input
              isInvalid={!validAddress}
              value={address ?? ""}
              onChange={handleAddressChange}
              placeholder="Look for by address"
            />
            <InputRightElement width="5.5rem">
              <Button type="submit" h="1.75rem" size="sm">
                Search
              </Button>
            </InputRightElement>
          </InputGroup>
          {submitted && !validAddress && (
            <FormHelperText>Invalid address</FormHelperText>
          )}
        </FormControl>
      </form>
      {loading ? (
        <Loading />
      ) : (
        //  1fr  To occupy all the screen
        <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
          {punks.map(({ name, image, tokenId }) => (
            //  key To manage the indexing of each element
            <Link key={tokenId} to={`/punks/${tokenId}`}>
              <PunkCard name={name} image={image} />
            </Link>
          ))}
        </Grid>
      )}
    </>
  );
};

export default Punks;
