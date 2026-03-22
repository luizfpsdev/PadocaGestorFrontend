import { useState } from "react";
import HeaderPage from "../../components/HeaderPages";
import useStyle from "../../components/Hooks/UseStyle";
import Modal from "../../components/Modal";
import FormularioProduto from "./FormularioProduto";

const PRODUCT_FORM_ID = "produto-form";

const Productspage = () => {
  const { S, theme } = useStyle();
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    categoria: "0",
    fornecedor: "0",
    tipoPreco: 1,
    markup: 2,
    preco: 0.0,
    precoIngrediente: 0.0,
    unidadeMedida: 0,
    ingrediente: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados do produto:", formData);
  };

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
          <Modal
            title="Novo Produto"
            onClose={() => setOpenModal(false)}
            formId={PRODUCT_FORM_ID}
            wide
          >
            <FormularioProduto
              formId={PRODUCT_FORM_ID}
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
            />
          </Modal>
        )}
      </div>
    </>
  );
};

export default Productspage;
