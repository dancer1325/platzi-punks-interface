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
  const { tokenId } = useParams();
  const { active, library, account } = useWeb3React();
  const { loading, punk, update } = usePunkData(tokenId);
  const platziPunks = usePlatziPunks();
  const toast = useToast();

  const transfer = () => {
    setTransfering(true);
    const address = prompt("Ingresa la dirección");

    const isAddress = library.utils.isAddress(address);

    if (!isAddress) {
      alert("La dirección no es válida");
      setTransfering(false);
    } else {
      platziPunks.methods
        .safeTransferFrom(punk.owner, address, punk.tokenId)
        .send({
          from: account,
        })
        .on("error", () => {
          setTransfering(false);
        })
        .on("transactionHash", (txHash) => {
          toast({
            title: "Transacción enviada",
            description: txHash,
            status: "info",
          });
        })
        .on("receipt", () => {
          setTransfering(false);
          toast({
            title: "Transacción confirmada",
            description: `El punk ahora pertenece a ${address}`,
            status: "success",
          });
          update();
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
          disabled={punk.owner !== account}
          isLoading={transfering}
          colorScheme="green"
          onClick={transfer}
        >
          {punk.owner !== account ? "No eres el dueño" : "Transferir"}
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
              <Th>Atributo</Th>
              <Th>Valor</Th>
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
