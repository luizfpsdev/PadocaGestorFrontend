import useStyle from "../../components/Hooks/UseStyle";

const FotosReceita = ({ formData, setFormData }) => {
  const { S, theme } = useStyle();

  const handleFotosChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    const novasFotos = files.map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 9)}`,
      nome: file.name,
      arquivo: file,
      preview: URL.createObjectURL(file),
    }));

    setFormData((prev) => ({
      ...prev,
      fotos: [...(prev.fotos || []), ...novasFotos],
    }));

    e.target.value = "";
  };

  const handleRemoveFoto = (fotoId) => {
    setFormData((prev) => {
      const fotoRemovida = (prev.fotos || []).find((foto) => foto.id === fotoId);

      if (fotoRemovida?.preview) {
        URL.revokeObjectURL(fotoRemovida.preview);
      }

      return {
        ...prev,
        fotos: (prev.fotos || []).filter((foto) => foto.id !== fotoId),
      };
    });
  };

  return (
    <div>
      <label htmlFor="fotos" style={S.inputLabel}>
        Upload de imagens
      </label>
      <input
        id="fotos"
        style={S.inp}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFotosChange}
      />
      <br />
      <br />
      <div style={{ color: theme.muted, fontSize: 11, marginTop: 8 }}>
              A primeira foto da lista é usada como capa da receita.
            </div>
            <br />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: 16,
        }}
      >
              
        {(formData.fotos || []).map((foto, idx) => (

          <div
            key={foto.id}
            style={{
              background: theme.bg,
              border: `1px solid ${idx === 0 ? theme.teal : theme.border2}`,
              borderRadius: 12,
              padding: 12,
            }}
          >
            <img
              src={foto.preview}
              alt={foto.nome}
              style={{
                width: "100%",
                height: 100,
                objectFit: "cover",
                borderRadius: 8,
                marginBottom: 10,
              }}
            />
            <div
              style={{
                color: theme.text,
                fontSize: 10,
                marginBottom: 10,
                wordBreak: "break-word",
              }}
            >
              {foto.nome}
            </div>
            <button
              type="button"
              style={{
                ...S.btnOutline,
                width: "100%",
              }}
              onClick={() => handleRemoveFoto(foto.id)}
            >
              Remover
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FotosReceita;
