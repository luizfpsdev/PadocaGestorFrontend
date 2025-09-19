import React from 'react';
import { Box, SimpleGrid, GridItem, Card, Stack, Field, Input, Badge, HStack, Button, Flex } from "@chakra-ui/react"


const FornecedoresPage = () => {
    return (
        <Box p={4}>
            <SimpleGrid columns={10} gap={4}>
                <GridItem colSpan={3}>
                    <Card.Root >
                        <Card.Header>
                            Cadastro de Fornecedores
                        </Card.Header>
                        <Card.Body>
                            <Stack gap="4" w="full">
                                <Field.Root>
                                    <Field.Label>Nome:</Field.Label>
                                    <Input />
                                </Field.Root>
                                <Field.Root>
                                    <Field.RequiredIndicator
                                        fallback={
                                            <Badge size="xs" variant="surface">
                                                Opcional
                                            </Badge>
                                        }
                                    />
                                    <Field.Label>Endereço:</Field.Label>
                                    <Input />
                                </Field.Root>
                                <HStack>
                                    <Field.Root>
                                        <Field.Label>Cnpj:</Field.Label>
                                        <Input />
                                    </Field.Root>
                                    <Field.Root>
                                        <Field.Label>Telefone:</Field.Label>
                                        <Input />
                                    </Field.Root>
                                </HStack>
                            </Stack>
                        </Card.Body>
                        <Card.Footer>
                            <Flex w="100%" justify="flex-end" >
                                <Button variant={"solid"} colorPalette={"orange"} ml={'auto'}>Salvar</Button>
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
    );
};

export default FornecedoresPage;