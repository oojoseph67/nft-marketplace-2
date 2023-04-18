import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  ThirdwebNftMedia,
  useAddress,
  useContract,
  useOwnedNFTs,
} from "@thirdweb-dev/react";
import { NFT_COLLECTION_ADDRESS } from "../const/addresses";
import NFTGrid from "../components/nftGrid";
import SaleInfo from "../components/saleInfo";

const Sell = () => {
  const { contract } = useContract(NFT_COLLECTION_ADDRESS);
  const address = useAddress();
  const { data, isLoading } = useOwnedNFTs(contract, address);
  console.log("address sell", address);

  const [selectedNFT, setSelectedNFT] = useState();
  return (
    <Container maxW={"1200px"}>
      <Heading>Sell NFTs</Heading>
      <Text>Select which NFT to sell below</Text>
      {!selectedNFT ? (
        <NFTGrid
          data={data}
          isLoading={isLoading}
          overrideOnClickBehavior={(nft) => {
            setSelectedNFT(nft);
          }}
          emptyText={"You don't own any NFTs from this collection"}
        />
      ) : (
        <Flex justifyContent={"center"} my={10}>
          <Card w={"75%"}>
            <SimpleGrid columns={2} spacing={10} p={5}>
              <ThirdwebNftMedia
                metadata={selectedNFT.metadata}
                width="100%"
                height="100%"
              />
              <Stack>
                <Flex justifyContent={"right"}>
                  <Button
                    onClick={() => {
                      setSelectedNFT(undefined);
                    }}>
                    X
                  </Button>
                </Flex>
                <Heading>{selectedNFT.metadata.name}</Heading>
                <SaleInfo nft={selectedNFT} />
              </Stack>
            </SimpleGrid>
          </Card>
        </Flex>
      )}
    </Container>
  );
};

export default Sell;
