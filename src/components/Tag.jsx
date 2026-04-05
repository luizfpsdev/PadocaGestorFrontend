function Tag({ color, txt, children }) {
  return (
    <span style={{
      background: color + "22", color: txt || color, fontSize: 10, fontWeight: 700,
      padding: "2px 8px", borderRadius: 20, letterSpacing: 0.5, whiteSpace: "nowrap"
    }}>
      {children}
    </span>
  );
}

export default Tag;