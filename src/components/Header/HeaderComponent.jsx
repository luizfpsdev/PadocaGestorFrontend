import style from "./HeaderComponent.module.css";
import { useAuth } from "react-oidc-context";
import {
  Box,
  Avatar,
  Menu,
  Portal,
  HStack,
  Button,
  Separator,
  Spacer,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useContext, React } from "react";
import { ThemeContext } from "../Theme/ThemeContext";
import { div } from "framer-motion/client";

const HeaderComponent = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const topBar = {
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

  const menuProfile = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };
  return (
    <div style={topBar}>
      <div>Delícias do Trigo</div>
      <div style={menuProfile}>
        {auth.isAuthenticated && (
          <div style={{marginRight:"10px"}}>
            <span>Olá, {auth.user?.profile?.email}</span>
          </div>
        )}
        {auth.isAuthenticated && (
          <div>
            <Menu.Root
              positioning={{ placement: "bottom-start" }}
              colorPalette="orange"
              variant="subtle"
            >
              <Menu.Trigger rounded="full" focusRing="outside">
                <Avatar.Root size="sm" variant="subtle" colorPalette="orange">
                  <Avatar.Fallback name={auth.user?.profile?.name} />
                </Avatar.Root>
              </Menu.Trigger>
            </Menu.Root>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderComponent;
