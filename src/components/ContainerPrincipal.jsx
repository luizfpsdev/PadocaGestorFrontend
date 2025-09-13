import React, { useEffect } from 'react';
import { useAuth } from "react-oidc-context";
import { Outlet } from 'react-router-dom';
import style from './ContainerPrincipal.module.css';
import HeaderComponent from './Header/HeaderComponent';
import { LogOut } from 'lucide-react';

const ContainerPrincipal = () => {
  const auth = useAuth();

  const handleLogout = () => {
    alert("Sessão deslogada no Keycloak");
    auth.removeUser();
    window.location.href = "/";
  };

  const handleLogoutExpiracao = () => {
    alert("Sessão expirada  no Keycloak");
    auth.removeUser();
    window.location.href = "/";
  };


  useEffect(() => {
    if (!auth.isAuthenticated) {
      auth.signinRedirect()
    }
  }, [auth.isAuthenticated]);


  useEffect(() => {
    if (!auth || !auth?.events) return;

    auth.events.addSilentRenewError(handleLogoutExpiracao);

    return () => {

      auth.events.removeSilentRenewError(handleLogoutExpiracao);
    }
  }, [auth.events]);

  useEffect(() => {

    if (!auth?.user) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/realms/padoca-realm/protocol/openid-connect/userinfo",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${auth.user.access_token}`,
            },
          }
        );

        if (!response.ok) {
          handleLogout();
        }
      } catch (error) {

        handleLogout();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [auth?.user]);

  return (
    <>
      <div className={style.container}>
        <div className={style.menus}>
          <div className={style.menuprincipal}>
            <div className={style.menuprincipalum}>

            </div >
            <div className={style.menuprincipaldois}>
              {auth.isAuthenticated && <button onClick={() => void auth.signoutRedirect()}><LogOut size={18} color='#625e5e' /><span>Sair</span></button>}
            </div>

          </div>
        </div>
        <div className={style.content}>
          <HeaderComponent>
          </HeaderComponent>
          <div className={style.pages}>
            {auth.isAuthenticated && <Outlet>
            </Outlet>}
          </div>
        </div>
      </div>

    </>
  );
};

export default ContainerPrincipal;