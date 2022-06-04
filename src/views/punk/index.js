import {
  Stack,
  Heading,
  Text,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Button,
  Tag,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useParams } from "react-router";
import { usePunkData } from "../../hooks/usePunksData";
import { useWeb3React } from "@web3-react/core";
import RequestAccess from "../../components/request-access";
import Loading from "../../components/loading";
import PunkCard from "../../components/punk-card";
import usePlatziPunks from "../../hooks/usePlatziPunks";

// View shown for each Punk
const Punk = () => {
  const [transfering, setTransfering] = useState(false);
  const { tokenId } = useParams();  // Get tokenId from the urlParams
  const { active, library, account } = useWeb3React();
  const { loading, punk, update } = usePunkData(tokenId);
  const platziPunks = usePlatziPunks();
  const toast = useToast();

  const transfer = () => {
    setTransfering(true);
    const address = prompt("Add the address to transfer the punk");

    const isAddress = library.utils.isAddress(address);

    if (!isAddress) {
      alert("Address isn't valid");
      setTransfering(false);
    } else {
      platziPunks.methods
        .safeTransferFrom(punk.owner, address, punk.tokenId)
        // https://docs.openzeppelin.com/contracts/4.x/api/token/erc721#IERC721-safeTransferFrom-address-address-uint256-
        .send({
          from: account,
        })
        .on("error", (error) => {
          setTransfering(false);
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
          setTransfering(false);
          toast({
            title: "Transaction confirmed",
            description: `Punk is owned by ${address}`,
            status: "success",
          });
          update(); // Update since it would have already transferred
        });
    }
  };

  if (!active) return <RequestAccess />;

  if (loading) return <Loading />;

  return (
    <Stack
      spacing={{ base: 8, md: 10 }}
      py={{ base: 5 }}
      direction={{ base: "column", md: "row" }}
    >
      <Stack>
        <PunkCard
          mx={{
            base: "auto",
            md: 0,
          }}
          name={punk.name}
          image={punk.image}
        />
        <Button
          disabled={punk.owner !== account}   // If you aren't the owner of the punk
          isLoading={transfering}
          colorScheme="green"
          onClick={transfer}
        >
          {punk.owner !== account ? "You aren't the owner" : "Transfer"}
        </Button>
      </Stack>
      <Stack width="100%" spacing={5}>
        <Heading>{punk.name}</Heading>
        <Text fontSize="xl">{punk.description}</Text>
        <Text fontWeight={600}>
          DNA:
          <Tag ml={2} colorScheme="green">
            {punk.dna}
          </Tag>
        </Text>
        <Text fontWeight={600}>
          Owner:
          <Tag ml={2} colorScheme="green">
            {punk.owner}
          </Tag>
        </Text>
        <Table size="sm" variant="simple">
          <Thead>
            <Tr>
              <Th>Attribute</Th>
              <Th>Value</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Object.entries(punk.attributes).map(([key, value]) => (
              <Tr key={key}>
                <Td>{key}</Td>
                <Td>
                  <Tag>{value}</Tag>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Stack>
    </Stack>
  );
};

export default Punk;
