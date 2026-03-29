import useStyle from "../../components/Hooks/UseStyle";

const DescricaoReceita = ({ formData, setFormData }) => {
  const { S } = useStyle();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div>
      <label htmlFor="descricao" style={S.inputLabel}>
        Descricao da receita
      </label>
      <textarea
        id="descricao"
        style={{ ...S.inp, height: "100px", resize: "vertical" }}
        name="descricao"
        value={formData.descricao || ""}
        onChange={handleChange}
        placeholder="Descreva a receita, observações e diferenciais."
      />
      <br />
      <br />
      <label htmlFor="modoPreparo" style={S.inputLabel}>
        Modo de preparo
      </label>
      <textarea
        id="modoPreparo"
        style={{ ...S.inp, height: "140px", resize: "vertical" }}
        name="modoPreparo"
        value={formData.modoPreparo || ""}
        onChange={handleChange}
        placeholder={"Ex:\n1) Misture os ingredientes secos.\n2) Adicione os líquidos.\n3) Asse por 35 min a 180°C."}
      />
    </div>
  );
};

export default DescricaoReceita;
