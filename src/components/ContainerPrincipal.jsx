import React from 'react';
import { useAuth } from "react-oidc-context";
import { Outlet } from 'react-router-dom';

const ContainerPrincipal = () => {
    const auth = useAuth();
    return (
        <>
            <div style={{ height: '100px', backgroundColor: 'red', width: '100%' }}>
                {!auth.isAuthenticated && <button onClick={() => void auth.signinRedirect()}>Log in</button>}
                {auth.isAuthenticated && <button onClick={() => void auth.removeUser()}>Log out</button>}
            </div>

             {auth.isAuthenticated && <Outlet>
            </Outlet>}
        </>
    );
};

export default ContainerPrincipal;