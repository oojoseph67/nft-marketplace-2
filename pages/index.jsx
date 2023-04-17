import {
  Container,
  Heading,
  Button,
  Flex,
  Stack
} from "@chakra-ui/react";
import NextLink from "next/link"

export default function Home() {
  return (
    <Container>
      <Flex h={"80vh"} alignItems={"center"} justifyContent={"center"}>
        <Stack spacing={4} align={"center"}>
          <Heading>Marketplace</Heading>
          <Button as={NextLink} href="/buy">
            Shop NFTs
          </Button>
        </Stack>
      </Flex>
    </Container>
  );
}
