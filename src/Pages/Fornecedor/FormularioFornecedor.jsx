import React from "react";
import useStyle from "../../components/Hooks/UseStyle";

const FormularioFornecedor = ({ formId, formData, setFormData, onSubmit }) => {
  const { S, theme } = useStyle();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatCPF = (value) => {
    value = value.replace(/\D/g, ""); // remove tudo que não é número
    value = value.slice(0, 11); // limita a 11 dígitos

    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    return value;
  };

  const handleCNPJChange = (e) => {
    const { value } = e.target;
    const formattedValue = formatCPF(value);

    setFormData((prev) => ({
      ...prev,
      cnpj: formattedValue,
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
          <label style={S.inputLabel} htmlFor="email">
            E-mail
          </label>
          <input
            style={S.inp}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
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
                name="cnpj"
                value={formData.cnpj}
                onChange={handleCNPJChange}
                placeholder="000.000.000-00"
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
