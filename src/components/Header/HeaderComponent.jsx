import React from 'react';
import style from './HeaderComponent.module.css';
import { useAuth } from "react-oidc-context";
import { ColorModeButton } from '../ui/color-mode';
import { Tabs, Box, Avatar, Menu, Portal, HStack, Button, Separator, Flex, Spacer } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react"
import { useNavigate } from 'react-router-dom';
import { LuLogOut,LuFileUser } from "react-icons/lu";

const HeaderComponent = () => {

    const auth = useAuth();
    const navigate = useNavigate();

    return (
        <Box bg="Background"  className={style.header}>
            <Flex align="center" gap={8}>
                <HStack wrap="wrap" gap="4">
                    <Spacer />
                    <Spacer />
                    <Image src="/padoca-logo.png" alt="Logo" boxSize="80px" objectFit="fill" />
                    <Spacer />
                    <Spacer />
                    <Spacer />
                    <Spacer />
                    <Spacer />
                    <Spacer />
                    <Spacer />
                    <Spacer />
                    <Spacer />
                    <Separator orientation="vertical" height="4" />
                    <Button variant="ghost" onClick={()=> navigate("/dashboard")}>Dashboard</Button>
                    <Button variant="ghost" onClick={()=> navigate("/receitas")}>Receitas</Button>
                    <Button variant="ghost" onClick={()=> navigate("/produtos")}>Produtos</Button>
                    <Button variant="ghost" onClick={()=> navigate("/pessoal")}>Pessoal</Button>
                    <Separator orientation="vertical" height="4" />
                    <Spacer />
                    <Spacer />
                    <Spacer />
                    <Spacer />
                    <Spacer />
                    <Spacer />
                    <Spacer />
                    <Spacer />
                    <Spacer />
                    <ColorModeButton></ColorModeButton>
                    <Separator orientation="vertical" height="4" />
                    {auth.isAuthenticated && <span>Olá, {auth.user?.profile?.email}</span>}
                    {auth.isAuthenticated && (
                    <Menu.Root positioning={{ placement: "right-start" }} colorPalette="orange" variant="subtle">
                        <Menu.Trigger rounded="full" focusRing="outside">
                            <Avatar.Root size="sm" variant="solid" colorPalette="orange">
                                <Avatar.Fallback name={auth.user?.profile?.name} />
                            </Avatar.Root>
                        </Menu.Trigger>
                        <Portal>
                            <Menu.Positioner >
                                <Menu.Content>
                                    <Menu.Item value="profile">
                                        <LuFileUser/>
                                        Profile</Menu.Item>
                                    <Menu.Item value="logout" onClick={() => auth.signoutRedirect()}>
                                        <LuLogOut/>
                                        Logout
                                        </Menu.Item>
                                </Menu.Content>
                            </Menu.Positioner>
                        </Portal>
                    </Menu.Root>)}
                </HStack>
            </Flex>
        </Box>
    );
};

export default HeaderComponent;