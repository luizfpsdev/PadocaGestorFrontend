import React from 'react';
import HeaderComponent from '../Header/HeaderComponent';
import { useAuth } from "react-oidc-context";
import { Outlet } from 'react-router-dom';
import style from './Content.module.css';

const Content = () => {

    const auth = useAuth();

    return (
        <div className={style.content}>
            <HeaderComponent></HeaderComponent>
            <div className={style.pages}>
                <Outlet></Outlet>
            </div>
        </div>
    );
};

export default Content;