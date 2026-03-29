import React from "react";
import useStyle from "../../components/Hooks/UseStyle";
import formaterReal from "../../components/Utils/formaterReal";

const FormularioReceita = ({ formId, formData, setFormData, onSubmit }) => {
  const { S, theme } = useStyle();
  const [tab, setTab] = React.useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div>
      <form id={formId} onSubmit={onSubmit}>
        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
          <button
            onClick={() => setTab(1)}
            type="button"
            style={{
              ...S.toggleBtn,
              ...(tab === 1 ? S.toggleOn : {}),
            }}
          >
            Dados
          </button>
          <button
            onClick={() => setTab(2)}
            type="button"
            style={{
              ...S.toggleBtn,
              ...(tab === 2 ? S.toggleOn : {}),
            }}
          >
            Descrição
          </button>
          <button
            onClick={() => setTab(3)}
            type="button"
            style={{
              ...S.toggleBtn,
              ...(tab === 3 ? S.toggleOn : {}),
            }}
          >
            Fotos
          </button>
          <button
            onClick={() => setTab(4)}
            type="button"
            style={{
              ...S.toggleBtn,
              ...(tab === 4 ? S.toggleOn : {}),
            }}
          >
            Produtos
          </button>
        </div>
        <div style={{ ...S.card, padding: "10px 12px" }}>
          {tab === 1 && <>1</>}
          {tab === 2 && <>2</>}
          {tab === 3 && <>3</>}
          {tab === 4 && <>4</>}
        </div>
        <br></br>
        <div style={{ ...S.card, padding: "10px 12px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(100px,1fr))",
              gap: 8,
            }}
          >
            {[
              { l: "Custo total", v: formaterReal(5), c: theme.text },
              { l: "Custo/unid", v: formaterReal(5), c: theme.amber },
              {
                l: "Margem",
                v: `${50}%`,
                c: 50 > 30 ? theme.green : 50 > 15 ? theme.amber : theme.rose,
              },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  background: theme.bg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 9,
                  padding: "8px 10px",
                }}
              >
                <div
                  style={{ color: theme.muted, fontSize: 10, marginBottom: 4 }}
                >
                  {s.l}
                </div>
                <div
                  style={{
                    color: s.c,
                    fontFamily: "monospace",
                    fontWeight: 700,
                    fontSize: 13,
                  }}
                >
                  {s.v}
                </div>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormularioReceita;
