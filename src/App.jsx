import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "./components/Dashboardpage";
import CallbackPage from "./Pages/Callbackpage";
import { useAuth } from "react-oidc-context";
import ContainerPrincipal from './components/ContainerPrincipal';
import LoadingPage from './Pages/Loadingpage';
import FornecedoresPage from './Pages/Fornecedorespage';

function App() {

  const auth = useAuth();

  return (
    <>
      {!auth.isLoading && <BrowserRouter>
        <Routes>
          <Route element={<ContainerPrincipal />}>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/callback" element={<CallbackPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/produtos" element={<LoadingPage />} />
            <Route path="/fornecedores" element={<FornecedoresPage/>} />
            <Route path="/ingredientes" element={<LoadingPage />} />
            <Route path="/receitas" element={<LoadingPage />} />
            <Route path="/pessoal" element={<LoadingPage />} />
          </Route>
        </Routes>
      </BrowserRouter>}
      {(!auth.isAuthenticated && auth.isLoading) && <LoadingPage></LoadingPage>}
    </>
  )
}

export default App
