import React from 'react';
import HeaderComponent from '../Header/HeaderComponent';
import { useAuth } from "react-oidc-context";
import { Outlet } from 'react-router-dom';
import style from './Content.module.css';
import { Box } from "@chakra-ui/react"

const Content = () => {

    const auth = useAuth();

    return (
        <div className={style.content}>
            <HeaderComponent></HeaderComponent>
            <Box bg="bg.muted" className={style.pages}>
                <Outlet></Outlet>
            </Box>
        </div>
    );
};

export default Content;