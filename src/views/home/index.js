import {
  Stack,
  Flex,
  Heading,
  Text,
  Button,
  Image,
  Badge,
  useToast,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useEffect, useCallback, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import usePlatziPunks from "../../hooks/usePlatziPunks";
import useTruncatedAddress from "../../hooks/useTruncatedAddress";

const Home = () => {
  // Create state variables
  const [nextId, setNextId] = useState(-1);
  const [imageSrc, setImageSrc] = useState("");
  const [maxSupply, setMaxSupply] = useState(0);
  const [availablePunks, setAvailablePunks] = useState("");
  const [minting, setMinting] = useState(false);
  const { active, account } = useWeb3React();
  const platziPunks = usePlatziPunks();
  const truncatedAddress = useTruncatedAddress(account);
  const toast = useToast(); // Generate messages into the UI https://chakra-ui.com/docs/components/feedback/toast

  // useCallback, because it's going to be invoked in a Hook
  const getPlatziPunksData = useCallback(async () => {
    if (platziPunks) {
      // .call()  Used for methods which don't mute the blockchain's state, just to return the information
      const maxSupply = await platziPunks.methods.maxSupply().call();
      setMaxSupply(maxSupply);
      const totalSupply = await platziPunks.methods.totalSupply().call();
      setNextId(totalSupply);
      setAvailablePunks(maxSupply - totalSupply);
      const dnaPreview = await platziPunks.methods
        .deterministicPseudoRandomDNA(totalSupply, account)
        .call();
      const image = await platziPunks.methods.imageByDNA(dnaPreview).call();
      setImageSrc(image);
    }
  }, [platziPunks, account]);

  useEffect(() => {
    getPlatziPunksData();
  }, [active, getPlatziPunksData]);

  const mint = () => {
    setMinting(true);

    // Don't wait because it would be necessary to wait that the transaction hash is generated
    platziPunks.methods
      .mint()
      .send({
        from: account,  // Address from which the transaction is sent
      })  // Send a transaction to the smart contract
      // https://web3js.readthedocs.io/en/v1.7.1/web3-eth-contract.html#methods-mymethod-send
      // .on("sending")
      // .on("sent")
      // .on("confirmation")
      .on("error", (error) => {
        setMinting(false);
        toast({
          title: "Transaction rejected",
          description: error.message,
          status: "error",
        })
      })
      .on("transactionHash", (txHash) => {
        toast({
          title: "Transaction sent",
          description: txHash,
          status: "info",
        });
      })
      .on("receipt", () => {
        setMinting(false);
        toast({
          title: "Transaction confirmed",
          description: "",
          status: "success",
        });
        getPlatziPunksData();
      });
  };

  return (
    <Stack
      align={"center"}
      spacing={{ base: 8, md: 10 }}
      py={{ base: 20, md: 28 }}
      direction={{ base: "column-reverse", md: "row" }}
    >
      <Stack flex={1} spacing={{ base: 5, md: 10 }}>
        <Heading
          lineHeight={1.1}
          fontWeight={600}
          fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}
        >
          <Text
            as={"span"}
            position={"relative"}
            _after={{
              content: "''",
              width: "full",
              height: "30%",
              position: "absolute",
              bottom: 1,
              left: 0,
              bg: "green.400",
              zIndex: -1,
            }}
          >
            Punk
          </Text>
          <br />
        </Heading>
        <Text color={"gray.500"}>
          Punk is an random Avatar collection whose metadata
          is stored on-chain. They have got unique characteristics
          and there are just 10000.
        </Text>
        <Text color={"green.500"}>
          Each Punk is generated sequentially based on your address,
          use the previsualize to find out which one would be your Punk if
          you mint in that moment
        </Text>
        <Stack
          spacing={{ base: 4, sm: 6 }}
          direction={{ base: "column", sm: "row" }}
        >
          <Button
            rounded={"full"}
            size={"lg"}
            fontWeight={"normal"}
            px={6}
            colorScheme={"green"}
            bg={"green.400"}
            _hover={{ bg: "green.500" }}
            disabled={!platziPunks}
            isLoading={minting}
            onClick={mint}
          >
            Get your punk
          </Button>
          <Link to="/punks">  {/* Declarative and accessible navigation around the application */}
            <Button rounded={"full"} size={"lg"} fontWeight={"normal"} px={6}>
              Media gallery
            </Button>
          </Link>
        </Stack>
      </Stack>
      <Flex
        flex={1}
        direction="column"
        justify={"center"}
        align={"center"}
        position={"relative"}
        w={"full"}
      >
        <Image src={active ? imageSrc : "https://avataaars.io/"} />
        {active ? (
          <>
            <Flex mt={3}>
              <Badge>
                Next ID:
                <Badge ml={1} colorScheme="green">
                  {nextId}
                </Badge>
              </Badge>
              <Badge>
                Available:
                <Badge ml={2} colorScheme="green">
                  {availablePunks}
                </Badge>
              </Badge>
              <Badge ml={3}>
                Address:
                <Badge ml={1} colorScheme="green">
                  {truncatedAddress}
                </Badge>
              </Badge>
            </Flex>
            {/* Since at the same time another user could try to get his/her Punk and mint the transaction
            previous to you --> that punk couldn't be available anymore*/}
            <Button
              onClick={getPlatziPunksData}
              mt={4}
              size="xs"
              colorScheme="green"
            >
              Update
            </Button>
          </>
        ) : (
          <Badge mt={2}>Disconnected wallet</Badge>
        )}
      </Flex>
    </Stack>
  );
};

export default Home;
