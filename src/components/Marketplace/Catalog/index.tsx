import React, { useEffect } from 'react';
import { Container, Text, Flex, Heading, SimpleGrid, Spinner } from '@chakra-ui/react';
import { Wind } from 'react-feather';
import { useSelector, useDispatch } from '../../../reducer';
import { getMarketplaceNftsQuery } from '../../../reducer/async/queries';
import TokenCard from '../../common/TokenCard';

export default function Catalog() {
  const { system, marketplace: state } = useSelector(s => s);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMarketplaceNftsQuery(state.marketplace.address));
  }, [state.marketplace.address, dispatch]);

  let tokens = state.marketplace.tokens;
  if (tokens === null) {
    tokens = [];
  }

  return (
    <Flex
      w="100%"
      h="100%"
      bg="brand.brightGray"
      pt={6}
      overflowY="scroll"
      justify="start"
      flexDir="column"
      alignItems="center"
    >
      {state.marketplace.loaded && tokens.length > 0 ? (
        <Flex width={['100%', '50%']} px={4} paddingBottom={8} justifyContent="center">
          <TokenCard
            key={`${tokens[0].address}-${tokens[0].id}`}
            network={system.config.network}
            {...tokens[0]}
          />
        </Flex>
      ) : null}
      <Container maxW="100%">
        <Flex
          flex="1"
          w="100%"
          flexDir="column"
        >
          {!state.marketplace.loaded ? (
            <Flex flexDir="column" align="center" flex="1" pt={20}>
              <Spinner size="xl" mb={6} color="gray.300" />
              <Heading size="lg" textAlign="center" color="gray.500">
                Loading...
              </Heading>
            </Flex>
          ) :
            tokens.length === 0 ? (
              <Flex w="100%" flex="1" flexDir="column" align="center">
                <Flex
                  px={20}
                  py={10}
                  bg="gray.200"
                  textAlign="center"
                  align="center"
                  borderRadius="5px"
                  flexDir="column"
                  fontSize="xl"
                  color="gray.400"
                  mt={28}
                >
                  <Wind />
                  <Text fontWeight="600" pt={5}>
                    No tokens to display in this marketplace
                </Text>
                </Flex>
              </Flex>
            ) : (
              <>
                <SimpleGrid columns={{ sm: 1, md: 2, lg: 3, xl: 4 }} gap={8} pb={8}>
                  {tokens.slice(1).map(token => {
                    return (
                      <TokenCard
                        key={`${token.address}-${token.id}`}
                        network={system.config.network}
                        {...token}
                      />
                    );
                  })}
                </SimpleGrid>
              </>
            )}
        </Flex>
      </Container>
    </Flex>
  );
}