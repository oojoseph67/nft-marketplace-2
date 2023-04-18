import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import {
  Web3Button,
  useContract,
  useCreateDirectListing,
} from "@thirdweb-dev/react";
import {
  MARKETPLACE_ADDRESS,
  NFT_COLLECTION_ADDRESS,
} from "../const/addresses";
import { Box, Input, Stack, Text } from "@chakra-ui/react";
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

  return (
    <Stack spacing={8}>
      <Box>
        <Text fontWeight={"bold"} mb={2}>
          Direct Listing:{" "}
        </Text>
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
          router.push(`/token/${NFT_COLLECTION_ADDRESS}/${nft.metadata.id}`);
        }}>
        Creating Direct Listing
      </Web3Button>
    </Stack>
  );
};

export default SaleInfo;
