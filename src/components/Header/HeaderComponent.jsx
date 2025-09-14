import React from 'react';
import style from './HeaderComponent.module.css';
import { useAuth } from "react-oidc-context";
import { ColorModeButton } from '../ui/color-mode';
import { Tabs, Box, Avatar, Menu, Portal, HStack, Button, Separator, Flex } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react"

const HeaderComponent = () => {

    const auth = useAuth();

    return (
        <Box bg="Background" >
            <Flex align="center" justify="space-around" gap={8}>
                <HStack wrap="wrap" gap="4">
                    <Image src="/padoca-logo.png" alt="Logo" boxSize="80px" objectFit="fill" />
                    <Separator orientation="vertical" height="4" />
                    <Button variant="ghost">Dashboard</Button>
                    <Button variant="ghost">Receitas</Button>
                    <Button variant="ghost">Produtos</Button>
                    <Button variant="ghost">Pessoal</Button>
                    <Separator orientation="vertical" height="4" />
                   
                        {auth.isAuthenticated && <span>Olá, {auth.user?.profile?.email}</span>}
                        <div style={{ width: '10px' }}></div>
                        {auth.isAuthenticated && (<Menu.Root positioning={{ placement: "right-start" }} colorPalette="orange" variant="subtle">
                            <Menu.Trigger rounded="full" focusRing="outside">
                                <Avatar.Root size="sm" variant="solid" colorPalette="orange">
                                    <Avatar.Fallback name={auth.user?.profile?.name} />
                                </Avatar.Root>
                            </Menu.Trigger>
                            <Portal>
                                <Menu.Positioner >
                                    <Menu.Content>
                                        <Menu.Item value="profile">Profile</Menu.Item>
                                        <Menu.Item value="logout" onClick={() => auth.signoutRedirect()}>Logout</Menu.Item>
                                    </Menu.Content>
                                </Menu.Positioner>
                            </Portal>
                        </Menu.Root>)}
                    <Separator orientation="vertical" height="4" />
                    <ColorModeButton></ColorModeButton>
                </HStack>
            </Flex>
        </Box>
    );
};

export default HeaderComponent;