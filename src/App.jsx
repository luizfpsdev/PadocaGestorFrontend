import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CallbackPage from "./Pages/Callbackpage";
import { useAuth } from "react-oidc-context";
import ContainerPrincipal from "./components/ContainerPrincipal";
import LoadingPage from "./Pages/Loadingpage";
import FornecedoresPage from "./Pages/Fornecedor/Fornecedorespage";
import ProductsPage from "./Pages/Produto/Productspage";
import ReceitasPage from "./Pages/Receita/Receitaspage";
import ComparativoPage from "./Pages/Comparativopage";
import DashboardPage from "./Pages/Dashboardpage";
import CustosOperacionaisPage from "./Pages/CustosOperacionaispage";
import useStyle from "./components/Hooks/UseStyle";

function App() {
  const auth = useAuth();
  const {theme} = useStyle();

  return (
    <div style={{ '--focus-color': theme.teal}}>
      {!auth.isLoading && (
        <BrowserRouter>
          <Routes>
            <Route element={<ContainerPrincipal />}>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/receitas" element={<ReceitasPage />} />
              <Route path="/produtos" element={<ProductsPage />} />
              <Route path="/fornecedores" element={<FornecedoresPage />} />
              <Route path="/custos" element={<CustosOperacionaisPage />} />
              <Route path="/comparativo" element={<ComparativoPage />} />
              <Route path="/lucro" element={<LoadingPage />} />
              <Route path="/callback" element={<CallbackPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      )}
      {!auth.isAuthenticated && auth.isLoading && <LoadingPage></LoadingPage>}
    </div>
  );
}

export default App;
