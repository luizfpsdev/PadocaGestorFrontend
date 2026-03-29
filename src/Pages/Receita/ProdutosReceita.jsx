import { useEffect, useRef, useState } from "react";
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
  busca: "",
  quantidade: 0,
});

const ProdutosReceita = ({ formData, setFormData }) => {
  const { S, theme } = useStyle();
  const [dropdownAbertoId, setDropdownAbertoId] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if ((formData.produtos || []).length === 0) {
      setFormData((prev) => ({
        ...prev,
        produtos: [criarLinhaProduto()],
      }));
    }
  }, [formData.produtos, setFormData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownAbertoId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const selecionarProduto = (linhaId, produto) => {
    setFormData((prev) => ({
      ...prev,
      produtos: (prev.produtos || []).map((item) =>
        item.id === linhaId
          ? {
              ...item,
              produtoId: produto.id,
              busca: `${produto.nome} - ${formaterReal(produto.preco)}/${produto.unidade}`,
            }
          : item,
      ),
    }));
    setDropdownAbertoId(null);
  };

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
          const produtosFiltrados = produtosDisponiveis.filter((produto) =>
            produto.nome.toLowerCase().includes((item.busca || "").toLowerCase()),
          );

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
              <div style={{ position: "relative" }}>
                <input
                  style={{
                    ...S.inp,
                    paddingRight: 42,
                    borderColor: produtoSelecionado ? theme.border2 : theme.border,
                  }}
                  type="text"
                  placeholder="Pesquise um produto"
                  value={item.busca || ""}
                  onFocus={() => setDropdownAbertoId(item.id)}
                  onChange={(e) => {
                    atualizarLinha(item.id, "busca", e.target.value);
                    atualizarLinha(item.id, "produtoId", "");
                    setDropdownAbertoId(item.id);
                  }}
                />
          
                {dropdownAbertoId === item.id && !produtoSelecionado && (
                  <div
                    ref={dropdownRef}
                    style={{
                      position: "absolute",
                      top: "calc(100% + 6px)",
                      left: 0,
                      right: 0,
                      background: theme.surface,
                      border: `1px solid ${theme.border}`,
                      borderRadius: 10,
                      overflow: "hidden",
                      zIndex: 999,
                      boxShadow: "0 18px 32px rgba(0,0,0,.24)",
                      maxHeight: 220,
                      overflowY: "auto",
                    }}
                  >
                    {produtosFiltrados.length > 0 ? (
                      produtosFiltrados.map((produto) => (
                        <button
                          key={produto.id}
                          type="button"
                          onClick={() => selecionarProduto(item.id, produto)}
                          style={{
                            width: "100%",
                            padding: "12px 14px",
                            border: "none",
                            borderBottom: `1px solid ${theme.border}`,
                            background: "transparent",
                            textAlign: "left",
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 12,
                          }}
                        >
                          <span
                            style={{
                              color: theme.text,
                              fontSize: 12,
                             
                            }}
                          >
                            {produto.nome}
                          </span>
                          <span
                            style={{
                              color: theme.muted,
                              fontSize: 12,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {formaterReal(produto.preco)}/{produto.unidade}
                          </span>
                        </button>
                      ))
                    ) : (
                      <div
                        style={{
                          padding: "10px 12px",
                          color: theme.muted,
                        }}
                      >
                        Nenhum produto encontrado
                      </div>
                    )}
                  </div>
                )}
              </div>

              <input
                style={{
                  ...S.inp,
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
                style={{
                  ...S.closeBtn,
                }}
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
        style={{
          ...S.toggleBtn,
        }}
      >
        + Adicionar Produto
      </button>
    </div>
  );
};

export default ProdutosReceita;
