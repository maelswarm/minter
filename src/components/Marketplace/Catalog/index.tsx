import React, { useEffect, useRef } from 'react';
import { Flex, SimpleGrid } from '@chakra-ui/react';
import { useSelector } from '../../../reducer';
import TokenCard from '../../common/TokenCard';
import { getMarketplaceNfts } from '../../../lib/nfts/queries';

export default function Catalog() {
  const { system, marketplace: state } = useSelector(s => s);
  let nfts: any;
  let ref = useRef(nfts);
  useEffect(() => {
    (async () => {
      ref.current = await getMarketplaceNfts(system, state.marketplace.address);
      console.log(ref.current)
    })();
  }, [state.marketplace.address, system]);

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
      <>
        <SimpleGrid columns={{ sm: 1, md: 2, lg: 3, xl: 4 }} gap={8} pb={8}>
          {ref.current?.map((nft: any, index: number) => {
            return (
              <TokenCard
                nft={nft}
                network={system.config.network}
                index={index}
              />
            );
          })}
        </SimpleGrid>
      </>
    </Flex>
  );
}