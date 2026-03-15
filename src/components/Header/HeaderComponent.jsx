import { useAuth } from "react-oidc-context";
import { Avatar } from "@chakra-ui/react";
import useStyle from "../Hooks/UseStyle";

const HeaderComponent = () => {
  const auth = useAuth();

  const { S } = useStyle();

  return (
    <div style={S.topBar}>
      <div style={S.topBarTitle}>Delícias do Trigo</div>
      <div style={S.menuProfile}>
        {auth.isAuthenticated && (
          <div style={{ marginRight: "10px" }}>
            <span style={S.profileEmail}>Olá, {auth.user?.profile?.email}</span>
          </div>
        )}
        {auth.isAuthenticated && (
          <div>
            <Avatar.Root
              size="sm"
              variant="subtle"
              colorPalette="orange"
              style={{ backgroundColor: "orange" }}
            >
              <Avatar.Fallback name={auth.user?.profile?.name} color="white" />
            </Avatar.Root>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderComponent;
