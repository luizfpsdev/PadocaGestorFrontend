import React from "react";
import useStyle from "../../components/Hooks/UseStyle";

const FormularioProduto = ({ formId, formData, setFormData, onSubmit }) => {
  const { S } = useStyle();

  const categorias = [
    { id: 0, nome: "Selecione a categoria" },
    { id: 1, nome: "Pao" },
    { id: 2, nome: "Doce" },
    { id: 3, nome: "Salgado" },
    { id: 4, nome: "Massas" },
  ];

  const fornecedores = [{ id: 0, nome: "Selecione o fornecedor" }];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTipoPrecoChange = (tipoPreco) => {
    setFormData((prev) => ({
      ...prev,
      tipoPreco,
      markup: tipoPreco === 1 ? prev.markup : "",
      preco: tipoPreco === 2 ? prev.preco : "",
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
            id="nome"
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
            Descricao
          </label>
          <input
            id="descricao"
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
              id="categoria"
              style={S.inp}
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
            >
              {categorias.map((categoria) => (
                <option key={categoria.id} value={String(categoria.id)}>
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
              id="fornecedor"
              style={S.inp}
              name="fornecedor"
              value={formData.fornecedor}
              onChange={handleChange}
            >
              {fornecedores.map((fornecedor) => (
                <option key={fornecedor.id} value={String(fornecedor.id)}>
                  {fornecedor.nome}
                </option>
              ))}
            </select>
          </div>
        </div>
        <br />
        <div>
          <label style={S.inputLabel} htmlFor="tipoPreco">
            Tipo preco
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
              onClick={() => handleTipoPrecoChange(1)}
              type="button"
            >
              Markup automatico
            </button>
            <button
              style={{
                ...S.toggleBtn,
                ...(formData.tipoPreco === 2 ? S.toggleOn : {}),
                width: "100%",
              }}
              onClick={() => handleTipoPrecoChange(2)}
              type="button"
            >
              Preco Manual
            </button>
          </div>
          <br />
          {formData.tipoPreco === 1 && (
            <div style={{width:"49%"}}>
              <label style={S.inputLabel} htmlFor="markup">
                Markup (x)
              </label>
              <input
                id="markup"
                style={S.inp}
                type="number"
                name="markup"
                value={formData.markup}
              />
            </div>
          )}
          {formData.tipoPreco === 2 && (
            <div style={{width:"49%"}}>
              <label style={S.inputLabel} htmlFor="preco">
                Preco de venda (R$)
              </label>
              <input
                id="preco"
                style={S.inp}
                type="number"
                name="preco"
                value={formData.preco}
              />
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default FormularioProduto;
