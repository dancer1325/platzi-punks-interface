import { useState, useCallback, useEffect } from "react";
import {
  Flex,
  Button,
  Tag,
  TagLabel,
  Badge,
  TagCloseButton,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { connector } from "../../../config/web3";
import useTruncatedAddress from "../../../hooks/useTruncatedAddress";

const WalletData = () => {
  // state variable
  const [balance, setBalance] = useState(0);

  // If you are using Hooks and you want to access context variables
  // https://github.com/NoahZinsmeister/web3-react/tree/v6/docs#useweb3react
  // library. Once the library is activated --> it's available via key library
  // account. The one which it's connected
  const { activate, account, library, active, deactivate, error } =
    useWeb3React();

  const isUnsupportedChain = error instanceof UnsupportedChainIdError;

  // Check that in each render is connected
  const connect = useCallback(() => {
    activate(connector);
    localStorage.setItem("previouslyConnected", "true");    // Store in the localStorage. Returns string values
  }, [activate]);

  // Hook which handles refresh events
  // connect automatically
  useEffect(() => {
    if (localStorage.getItem("previouslyConnected") === "true") connect();  // Depends on
  }, [connect]);

  const getBalance = useCallback(async () => {
    const balance = await library.eth.getBalance(account);
    setBalance((balance / 1e18).toFixed(2));  // Divide by 1e18 to display in eth
  }, [account, library]);

  useEffect(() => {
    if (active) getBalance();   // Just in case if it's active the connection to the provider
  }, [active, getBalance]);     // listen changes on active and getBalance

  const disconnect = () => {
    deactivate();     // Deactivate to the provider from our account
    localStorage.removeItem("previouslyConnected");
  };

  const truncatedAddress = useTruncatedAddress(account);

  return (
    <Flex alignItems={"center"}>
      {/* If it's connected to the provider --> enable it */}
      {active ? (     
        <Tag colorScheme="green" borderRadius="full">
          <TagLabel>
            <Link to={`/punks?address=${account}`}>{truncatedAddress}</Link>
          </TagLabel>
          <Badge
            d={{
              base: "none",
              md: "block",
            }}
            variant="solid"
            fontSize="0.8rem"
            ml={1}
          >
            ~{balance} Ξ
          </Badge>
          <TagCloseButton onClick={disconnect} />
        </Tag>
      ) : (
        <Button
          variant={"solid"}
          colorScheme={"green"}
          size={"sm"}
          leftIcon={<AddIcon />}
          onClick={connect}
          disabled={isUnsupportedChain}
        >
          {isUnsupportedChain ? "Unsupported chain" : "Connect wallet"}
        </Button>
      )}
    </Flex>
  );
};

export default WalletData;
