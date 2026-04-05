import useStyle from "../../components/Hooks/UseStyle";

function KpiCard({ lbl, val, color, icon = "" }) {
  const { theme, S } = useStyle();

  return (
    <div style={S.kpi} className="hov">
      {icon && <span style={{ fontSize: 20, marginBottom: 4 }}>{icon}</span>}
      <div
        style={{
          color,
          fontFamily: "monospace",
          fontWeight: 700,
          fontSize: 24,
          margin: "4px 0 2px",
        }}
      >
        {val}
      </div>
      <div style={{ color: theme.muted, fontSize: 12 }}>{lbl}</div>
      <div
        style={{
          height: 3,
          background: color + "22",
          borderRadius: 2,
          marginTop: 10,
        }}
      >
        <div
          style={{
            height: "100%",
            width: "65%",
            background: color,
            borderRadius: 2,
          }}
        />
      </div>
    </div>
  );
}

export default KpiCard;
