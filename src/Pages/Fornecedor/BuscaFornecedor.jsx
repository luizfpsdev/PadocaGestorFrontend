import useStyle from "../../components/Hooks/UseStyle";

const BuscaFornecedor = ({
  search,
  setSearch,
  nameOrder,
  setNameOrder,
}) => {
  const { S } = useStyle();

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 170px",
          gap: 8,
          marginBottom: 10,
          padding: 22,
        }}
      >
        <input
          style={{ ...S.search, marginBottom: 0 }}
          placeholder="Buscar fornecedor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          style={S.inp}
          value={nameOrder}
          onChange={(e) => setNameOrder(e.target.value)}
        >
          <option value="asc">Nome (A-Z)</option>
          <option value="desc">Nome (Z-A)</option>
        </select>
      </div>
    </div>
  );
};

export default BuscaFornecedor;
