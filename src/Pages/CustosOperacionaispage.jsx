import HeaderPage from "../components/HeaderPages";
import useStyle from "../components/Hooks/UseStyle";

const CustosOperacionaisPage = () => {
  
  const {S, theme } = useStyle();

  return (
    <div
      style={{
        backgroundColor: theme.bg,
        color: theme.text,
        height: "100vh",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <HeaderPage eyebrow="Gestão" title="Custos Operacionais" right={
         <div style={{ display: "flex", gap: 8 }}>
            <button
              style={S.btnPrimary}
            >
              + Novo Custo
            </button>
          </div>
      }/>
    </div>
  );
};

export default CustosOperacionaisPage;
