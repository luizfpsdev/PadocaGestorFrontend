import { useAuth } from "react-oidc-context";
import { Avatar, Menu } from "@chakra-ui/react";

import { useContext, React } from "react";
import { ThemeContext } from "../Theme/ThemeContext";

const HeaderComponent = () => {
  const auth = useAuth();
  const { theme } = useContext(ThemeContext);

  let topBar = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 24px",
    borderBottom: `1px solid ${theme.border}`,
    background: theme.surface,
    position: "sticky",
    top: 0,
    zIndex: 5,
  };

  let topBarTitle = {
    color: theme.text,
    fontFamily: "'Bricolage Grotesque',sans-serif",
    fontWeight: 700,
    fontSize: 18,
    letterSpacing: 0.5,
  };

  let profileEmail = {
    color: theme.muted,
    fontSize: 12,
    fontWeight: 600,
    maxWidth: 220,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  const menuProfile = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };
  return (
    <div style={topBar}>
      <div style={topBarTitle}>Delícias do Trigo</div>
      <div style={menuProfile}>
        {auth.isAuthenticated && (
          <div style={{ marginRight: "10px" }}>
            <span style={profileEmail}>Olá, {auth.user?.profile?.email}</span>
          </div>
        )}
        {auth.isAuthenticated && (
          <div>
            <Avatar.Root size="sm" variant="subtle" colorPalette="orange" style={{backgroundColor:"orange"}}>
              <Avatar.Fallback name={auth.user?.profile?.name} color="white"/>
            </Avatar.Root>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderComponent;
