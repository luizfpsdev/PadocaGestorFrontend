import useStyle from "./Hooks/UseStyle";

function ChartHeader({ title, sub }) {
  const { theme } = useStyle();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        marginBottom: 12,
      }}
    >
      <span style={{ color: theme.text, fontWeight: 600, fontSize: 14 }}>
        {title}
      </span>
      {sub && <span style={{ color: theme.muted, fontSize: 11 }}>{sub}</span>}
    </div>
  );
}

export default ChartHeader;
