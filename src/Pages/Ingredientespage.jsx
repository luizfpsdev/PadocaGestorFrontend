import React, { useEffect, useState } from "react";

const STORAGE_KEY = "padoca_ingredientes";

export default function IngredientesPage() {
    const [ingredientes, setIngredientes] = useState([]);
    const [nome, setNome] = useState("");
    const [editId, setEditId] = useState(null);
    const [editNome, setEditNome] = useState("");
    const [filtro, setFiltro] = useState("");

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            setIngredientes(JSON.parse(saved));
        } else {
            setIngredientes([
                { id: 1, nome: "Farinha", quantidade: "1kg" },
                { id: 2, nome: "Açúcar", quantidade: "500g" },
            ]);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(ingredientes));
    }, [ingredientes]);

    function gerarId() {
        return Date.now();
    }

    function adicionar(e) {
        e.preventDefault();
        if (!nome.trim()) return;
        setIngredientes((prev) => [
            ...prev,
            { id: gerarId(), nome: nome.trim(), quantidade: "" },
        ]);
        setNome("");
    }

    function começarEdicao(item) {
        setEditId(item.id);
        setEditNome(item.nome);
    }

    function salvarEdicao(id) {
        if (!editNome.trim()) return;
        setIngredientes((prev) =>
            prev.map((it) => (it.id === id ? { ...it, nome: editNome.trim() } : it))
        );
        cancelarEdicao();
    }

    function cancelarEdicao() {
        setEditId(null);
        setEditNome("");
    }

    function remover(id) {
        if (!window.confirm("Remover ingrediente?")) return;
        setIngredientes((prev) => prev.filter((it) => it.id !== id));
    }

    const listaFiltrada = ingredientes.filter((it) =>
        it.nome.toLowerCase().includes(filtro.toLowerCase())
    );

    return (
        <div style={{ padding: 20, maxWidth: 800, margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
            <h1>Ingredientes</h1>

            <div style={{ marginBottom: 12 }}>
                <input
                    placeholder="Pesquisar..."
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    style={{ padding: 8, width: "100%", boxSizing: "border-box" }}
                />
            </div>

            <form onSubmit={adicionar} style={{ marginBottom: 16, display: "flex", gap: 8 }}>
                <input
                    placeholder="Nome do ingrediente"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    style={{ flex: 1, padding: 8 }}
                />
                <button type="submit" style={{ padding: "8px 12px" }}>
                    Adicionar
                </button>
            </form>

            <ul style={{ listStyle: "none", padding: 0 }}>
                {listaFiltrada.map((item) => (
                    <li
                        key={item.id}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "8px 12px",
                            borderBottom: "1px solid #eee",
                        }}
                    >
                        <div style={{ flex: 1 }}>
                            {editId === item.id ? (
                                <input
                                    value={editNome}
                                    onChange={(e) => setEditNome(e.target.value)}
                                    style={{ padding: 6, width: "100%" }}
                                />
                            ) : (
                                <div>
                                    <strong>{item.nome}</strong>
                                    {item.quantidade ? <span style={{ marginLeft: 8, color: "#666" }}>{item.quantidade}</span> : null}
                                </div>
                            )}
                        </div>

                        <div style={{ marginLeft: 12, display: "flex", gap: 8 }}>
                            {editId === item.id ? (
                                <>
                                    <button onClick={() => salvarEdicao(item.id)} style={{ padding: "6px 10px" }}>Salvar</button>
                                    <button onClick={cancelarEdicao} style={{ padding: "6px 10px" }}>Cancelar</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => começarEdicao(item)} style={{ padding: "6px 10px" }}>Editar</button>
                                    <button onClick={() => remover(item.id)} style={{ padding: "6px 10px" }}>Remover</button>
                                </>
                            )}
                        </div>
                    </li>
                ))}
                {listaFiltrada.length === 0 && <li style={{ padding: 12, color: "#777" }}>Nenhum ingrediente encontrado.</li>}
            </ul>
        </div>
    );
}