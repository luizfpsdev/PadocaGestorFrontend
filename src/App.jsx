import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "./components/Dashboardpage";
import CallbackPage from "./Pages/Callbackpage";
import { useAuth } from "react-oidc-context";
import ContainerPrincipal from './components/ContainerPrincipal';
import LoadingPage from './Pages/Loadingpage';
import FornecedoresPage from './Pages/Fornecedorespage';
import ProductsPage from './Pages/Productspage';
import IngredientesPage from './Pages/Ingredientespage';

function App() {

    const auth = useAuth();

  return (
    <>
      {
      !auth.isLoading && 
      <BrowserRouter>
        <Routes>
          <Route element={<ContainerPrincipal />}>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/receitas" element={<LoadingPage />} />
            <Route path="/produtos" element={<ProductsPage/>} />
            <Route path="/fornecedores" element={<FornecedoresPage/>} />
            <Route path="/custos" element={<IngredientesPage />} />
            <Route path="/comparativo" element={<LoadingPage />} />
            <Route path="/lucro" element={<LoadingPage />} />
            <Route path="/callback" element={<CallbackPage />} />
          </Route>
        </Routes>
      </BrowserRouter>}
      {(!auth.isAuthenticated && auth.isLoading) && <LoadingPage></LoadingPage>}
    </>
  )
}

export default App

