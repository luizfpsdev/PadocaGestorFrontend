import { useState } from "react";
import HeaderPage from "../components/HeaderPages";
import useStyle from "../components/Hooks/UseStyle";
import Modal from "../components/Modal";

const Productspage = () => {
  const { S, theme } = useStyle();
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
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
          title="Produtos"
          right={
            <div style={{ display: "flex", gap: 8 }}>
              <button style={S.btnOutline}>Importar Planilha</button>
              <button style={S.btnPrimary} onClick={() => setOpenModal(true)}>
                + Novo Produto
              </button>
            </div>
          }
        />
      </div>
      <div>
        {openModal && (
          <Modal title="Novo Produto" onClose={() => setOpenModal(false)} wide>
            <p>Conteúdo do modal de novo produto</p>
          </Modal>
        )}
      </div>
    </>
  );
};

export default Productspage;
