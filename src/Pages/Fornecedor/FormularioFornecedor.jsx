import React from "react";
import useStyle from "../../components/Hooks/UseStyle";

const FormularioFornecedor = ({ formId, formData, setFormData, onSubmit }) => {
  const { S, theme } = useStyle();

  console.log(formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="formulario-fornecedor">
      <form id={formId} onSubmit={onSubmit}>
        <div>
          <label htmlFor="nome" style={S.inputLabel}>
            Nome*
          </label>
          <input
            style={{ ...S.inp }}
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <br></br>
          <div style={{ display: "flex", gap: 20 }}>
            <div style={{ width: "50%" }}>
              <label htmlFor="cnpj" style={S.inputLabel}>
                Cnpj
              </label>
              <input
                style={S.inp}
                type="text"
                name="cnjp"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div style={{ width: "50%" }}>
              <label style={S.inputLabel} htmlFor="telefone">
                Telefone
              </label>
              <input
                style={S.inp}
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div>
          <br></br>
          <label style={S.inputLabel} htmlFor="endereco">
            Endereço
          </label>
          <input
            style={S.inp}
            type="text"
            name="endereco"
            value={formData.endereco}
            onChange={handleChange}
          />
        </div>
        <div>
          <br></br>
          <label style={S.inputLabel} htmlFor="observacao">
            Observação
          </label>
          <textarea
            style={{ ...S.inp, height: "100px", resize: "vertical" }}
            name="observacao"
            value={formData.observacao}
            onChange={handleChange}
          />
        </div>
      </form>
    </div>
  );
};

export default FormularioFornecedor;
