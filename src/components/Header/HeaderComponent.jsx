import React from 'react';
import style from './HeaderComponent.module.css';
import { useAuth } from "react-oidc-context";
import { LogOut ,CircleUserRound} from 'lucide-react';

const HeaderComponent = () => {

    const auth = useAuth();

    return (
        <div className={style.header}>
            <div className={style.leftside}></div>
            <div className={style.middle}></div>
            <div className={style.rightside}>
                {auth.isAuthenticated && <span>Olá, {auth.user?.profile?.email}</span>}
                <div style={{width:'10px'}}></div>
                {auth.isAuthenticated && <CircleUserRound size={44} strokeWidth={0.75}  color='#625e5e'/>}
            </div>
            
        </div>
    );
};

export default HeaderComponent;