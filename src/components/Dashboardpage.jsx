import React, { useEffect } from 'react';
import { useAuth } from "react-oidc-context";

const DashboardPage = () => {

    const auth = useAuth();
    console.log("Auth State:", auth);

    // useEffect(() => {
    //     if (!auth.isAuthenticated) {
    //         auth.signinRedirect(); // redireciona para login Keycloak
    //     }
    // }, [auth.isAuthenticated, auth.isLoading]);

    return (
        <>
            {auth.isLoading && <div>Loading...</div>}
            {auth.isAuthenticated && (<div>
                <h1>Dashboard</h1>
                <p>Welcome to your dashboard!</p>
                <button onClick={() => void auth.removeUser()}>Log out</button>
            </div>
            )}
            {!auth.isAuthenticated && <button onClick={() => void auth.signinRedirect()}>Log in</button>}
        </>
    );
};

export default DashboardPage;