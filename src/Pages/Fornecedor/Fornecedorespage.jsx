import { useState } from "react";
import HeaderPage from "../../components/HeaderPages";
import useStyle from "../../components/Hooks/UseStyle";
import Modal from "../../components/Modal";
import BuscaFornecedor from "./BuscaFornecedor";
import FormularioFornecedor from "./FormularioFornecedor";

const FornecedoresPage = () => {
  
  const FORM_ID = "fornecedor-form";

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



  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados do fornecedor:", formData);
  };

  console.log("search:", search);
  console.log("nameOrder:", nameOrder);

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
        <BuscaFornecedor
          search={search}
          setSearch={setSearch}
          nameOrder={nameOrder}
          setNameOrder={setNameOrder}
        />
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
