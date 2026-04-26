import { useMemo, useState } from "react";
import { useAuth } from "react-oidc-context";
import HeaderPage from "../../components/HeaderPages";
import useStyle from "../../components/Hooks/UseStyle";
import Modal from "../../components/Modal";
import BuscaFornecedor from "./BuscaFornecedor";
import FornecedorCard from "./FornecedorCard";
import FormularioFornecedor from "./FormularioFornecedor";
import {
  createEmptySupplierForm,
  loadSuppliers,
  mapApiSupplierToLocal,
  mapFormToSupplier,
  mapFormToSupplierRequest,
  mapSupplierToForm,
  saveSuppliers,
} from "./fornecedoresStorage";

const API_URL = (import.meta.env.VITE_API_URL || "https://localhost:7216").replace(/\/$/, "");

const FornecedoresPage = () => {
  const FORM_ID = "fornecedor-form";

  const auth = useAuth();
  const { S, theme } = useStyle();
  const [openModal, setOpenModal] = useState(false);
  const [editingSupplierId, setEditingSupplierId] = useState(null);
  const [formData, setFormData] = useState(createEmptySupplierForm);
  const [search, setSearch] = useState("");
  const [nameOrder, setNameOrder] = useState("asc");
  const [suppliers, setSuppliers] = useState(loadSuppliers);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!formData.uf || !formData.cidade || !formData.email || !formData.contato) {
      setSubmitError("Preencha contato, e-mail, UF e cidade para cadastrar o fornecedor.");
      return;
    }

    if (!editingSupplierId && !auth.user?.access_token) {
      setSubmitError("Nao foi possivel autenticar o usuario para cadastrar o fornecedor.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingSupplierId) {
        const supplierData = mapFormToSupplier(formData, editingSupplierId);
        const nextSuppliers = suppliers.map((item) =>
          item.id === editingSupplierId ? supplierData : item,
        );

        setSuppliers(nextSuppliers);
        saveSuppliers(nextSuppliers);
      } else {
        const response = await fetch(`${API_URL}/Fornecedores`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.user.access_token}`,
          },
          body: JSON.stringify(mapFormToSupplierRequest(formData)),
        });

        if (!response.ok) {
          const message = await response.text();
          throw new Error(message || "Erro ao cadastrar fornecedor.");
        }

        const createdSupplier = mapApiSupplierToLocal(await response.json());
        const nextSuppliers = [createdSupplier, ...suppliers];

        setSuppliers(nextSuppliers);
        saveSuppliers(nextSuppliers);
      }

      setFormData(createEmptySupplierForm());
      setEditingSupplierId(null);
      setOpenModal(false);
    } catch (error) {
      console.error("Erro ao salvar fornecedor:", error);
      setSubmitError(
        error instanceof Error && error.message
          ? error.message
          : "Nao foi possivel salvar o fornecedor.",
      );
    } finally {
      setIsSubmitting(false);
    }
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
    setSubmitError("");
    setOpenModal(true);
  };

  const handleEdit = (selectedSupplier) => {
    setEditingSupplierId(selectedSupplier.id);
    setFormData(mapSupplierToForm(selectedSupplier));
    setSubmitError("");
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingSupplierId(null);
    setSubmitError("");
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
            submitDisabled={isSubmitting}
            submitLabel={isSubmitting ? "Salvando..." : "Salvar"}
          >
            {submitError && (
              <div
                style={{
                  marginBottom: 12,
                  padding: "10px 12px",
                  borderRadius: 10,
                  background: `${theme.rose}22`,
                  border: `1px solid ${theme.rose}44`,
                  color: theme.text,
                  fontSize: 13,
                }}
              >
                {submitError}
              </div>
            )}
            <FormularioFornecedor
              formId={FORM_ID}
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default FornecedoresPage;
