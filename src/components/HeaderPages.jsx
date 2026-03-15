import useStyle from "./Hooks/UseStyle";

const HeaderPage = ({ eyebrow, title, right }) => {
  const { S, theme } = useStyle();

  return (
    <div style={S.headerStyle}>
      <div style={{ ...S.pageHead, marginBottom: 12 }}>
        <div>
          <p style={S.eyebrow}>{eyebrow}</p>
          <h1 style={S.pageTitle}>{title}</h1>
        </div>
        {right}
      </div>
      <div style={{ height: 1, background: theme.border }} />
    </div>
  );
};

export default HeaderPage;
