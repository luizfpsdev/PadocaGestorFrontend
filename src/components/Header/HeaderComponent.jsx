import React from 'react';
import style from './HeaderComponent.module.css';
import { useAuth } from "react-oidc-context";
import { ColorModeButton } from '../ui/color-mode';
import { Tabs, Box, Avatar, Menu, Portal,HStack,Button } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react"

const HeaderComponent = () => {

    const auth = useAuth();

    return (
        <Box bg="Background" className={style.header}>
            <div className={style.leftside}>
                <Image src="/vite.svg" alt="Logo" boxSize="40px" objectFit="cover" />
            </div>
            <div className={style.middle}>
                <HStack wrap="wrap" gap="4">
                    <Button variant="ghost">Dashboard</Button>
                    <Button variant="ghost">Receitas</Button>
                    <Button variant="ghost">Produtos</Button>
                    <Button variant="ghost">Pessoal</Button>
                </HStack>
            </div>
            <div className={style.rightside}>
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
                <ColorModeButton></ColorModeButton>
            </div>
        </Box>
    );
};

export default HeaderComponent;