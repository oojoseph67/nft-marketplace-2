import React from "react";
import { Container, Heading, Text } from "@chakra-ui/react";
import NFTGrid from "../components/nftGrid";
import { NFT_COLLECTION_ADDRESS } from "../const/addresses";
import { useContract, useNFTs } from "@thirdweb-dev/react";

const Buy = () => {
  const { contract } = useContract(NFT_COLLECTION_ADDRESS);
  const { data, isLoading } = useNFTs(contract);
  console.log("nft data", data);
  return (
    <Container maxW={"1200px"} p={5}>
      <Heading>Buy NFTs</Heading>
      <Text>Browse and buy NFTs from this collection</Text>
      <NFTGrid isLoading={isLoading} data={data} emptyText={"No NFTs Found"} />
    </Container>
  );
};

export default Buy;
