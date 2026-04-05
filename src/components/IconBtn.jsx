import useStyle from "./Hooks/UseStyle";

function IcoBtn({ children, onClick }) {
  const { theme } = useStyle();

  return (
    <button
      style={{
        background: theme.border,
        border: "none",
        borderRadius: 7,
        width: 28,
        height: 28,
        fontSize: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default IcoBtn;
