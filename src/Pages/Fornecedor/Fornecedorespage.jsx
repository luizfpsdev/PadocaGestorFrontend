import { useEffect, useMemo, useState } from "react";
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

const EMPTY_STATE_COPY = {
  titleDefault: "Sua rede de fornecedores ainda esta vazia",
  textDefault:
    "Cadastre o primeiro fornecedor para acompanhar contatos, cidades e manter sua operacao mais organizada.",
  titleSearch: "Nenhum fornecedor apareceu nessa busca",
  textSearch:
    "Tente outro nome, reduza os filtros ou revise a grafia para encontrar o fornecedor que voce procura.",
};

const FornecedoresPage = () => {
  const FORM_ID = "fornecedor-form";
  const PAGE_SIZE = 10;

  const auth = useAuth();
  const { S, theme } = useStyle();
  const [openModal, setOpenModal] = useState(false);
  const [editingSupplierId, setEditingSupplierId] = useState(null);
  const [formData, setFormData] = useState(createEmptySupplierForm);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [nameOrder, setNameOrder] = useState("asc");
  const [suppliers, setSuppliers] = useState(loadSuppliers);
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(false);
  const [listError, setListError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const trimmedSearch = search.trim();
  const shouldSearchApi = trimmedSearch.length === 0 || trimmedSearch.length >= 3;
  const hasActiveSearch = debouncedSearch.trim().length >= 3;

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => window.clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    if (!auth.user?.access_token) return;
    if (!shouldSearchApi) {
      setIsLoadingSuppliers(false);
      setListError("");
      return;
    }

    const controller = new AbortController();

    const fetchSuppliers = async () => {
      setIsLoadingSuppliers(true);
      setListError("");

      try {
        const params = new URLSearchParams({
          pagina: "1",
          tamanhoPagina: String(PAGE_SIZE),
          ordem: nameOrder,
        });

        if (debouncedSearch.trim()) {
          params.set("nome", debouncedSearch.trim());
        }

        const response = await fetch(`${API_URL}/Fornecedores?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${auth.user.access_token}`,
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          const message = await response.text();
          throw new Error(message || "Erro ao listar fornecedores.");
        }

        const data = await response.json();
        const nextSuppliers = Array.isArray(data?.itens)
          ? data.itens.map(mapApiSupplierToLocal)
          : [];

        setSuppliers(nextSuppliers);
        saveSuppliers(nextSuppliers);
      } catch (error) {
        if (error.name === "AbortError") return;

        console.error("Erro ao carregar fornecedores:", error);
        setListError(
          error instanceof Error && error.message
            ? error.message
            : "Nao foi possivel carregar os fornecedores.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingSuppliers(false);
        }
      }
    };

    fetchSuppliers();

    return () => controller.abort();
  }, [auth.user?.access_token, debouncedSearch, nameOrder, shouldSearchApi]);

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
        const nextSuppliers = [createdSupplier, ...suppliers].sort((a, b) => {
          const compare = a.name.localeCompare(b.name, "pt-BR");
          return nameOrder === "asc" ? compare : compare * -1;
        });

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
    return [...suppliers].sort((a, b) => {
      const compare = a.name.localeCompare(b.name, "pt-BR");
      return nameOrder === "asc" ? compare : compare * -1;
    });
  }, [nameOrder, suppliers]);
  const showEmptyState = !isLoadingSuppliers && filteredSuppliers.length === 0;

  const handleDelete = async (selectedSupplier) => {
    if (!auth.user?.access_token) {
      setListError("Nao foi possivel autenticar o usuario para excluir o fornecedor.");
      return;
    }

    try {
      setListError("");

      const response = await fetch(`${API_URL}/Fornecedores/${selectedSupplier.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${auth.user.access_token}`,
        },
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Erro ao excluir fornecedor.");
      }

      const nextSuppliers = suppliers.filter((item) => item.id !== selectedSupplier.id);
      setSuppliers(nextSuppliers);
      saveSuppliers(nextSuppliers);
    } catch (error) {
      console.error("Erro ao excluir fornecedor:", error);
      setListError(
        error instanceof Error && error.message
          ? error.message
          : "Nao foi possivel excluir o fornecedor.",
      );
    }
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
        {listError && (
          <div
            style={{
              margin: "0 22px 12px",
              padding: "10px 12px",
              borderRadius: 10,
              background: `${theme.rose}22`,
              border: `1px solid ${theme.rose}44`,
              color: theme.text,
              fontSize: 13,
            }}
          >
            {listError}
          </div>
        )}
        {isLoadingSuppliers && filteredSuppliers.length > 0 && (
          <div
            style={{
              margin: "0 22px 14px",
              padding: "12px 14px",
              borderRadius: 14,
              border: `1px solid ${theme.border}`,
              background: `linear-gradient(135deg, ${theme.surface} 0%, ${theme.border} 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              color: theme.text,
              transition: "opacity .3s ease, transform .3s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: theme.teal,
                  boxShadow: `0 0 0 6px ${theme.teal}22`,
                  flexShrink: 0,
                }}
              />
              <div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: theme.text,
                  }}
                >
                  Atualizando fornecedores
                </div>
                <div style={{ fontSize: 12, color: theme.muted }}>
                  Refinando a listagem para combinar com sua busca.
                </div>
              </div>
            </div>
            <div
              style={{
                width: 82,
                height: 6,
                borderRadius: 999,
                background: theme.bg,
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: "48%",
                  height: "100%",
                  borderRadius: 999,
                  background: `linear-gradient(90deg, ${theme.teal}, ${theme.green || theme.teal})`,
                  transform: "translateX(60%)",
                  transition: "transform .45s ease",
                }}
              />
            </div>
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px,  max-content))",
            gap: 10,
            paddingLeft: 22,
            paddingRight: 22,
            opacity: isLoadingSuppliers && filteredSuppliers.length > 0 ? 0.9 : 1,
            transform:
              isLoadingSuppliers && filteredSuppliers.length > 0
                ? "translateY(6px)"
                : "translateY(0)",
            transition: "opacity .4s cubic-bezier(.22,1,.36,1), transform .4s cubic-bezier(.22,1,.36,1)",
          }}
        >
          {isLoadingSuppliers && filteredSuppliers.length === 0 && (
            <div
              style={{
                ...S.card,
                minHeight: 210,
                display: "grid",
                placeItems: "center",
                padding: 28,
                background: `linear-gradient(135deg, ${theme.surface} 0%, ${theme.border} 100%)`,
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    margin: "0 auto 14px",
                    borderRadius: "50%",
                    background: `${theme.teal}18`,
                    border: `1px solid ${theme.teal}33`,
                    display: "grid",
                    placeItems: "center",
                    color: theme.teal,
                    fontSize: 24,
                  }}
                >
                  {"\uD83D\uDD0D"}
                </div>
                <div style={{ color: theme.text, fontWeight: 700, fontSize: 15 }}>
                  Carregando fornecedores
                </div>
                <div style={{ color: theme.muted, fontSize: 12, marginTop: 6 }}>
                  Estamos preparando a listagem para voce.
                </div>
              </div>
            </div>
          )}
          {showEmptyState && (
            <div
              style={{
                ...S.card,
                gridColumn: "1 / -1",
                padding: 0,
                overflow: "hidden",
                background: `linear-gradient(135deg, ${theme.surface} 0%, ${theme.border} 100%)`,
              }}
            >
              <div
                style={{
                  padding: "26px 28px",
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    width: 88,
                    height: 88,
                    borderRadius: 24,
                    background: `radial-gradient(circle at 30% 30%, ${theme.teal}33 0%, ${theme.teal}12 45%, transparent 70%)`,
                    border: `1px solid ${theme.teal}26`,
                    display: "grid",
                    placeItems: "center",
                    color: theme.teal,
                    fontSize: 34,
                    flexShrink: 0,
                  }}
                >
                  {hasActiveSearch ? "\uD83D\uDD0E" : "\uD83C\uDFE2"}
                </div>

                <div style={{ flex: 1, minWidth: 260 }}>
                  <div
                    style={{
                      color: theme.teal,
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    {hasActiveSearch ? "Busca sem resultado" : "Comece por aqui"}
                  </div>
                  <div
                    style={{
                      color: theme.text,
                      fontFamily: "'Bricolage Grotesque',sans-serif",
                      fontSize: 26,
                      fontWeight: 800,
                      lineHeight: 1.08,
                      marginBottom: 10,
                      maxWidth: 520,
                    }}
                  >
                    {hasActiveSearch
                      ? EMPTY_STATE_COPY.titleSearch
                      : EMPTY_STATE_COPY.titleDefault}
                  </div>
                  <div
                    style={{
                      color: theme.muted,
                      fontSize: 14,
                      lineHeight: 1.6,
                      maxWidth: 620,
                    }}
                  >
                    {hasActiveSearch
                      ? EMPTY_STATE_COPY.textSearch
                      : EMPTY_STATE_COPY.textDefault}
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gap: 10,
                    minWidth: 220,
                    flex: "0 0 240px",
                  }}
                >
                  <div
                    style={{
                      padding: "14px 16px",
                      borderRadius: 16,
                      background: `${theme.bg}aa`,
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    <div style={{ color: theme.muted, fontSize: 11, marginBottom: 6 }}>
                      {hasActiveSearch ? "Sugestao" : "Proximo passo"}
                    </div>
                    <div style={{ color: theme.text, fontSize: 13, fontWeight: 700 }}>
                      {hasActiveSearch
                        ? "Experimente buscar por parte do nome ou limpar o campo."
                        : "Cadastre seu primeiro fornecedor para popular a listagem."}
                    </div>
                  </div>
                  {!hasActiveSearch && (
                    <button
                      style={{
                        ...S.btnPrimary,
                        width: "100%",
                        padding: "11px 18px",
                      }}
                      onClick={handleCreate}
                    >
                      + Cadastrar primeiro fornecedor
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
          {filteredSuppliers.map((supplier, index) => (
            <FornecedorCard
              key={supplier.id}
              supplier={supplier}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isRefreshing={isLoadingSuppliers}
              index={index}
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
