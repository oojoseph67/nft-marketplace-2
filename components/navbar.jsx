import { Avatar, Box, Flex, Heading, Link, Text } from "@chakra-ui/react";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import NextLink from "next/link";
import React from "react";

const Navbar = () => {
  const address = useAddress();
  return (
    <Box maxW={"1200px"} m={"auto"} py={"10px"} px={"40px"}>
      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <Link as={NextLink} href="/">
          <Heading>ASHIB</Heading>
        </Link>
        <Flex direction={"row"}>
          <Link as={NextLink} href="/buy" mx={2.5}>
            <Text>Buy</Text>
          </Link>
          <Link as={NextLink} href="/sell" mx={2.5}>
            <Text>Sell</Text>
          </Link>
        </Flex>
        <Flex dir={"row"} alignContent={"center"}>
          <ConnectWallet />
          {address && (
            <Link as={NextLink} href={`/profile/${address}`}>
              <Avatar src="https://bit.ly/broken-link" ml={"20px"} />
            </Link>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
