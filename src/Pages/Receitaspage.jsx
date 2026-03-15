import { useState } from "react";
import HeaderPage from "../components/HeaderPages";
import useStyle from "../components/Hooks/UseStyle";
import Modal from "../components/Modal";

const ReceitasPage = () => {
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
        title="Receitas"
        right={
          <div style={{ display: "flex", gap: 8 }}>
            <button style={S.btnPrimary} onClick={() => setOpenModal(true)}>
              + Nova Receita
            </button>
          </div>
        }
      />
      {openModal && (
        <Modal title="Nova Receita" onClose={() => setOpenModal(false)} wide>
          <p>Conteúdo do modal de nova receita</p>
        </Modal>
      )}
    </div>
  );
};

export default ReceitasPage;
