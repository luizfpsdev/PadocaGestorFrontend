import React from 'react';
import style from './HeaderComponent.module.css';
import { useAuth } from "react-oidc-context";
import { ColorModeButton } from '../ui/color-mode';
import { Box, Avatar, Menu, Portal, HStack, Button, Separator, Spacer } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react"
import { useNavigate } from 'react-router-dom';
import { LuLogOut,LuFileUser,LuLayoutDashboard,LuUsers,LuBox,LuBookOpenText,LuChefHat,LuBoxes } from "react-icons/lu";

const HeaderComponent = () => {

    const auth = useAuth();
    const navigate = useNavigate();

    return (
        <Box bg="Background"  className={style.header} w="100%">
                <HStack >
                    <Spacer />
                    <Spacer />
                    <Image src="/padoca-logo2.png" alt="Logo" boxSize="80px" width="250px" objectFit="fill" />
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
                    <Button className={style.actionbutton} variant="ghost" onClick={()=> navigate("/dashboard")} rounded="full"><LuLayoutDashboard></LuLayoutDashboard>Dashboard</Button>
                    <Button className={style.actionbutton} variant="ghost" onClick={()=> navigate("/receitas")} rounded="full"><LuBookOpenText/>Receitas</Button>
                    <Button className={style.actionbutton} variant="ghost" onClick={()=> navigate("/produtos")} rounded="full"><LuBox/> Produtos</Button>
                    <Button className={style.actionbutton} variant="ghost" onClick={()=> navigate("/ingredientes")} rounded="full"><LuChefHat/> Ingredientes</Button>
                    <Button className={style.actionbutton} variant="ghost" onClick={()=> navigate("/pessoal")} rounded="full"><LuUsers/> Pessoal</Button>
                    <Button className={style.actionbutton} variant="ghost" onClick={()=> navigate("/fornecedores")} rounded="full"><LuBoxes/> Fornecedores</Button>
                    <Separator orientation="vertical" height="4" />
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
                    <Menu.Root positioning={{ placement: "bottom-start" }} colorPalette="orange" variant="subtle">
                        <Menu.Trigger rounded="full" focusRing="outside">
                            <Avatar.Root size="sm" variant="subtle" colorPalette="orange">
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
                     <Spacer />
                </HStack>
        </Box>
    );
};

export default HeaderComponent;