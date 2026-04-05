const formaterReal = (value) => {
  return `R$${Number(value).toFixed(2)}`;
};

function fmtK(n) { return n >= 1000 ? `R$${(n / 1000).toFixed(1)}k` : formaterReal(n); }

function pct(a, b) { return b ? ((a - b) / b * 100).toFixed(1) + "%" : "—"; }

export default formaterReal;
export { fmtK, pct };