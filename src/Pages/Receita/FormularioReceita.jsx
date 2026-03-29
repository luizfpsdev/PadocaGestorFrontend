import React from "react";
import useStyle from "../../components/Hooks/UseStyle";
import formaterReal from "../../components/Utils/formaterReal";
import DadosReceita from "./DadosReceita.jsx";
import DescricaoReceita from "./DescricaoReceita.jsx";
import FotosReceita from "./FotosReceita.jsx";
import ProdutosReceita from "./ProdutosReceita.jsx";

const FormularioReceita = ({ formId, formData, setFormData, onSubmit }) => {
  const { S, theme } = useStyle();
  const [tab, setTab] = React.useState(1);

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
        <div style={{ ...S.card, padding: "10px 12px", minHeight: "400px" }}>
          {tab === 1 && (
            <DadosReceita formData={formData} setFormData={setFormData} />
          )}
          {tab === 2 && (
            <DescricaoReceita formData={formData} setFormData={setFormData} />
          )}
          {tab === 3 && (
            <FotosReceita formData={formData} setFormData={setFormData} />
          )}
          {tab === 4 && (
            <ProdutosReceita formData={formData} setFormData={setFormData} />
          )}
        </div>
        <br></br>
        <div style={{ ...S.card, padding: "10px 12px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, minmax(100px,1fr))",
              gap: 8,
            }}
          >
            {[
              { l: "Custo total", v: formaterReal(5), c: theme.text },
              { l: "Custo/unid", v: formaterReal(5), c: theme.amber },
              { l: "Preço de venda", v: formaterReal(10), c: theme.green },
              { l: "Preço/unidade", v: formaterReal(10), c: theme.green },
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
