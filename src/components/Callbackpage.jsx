import React, { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";

const CallbackPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    auth.signinRedirectCallback()
      .then(() => {
        navigate("/dashboard"); 
      })
      .catch(console.error);
  }, [auth, navigate]);

  return <div>Processando login...</div>;
};

export default CallbackPage;
