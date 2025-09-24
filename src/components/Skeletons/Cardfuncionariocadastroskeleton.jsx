import React from 'react';
import { Box, SimpleGrid, GridItem, Card, Stack, Field, Input, Badge, HStack, Button, Flex, Textarea } from "@chakra-ui/react"
import { SkeletonText } from "@chakra-ui/react"

const CardFuncionarioCadastroSkeleton = () => (
    <>
        <Box p={4}>
            <SimpleGrid columns={10} gap={4}>
                <GridItem colSpan={3}>
                    <Card.Root >
                        <Card.Header>
                            <SkeletonText noOfLines={1} width="45%" />
                        </Card.Header>
                        <Card.Body>
                            <Stack gap="4" w="full">
                                <Field.Root>
                                    <SkeletonText noOfLines={1} width="15%" />
                                    <SkeletonText noOfLines={1} h="50px" />
                                </Field.Root>
                                <Field.Root>
                                    <SkeletonText noOfLines={1} width="10%" />
                                    <SkeletonText noOfLines={1} width="15%" />
                                    <SkeletonText noOfLines={1} h="50px" />
                                </Field.Root>
                                <HStack>
                                    <Field.Root>
                                        <SkeletonText noOfLines={1} width="20%" />
                                        <SkeletonText noOfLines={1} h="50px" />
                                    </Field.Root>
                                    <Field.Root>
                                        <SkeletonText noOfLines={1} width="35%" />
                                        <SkeletonText noOfLines={1} h="50px" />
                                    </Field.Root>
                                </HStack>
                                <Field.Root>
                                    <SkeletonText noOfLines={1} width="10%" />
                                     <SkeletonText noOfLines={1} h="72px" />
                                </Field.Root>
                            </Stack>
                        </Card.Body>
                        <Card.Footer>
                            <Flex w="100%" justify="flex-end" >
                                <SkeletonText noOfLines={1} width="20%" h="50px" ml={'auto'} colorPalette="orange"/>
                            </Flex>
                        </Card.Footer>
                    </Card.Root>
                </GridItem>
                <GridItem colSpan={7}>
                    <Card.Root>
                        <Card.Header />
                        <Card.Body>

                        </Card.Body>
                        <Card.Footer />
                    </Card.Root>
                </GridItem>
            </SimpleGrid>
        </Box>
    </>
);

export default CardFuncionarioCadastroSkeleton;