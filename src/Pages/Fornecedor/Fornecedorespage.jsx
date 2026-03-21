import { useState } from "react";
import HeaderPage from "../../components/HeaderPages";
import useStyle from "../../components/Hooks/UseStyle";
import Modal from "../../components/Modal";
import FormularioFornecedor from "./FormularioFornecedor";

const FornecedoresPage = () => {
    
  const { S, theme } = useStyle();
  const [openModal, setOpenModal] = useState(false);

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
          wide
        >
          <FormularioFornecedor></FormularioFornecedor>
        </Modal>
      )}
    </div>
  );
};

export default FornecedoresPage;
