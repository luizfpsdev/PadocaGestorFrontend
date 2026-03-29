const formaterReal = (value) => {
  return `R$${Number(value).toFixed(2)}`;
};

export default formaterReal;
