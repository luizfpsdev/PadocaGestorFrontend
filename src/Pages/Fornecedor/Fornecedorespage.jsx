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
  });

  const FORM_ID = "fornecedor-form";

   const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Dados do fornecedor:', formData);
    };

    console.log(formData)

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
      />
      {openModal && (
        <Modal
          title="Novo Fornecedor"
          onClose={() => setOpenModal(false)}
          wide = {false}
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
  );
};

export default FornecedoresPage;
