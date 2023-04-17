import { SimpleGrid, Skeleton, Text } from "@chakra-ui/react"
import NFTComponent from "./nft";
import Link from "next/link";
import { NFT_COLLECTION_ADDRESS } from "../const/addresses";

import React from "react";

export default function NFTGrid({
  isLoading,
  data,
  overrideOnClickBehavior,
  emptyText,
}) {
  return (
    <SimpleGrid columns={4} spacing={6} w={"100%"} padding={2.5} my={5}>
      {isLoading ? (
        [...Array(20)].map((_, index) => (
          <Skeleton key={index} height={"312px"} width={"100%"} />
        ))
      ) : data && data.length > 0 ? (
        data.map((nft) =>
          !overrideOnClickBehavior ? (
            <Link
              href={`/token/${NFT_COLLECTION_ADDRESS}/${nft.metadata.id}`}
              key={nft.metadata.id}
            >
              <NFTComponent nft={nft} />
            </Link>
          ) : (
            <div
              key={nft.metadata.id}
              onClick={() => overrideOnClickBehavior(nft)}>
              <NFTComponent nft={nft} />
            </div>
          )
        )
      ) : (
        <Text>{emptyText}</Text>
      )}
    </SimpleGrid>
  );
}

// export default NFTGrid;
