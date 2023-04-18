import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import {
  Web3Button,
  useContract,
  useCreateAuctionListing,
  useCreateDirectListing,
} from "@thirdweb-dev/react";
import {
  MARKETPLACE_ADDRESS,
  NFT_COLLECTION_ADDRESS,
} from "../const/addresses";
import {
  Box,
  Input,
  Stack,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Text,
} from "@chakra-ui/react";
import React from "react";

const SaleInfo = ({ nft }) => {
  const router = useRouter();
  const { contract: marketplace } = useContract(
    MARKETPLACE_ADDRESS,
    "marketplace-v3"
  );
  const { contract: nftCollection } = useContract(NFT_COLLECTION_ADDRESS);
  const { mutateAsync: createDirectListing } =
    useCreateDirectListing(marketplace);
  const { mutateAsync: createAuctionListing } =
    useCreateAuctionListing(marketplace);

  async function checkAndProvideApproval() {
    const hasApproval = await nftCollection?.call("isApprovedForAll", [
      nft.owner,
      MARKETPLACE_ADDRESS,
    ]);

    if (!hasApproval) {
      const txResult = await nftCollection?.call("setApprovalForAll", [
        MARKETPLACE_ADDRESS,
        true,
      ]);

      if (!txResult) {
        console.log("Approval provided");
      }
    }

    return true;
  }

  const { register: registerDirect, handleSubmit: handleSubmitDirect } =
    useForm({
      defaultValues: {
        nftContractAddress: NFT_COLLECTION_ADDRESS,
        tokenId: nft.metadata.id,
        price: "0",
        startDate: new Date(),
        endDate: new Date(),
      },
    });

  async function handleSubmissionDirect(data) {
    await checkAndProvideApproval();
    const txResult = await createDirectListing({
      assetContractAddress: data.nftContractAddress,
      tokenId: data.tokenId,
      pricePerToken: data.price,
      startTimeStamp: new Date(data.startDate),
      endTimeStamp: new Date(data.endDate),
    });

    return txResult;
  }

  const { register: registerAuction, handleSubmit: handleSubmitAuction } =
    useForm({
      defaultValues: {
        nftContractAddress: NFT_COLLECTION_ADDRESS,
        tokenId: nft.metadata.id,
        startDate: new Date(),
        endDate: new Date(),
        floorPrice: "0",
        buyoutPrice: "0",
      },
    });

  async function handleSubmissionAuction(data) {
    await checkAndProvideApproval();
    const txResult = await createAuctionListing({
      assetContractAddress: data.nftContractAddress,
      tokenId: data.tokenId,
      buyoutBidAmount: data.buyoutPrice,
      minimumBidAmount: data.floorPrice,
      startTimestamp: new Date(data.startDate),
      endTimestamp: new Date(data.endDate),
    });
    return txResult;
  }

  return (
    <Tabs>
      <TabList>
        <Tab>Direct</Tab>
        <Tab>Auction</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Stack spacing={8}>
            <Box>
              <Text>Listing starts on: </Text>
              <Input
                placeholder="Select Date and Time"
                size="md"
                type="datetime-local"
                {...registerDirect("startDate")}
              />
              <Text mt={2}>Listing ends on:</Text>
              <Input
                placeholder="Select Data and Time"
                size="md"
                type="datetime-local"
                {...registerDirect("endDate")}
              />
            </Box>
            <Box>
              <Text fontWeight={"bold"}>Price:</Text>
              <Input
                placeholder="0"
                size="md"
                type="number"
                {...registerDirect("price")}
              />
            </Box>
            <Web3Button
              contractAddress={MARKETPLACE_ADDRESS}
              action={async () => {
                await handleSubmitDirect(handleSubmissionDirect)();
              }}
              onSuccess={(txResult) => {
                router.push(
                  `/token/${NFT_COLLECTION_ADDRESS}/${nft.metadata.id}`
                );
              }}>
              Creating Direct Listing
            </Web3Button>
          </Stack>
        </TabPanel>
        <TabPanel>
          <Stack spacing={8}>
            <Box>
              <Text>Listing starts on:</Text>
              <Input
                placeholder="Select Date and Time"
                size="md"
                type="datetime-local"
                {...registerAuction("startDate")}
              />
              <Text mt={2}>Listing ends on:</Text>
              <Input
                placeholder="Select Data and Time"
                size="md"
                type="datetime-local"
                {...registerAuction("endDate")}
              />
            </Box>
            <Box>
              <Text fontWeight={"bold"}>Starting bid from:</Text>
              <Input
                placeholder="0"
                size="md"
                type="number"
                {...registerAuction("floorPrice")}
              />
            </Box>
            <Box>
              <Text fontWeight={"bold"}>Buyout Price:</Text>
              <Input
                placeholder="0"
                size="md"
                type="number"
                {...registerAuction("buyoutPrice")}
              />
            </Box>
            <Web3Button
              contractAddress={MARKETPLACE_ADDRESS}
              action={async () => {
                return await handleSubmitAuction(handleSubmissionAuction)();
              }}
              onSuccess={(txResult) => {
                router.push(
                  `/token/${NFT_COLLECTION_ADDRESS}/${nft.metadata.id}`
                );
              }}>
              Create Auction Listing
            </Web3Button>
          </Stack>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default SaleInfo;
