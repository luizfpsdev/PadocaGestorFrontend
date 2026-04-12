const STORAGE_KEY = "padoca:fornecedores";

const SEED_SUPPLIERS = [
  {
    id: "s1",
    name: "Atacado Doce Sul",
    contact: "Marina",
    phone: "(11) 98888-1111",
    email: "vendas@docesul.com",
    city: "Sao Paulo",
    state: "SP",
    address: "Rua das Flores, 120",
    document: "12.345.678/0001-90",
    note: "Entrega 2x por semana",
  },
  {
    id: "s2",
    name: "Laticinios Serra",
    contact: "Rafael",
    phone: "(11) 97777-2222",
    email: "comercial@serra.com",
    city: "Campinas",
    state: "SP",
    address: "Av. da Serra, 450",
    document: "98.765.432/0001-10",
    note: "Prazo 14 dias",
  },
  {
    id: "s3",
    name: "Distribuidora Central",
    contact: "Carla",
    phone: "(11) 96666-3333",
    email: "pedido@dcentral.com",
    city: "Guarulhos",
    state: "SP",
    address: "Rua Central, 78",
    document: "45.987.321/0001-44",
    note: "",
  },
];

const isBrowser = typeof window !== "undefined";

export const getSeedSuppliers = () => SEED_SUPPLIERS;

export const loadSuppliers = () => {
  if (!isBrowser) return SEED_SUPPLIERS;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_SUPPLIERS));
    return SEED_SUPPLIERS;
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SEED_SUPPLIERS;
  } catch {
    return SEED_SUPPLIERS;
  }
};

export const saveSuppliers = (suppliers) => {
  if (!isBrowser) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(suppliers));
};

export const createEmptySupplierForm = () => ({
  nome: "",
  email: "",
  telefone: "",
  endereco: "",
  observacao: "",
  cnpj: "",
  uf: "",
  cidade: "",
  contato: "",
});

export const mapSupplierToForm = (supplier) => ({
  nome: supplier?.name || "",
  email: supplier?.email || "",
  telefone: supplier?.phone || "",
  endereco: supplier?.address || "",
  observacao: supplier?.note || "",
  cnpj: supplier?.document || "",
  uf: supplier?.state || "",
  cidade: supplier?.city || "",
  contato: supplier?.contact || "",
});

export const mapFormToSupplier = (formData, existingId) => ({
  id: existingId || `s-${Date.now()}`,
  name: formData.nome.trim(),
  contact: formData.contato.trim(),
  phone: formData.telefone.trim(),
  email: formData.email.trim(),
  city: formData.cidade.trim(),
  state: formData.uf,
  address: formData.endereco.trim(),
  document: formData.cnpj.trim(),
  note: formData.observacao.trim(),
});
