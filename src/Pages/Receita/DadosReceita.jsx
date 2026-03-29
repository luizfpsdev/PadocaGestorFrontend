import useStyle from "../../components/Hooks/UseStyle";

const DadosReceita = ({ formData, setFormData }) => {
  const { S } = useStyle();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const categorias = [
    { id: 0, nome: "Selecione a categoria" },
    { id: 1, nome: "Pao" },
    { id: 2, nome: "Doce" },
    { id: 3, nome: "Salgado" },
    { id: 4, nome: "Massas" },
  ];

  const unidades = [
    { id: "", nome: "Selecione a unidade" },
    { id: "kg", nome: "Kg" },
    { id: "g", nome: "g" },
    { id: "l", nome: "L" },
    { id: "ml", nome: "ml" },
    { id: "un", nome: "Unidade" },
    { id: "dz", nome: "Duzia" },
  ];

  const handleTipoPrecoChange = (tipoPreco) => {
    setFormData((prev) => ({
      ...prev,
      tipoPreco,
      markup: tipoPreco === 1 ? prev.markup : "",
      preco: tipoPreco === 2 ? prev.preco : "",
    }));
  };

  const handleMarkupChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      markup: parseFloat(value) || 0,
    }));
  };

  const handlePrecoChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      preco: parseFloat(value) || 0,
    }));
  };

  return (
    <div>
      <label htmlFor="nome" style={S.inputLabel}>
        Nome*
      </label>
      <input
        id="nome"
        style={S.inp}
        type="text"
        name="nome"
        value={formData.nome || ""}
        onChange={handleChange}
      />
      <br />
      <br />
      <div
        style={{
          display: "flex",
          gap: 20,
        }}
      >
        <div style={{ width: "100%" }}>
          <label htmlFor="categoria" style={S.inputLabel}>
            Categoria
          </label>
          <select
            id="categoria"
            style={S.inp}
            name="categoria"
            value={formData.categoria || 0}
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
          <label htmlFor="rendimento" style={S.inputLabel}>
            Rendimento
          </label>
          <input
            id="rendimento"
            style={S.inp}
            type="number"
            name="rendimento"
            step="0.01"
            value={formData.rendimento || ""}
            onChange={handleChange}
          />
        </div>
        <div style={{ width: "100%" }}>
          <label htmlFor="unidade" style={S.inputLabel}>
            Unidade
          </label>
          <select
            id="unidade"
            style={S.inp}
            name="unidade"
            value={formData.unidade || ""}
            onChange={handleChange}
          >
            {unidades.map((unidade) => (
              <option key={unidade.id} value={unidade.id}>
                {unidade.nome}
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
          <div style={{ width: "49%" }}>
            <label style={S.inputLabel} htmlFor="markup">
              Markup (x)
            </label>
            <input
              id="markup"
              style={S.inp}
              type="number"
              name="markup"
              step="0.01"
              value={formData.markup || ""}
              onChange={handleMarkupChange}
            />
          </div>
        )}
        {formData.tipoPreco === 2 && (
          <div style={{ width: "49%" }}>
            <label style={S.inputLabel} htmlFor="preco">
              Preco de venda (R$)
            </label>
            <input
              id="preco"
              style={S.inp}
              type="number"
              name="preco"
              min={0}
              value={formData.preco || ""}
              onChange={handlePrecoChange}
              step="0.01"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DadosReceita;
