import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "react-oidc-context";
import { WebStorageStateStore } from "oidc-client-ts";
import { Provider } from "./components/ui/provider"

const oidcConfig = {
  authority: import.meta.env.VITE_KEYCLOAK_AUTHORIRY,
  client_id: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_KEYCLOAK_REDIRECT_URI,
  response_type: "code",
  scope: "openid profile email",
  automaticSilentRenew: true,
  monitorSession: true,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  post_logout_redirect_uri: "http://localhost:5173"
};



createRoot(document.getElementById('root')).render(
  <AuthProvider {...oidcConfig}>
    <Provider>
    <StrictMode>
      <App />
    </StrictMode>
    </Provider>
  </AuthProvider>,
)
