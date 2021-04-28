import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Menu,
  MenuList,
  Modal,
  ModalCloseButton,
  ModalContent,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  useDisclosure
} from '@chakra-ui/react';
import { ChevronLeft, HelpCircle, MoreHorizontal } from 'react-feather';
import { MinterButton, MinterMenuButton, MinterMenuItem } from '../../common';
import { TransferTokenModal } from '../../common/modals/TransferToken';
import { SellTokenButton } from '../../common/modals/SellToken';
import { CancelTokenSaleButton } from '../../common/modals/CancelTokenSale';
import { BuyTokenButton } from '../../common/modals/BuyToken';
import { useSelector, useDispatch } from '../../../reducer';
import {
  getContractNftsQuery,
  getNftAssetContractQuery
} from '../../../reducer/async/queries';
import { Maximize2 } from 'react-feather';
import { TokenMedia } from '../../common/TokenMedia';

function NotFound() {
  return (
    <Flex flex="1" width="100%" justify="center">
      <Flex w="100%" flex="1" flexDir="column" align="center">
        <Flex
          px={32}
          py={16}
          bg="gray.100"
          textAlign="center"
          align="center"
          borderRadius="5px"
          flexDir="column"
          fontSize="xl"
          borderColor="gray.200"
          borderWidth="5px"
          mt={36}
          color="gray.300"
        >
          <HelpCircle size="100px" />
          <Heading size="xl" fontWeight="normal" pt={8} color="gray.400">
            Token not found
          </Heading>
        </Flex>
      </Flex>
    </Flex>
  );
}

interface TokenDetailProps {
  contractAddress: string;
  tokenId: number;
}

