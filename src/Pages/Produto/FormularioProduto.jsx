import React from "react";
import useStyle from "../../components/Hooks/UseStyle";

const FormularioProduto = (onSubmit) => {
  const { S, theme } = useStyle();
  const [tipoPreco, setTipoPreco] = React.useState(1);

  const categorias = [
    {
      id: 0,
      nome: "Selecione a categoria",
    },
    {
      id: 1,
      nome: "Pão",
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

  const [formData, setFormData] = React.useState({
    nome: "",
    descricao: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados do fornecedor:", formData);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
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
        <br></br>
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
  <br></br>
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
            <select style={S.inp} name="categoria" onChange={handleChange}>
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
            <select style={S.inp} name="fornecedor" onChange={handleChange}>
              {fornecedores.map((fornecedor) => (
                <option key={fornecedor.id} value={fornecedor.id}>
                  {fornecedor.nome}
                </option>
              ))}
            </select>
          </div>
        </div>
        <br></br>
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
          name="tipoPreco"
        >
          <button style={{ ...S.toggleBtn,...(tipoPreco === 1?S.toggleOn:{}), width: "100%" }} onClick={()=> setTipoPreco(1)}>
            Markup automático
          </button>
          <button style={{ ...S.toggleBtn,...(tipoPreco === 2?S.toggleOn:{}), width: "100%" }} onClick={()=> setTipoPreco(2)}>
            Preço Manual
          </button>
        </div>
        </div>
       
      </form>
    </div>
  );
};

export default FormularioProduto;
