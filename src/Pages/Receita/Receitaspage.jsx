import { useState } from "react";
import HeaderPage from "../../components/HeaderPages";
import useStyle from "../../components/Hooks/UseStyle";
import Modal from "../../components/Modal";
import FormularioReceita from "./FormularioReceita";

const ReceitasPage = () => {
  const { S, theme } = useStyle();
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    categoria: 0,
    unidade: "",
    rendimento: "",
    tipoPreco: 1,
    markup: "",
    preco: "",
    descricao: "",
    produtos: [],
    fotos: [],
  });

  const formId = "receita-form";

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados da receita:", formData);
  }

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
          <FormularioReceita  onClose={() => setOpenModal(false)} formData={formData} setFormData={setFormData} formId={formId} onSubmit={handleSubmit} />
        </Modal>
      )}
    </div>
  );
};

export default ReceitasPage;
