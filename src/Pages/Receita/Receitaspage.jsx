import { useState } from "react";
import HeaderPage from "../../components/HeaderPages";
import useStyle from "../../components/Hooks/UseStyle";
import Modal from "../../components/Modal";
import FormularioReceita from "./FormularioReceita";

const ReceitasPage = () => {
  const { S, theme } = useStyle();
  const [openModal, setOpenModal] = useState(false);

  const defaultFormData = {
    nome: "",
    categoria: 0,
    unidade: "",
    rendimento: "",
    tipoPreco: 1,
    markup: "",
    preco: "",
    descricao: "",
    modoPreparo: "",
    produtos: [],
    fotos: [],
  };
  const [formData, setFormData] = useState(defaultFormData);

  const formId = "receita-form";

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados da receita:", formData);
  };

  return (
    <div
      style={{
        backgroundColor: theme.bg,
        color: theme.text,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={S.containerWidth}>
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
          headerStyleCustom={{ width: "100%" }}
        />
      </div>

      {openModal && (
        <Modal
          title="Nova Receita"
          onClose={() => {
            setOpenModal(false);
            setFormData(defaultFormData);
          }}
          wide={true}
          formId={formId}
        >
          <FormularioReceita
            onClose={() => setOpenModal(false)}
            formData={formData}
            setFormData={setFormData}
            formId={formId}
            onSubmit={handleSubmit}
          />
        </Modal>
      )}
    </div>
  );
};

export default ReceitasPage;
