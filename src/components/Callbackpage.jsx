import React, { useEffect ,} from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";


const CallbackPage = () => {

    const auth = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.isAuthenticated) {
            navigate("/dashboard", { replace: true });
        }
    }, [auth.isAuthenticated]);
    return <div>Processando login...</div>;
};

export default CallbackPage;
