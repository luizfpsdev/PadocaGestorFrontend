import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import useStyle from "../../components/Hooks/UseStyle";
import { estados } from "./estados.ts";

const bandeiraStyle = {
  width: 22,
  height: 16,
  objectFit: "cover",
  borderRadius: 3,
  border: "1px solid rgba(255,255,255,0.12)",
  flexShrink: 0,
};

const FormularioFornecedor = ({ formId, formData, setFormData, onSubmit }) => {
  const { S, theme } = useStyle();
  const [cidades, setCidades] = useState([]);
  const [loadingCidades, setLoadingCidades] = useState(false);
  const [ufMenuOpen, setUfMenuOpen] = useState(false);
  const ufMenuRef = useRef(null);

  const estadoSelecionado =
    estados.find((estado) => estado.uf === formData.uf) || null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatCPF = (value) => {
    value = value.replace(/\D/g, "");
    value = value.slice(0, 11);

    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    return value;
  };

  const handleCNPJChange = (e) => {
    const { value } = e.target;
    const formattedValue = formatCPF(value);

    setFormData((prev) => ({
      ...prev,
      cnpj: formattedValue,
    }));
  };

  const handleUfSelect = (uf) => {
    setFormData((prev) => ({
      ...prev,
      uf,
      cidade: "",
    }));

    setUfMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ufMenuRef.current && !ufMenuRef.current.contains(event.target)) {
        setUfMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!formData.uf) {
      setCidades([]);
      return;
    }

    const controller = new AbortController();

    const carregarCidades = async () => {
      setLoadingCidades(true);

      try {
        const response = await fetch(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${formData.uf}/municipios`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Erro ao buscar cidades");
        }

        const data = await response.json();
        setCidades(data.map((municipio) => municipio.nome));
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Erro ao carregar cidades do IBGE:", error);
          setCidades([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingCidades(false);
        }
      }
    };

    carregarCidades();

    return () => controller.abort();
  }, [formData.uf]);

  return (
    <div className="formulario-fornecedor">
      <form id={formId} onSubmit={onSubmit}>
        <div>
          <label htmlFor="contato" style={S.inputLabel}>
            Contato
          </label>
          <input
            style={{ ...S.inp }}
            type="text"
            name="contato"
            value={formData.contato}
            onChange={handleChange}
          />
        </div>
        <br />
        <div>
          <label htmlFor="nome" style={S.inputLabel}>
            Nome*
          </label>
          <input
            style={{ ...S.inp }}
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
        </div>
        <br />
        <div>
          <label style={S.inputLabel} htmlFor="email">
            E-mail
          </label>
          <input
            style={S.inp}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <br></br>
          <div style={{ display: "flex", gap: 20 }}>
            <div style={{ width: "50%" }}>
              <label htmlFor="cnpj" style={S.inputLabel}>
                Cnpj
              </label>
              <input
                style={S.inp}
                type="text"
                name="cnpj"
                value={formData.cnpj}
                onChange={handleCNPJChange}
                placeholder="000.000.000-00"
                required
              />
            </div>
            <div style={{ width: "50%" }}>
              <label style={S.inputLabel} htmlFor="telefone">
                Telefone
              </label>
              <input
                style={S.inp}
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div>
          <br></br>
          <div style={{ display: "flex", gap: 20 }}>
            <div style={{ width: "50%", position: "relative" }} ref={ufMenuRef}>
              <label style={S.inputLabel} htmlFor="uf">
                UF
              </label>
              <button
                type="button"
                onClick={() => setUfMenuOpen((prev) => !prev)}
                style={{
                  ...S.inp,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    color: estadoSelecionado ? theme.text : theme.muted,
                  }}
                >
                  {estadoSelecionado ? (
                    <>
                      <img
                        src={estadoSelecionado.bandeira}
                        alt={`Bandeira de ${estadoSelecionado.nome}`}
                        style={bandeiraStyle}
                      />
                      <span>{estadoSelecionado.uf}</span>
                    </>
                  ) : (
                    <span>Selecione a UF</span>
                  )}
                </span>
                <ChevronDown size={16} color={theme.muted} />
              </button>

              {ufMenuOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 6px)",
                    left: 0,
                    right: 0,
                    zIndex: 20,
                    background: theme.surface,
                    border: `1px solid ${theme.border}`,
                    borderRadius: 10,
                    overflow: "auto",
                    maxHeight: 220,
                    boxShadow: "0 18px 32px rgba(0,0,0,.18)",
                  }}
                >
                  {estados.map((estado) => (
                    <button
                      key={estado.uf}
                      type="button"
                      onClick={() => handleUfSelect(estado.uf)}
                      style={{
                        width: "100%",
                        border: "none",
                        background:
                          formData.uf === estado.uf ? theme.border : "transparent",
                        color: theme.text,
                        padding: "8px 10px",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        cursor: "pointer",
                        
                      }}
                    >
                      <img
                        src={estado.bandeira}
                        alt={`Bandeira de ${estado.nome}`}
                        style={bandeiraStyle}
                      />
                      <span style={{ minWidth: 24, fontWeight: 700 }}>
                        {estado.uf}
                      </span>
                      <span style={{ color: theme.muted }}>{estado.nome}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div style={{ width: "50%" }}>
              <label style={S.inputLabel} htmlFor="cidade">
                Cidade
              </label>
              <select
                style={S.inp}
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                disabled={!formData.uf || loadingCidades}
              >
                <option value="">
                  {!formData.uf
                    ? "Selecione a UF primeiro"
                    : loadingCidades
                      ? "Carregando cidades..."
                      : "Selecione a cidade"}
                </option>
                {cidades.map((cidade) => (
                  <option key={cidade} value={cidade}>
                    {cidade}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div>
          <br></br>
          <label style={S.inputLabel} htmlFor="endereco">
            Endereco
          </label>
          <input
            style={S.inp}
            type="text"
            name="endereco"
            value={formData.endereco}
            onChange={handleChange}
          />
        </div>
        <div>
          <br></br>
          <label style={S.inputLabel} htmlFor="observacao">
            Observacao
          </label>
          <textarea
            style={{ ...S.inp, height: "100px", resize: "vertical" }}
            name="observacao"
            value={formData.observacao}
            onChange={handleChange}
          />
        </div>
      </form>
    </div>
  );
};

export default FormularioFornecedor;
