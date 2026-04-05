import { useState } from "react";
import HeaderPage from "../../components/HeaderPages";
import useStyle from "../../components/Hooks/UseStyle";
import Modal from "../../components/Modal";
import FormularioFornecedor from "./FormularioFornecedor";

const FornecedoresPage = () => {
  const { S, theme } = useStyle();
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
    observacao: "",
    cnpj: "",
    uf: "",
    cidade: "",
  });
  const [search, setSearch] = useState("");
  const [nameOrder, setNameOrder] = useState("asc");

  const FORM_ID = "fornecedor-form";

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados do fornecedor:", formData);
  };

  return (
    <div
      style={{
        backgroundColor: theme.bg,
        color: theme.text,
        height: "100vh",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{width:"75%"}}>
        <HeaderPage
          eyebrow="Gestão"
          title="Fornecedores"
          right={
            <div style={{ display: "flex", gap: 8 }}>
              <button style={S.btnPrimary} onClick={() => setOpenModal(true)}>
                + Novo Fornecedor
              </button>
            </div>
          }
          headerStyleCustom={{ width: "100%",marginBottom: 0 }}
        />
        <div >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 170px",
              gap: 8,
              marginBottom: 10,
              padding: 22,
            }}
          >
            <input
              style={{ ...S.search, marginBottom: 0 }}
              placeholder="Buscar fornecedor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              style={S.inp}
              value={nameOrder}
              onChange={(e) => setNameOrder(e.target.value)}
            >
              <option value="asc">Nome (A-Z)</option>
              <option value="desc">Nome (Z-A)</option>
            </select>
          </div>
        </div>
        {openModal && (
          <Modal
            title="Novo Fornecedor"
            onClose={() => setOpenModal(false)}
            wide={true}
            formId={FORM_ID}
          >
            <FormularioFornecedor
              formId={FORM_ID}
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
            />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default FornecedoresPage;