function TokenDetail({ contractAddress, tokenId }: TokenDetailProps) {
  const { system, collections: state } = useSelector(s => s);
  const disclosure = useDisclosure();
  const dispatch = useDispatch();
  const collection = state.collections[contractAddress];
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [zoom, setZoom] = useState(0);
  const [initialZoom] = useState(0);
  const [imageHeight] = useState(0);
  const [imageWidth] = useState(0);
  const [mediaType] = useState('');

  const collectionUndefined = collection === undefined;

  useEffect(() => {
    if (collectionUndefined) {
      dispatch(getNftAssetContractQuery(contractAddress));
    } else {
      dispatch(getContractNftsQuery(contractAddress));
    }
  }, [contractAddress, tokenId, collectionUndefined, dispatch]);

  useEffect(() => {
    const img = document.getElementById('fullScreenAssetView');
    const wHeight = window.innerHeight;
    const wWidth = window.innerWidth;
    const isPortrait = wHeight > wWidth;

    if (img && zoom !== 0 && zoom !== initialZoom) {
      img.style.maxWidth = `${imageWidth}px`;
      img.style.width = `${imageWidth * zoom}px`;
      img.style.height = `${imageHeight * zoom}px`;
      if (isPortrait && imageHeight > imageWidth) {
        img.style.margin = `calc((((${imageHeight - wHeight
          }px) / 2) * ${initialZoom} - 80px) * ${1 - zoom}) auto`;
      }
    }
  }, [imageHeight, imageWidth, initialZoom, zoom]);

  if (!collection?.tokens) {
    return null;
  }

  const token = collection.tokens.find(token => token.id === tokenId);
  if (!token) {
    return <NotFound />;
  }

  const isOwner =
    system.tzPublicKey &&
    (system.tzPublicKey === token.owner ||
      system.tzPublicKey === token.sale?.seller);

  return (
    <Flex flexDir="column" bg="brand.brightGray" flexGrow={1}>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="full"
        scrollBehavior="inside"
      >
        <ModalContent
          height="100vh"
          maxHeight="unset"
          width="100vw"
          display="flex"
          flexDirection="column"
          flexWrap="nowrap"
          justifyContent="center"
          alignItems="center"
          position="relative"
          backgroundColor="#222222f9"
          zIndex="2000"
          margin="0 !important"
          borderRadius="0"
        >
          {/^image\/.*/.test(mediaType) ? (
            <Flex
              height="3rem"
              alignItems="center"
              position="sticky"
              top={0}
              left={0}
            >
              <Slider
                defaultValue={initialZoom}
                min={initialZoom}
                max={1}
                step={0.01}
                width="10rem"
                margin="auto"
                onChange={setZoom}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </Flex>
          ) : (
            ''
          )}

          <TokenMedia
            key={`${token.address}-${token.id}`}
            config={system.config}
            {...token}
            metadata={token.metadata}
            maxW="85%"
            maxH="85%"
          />
          <ModalCloseButton
            position="absolute"
            right="0px !important"
            display="block !important"
            fontSize="18px"
            top="0px !important"
            borderLeft="2px solid #aaa"
            color="white"
            borderTop="2px solid #aaa"
            width="4rem"
            height="4rem"
            borderRight="none"
            borderBottom="none"
            borderBottomStartRadius="0"
            borderBottomEndRadius="0"
            borderTopEndRadius="0"
            border="0"
          />
        </ModalContent>
      </Modal>
      <Flex>
        <MinterButton
          variant="primaryActionInverted"
          onClick={e => {
            e.preventDefault();
            window.history.back();
          }}
        >
          <Box color="currentcolor">
            <ChevronLeft size={24} strokeWidth="3" />
          </Box>
        </MinterButton>
      </Flex>
      <Box
        align="center"
        px={[4, 16]}
        mx="auto"
        width={['100%', "100%", "100%", '70%']}
        maxWidth="80%"
        maxHeight={["40vh", "70vh", "65vh"]}
        height={["auto"]}
      >
        <TokenMedia
          key={`${token.address}-${token.id}`}
          config={system.config}
          {...token}
          metadata={token.metadata}
          maxH="45vh"
        />
      </Box>
      <Flex width="99vw" height={10} justifyContent="flex-end" marginBottom={[3, 2]} zIndex="50">
        <Button onClick={onOpen}>
          <Maximize2 size={16} strokeWidth="3" />
        </Button>
      </Flex>
      <Flex width={['100%']} bg="white" flexDir="column" flexGrow={1}>
        <Flex align="center" justify="space-evenly" width={['100']} mt="4">
        </Flex>
        <Flex
          width={['90%', '90%', '70%']}
          mx="auto"
          flexDir="column"
          px={[4, 16]}
          flex="1"
        >
          <Flex
            flexDir="column"
            w="100%"
            bg="white"
            py={6}
            mb={10}
            pos="relative"
          >
            <Flex display={['block', 'block', 'flex']} justifyContent="space-between" alignItems="center" width="100%" flexDir={['column', 'column', 'row']} flexWrap="wrap">
              <Heading textAlign="left" color="brand.black" width={["100%", "100%", "80%"]} fontSize={["10vw", "3vw"]} display="inline-block">
                {token.title}
              </Heading>
              <Flex justifyContent={["space-between", "space-between", "space-between", "flex-end"]} alignItems="center" width="100%">
                {token.sale ? (
                  isOwner ? (
                    <>
                      <Text color="brand.black" fontSize="xl" fontWeight="700" marginRight={8}>
                        {token.sale.price} ꜩ
                    </Text>
                      <Box marginRight={8}>
                        <CancelTokenSaleButton
                          contract={contractAddress}
                          tokenId={tokenId}
                        />
                      </Box>
                    </>
                  ) : (
                    <>
                      <Text color="black" fontSize={['md', 'md', 'lg']} mr={1} fontWeight="700" marginRight={8}>
                        {token.sale.price.toFixed(2)} ꜩ
                      </Text>
                      <Box>
                        <BuyTokenButton contract={contractAddress} token={token} />
                      </Box>
                    </>
                  )
                ) : isOwner ? (
                  <Box marginRight={8}>
                    <SellTokenButton contract={contractAddress} tokenId={tokenId} />
                  </Box>
                ) : (
                  <></>
                )}
                {isOwner ? (
                  <Menu>
                    <MinterMenuButton variant="primary">
                      <MoreHorizontal color="#25282B" />
                    </MinterMenuButton>
                    <MenuList
                      borderColor="brand.lightBlue"
                      borderRadius="2px"
                      p={0}
                      minWidth={[100]}
                    >
                      {token.sale ? (
                        <></>
                      ) : (
                        <MinterMenuItem
                          w={[100]}
                          variant="primary"
                          onClick={disclosure.onOpen}
                        >
                          Transfer
                        </MinterMenuItem>
                      )}
                    </MenuList>
                    <TransferTokenModal
                      contractAddress={contractAddress}
                      tokenId={tokenId}
                      disclosure={disclosure}
                    />
                  </Menu>
                ) : (
                  <></>
                )}
              </Flex>
            </Flex>
            <Text
              fontSize="md"
              color="brand.neutralGray"
              fontWeight="bold"
              mt={[2, 4]}
              width={['100%', '100%', '100%', '100%', '60%']}
            >
              {token.description || 'No description provided'}
            </Text>
            <Accordion allowToggle>
              <AccordionItem border="none">
                <AccordionButton mt={[4, 8]} p={0}>
                  <Text color="brand.neutralGray">Token Info</Text>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <Flex mt={[4, 8]}>
                    <Text color="brand.neutralGray">Minter:</Text>
                    <Text color="brand.darkGray" fontWeight="bold" ml={[1]}  whiteSpace="nowrap" overflow="hidden">
                      <Link display="block" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" href={`https://tzkt.io/${token.owner}`}>{token.owner}</Link>
                    </Text>
                  </Flex>
                  <Flex mt={[4, 8]}>
                    <Text color="brand.neutralGray">Collection:</Text>
                    <Text color="brand.darkGray" fontWeight="bold" ml={[1]}  whiteSpace="nowrap" overflow="hidden">
                      <Link display="block" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" href={`https://tzkt.io/${contractAddress}`}>{contractAddress}</Link>
                    </Text>
                  </Flex>
                  {token.metadata?.attributes?.map(({ name, value }) => (
                    <Flex mt={[4, 8]}>
                      <Text color="brand.neutralGray">{name}:</Text>
                      <Text display="block" color="brand.darkGray" fontWeight="bold" ml={[1]}  whiteSpace="nowrap" overflow="hidden" textOverflow="wrap">
                        {value}
                      </Text>
                    </Flex>
                  ))}
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Flex>
        </Flex>
      </Flex>
    </Flex >
  );
}

export default TokenDetail;
