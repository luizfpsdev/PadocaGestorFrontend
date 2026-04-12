import { useMemo, useState } from "react";
import HeaderPage from "../../components/HeaderPages";
import useStyle from "../../components/Hooks/UseStyle";
import Modal from "../../components/Modal";
import BuscaFornecedor from "./BuscaFornecedor";
import FornecedorCard from "./FornecedorCard";
import FormularioFornecedor from "./FormularioFornecedor";
import {
  createEmptySupplierForm,
  loadSuppliers,
  mapFormToSupplier,
  mapSupplierToForm,
  saveSuppliers,
} from "./fornecedoresStorage";

const FornecedoresPage = () => {
  const FORM_ID = "fornecedor-form";

  const { S, theme } = useStyle();
  const [openModal, setOpenModal] = useState(false);
  const [editingSupplierId, setEditingSupplierId] = useState(null);
  const [formData, setFormData] = useState(createEmptySupplierForm);
  const [search, setSearch] = useState("");
  const [nameOrder, setNameOrder] = useState("asc");
  const [suppliers, setSuppliers] = useState(loadSuppliers);

  const handleSubmit = (e) => {
    e.preventDefault();

    const supplierData = mapFormToSupplier(formData, editingSupplierId);
    const nextSuppliers = editingSupplierId
      ? suppliers.map((item) =>
          item.id === editingSupplierId ? supplierData : item,
        )
      : [supplierData, ...suppliers];

    setSuppliers(nextSuppliers);
    saveSuppliers(nextSuppliers);
    setFormData(createEmptySupplierForm());
    setEditingSupplierId(null);
    setOpenModal(false);
  };

  const filteredSuppliers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const visibleSuppliers = suppliers.filter((supplier) => {
      if (!normalizedSearch) return true;

      const searchableFields = [
        supplier.name,
        supplier.contact,
        supplier.email,
        supplier.city,
      ];

      return searchableFields.some((field) =>
        field?.toLowerCase().includes(normalizedSearch),
      );
    });

    return visibleSuppliers.sort((a, b) => {
      const compare = a.name.localeCompare(b.name, "pt-BR");
      return nameOrder === "asc" ? compare : compare * -1;
    });
  }, [nameOrder, search, suppliers]);

  const handleDelete = (selectedSupplier) => {
    const nextSuppliers = suppliers.filter((item) => item.id !== selectedSupplier.id);
    setSuppliers(nextSuppliers);
    saveSuppliers(nextSuppliers);
  };

  const handleCreate = () => {
    setEditingSupplierId(null);
    setFormData(createEmptySupplierForm());
    setOpenModal(true);
  };

  const handleEdit = (selectedSupplier) => {
    setEditingSupplierId(selectedSupplier.id);
    setFormData(mapSupplierToForm(selectedSupplier));
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingSupplierId(null);
    setFormData(createEmptySupplierForm());
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
      <div style={{ width: "70%" }}>
        <HeaderPage
          eyebrow="Gestão"
          title="Fornecedores"
          right={
            <div style={{ display: "flex", gap: 8 }}>
              <button
                style={S.btnPrimary}
                onClick={handleCreate}
              >
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
          {filteredSuppliers.map((supplier) => (
            <FornecedorCard
              key={supplier.id}
              supplier={supplier}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
        {openModal && (
          <Modal
            title={editingSupplierId ? "Editar Fornecedor" : "Novo Fornecedor"}
            onClose={handleCloseModal}
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
