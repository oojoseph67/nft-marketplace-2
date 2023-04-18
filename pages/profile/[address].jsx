import { Container, Heading, Text } from "@chakra-ui/react";
import { useContract, useOwnedNFTs, useAddress } from "@thirdweb-dev/react";
import React from "react";
import {
  MARKETPLACE_ADDRESS,
  NFT_COLLECTION_ADDRESS,
} from "../../const/addresses";
import { useRouter } from "next/router";
import NFTGrid from "../../components/nftGrid";

const Address = () => {
  const router = useRouter();
  const address = useAddress();
  const { contract: nftCollection } = useContract(NFT_COLLECTION_ADDRESS);
  const { contract: marketplace } = useContract(
    MARKETPLACE_ADDRESS,
    "marketplace-v3"
  );
  const { data: ownedNFTs, isLoading: loadingOwnedNFTs } = useOwnedNFTs(
    nftCollection,
    router.query.address
    // address
  );

  return (
    <Container maxW={"1200px"} p={5}>
      <Heading>{"Owned NFT(s)"}</Heading>
      <Text>Browse and manage your NFTs from this collection</Text>
      <NFTGrid
        data={ownedNFTs}
        isLoading={loadingOwnedNFTs}
        emptyText={"You don't own any NFTs yet from this collection"}
      />
    </Container>
  );
};

export default Address;
