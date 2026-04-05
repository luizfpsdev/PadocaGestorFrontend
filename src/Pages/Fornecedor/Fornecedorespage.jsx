import { useState } from "react";
import HeaderPage from "../../components/HeaderPages";
import useStyle from "../../components/Hooks/UseStyle";
import Modal from "../../components/Modal";
import BuscaFornecedor from "./BuscaFornecedor";
import FornecedorCard from "./FornecedorCard";
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

  const SEED_SUP = [
    {
      id: "s1",
      name: "Atacado Doce Sul",
      contact: "Marina",
      phone: "(11) 98888-1111",
      email: "vendas@docesul.com",
      city: "Sao Paulo",
      note: "Entrega 2x por semana",
    },
    {
      id: "s2",
      name: "Laticinios Serra",
      contact: "Rafael",
      phone: "(11) 97777-2222",
      email: "comercial@serra.com",
      city: "Campinas",
      note: "Prazo 14 dias",
    },
    {
      id: "s3",
      name: "Distribuidora Central",
      contact: "Carla",
      phone: "(11) 96666-3333",
      email: "pedido@dcentral.com",
      city: "Guarulhos",
      note: "",
    },
  ];

  const [suppliers, setSuppliers] = useState(SEED_SUP);

  return (
    <div
      style={{
        backgroundColor: theme.bg,
        color: theme.text,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "70%" }}>
        <HeaderPage
          eyebrow="GestÃ£o"
          title="Fornecedores"
          right={
            <div style={{ display: "flex", gap: 8 }}>
              <button style={S.btnPrimary} onClick={() => setOpenModal(true)}>
                + Novo Fornecedor
              </button>
            </div>
          }
          headerStyleCustom={{ width: "100%", marginBottom: 0 }}
        />
        <BuscaFornecedor
          search={search}
          setSearch={setSearch}
          nameOrder={nameOrder}
          setNameOrder={setNameOrder}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px,  max-content))",
            gap: 10,
            paddingLeft: 22,
            paddingRight: 22,
          }}
        >
          {suppliers.map((supplier) => (
            <FornecedorCard
              key={supplier.id}
              supplier={supplier}
              onEdit={(selectedSupplier) =>
                setModal({ type: "supplier", data: selectedSupplier })
              }
              onDelete={(selectedSupplier) => {
                setSuppliers((currentSuppliers) =>
                  currentSuppliers.filter((item) => item.id !== selectedSupplier.id)
                );
                showToast("Fornecedor removido", theme.rose);
              }}
            />
          ))}
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
