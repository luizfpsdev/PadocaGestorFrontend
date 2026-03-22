import React from "react";
import useStyle from "../../components/Hooks/UseStyle";

const FormularioProduto = ({ formId, formData, setFormData, onSubmit }) => {
  const { S } = useStyle();

  const categorias = [
    {
      id: 0,
      nome: "Selecione a categoria",
    },
    {
      id: 1,
      nome: "PÃ£o",
    },
    {
      id: 2,
      nome: "Doce",
    },
    {
      id: 3,
      nome: "Salgado",
    },
    {
      id: 4,
      nome: "Massas",
    },
  ];

  const fornecedores = [
    {
      id: 0,
      nome: "Selecione o fornecedor",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div>
      <form id={formId} onSubmit={onSubmit}>
        <div>
          <label htmlFor="nome" style={S.inputLabel}>
            Nome*
          </label>
          <input
            style={S.inp}
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
        </div>
        <br />
        <div>
          <label htmlFor="descricao" style={S.inputLabel}>
            Descrição
          </label>
          <input
            style={S.inp}
            type="text"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            required
          />
        </div>
        <br />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 20,
          }}
        >
          <div style={{ width: "100%" }}>
            <label style={S.inputLabel} htmlFor="categoria">
              Categoria
            </label>
            <select
              style={S.inp}
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
            >
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nome}
                </option>
              ))}
            </select>
          </div>
          <div style={{ width: "100%" }}>
            <label style={S.inputLabel} htmlFor="fornecedor">
              Fornecedor
            </label>
            <select
              style={S.inp}
              name="fornecedor"
              value={formData.fornecedor}
              onChange={handleChange}
            >
              {fornecedores.map((fornecedor) => (
                <option key={fornecedor.id} value={fornecedor.id}>
                  {fornecedor.nome}
                </option>
              ))}
            </select>
          </div>
        </div>
        <br />
        <div>
          <label style={S.inputLabel} htmlFor="tipoPreco">
            Tipo preço
          </label>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 20,
            }}
          >
            <button
              style={{
                ...S.toggleBtn,
                ...(formData.tipoPreco === 1 ? S.toggleOn : {}),
                width: "100%",
              }}
              onClick={() => setFormData((prev) => ({ ...prev, tipoPreco: 1 }))}
              type="button"
            >
              Markup automático
            </button>
            <button
              style={{
                ...S.toggleBtn,
                ...(formData.tipoPreco === 2 ? S.toggleOn : {}),
                width: "100%",
              }}
              onClick={() => setFormData((prev) => ({ ...prev, tipoPreco: 2 }))}
              type="button"
            >
              Preço Manual
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormularioProduto;
