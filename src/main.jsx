import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "react-oidc-context";


const oidcConfig = {
  authority: import.meta.env.VITE_KEYCLOAK_AUTHORIRY,
  client_id: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_KEYCLOAK_REDIRECT_URI,
  response_type: "code",
  scope: "openid profile email",
  automaticSilentRenew: true,
};


createRoot(document.getElementById('root')).render(
  <AuthProvider {...oidcConfig}>
    <StrictMode>
      <App />
    </StrictMode>
  </AuthProvider>,
)
