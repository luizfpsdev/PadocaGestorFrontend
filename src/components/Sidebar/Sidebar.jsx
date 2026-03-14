import React from "react";
import { useContext } from "react";
import { ThemeContext } from "../Theme/ThemeContext";
import { useAuth } from "react-oidc-context";
import { useNavigate } from 'react-router-dom';

const IcoLogout = ({ sz, cl }) => (
  <svg
    width={sz}
    height={sz}
    viewBox="0 0 24 24"
    fill="none"
    stroke={cl}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const IcoGrid = ({ sz, cl }) => (
  <svg
    width={sz}
    height={sz}
    viewBox="0 0 24 24"
    fill="none"
    stroke={cl}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </svg>
);
const IcoBook = ({ sz, cl }) => (
  <svg
    width={sz}
    height={sz}
    viewBox="0 0 24 24"
    fill="none"
    stroke={cl}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);
const IcoBox = ({ sz, cl }) => (
  <svg
    width={sz}
    height={sz}
    viewBox="0 0 24 24"
    fill="none"
    stroke={cl}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);
const IcoUsers = ({ sz, cl }) => (
  <svg
    width={sz}
    height={sz}
    viewBox="0 0 24 24"
    fill="none"
    stroke={cl}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IcoBolt = ({ sz, cl }) => (
  <svg
    width={sz}
    height={sz}
    viewBox="0 0 24 24"
    fill="none"
    stroke={cl}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const IcoBell = ({ sz, cl }) => (
  <svg
    width={sz}
    height={sz}
    viewBox="0 0 24 24"
    fill="none"
    stroke={cl}
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M10.3 21a2.2 2.2 0 0 0 3.4 0" />
    <path d="M15.4 18H5.9a1 1 0 0 1-.7-1.7l1.1-1.1a1.8 1.8 0 0 0 .5-1.3v-3.2a5.2 5.2 0 1 1 10.4 0v3.2" />
    <circle cx="18.4" cy="16.8" r="2.1" fill={cl} stroke="none" />
  </svg>
);
const IcoBrain = ({ sz, cl }) => (
  <svg
    width={sz}
    height={sz}
    viewBox="0 0 24 24"
    fill="none"
    stroke={cl}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9.5 2a3.5 3.5 0 0 0-3.5 3.5V7a3 3 0 0 0-2 2.82A3 3 0 0 0 6 12.64V14a3 3 0 0 0 2.34 2.93A3.5 3.5 0 0 0 11.5 21h1a3.5 3.5 0 0 0 3.16-2.07A3 3 0 0 0 18 16V14.64a3 3 0 0 0 2-2.82A3 3 0 0 0 18 9V7a3.5 3.5 0 0 0-3.5-3.5" />
    <path d="M9 7h.01" />
    <path d="M15 7h.01" />
    <path d="M10 11h4" />
    <path d="M9 15h6" />
  </svg>
);
const IcoChatSpark = ({ sz, cl }) => (
  <svg
    width={sz}
    height={sz}
    viewBox="0 0 24 24"
    fill="none"
    stroke={cl}
    strokeWidth="2.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4.2 6.2h9.6a2.6 2.6 0 0 1 2.6 2.6v4.4a2.6 2.6 0 0 1-2.6 2.6H9.5l-3 2.6v-2.6H4.2a2.6 2.6 0 0 1-2.6-2.6V8.8a2.6 2.6 0 0 1 2.6-2.6z" />
    <path
      d="M18.8 4.2l.55 1.45 1.45.55-1.45.55-.55 1.45-.55-1.45-1.45-.55 1.45-.55z"
      fill={cl}
      stroke="none"
    />
    <circle cx="21" cy="10.8" r="1" fill={cl} stroke="none" />
  </svg>
);
const IcoChart = ({ sz, cl }) => (
  <svg
    width={sz}
    height={sz}
    viewBox="0 0 24 24"
    fill="none"
    stroke={cl}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);
const IcoUser = ({ sz, cl }) => (
  <svg
    width={sz}
    height={sz}
    viewBox="0 0 24 24"
    fill="none"
    stroke={cl}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="9" r="3" />
    <path d="M7 18c1.4-2.1 3-3 5-3s3.6.9 5 3" />
  </svg>
);
const IcoProfile = ({ sz, cl }) => (
  <svg
    width={sz}
    height={sz}
    viewBox="0 0 24 24"
    fill="none"
    stroke={cl}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21a8 8 0 0 0-16 0" />
    <circle cx="12" cy="8" r="4" />
    <rect x="3" y="3" width="18" height="18" rx="3" />
  </svg>
);
const IcoSun = ({ sz, cl }) => (
  <svg
    width={sz}
    height={sz}
    viewBox="0 0 24 24"
    fill="none"
    stroke={cl}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="4" />
    <line x1="12" y1="2" x2="12" y2="5" />
    <line x1="12" y1="19" x2="12" y2="22" />
    <line x1="2" y1="12" x2="5" y2="12" />
    <line x1="19" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="4.93" x2="7.05" y2="7.05" />
    <line x1="16.95" y1="16.95" x2="19.07" y2="19.07" />
    <line x1="16.95" y1="7.05" x2="19.07" y2="4.93" />
    <line x1="4.93" y1="19.07" x2="7.05" y2="16.95" />
  </svg>
);
const IcoMoon = ({ sz, cl }) => (
  <svg
    width={sz}
    height={sz}
    viewBox="0 0 24 24"
    fill="none"
    stroke={cl}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3c0 5.25 4.26 9.5 9.79 9.79z" />
  </svg>
);

const Sidebar = () => {

  const { theme, toggleTheme, darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const auth = useAuth();

  const C = { ...theme };

  let S = {
    root: { display: "flex", minHeight: "100vh", background: C.bg },
    sidebar: {
      width: 220,
      background: C.surface,
      borderRight: `1px solid ${C.border}`,
      display: "flex",
      flexDirection: "column",
      padding: "24px 14px",
      position: "sticky",
      top: 0,
      height: "100vh",
    },
    brand: { display: "flex", alignItems: "center", gap: 9, marginBottom: 32 },
    dot: {
      width: 8,
      height: 8,
      background: C.teal,
      borderRadius: "50%",
      boxShadow: `0 0 8px ${C.teal}`,
    },
    brandTxt: {
      fontFamily: "'Bricolage Grotesque',sans-serif",
      fontSize: 17,
      fontWeight: 800,
      color: C.text,
      letterSpacing: 2,
    },
    nav: { display: "flex", flexDirection: "column", gap: 3, flex: 1 },
    navBtn: {
      display: "flex",
      alignItems: "center",
      gap: 9,
      padding: "9px 11px",
      background: "transparent",
      border: "none",
      borderRadius: 9,
      color: C.muted,
      fontSize: 13,
      fontFamily: "'Mulish',sans-serif",
      position: "relative",
    },
    navOn: { color: C.text, background: C.border },
    navBar: {
      position: "absolute",
      right: 0,
      top: "50%",
      transform: "translateY(-50%)",
      width: 3,
      height: 16,
      background: C.teal,
      borderRadius: "2px 0 0 2px",
      boxShadow: `0 0 8px ${C.teal}`,
    },
    sideFooter: {
      paddingTop: 16,
      borderTop: `1px solid ${C.border}`,
      display: "flex",
      flexDirection: "column",
      gap: 8,
    },
    sideChip: { background: C.border, borderRadius: 10, padding: "10px 12px" },
    sideChipLbl: {
      display: "block",
      color: C.muted,
      fontSize: 10,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: 1.5,
      marginBottom: 4,
    },
    sideChipVal: {
      display: "block",
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: 18,
      fontWeight: 700,
    },
    sidebarLogoutBtn: {
      marginTop: 6,
      height: 36,
      borderRadius: 10,
      border: `1px solid ${C.border2}`,
      background: C.border,
      color: C.text,
      fontSize: 12,
      fontWeight: 700,
      fontFamily: "'Mulish',sans-serif",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    topBar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "14px 24px",
      borderBottom: `1px solid ${C.border}`,
      background: C.surface,
      position: "sticky",
      top: 0,
      zIndex: 5,
    },
    topBarTitle: {
      color: C.text,
      fontFamily: "'Bricolage Grotesque',sans-serif",
      fontWeight: 700,
      fontSize: 18,
      letterSpacing: 0.5,
    },
    profileWrap: { display: "flex", alignItems: "center", gap: 10 },
    profileEmail: {
      color: C.muted,
      fontSize: 12,
      fontWeight: 600,
      maxWidth: 220,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    profileBtn: {
      width: 34,
      height: 34,
      borderRadius: "50%",
      border: `1px solid ${C.border2}`,
      background: C.border,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
    },
    main: { flex: 1, overflow: "auto" },
    page: { padding: "36px 42px", maxWidth: 1200, margin: "0 auto" },
    pageHead: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
      marginBottom: 28,
    },
    eyebrow: {
      color: C.teal,
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: 3,
      textTransform: "uppercase",
      marginBottom: 4,
    },
    pageTitle: {
      fontFamily: "'Bricolage Grotesque',sans-serif",
      fontSize: 32,
      fontWeight: 800,
      color: C.text,
    },
    dateBadge: {
      color: C.muted,
      fontSize: 12,
      padding: "7px 14px",
      background: C.surface,
      borderRadius: 8,
      border: `1px solid ${C.border}`,
    },
    grid4: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 14,
      marginBottom: 20,
    },
    kpi: {
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 14,
      padding: "16px 18px",
      display: "flex",
      flexDirection: "column",
    },
    row: { display: "flex", gap: 16 },
    card: {
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 14,
      padding: "18px 20px",
    },
    listRow: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "12px 16px",
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 12,
      cursor: "pointer",
      transition: "border-color .15s",
    },
    listRowOn: { borderColor: C.teal + "55", background: C.surface },
    listName: { color: C.text, fontWeight: 600, fontSize: 14 },
    rowActs: { display: "flex", gap: 5 },
    quickStats: {
      display: "flex",
      flexDirection: "column",
      gap: 7,
      marginTop: 14,
      paddingTop: 14,
      borderTop: `1px solid ${C.border}`,
    },
    quickRow: { display: "flex", justifyContent: "space-between" },
    ingGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))",
      gap: 14,
    },
    ingCard: {
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 13,
      padding: 16,
    },
    priceIn: {
      background: C.bg,
      border: `1px solid ${C.teal}`,
      borderRadius: 7,
      padding: "4px 8px",
      fontSize: 16,
      color: C.teal,
      fontFamily: "'JetBrains Mono',monospace",
      width: 120,
    },
    opRow: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "11px 14px",
      background: C.surface,
      borderRadius: 10,
      border: `1px solid ${C.border}`,
    },
    search: {
      width: "100%",
      padding: "9px 14px",
      background: C.bg,
      border: `1px solid ${C.border}`,
      borderRadius: 10,
      fontSize: 13,
      color: C.text,
      marginBottom: 12,
      fontFamily: "'Mulish',sans-serif",
    },
    toggleBtn: {
      background: "transparent",
      border: `1px solid ${C.border}`,
      borderRadius: 8,
      padding: "7px 16px",
      color: C.muted,
      fontSize: 13,
      fontFamily: "'Mulish',sans-serif",
    },
    toggleOn: { background: C.teal + "22", borderColor: C.teal, color: C.teal },
    overlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,.82)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 100,
      padding: 20,
    },
    modal: {
      background: C.surface,
      border: `1px solid ${C.border2}`,
      borderRadius: 18,
      width: "100%",
      maxHeight: "90vh",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      boxShadow: "0 24px 80px rgba(0,0,0,.6)",
    },
    modalHead: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "18px 22px",
      borderBottom: `1px solid ${C.border}`,
    },
    modalTitle: {
      fontFamily: "'Bricolage Grotesque',sans-serif",
      fontSize: 20,
      fontWeight: 700,
      color: C.text,
    },
    closeBtn: {
      background: C.border,
      border: "none",
      borderRadius: 7,
      width: 28,
      height: 28,
      color: C.muted,
      fontSize: 13,
    },
    modalBody: { padding: "20px 22px", overflow: "auto", flex: 1 },
    inp: {
      width: "100%",
      padding: "9px 12px",
      background: C.bg,
      border: `1px solid ${C.border}`,
      borderRadius: 8,
      color: C.text,
      fontSize: 13,
      fontFamily: "'Mulish',sans-serif",
    },
    btnPrimary: {
      background: C.teal,
      color: C.bg,
      padding: "9px 20px",
      borderRadius: 9,
      border: "none",
      fontWeight: 700,
      fontSize: 13,
      fontFamily: "'Mulish',sans-serif",
    },
    btnOutline: {
      background: "transparent",
      color: C.muted,
      padding: "9px 20px",
      borderRadius: 9,
      border: `1px solid ${C.border}`,
      fontWeight: 600,
      fontSize: 13,
      fontFamily: "'Mulish',sans-serif",
    },
    toast: {
      position: "fixed",
      bottom: 22,
      right: 22,
      background: C.surface,
      border: "1px solid",
      padding: "10px 18px",
      borderRadius: 10,
      fontWeight: 600,
      zIndex: 200,
      fontSize: 12,
      fontFamily: "'JetBrains Mono',monospace",
    },
    th: {
      padding: "8px 12px",
      textAlign: "left",
      color: C.muted,
      fontSize: 10,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: 1,
      borderBottom: `1px solid ${C.border}`,
    },
    td: { padding: "9px 12px", color: C.text, fontSize: 13 },
    empty: {
      color: C.muted,
      textAlign: "center",
      padding: "48px 20px",
      fontSize: 14,
    },
  };

  const nav = [
    { key: "dashboard", label: "Dashboard", Icon: IcoGrid },
    { key: "receitas", label: "Receitas", Icon: IcoBook },
    { key: "produtos", label: "Produtos", Icon: IcoBox },
    { key: "comparativo", label: "Comparativo", Icon: IcoChart },
    { key: "custos", label: "Custos Op.", Icon: IcoBolt },
    { key: "fornecedores", label: "Fornecedores", Icon: IcoUsers },
    { key: "lucro", label: "Lucratividade", Icon: IcoChart },
  ];


  const [page, setPage] = React.useState("dashboard");

  return (

    <aside style={S.sidebar}>
      <div style={S.brand}>
        <div style={S.dot} />
        <span style={S.brandTxt}>
          CUSTO<span style={{ color: C.teal }}>LAB</span>
        </span>
      </div>
      <nav style={S.nav}>
        {nav.map(({ key, label, Icon }) => {
          const on = page === key;
          return (
            <button
              key={key}
              style={{ ...S.navBtn, ...(on ? S.navOn : {}) }}
              onClick={() => {setPage(key), navigate(key)}}
            >
              <Icon sz={17} cl={on ? C.teal : C.muted} />
              <span>{label}</span>
              {on && <div style={S.navBar} />}
            </button>
          );
        })}
      </nav>
      <div style={S.sideFooter}>
        <button
          onClick={toggleTheme}
          role="switch"
          aria-checked={!darkMode}
          aria-label="Toggle theme"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            width: "100%",
            background: C.border,
            border: `1px solid ${C.border2}`,
            color: C.text,
            borderRadius: 10,
            padding: "9px 10px",
            fontSize: 12,
            fontWeight: 600,
            fontFamily: "'Mulish',sans-serif",
          }}
        >
          <span>{darkMode ? "Dark mode" : "Light mode"}</span>
          <span
            style={{
              width: 44,
              height: 24,
              borderRadius: 999,
              background: darkMode ? C.dim : C.teal + "33",
              border: `1px solid ${darkMode ? C.border2 : C.teal + "66"}`,
              position: "relative",
              transition: "background .2s, border-color .2s",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: 1,
                left: 1,
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: C.surface,
                border: `1px solid ${C.border2}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `translateX(${darkMode ? 0 : 20}px)`,
                transition: "transform .2s",
              }}
            >
              {darkMode ? (
                <IcoMoon sz={11} cl={C.muted} />
              ) : (
                <IcoSun sz={11} cl={C.amber} />
              )}
            </span>
          </span>
        </button>
        <button style={S.sidebarLogoutBtn} onClick={() => void auth.signoutRedirect()}>
          <IcoLogout sz={14} cl={C.text} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
