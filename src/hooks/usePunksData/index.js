import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useState } from "react";
import usePlatziPunks from "../usePlatziPunks";

// async because it calls to the smart contract
const getPunkData = async ({ platziPunks, tokenId }) => {
  const [
    accessoriesType,
    clotheColor,
    clotheType,
    eyeType,
    eyeBrowType,
    facialHairColor,
    facialHairType,
    hairColor,
    hatColor,
    graphicType,
    mouthType,
    skinColor,
    topType,
    tokenURI,
    dna,
    owner,
  ] = await Promise.all([   // List of Promises to create
    platziPunks.methods.getAccessoriesType(tokenId).call(),
    platziPunks.methods.getClotheColor(tokenId).call(),
    platziPunks.methods.getClotheType(tokenId).call(),
    platziPunks.methods.getEyeType(tokenId).call(),
    platziPunks.methods.getEyeBrowType(tokenId).call(),
    platziPunks.methods.getFacialHairColor(tokenId).call(),
    platziPunks.methods.getFacialHairType(tokenId).call(),
    platziPunks.methods.getHairColor(tokenId).call(),
    platziPunks.methods.getHatColor(tokenId).call(),
    platziPunks.methods.getGraphicType(tokenId).call(),
    platziPunks.methods.getMouthType(tokenId).call(),
    platziPunks.methods.getSkinColor(tokenId).call(),
    platziPunks.methods.getTopType(tokenId).call(),
    platziPunks.methods.tokenURI(tokenId).call(),
    platziPunks.methods.tokenDNA(tokenId).call(),
    platziPunks.methods.ownerOf(tokenId).call(),
  ]);
  // tokenURI is in Base64 --> we need to make a fetch to convert to JSON
  const response = await fetch(tokenURI);
  const metadata = await response.json();

  return {
    tokenId,
    attributes: {
      accessoriesType,
      clotheColor,
      clotheType,
      eyeType,
      eyeBrowType,
      facialHairColor,
      facialHairType,
      hairColor,
      hatColor,
      graphicType,
      mouthType,
      skinColor,
      topType,
    },
    owner,
    dna,
    ...metadata,
  };
};

const usePunksData = ({ owner = null } = {}) => {
  const [punks, setPunks] = useState([]);
  const { library } = useWeb3React();
  const [loading, setLoading] = useState(true);
  const platziPunks = usePlatziPunks(); // Instantiate the contract

  const update = useCallback(async () => {
    if (platziPunks) {
      setLoading(true); // Previous to get all punks, it's set to true

      let tokenIds;

      if (!library.utils.isAddress(owner)) {
        const totalSupply = await platziPunks.methods.totalSupply().call();
        // Number because web3 parses normally to String
        tokenIds = new Array(Number(totalSupply))
          .fill()
          .map((_, index) => index);
      } else {
        // https://docs.openzeppelin.com/contracts/4.x/api/token/erc721#IERC721-balanceOf-address-
        const balanceOf = await platziPunks.methods.balanceOf(owner).call();
        const tokenIdsOfOwner = new Array(Number(balanceOf))
          .fill()
          .map((_, index) =>
            // https://docs.openzeppelin.com/contracts/4.x/api/token/erc721#IERC721Enumerable-tokenOfOwnerByIndex-address-uint256-
            platziPunks.methods.tokenOfOwnerByIndex(owner, index).call()
          );
        tokenIds = await Promise.all(tokenIdsOfOwner);
      }

      const punksPromise = tokenIds.map((tokenId) =>
        getPunkData({ tokenId, platziPunks })
      );

      const punks = await Promise.all(punksPromise);

      setPunks(punks);
      setLoading(false);  // After getting all punks, it's switched to false
    }
  }, [platziPunks, owner, library?.utils]);

  // Get all Punks data with the first render
  useEffect(() => {
    update();
  }, [update]);

  return {
    loading,
    punks,
    update,
  };
};

const usePunkData = (tokenId = null) => {
  const [punk, setPunk] = useState({}); // {} define an empty object
  const [loading, setLoading] = useState(true);
  const platziPunks = usePlatziPunks();

  const update = useCallback(async () => {
    // tokenId can be 0 --> you must compare against null
    if (platziPunks && tokenId != null) {
      setLoading(true);  // Previous to get the punk, it's set to true

      const punk = await getPunkData({ tokenId, platziPunks });

      setPunk(punk);
      setLoading(false); // After getting the punk, it's switched to false
    }
  }, [platziPunks, tokenId]);

  useEffect(() => {
    update();
  }, [update]);

  return {
    loading,
    punk,
    update,
  };
};

export { usePunksData, usePunkData };
