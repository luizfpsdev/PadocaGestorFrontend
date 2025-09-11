import './App.css'
import { AuthProvider } from "react-oidc-context";
import { BrowserRouter, Routes, Route,Navigate } from "react-router-dom";
import DashboardPage from "./components/Dashboardpage";
import CallbackPage from "./components/Callbackpage";

function App() {

  const oidcConfig = {
    authority: import.meta.env.VITE_KEYCLOAK_AUTHORIRY,
    client_id: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_KEYCLOAK_REDIRECT_URI,
    response_type: "code",
    scope: "openid profile email",
    automaticSilentRenew: true,
    // onSigninCallback: () => {
    //    console.log(window.location.href);
    //   //  window.history.replaceState(
    //   //         {},
    //   //         document.title,
    //   //         window.location.pathname
    //   //     )
    //   }
  
  };

  return (

    <AuthProvider {...oidcConfig}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/callback" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
