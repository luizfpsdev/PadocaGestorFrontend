import React, { useEffect,useState } from "react";
import useStyle from "../../components/Hooks/UseStyle";
import formaterReal from "../../components/Utils/formaterReal";
import { useAuth } from "react-oidc-context";

const FormularioProduto = ({ formId, formData, setFormData, onSubmit }) => {
  const { S, theme } = useStyle();
  const [suppliers, setSuppliers] = useState([]);
  const auth = useAuth();

  const categorias = [
    { id: 0, nome: "Selecione a categoria" },
    { id: 1, nome: "Pao" },
    { id: 2, nome: "Doce" },
    { id: 3, nome: "Salgado" },
    { id: 4, nome: "Massas" },
  ];

  const unidadesMedida = [
    { id: 0, nome: "Selecione a unidade de medida" },
    { id: 1, nome: "Kg" },
    { id: 2, nome: "g" },
    { id: 3, nome: "L" },
    { id: 4, nome: "ml" },
    { id: 5, nome: "Unidade" },
    { id: 6, nome: "Duzia" },
  ];

  const fornecedores = [{key: 0, id: 0, nome: "Selecione o fornecedor" }];

  const API_URL = (import.meta.env.VITE_API_URL || "https://localhost:7216").replace(/\/$/, "");


  useEffect(() => {
       const fetchSuppliers = async () => {

        //TODO: melhorar e implementar busca no select e exportar para um hook

              const controller = new AbortController();
          
              const params = new URLSearchParams({
                pagina: "1",
                tamanhoPagina: 99999,
                ordem: "asc",
              });
      
      
              const response = await fetch(`${API_URL}/Fornecedores?${params.toString()}`, {
                headers: {
                  Authorization: `Bearer ${auth.user.access_token}`,
                },
                signal: controller.signal,
              });
      
      
              const data = await response.json();

              const nextSuppliers = Array.isArray(data?.itens)
                ? [...fornecedores, ...data.itens.map(x => {
                    return {
                      key: x.idFornecedor,
                      id: x.idFornecedor,
                      nome: x.nome,
                    };
                  })
                ]: [];
      
              setSuppliers(nextSuppliers);
          };
      
          fetchSuppliers();
    },[]);

  const margin = () => {
    const custo = formData.precoIngrediente;

    const venda =
      formData.tipoPreco === 1 ? formData.markup * custo : formData.preco;

    if (!venda || venda === 0) return 0;

    const margem = ((venda - custo) / venda) * 100;

    return Number(margem.toFixed(2));
  };

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
              {suppliers.map((fornecedor) => (
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
                value={formData.markup}
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
                value={formData.preco}
                onChange={handlePrecoChange}
                step="0.01"
              />
            </div>
          )}
        </div>
        <br />
        {/*campos ingredientes*/}
        <label style={S.inputLabel} htmlFor="ingredientes">
          Ingredientes
        </label>
        <div
          style={{
            display: "flex",
            gap: 10,
          }}
        >
          <div style={{ width: "60%" }}>
            <input
              id="ingrediente"
              style={S.inp}
              type="text"
              name="ingrediente"
              value={formData.ingrediente || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <select
              id="unidadeMedida"
              style={S.inp}
              name="unidadeMedida"
              value={formData.unidadeMedida || ""}
              onChange={handleChange}
            >
              {unidadesMedida.map((unidade) => (
                <option key={unidade.id} value={unidade.id}>
                  {unidade.nome}
                </option>
              ))}
            </select>
          </div>
          <div>
            <input
              id="precoIngrediente"
              style={S.inp}
              type="number"
              name="precoIngrediente"
              value={formData.precoIngrediente || 0.0}
              mask="currency"
              onChange={handleChange}
              step="0.10"
            />
          </div>
        </div>
        <br></br>
        <div
          style={{
            display: "flex",
            gap: 14,
            padding: "12px 16px",
            background: theme.bg,
            borderRadius: 10,
            fontSize: 12,
          }}
        >
          <span style={{ color: theme.muted }}>
            Custo Ing:{" "}
            <span style={{ color: theme.text }}>
              {formaterReal(formData.precoIngrediente)}
            </span>
          </span>
          <span style={{ color: theme.muted }}>
            Preço Venda:{" "}
            <span style={{ color: theme.teal }}>
              {formaterReal(
                formData.tipoPreco == 1
                  ? formData.markup * formData.precoIngrediente
                  : formData.preco,
              )}
            </span>
          </span>
          <span style={{ color: theme.muted }}>
            Margem:{" "}
            <span
              style={{
                color:
                  margin() > 30
                    ? theme.green
                    : margin() > 15
                      ? theme.amber
                      : theme.rose,
                fontWeight: 700,
              }}
            >
              {margin()}%
            </span>
          </span>
        </div>
      </form>
    </div>
  );
};

export default FormularioProduto;
