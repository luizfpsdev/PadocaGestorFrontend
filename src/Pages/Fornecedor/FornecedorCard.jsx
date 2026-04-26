import useStyle from "../../components/Hooks/UseStyle";
import IcoBtn from "../../components/IconBtn";
import Tag from "../../components/Tag";

const FornecedorCard = ({ supplier, onEdit, onDelete }) => {
  const { S, theme } = useStyle();

  return (
    <div
      style={{
        ...S.card,
        padding: "14px 14px 12px",
      }}
    >
      <div style={{minHeight:"150px"}}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                color: theme.text,
                fontWeight: 700,
                fontSize: 14,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {supplier.name}
            </div>
            <div style={{ color: theme.muted, fontSize: 12, marginTop: 2 }}>
              {supplier.contact
                ? `Contato: ${supplier.contact}`
                : "Sem contato"}
            </div>
          </div>
          {supplier.city && <Tag color={theme.teal}>{supplier.city}</Tag>}
        </div>

        <div style={{ display: "grid", gap: 4, marginBottom: 10 }}>
          <div style={{ color: theme.muted, fontSize: 12 }}>
            {"\uD83D\uDCDE"} {supplier.phone || "Sem telefone"}
          </div>
          <div
            style={{
              color: theme.muted,
              fontSize: 12,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {"\u2709\uFE0F"} {supplier.email || "Sem email"}
          </div>
          {supplier.note && (
            <div
              style={{
                color: theme.dim,
                fontSize: 11,
                marginTop: 2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {supplier.note}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          ...S.rowActs,
          justifyContent: "flex-end",
          borderTop: `1px solid ${theme.border}`,
          paddingTop: 8,
        }}
      >
        <IcoBtn onClick={() => onEdit?.(supplier)}>{"\u270F\uFE0F"}</IcoBtn>
        <IcoBtn onClick={() => onDelete?.(supplier)}>
          {"\uD83D\uDDD1\uFE0F"}
        </IcoBtn>
      </div>
    </div>
  );
};

export default FornecedorCard;
