import React, { useEffect, useState } from 'react';
import { Box, SimpleGrid, GridItem, Group, Card, Stack, Field, Input, Badge, HStack, Button, Flex, Textarea, Table, Pagination, ButtonGroup, IconButton, Checkbox } from "@chakra-ui/react"
import CardFuncionarioCadastroSkeleton from '../components/Skeletons/Cardfuncionariocadastroskeleton';
import { LuChevronLeft, LuChevronRight, LuSearch } from "react-icons/lu"


const FornecedoresPage = () => {

    const [loading, setLoadingPage] = React.useState(false);
    const [page, setPage] = useState(1);
    const [selection, setSelection] = useState([])

    const items = [
        { id: 1, nome: "Laptop", endereco: "Electronics", telefone: 999.99, cnpj: "12.345.678/0001-99" },
        { id: 2, nome: "Coffee Maker", endereco: "Home Appliances", telefone: 49.99, cnpj: "12.345.678/0001-99" },
        { id: 3, nome: "Desk Chair", endereco: "Furniture", telefone: 150.0, cnpj: "12.345.678/0001-99" },
        { id: 4, nome: "Smartphone", endereco: "Electronics", telefone: 799.99, cnpj: "12.345.678/0001-99" },
        { id: 5, nome: "Headphones", endereco: "Accessories", telefone: 199.99, cnpj: "12.345.678/0001-99" },
         { id: 6, nome: "Smartphone", endereco: "Electronics", telefone: 799.99, cnpj: "12.345.678/0001-99" },
        { id: 7, nome: "Headphones", endereco: "Accessories", telefone: 199.99, cnpj: "12.345.678/0001-99" },
              { id: 8, nome: "Headphones", endereco: "Accessories", telefone: 199.99, cnpj: "12.345.678/0001-99" },
         { id: 9, nome: "Smartphone", endereco: "Electronics", telefone: 799.99, cnpj: "12.345.678/0001-99" },
        { id: 10, nome: "Headphones", endereco: "Accessories", telefone: 199.99, cnpj: "12.345.678/0001-99" },
    ]

    const indeterminate = selection.length > 0 && selection.length < items.length

    useEffect(() => {
        setTimeout(() => {
            setLoadingPage(true);
        }, 1000)
    }, []);

    return (
        <>
            {!loading && <CardFuncionarioCadastroSkeleton />}
            {loading && (<Box p={4}>
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
                                    <Field.Root>
                                        <Field.Label>Obs:</Field.Label>
                                        <Textarea variant="subtle" />
                                    </Field.Root>
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
                            <Card.Header>
                                <Group attached w="full" maxW="sm">
                                    <Input flex="1" placeholder="Entre com o termo pesquisado" />
                                    <IconButton colorPalette="orange" variant="solid">
                                        <LuSearch />
                                    </IconButton>
                                </Group>
                            </Card.Header>
                            <Card.Body>
                                <Table.Root size="lg" variant="line" interactive colorPalette="orange" striped>
                                    <Table.Header>
                                        <Table.Row >
                                            <Table.ColumnHeader>
                                                <Checkbox.Root
                                                    size="sm"
                                                    mt="0.5"
                                                    aria-label="Select all rows"
                                                    checked={indeterminate ? "indeterminate" : selection.length > 0}
                                                    onCheckedChange={(changes) => {
                                                        setSelection(
                                                            changes.checked ? items.map((item) => item.id) : [],
                                                        )
                                                    }}
                                                >
                                                    <Checkbox.HiddenInput />
                                                    <Checkbox.Control />
                                                </Checkbox.Root>
                                            </Table.ColumnHeader>
                                            <Table.ColumnHeader>#
                                            </Table.ColumnHeader>
                                            <Table.ColumnHeader>Nome</Table.ColumnHeader>
                                            <Table.ColumnHeader>Endereço</Table.ColumnHeader>
                                            <Table.ColumnHeader>Telefone</Table.ColumnHeader>
                                            <Table.ColumnHeader>Cnpj</Table.ColumnHeader>
                                            <Table.ColumnHeader textAlign="end">Ações</Table.ColumnHeader>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {items.map((item) => (
                                            <Table.Row key={item.id} data-selected={selection.includes(item.id) ? "" : undefined}>
                                                <Table.Cell>
                                                    <Checkbox.Root
                                                        size="sm"
                                                        mt="0.5"
                                                        aria-label="Select row"
                                                        checked={selection.includes(item.id)}
                                                        onCheckedChange={(changes) => {
                                                            setSelection((prev) =>
                                                                changes.checked
                                                                    ? [...prev, item.id]
                                                                    : selection.filter((id) => id !== item.id),
                                                            )
                                                        }}
                                                    >
                                                        <Checkbox.HiddenInput />
                                                        <Checkbox.Control />
                                                    </Checkbox.Root>
                                                </Table.Cell>
                                                <Table.Cell>{item.id}</Table.Cell>
                                                <Table.Cell>{item.nome}</Table.Cell>
                                                <Table.Cell>{item.endereco}</Table.Cell>
                                                <Table.Cell>{item.telefone}</Table.Cell>
                                                <Table.Cell>{item.cnpj}</Table.Cell>
                                                <Table.Cell textAlign="end">{item.price}</Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table.Root>


                            </Card.Body>
                            <Flex justifyContent={'space-around'} >
                                <Card.Footer>

                                    <Pagination.Root count={items.length * 1000} pageSize={5} page={page} onPageChange={(e) => setPage(e.page)} colorPalette="orange">

                                        <ButtonGroup variant="outline" size="lg" wrap="wrap" attached >
                                            <Pagination.PrevTrigger asChild>
                                                <IconButton>
                                                    <LuChevronLeft />
                                                </IconButton>
                                            </Pagination.PrevTrigger>

                                            <Pagination.Items
                                                render={(page) => (
                                                    <IconButton variant={{ base: "outline", _selected: "solid" }}>
                                                        {page.value}
                                                    </IconButton>
                                                )}
                                            />

                                            <Pagination.NextTrigger asChild>
                                                <IconButton>
                                                    <LuChevronRight />
                                                </IconButton>
                                            </Pagination.NextTrigger>
                                        </ButtonGroup>
                                    </Pagination.Root>
                                </Card.Footer>
                            </Flex>

                        </Card.Root>
                    </GridItem>
                </SimpleGrid>
            </Box>)}

        </>
    );
};

export default FornecedoresPage;