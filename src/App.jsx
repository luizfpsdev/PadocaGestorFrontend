import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "./components/Dashboardpage";
import CallbackPage from "./components/Callbackpage";
import { useAuth } from "react-oidc-context";
import ContainerPrincipal from './components/ContainerPrincipal';

function App() {

  const auth = useAuth();

  return (
    <>
      {auth.isLoading && <div>Loading...</div>}
      {!auth.isLoading && <BrowserRouter>
        <Routes>
          <Route element={<ContainerPrincipal />}>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/callback" element={<CallbackPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
        </Routes>
      </BrowserRouter>}

    </>
  )
}

export default App
