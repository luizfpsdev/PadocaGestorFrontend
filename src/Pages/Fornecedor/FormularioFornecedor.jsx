import React, { useEffect, useState } from "react";
import useStyle from "../../components/Hooks/UseStyle";

const FormularioFornecedor = ({ formId, formData, setFormData, onSubmit }) => {
  const { S, theme } = useStyle();
  const [cidades, setCidades] = useState([]);
  const [loadingCidades, setLoadingCidades] = useState(false);

  const ufs = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO",
  ];

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

  const handleUfChange = (e) => {
    const { value } = e.target;

    setFormData((prev) => ({
      ...prev,
      uf: value,
      cidade: "",
    }));
  };

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
            <div style={{ width: "50%" }}>
              <label style={S.inputLabel} htmlFor="uf">
                UF
              </label>
              <select
                style={S.inp}
                name="uf"
                value={formData.uf}
                onChange={handleUfChange}
              >
                <option value="">Selecione a UF</option>
                {ufs.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
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
