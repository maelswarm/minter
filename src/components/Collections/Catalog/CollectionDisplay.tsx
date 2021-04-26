import React, { useEffect } from 'react';
import {
  Flex,
  Heading,
  Link,
  SimpleGrid,
  Spinner,
  Text
} from '@chakra-ui/react';
import { MinterButton } from '../../common';
import { ExternalLink, Wind } from 'react-feather';
import { useDispatch, useSelector } from '../../../reducer';
import { getContractNftsQuery } from '../../../reducer/async/queries';
import CollectionsDropdown from './CollectionsDropdown';
import TokenCard from '../../common/TokenCard';
import { Nft } from '../../../lib/nfts/queries';

interface CollectionDisplayProps {
  address: string | null;
}

export default function CollectionDisplay({
  address
}: CollectionDisplayProps) {
  const collections = useSelector(s => s.collections);
  const { system } = useSelector(s => s);
  const dispatch = useDispatch();

  useEffect(() => {
    if (address !== null) {
      dispatch(getContractNftsQuery(address));
    }
  }, [address, dispatch]);

  if (address === null) {
    return <></>;
  }

  const collection = collections.collections[address];
  if (!collection) {
    return <></>;
  }

  if (!collection.loaded) {
    return (
      <Flex flexDir="column" align="center" flex="1" pt={20} borderLeft="2px solid #aaa">
        <Spinner size="xl" mb={6} color="gray.300" />
        <Heading size="lg" textAlign="center" color="gray.500">
          Loading...
        </Heading>
      </Flex>
    );
  }

  if (!collection.tokens) {
    return <></>;
  }

  const tokens = collection.tokens;

  if (tokens?.length === 0) {
    return (
      <Flex w="100%" flex="1" flexDir="column" align="center" borderLeft="2px solid #aaa">
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
            'No tokens to display in this collection.
          </Text>
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex
      flexDir="column"
      h="100%"
      w="100%"
      px={{ base: 6, md: 10 }}
      pt={6}
      flex="1"
      bg="brand.brightGray"
      overflowY="scroll"
      justify="start"
      borderLeft="2px solid #aaa"
    >
      { system.wallet !== null ? (
        <Flex display={{ base: 'flex', md: 'none' }} mb={4}>
          <CollectionsDropdown />
        </Flex>
      ) : null}
      <Flex
        w="100%"
        pb={6}
        justify="space-between"
        align={{
          base: 'flex-start',
          md: 'center'
        }}
        flexDir={{
          base: 'column',
          md: 'row'
        }}
      >
        <Flex flexDir="column" width="100%">
          <Flex justify="space-between" width="100%">
            <Heading size="lg">{collection.metadata.name || ''}</Heading>
          </Flex>
          <Flex align="center" display={{ base: 'none', md: 'flex' }}>
            <Text fontFamily="mono" color="brand.lightGray">
              {collection.address}
            </Text>
            <Link
              href={system.config.bcd.gui + '/' + collection.address}
              color="brand.darkGray"
              isExternal
              ml={2}
            >
              <ExternalLink size={16} />
            </Link>
          </Flex>
        </Flex>
        <MinterButton
          display={{ base: 'none', md: 'flex' }}
          variant="primaryActionInverted"
          onClick={() => {
            const selectedCollection = collections.selectedCollection;
            if (selectedCollection !== null) {
              dispatch(getContractNftsQuery(selectedCollection));
            }
          }}
          mt={{
            base: 4,
            md: 0
          }}
        ></MinterButton>
      </Flex>
      <SimpleGrid columns={{ sm: 1, md: 2, lg: 3, xl: 4 }} gap={8} pb={8}>
        {tokens?.filter((token: Nft) => token.owned).map((token: Nft, idx: number) =>
          <TokenCard
            key={idx}
            address={collection.address}
            config={system.config} {...token}
          />
        )}

      </SimpleGrid>
    </Flex>
  );
}
