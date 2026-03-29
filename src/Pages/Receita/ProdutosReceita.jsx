import { useEffect } from "react";
import useStyle from "../../components/Hooks/UseStyle";
import formaterReal from "../../components/Utils/formaterReal";

const produtosDisponiveis = [
  { id: "1", nome: "Mousse de Limao", preco: 12.3, unidade: "kg" },
  { id: "2", nome: "Brigadeiro", preco: 18.9, unidade: "kg" },
  { id: "3", nome: "Creme de Baunilha", preco: 16.5, unidade: "kg" },
  { id: "4", nome: "Massa de Pao de Lo", preco: 9.8, unidade: "kg" },
  { id: "5", nome: "Ganache", preco: 21.4, unidade: "kg" },
];

const criarLinhaProduto = () => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  produtoId: "",
  quantidade: "",
});

const ProdutosReceita = ({ formData, setFormData }) => {
  const { S, theme } = useStyle();

  useEffect(() => {
    if ((formData.produtos || []).length === 0) {
      setFormData((prev) => ({
        ...prev,
        produtos: [criarLinhaProduto()],
      }));
    }
  }, [formData.produtos, setFormData]);

  const atualizarLinha = (id, campo, valor) => {
    setFormData((prev) => ({
      ...prev,
      produtos: (prev.produtos || []).map((produto) =>
        produto.id === id ? { ...produto, [campo]: valor } : produto,
      ),
    }));
  };

  const adicionarLinha = () => {
    setFormData((prev) => ({
      ...prev,
      produtos: [...(prev.produtos || []), criarLinhaProduto()],
    }));
  };

  const removerLinha = (id) => {
    setFormData((prev) => {
      const produtosAtualizados = (prev.produtos || []).filter(
        (produto) => produto.id !== id,
      );

      return {
        ...prev,
        produtos:
          produtosAtualizados.length > 0
            ? produtosAtualizados
            : [criarLinhaProduto()],
      };
    });
  };

  const getProdutoSelecionado = (produtoId) =>
    produtosDisponiveis.find((produto) => produto.id === produtoId);

  return (
    <div>
      <div
        style={{
          color: theme.muted,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: "uppercase",
          marginBottom: 14,
        }}
      >
        Produtos da receita
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {(formData.produtos || []).map((item) => {
          const produtoSelecionado = getProdutoSelecionado(item.produtoId);
          const quantidade = parseFloat(item.quantidade) || 0;
          const custo = produtoSelecionado ? produtoSelecionado.preco * quantidade : 0;

          return (
            <div
              key={item.id}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) 120px 140px 44px",
                gap: 12,
                alignItems: "center",
              }}
            >
              <select
                style={{
                  ...S.inp,
                  borderRadius: 12,
                  appearance: "auto",
                }}
                value={item.produtoId}
                onChange={(e) => atualizarLinha(item.id, "produtoId", e.target.value)}
              >
                <option value="">Selecione um produto</option>
                {produtosDisponiveis.map((produto) => (
                  <option key={produto.id} value={produto.id}>
                    {produto.nome} — {formaterReal(produto.preco)}/{produto.unidade}
                  </option>
                ))}
              </select>

              <input
                style={{
                  ...S.inp,
                  borderRadius: 12,
                  textAlign: "center",
                }}
                type="number"
                step="0.01"
                min="0"
                value={item.quantidade}
                onChange={(e) => atualizarLinha(item.id, "quantidade", e.target.value)}
              />

              <div
                style={{
                  color: theme.amber,
                  textAlign: "right",
                }}
              >
                {formaterReal(custo)}
              </div>

              <button
                type="button"
                onClick={() => removerLinha(item.id)}
               style={S.closeBtn}
              >
                {"\u2715"}
              </button>
            </div>
          );
        })}
      </div>
<br />
      <button
        type="button"
        onClick={adicionarLinha}
        style = {{
              ...S.toggleBtn,
             
            }}
      >
        + Adicionar Produto
      </button>
    </div>
  );
};

export default ProdutosReceita;
