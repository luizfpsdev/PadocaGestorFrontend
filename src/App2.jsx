import { useState, useRef, useMemo } from "react";
import { useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis,
} from "recharts";

// THEME
const THEME_KEY = "custolab-theme";
const THEMES = {
  dark: {
    bg: "#07090f",
    surface: "#0e1117",
    border: "#1c2333",
    border2: "#252d3d",
    text: "#e2e8f0",
    muted: "#64748b",
    dim: "#334155",
    green: "#10b981",
    teal: "#f97316",
    amber: "#f59e0b",
    rose: "#f43f5e",
    violet: "#8b5cf6",
    blue: "#3b82f6",
    overlay: "rgba(0,0,0,.82)",
    shadow: "0 24px 80px rgba(0,0,0,.6)",
    hover: "0 8px 32px rgba(249,115,22,0.12)",
  },
  light: {
    bg: "#f4f7fb",
    surface: "#ffffff",
    border: "#e2e8f0",
    border2: "#cbd5e1",
    text: "#0f172a",
    muted: "#64748b",
    dim: "#94a3b8",
    green: "#059669",
    teal: "#ea580c",
    amber: "#d97706",
    rose: "#e11d48",
    violet: "#7c3aed",
    blue: "#2563eb",
    overlay: "rgba(15,23,42,.4)",
    shadow: "0 20px 60px rgba(15,23,42,.18)",
    hover: "0 8px 30px rgba(234,88,12,.18)",
  },
};
const C = { ...THEMES.dark };
const PALETTE = [C.teal, C.green, C.amber, C.rose, C.violet, C.blue];

// HELPERS
let _id = 1;
function uid() { return `id_${_id++}_${Math.random().toString(36).slice(2, 6)}`; }
function dAgo(n) { const d = new Date(); d.setDate(d.getDate() - n); return d; }
function dateInputOf(d) {
  if (typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
  const dt = new Date(d);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const day = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function fmt(n) { return `R$${Number(n).toFixed(2)}`; }
function fmtK(n) { return n >= 1000 ? `R$${(n / 1000).toFixed(1)}k` : fmt(n); }
function pct(a, b) { return b ? ((a - b) / b * 100).toFixed(1) + "%" : "—"; }
function normText(v) {
  return String(v || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}
function parseDelimitedLine(line, delim) {
  const out = [];
  let curr = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === "\"") {
      if (inQuotes && line[i + 1] === "\"") {
        curr += "\"";
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === delim && !inQuotes) {
      out.push(curr.trim());
      curr = "";
      continue;
    }
    curr += ch;
  }
  out.push(curr.trim());
  return out;
}
function parseCsvAuto(text) {
  const raw = String(text || "").replace(/^\uFEFF/, "");
  const lines = raw.split(/\r?\n/).filter(l => l.trim());
  if (!lines.length) return { headers: [], rows: [] };
  const first = lines[0];
  const semi = (first.match(/;/g) || []).length;
  const comma = (first.match(/,/g) || []).length;
  const delim = semi > comma ? ";" : ",";
  const headers = parseDelimitedLine(first, delim);
  const rows = lines.slice(1).map((line, i) => ({ line: i + 2, cells: parseDelimitedLine(line, delim) }));
  return { headers, rows };
}

// SEED DATA
const SEED_ING = [
  { id: "i1", name: "Farinha de Trigo", unit: "kg", price: 4.50 },
  { id: "i2", name: "Açúcar Refinado", unit: "kg", price: 3.80 },
  { id: "i3", name: "Manteiga", unit: "kg", price: 28.0 },
  { id: "i4", name: "Ovos", unit: "unid", price: 0.85 },
  { id: "i5", name: "Leite Integral", unit: "L", price: 5.20 },
  { id: "i6", name: "Chocolate em Pó 70%", unit: "kg", price: 22.0 },
  { id: "i7", name: "Cream Cheese", unit: "kg", price: 45.0 },
  { id: "i8", name: "Fermento", unit: "g", price: 0.05 },
  { id: "i9", name: "Sal", unit: "kg", price: 2.00 },
  { id: "i10", name: "Extrato de Baunilha", unit: "ml", price: 0.18 },
  { id: "i11", name: "Morango", unit: "kg", price: 16.0 },
  { id: "i12", name: "Leite Condensado", unit: "kg", price: 9.5 },
  { id: "i13", name: "Creme de Leite", unit: "kg", price: 8.9 },
  { id: "i14", name: "Nozes", unit: "kg", price: 52.0 },
  { id: "i15", name: "Coco Ralado", unit: "kg", price: 19.0 },
  { id: "i16", name: "Limão", unit: "kg", price: 7.8 },
];

// Products: made from ingredients, individually sellable
const SEED_PROD = [
  {
    id: "p1", name: "Massa Base Chocolate", category: "Massas", unit: "unid", yield: 1,
    description: "Base para bolos de chocolate",
    priceMode: "markup", markup: 1.6, manualPrice: null,
    ingredients: [
      { ingredientId: "i1", qty: 0.30 }, { ingredientId: "i2", qty: 0.25 },
      { ingredientId: "i3", qty: 0.15 }, { ingredientId: "i4", qty: 3 },
      { ingredientId: "i5", qty: 0.20 }, { ingredientId: "i6", qty: 0.10 },
      { ingredientId: "i8", qty: 5 },
    ],
  },
  {
    id: "p2", name: "Recheio Brigadeiro", category: "Recheios", unit: "kg", yield: 0.5,
    description: "Brigadeiro cremoso para recheio",
    priceMode: "markup", markup: 2.0, manualPrice: null,
    ingredients: [
      { ingredientId: "i2", qty: 0.20 }, { ingredientId: "i3", qty: 0.10 },
      { ingredientId: "i5", qty: 0.15 }, { ingredientId: "i6", qty: 0.08 },
    ],
  },
  {
    id: "p3", name: "Cobertura Ganache", category: "Coberturas", unit: "kg", yield: 0.4,
    description: "Ganache brilhante de chocolate",
    priceMode: "manual", markup: 2.0, manualPrice: 18.0,
    ingredients: [
      { ingredientId: "i6", qty: 0.20 }, { ingredientId: "i5", qty: 0.10 },
      { ingredientId: "i3", qty: 0.08 },
    ],
  },
  {
    id: "p4", name: "Base Cheesecake", category: "Massas", unit: "unid", yield: 1,
    description: "Base de biscoito para cheesecake",
    priceMode: "markup", markup: 1.8, manualPrice: null,
    ingredients: [
      { ingredientId: "i7", qty: 0.50 }, { ingredientId: "i2", qty: 0.15 },
      { ingredientId: "i4", qty: 4 }, { ingredientId: "i10", qty: 5 },
    ],
  },
  {
    id: "p5", name: "Calda de Frutas Vermelhas", category: "Caldas", unit: "L", yield: 0.3,
    description: "Calda artesanal para sobremesas",
    priceMode: "manual", markup: 2.0, manualPrice: 22.0,
    ingredients: [
      { ingredientId: "i2", qty: 0.10 }, { ingredientId: "i5", qty: 0.05 },
    ],
  },
  {
    id: "p6", name: "Mousse de Limão", category: "Recheios", unit: "kg", yield: 0.6,
    description: "Mousse leve de limão",
    priceMode: "markup", markup: 2.1, manualPrice: null,
    ingredients: [
      { ingredientId: "i12", qty: 0.30 }, { ingredientId: "i13", qty: 0.25 }, { ingredientId: "i16", qty: 0.10 },
    ],
  },
  {
    id: "p7", name: "Doce de Leite Cremoso", category: "Recheios", unit: "kg", yield: 0.7,
    description: "Recheio base de doce de leite",
    priceMode: "markup", markup: 2.0, manualPrice: null,
    ingredients: [
      { ingredientId: "i12", qty: 0.35 }, { ingredientId: "i13", qty: 0.20 }, { ingredientId: "i3", qty: 0.05 },
    ],
  },
  {
    id: "p8", name: "Ganache Branco", category: "Coberturas", unit: "kg", yield: 0.5,
    description: "Cobertura cremosa branca",
    priceMode: "manual", markup: 2.0, manualPrice: 21.0,
    ingredients: [
      { ingredientId: "i5", qty: 0.20 }, { ingredientId: "i3", qty: 0.12 }, { ingredientId: "i2", qty: 0.12 },
    ],
  },
  {
    id: "p9", name: "Crocante de Nozes", category: "Toppings", unit: "kg", yield: 0.4,
    description: "Finalização crocante",
    priceMode: "markup", markup: 2.4, manualPrice: null,
    ingredients: [
      { ingredientId: "i14", qty: 0.20 }, { ingredientId: "i2", qty: 0.10 }, { ingredientId: "i3", qty: 0.05 },
    ],
  },
  {
    id: "p10", name: "Brigadeiro Branco", category: "Recheios", unit: "kg", yield: 0.6,
    description: "Versão branca para bolos",
    priceMode: "markup", markup: 2.0, manualPrice: null,
    ingredients: [
      { ingredientId: "i12", qty: 0.30 }, { ingredientId: "i13", qty: 0.20 }, { ingredientId: "i3", qty: 0.08 },
    ],
  },
  {
    id: "p11", name: "Calda de Morango", category: "Caldas", unit: "L", yield: 0.4,
    description: "Calda artesanal de morango",
    priceMode: "manual", markup: 2.0, manualPrice: 24.0,
    ingredients: [
      { ingredientId: "i11", qty: 0.22 }, { ingredientId: "i2", qty: 0.08 },
    ],
  },
  {
    id: "p12", name: "Cobertura de Coco", category: "Coberturas", unit: "kg", yield: 0.5,
    description: "Cobertura cremosa de coco",
    priceMode: "markup", markup: 2.2, manualPrice: null,
    ingredients: [
      { ingredientId: "i15", qty: 0.20 }, { ingredientId: "i5", qty: 0.18 }, { ingredientId: "i2", qty: 0.10 },
    ],
  },
];

// Recipes: made ONLY of products
const SEED_REC = [
  {
    id: "r1", name: "Bolo de Chocolate Clássico", category: "Bolos",
    yield: 12, yieldUnit: "fatias", monthlyBatches: 8,
    markup: 2.5,
    image: "",
    products: [
      { productId: "p1", qty: 1 },
      { productId: "p2", qty: 1 },
      { productId: "p3", qty: 1 },
    ],
    createdAt: dAgo(40),
  },
  {
    id: "r2", name: "Cheesecake Premium", category: "Tortas",
    yield: 10, yieldUnit: "fatias", monthlyBatches: 5,
    markup: 3.0,
    image: "",
    products: [
      { productId: "p4", qty: 1 },
      { productId: "p5", qty: 1 },
    ],
    createdAt: dAgo(20),
  },
  {
    id: "r3", name: "Bolo Mousse de Limão", category: "Bolos",
    yield: 14, yieldUnit: "fatias", monthlyBatches: 6,
    markup: 2.6,
    image: "",
    products: [{ productId: "p1", qty: 1 }, { productId: "p6", qty: 1 }, { productId: "p8", qty: 1 }],
    createdAt: dAgo(15),
  },
  {
    id: "r4", name: "Bolo Nozes Crocante", category: "Bolos",
    yield: 12, yieldUnit: "fatias", monthlyBatches: 4,
    markup: 2.8,
    image: "",
    products: [{ productId: "p1", qty: 1 }, { productId: "p7", qty: 1 }, { productId: "p9", qty: 1 }],
    createdAt: dAgo(12),
  },
  {
    id: "r5", name: "Bolo Morango Nobre", category: "Bolos",
    yield: 14, yieldUnit: "fatias", monthlyBatches: 7,
    markup: 2.7,
    image: "",
    products: [{ productId: "p1", qty: 1 }, { productId: "p10", qty: 1 }, { productId: "p11", qty: 1 }],
    createdAt: dAgo(10),
  },
  {
    id: "r6", name: "Torta de Coco", category: "Tortas",
    yield: 10, yieldUnit: "fatias", monthlyBatches: 5,
    markup: 2.9,
    image: "",
    products: [{ productId: "p4", qty: 1 }, { productId: "p12", qty: 1 }],
    createdAt: dAgo(9),
  },
  {
    id: "r7", name: "Bolo Duo Chocolate", category: "Bolos",
    yield: 12, yieldUnit: "fatias", monthlyBatches: 8,
    markup: 2.6,
    image: "",
    products: [{ productId: "p1", qty: 1 }, { productId: "p2", qty: 1 }, { productId: "p8", qty: 1 }],
    createdAt: dAgo(8),
  },
  {
    id: "r8", name: "Cheesecake de Morango", category: "Tortas",
    yield: 10, yieldUnit: "fatias", monthlyBatches: 6,
    markup: 3.1,
    image: "",
    products: [{ productId: "p4", qty: 1 }, { productId: "p11", qty: 1 }],
    createdAt: dAgo(7),
  },
  {
    id: "r9", name: "Bolo Brigadeiro Branco", category: "Bolos",
    yield: 12, yieldUnit: "fatias", monthlyBatches: 6,
    markup: 2.5,
    image: "",
    products: [{ productId: "p1", qty: 1 }, { productId: "p10", qty: 1 }, { productId: "p12", qty: 1 }],
    createdAt: dAgo(6),
  },
  {
    id: "r10", name: "Torta Limão Especial", category: "Tortas",
    yield: 10, yieldUnit: "fatias", monthlyBatches: 5,
    markup: 3.0,
    image: "",
    products: [{ productId: "p4", qty: 1 }, { productId: "p6", qty: 1 }],
    createdAt: dAgo(5),
  },
];

const SEED_OP = [
  { id: "o1", name: "Energia Elétrica", category: "Energia Elétrica", costType: "Fixo", date: dateInputOf(dAgo(2)), amount: 850, recurrence: "monthly", note: "Média 3 meses" },
  { id: "o2", name: "Água e Esgoto", category: "Água", costType: "Fixo", date: dateInputOf(dAgo(5)), amount: 180, recurrence: "monthly", note: "" },
  { id: "o3", name: "Gás GLP", category: "Gás", costType: "Variável", date: dateInputOf(dAgo(8)), amount: 320, recurrence: "monthly", note: "" },
  { id: "o4", name: "Folha de Pagamento", category: "Folha de Pagamento", costType: "Fixo", date: dateInputOf(dAgo(10)), amount: 4200, recurrence: "monthly", note: "2 colaboradores" },
  { id: "o5", name: "Internet", category: "Internet", costType: "Fixo", date: dateInputOf(dAgo(12)), amount: 120, recurrence: "monthly", note: "" },
  { id: "o6", name: "Aluguel", category: "Aluguel", costType: "Fixo", date: dateInputOf(dAgo(15)), amount: 2500, recurrence: "monthly", note: "Cozinha industrial" },
];

const SEED_SUP = [
  { id: "s1", name: "Atacado Doce Sul", contact: "Marina", phone: "(11) 98888-1111", email: "vendas@docesul.com", city: "Sao Paulo", note: "Entrega 2x por semana" },
  { id: "s2", name: "Laticinios Serra", contact: "Rafael", phone: "(11) 97777-2222", email: "comercial@serra.com", city: "Campinas", note: "Prazo 14 dias" },
  { id: "s3", name: "Distribuidora Central", contact: "Carla", phone: "(11) 96666-3333", email: "pedido@dcentral.com", city: "Guarulhos", note: "" },
];

const ACCESS_PERMS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "receitas", label: "Receitas" },
  { key: "produtos", label: "Produtos" },
  { key: "comparativo", label: "Comparativo" },
  { key: "custos", label: "Custos Op." },
  { key: "fornecedores", label: "Fornecedores" },
  { key: "lucro", label: "Lucratividade" },
];

const SEED_ACCOUNT_USERS = [
  {
    id: "u_owner",
    name: "Usuario",
    email: "usuario@exemplo.com",
    role: "owner",
    active: true,
    perms: Object.fromEntries(ACCESS_PERMS.map(p => [p.key, true]))
  },
  {
    id: "u_fin",
    name: "Ana Financeiro",
    email: "ana.financeiro@exemplo.com",
    role: "financeiro",
    active: true,
    perms: { dashboard: true, receitas: true, produtos: false, comparativo: true, custos: true, fornecedores: false, lucro: true }
  },
  {
    id: "u_ops",
    name: "Carlos Operacao",
    email: "carlos.ops@exemplo.com",
    role: "operacao",
    active: true,
    perms: { dashboard: true, receitas: true, produtos: true, comparativo: false, custos: false, fornecedores: true, lucro: false }
  },
];

const OP_ICONS = { "Energia Elétrica": "\u26A1", "Água": "\uD83D\uDCA7", "Gás": "\uD83D\uDD25", "Folha de Pagamento": "\uD83D\uDC65", "Internet": "\uD83C\uDF10", "Aluguel": "\uD83C\uDFE0", "Manutenção": "\uD83D\uDD27", "Marketing": "\uD83D\uDCE3", "Outros": "\uD83D\uDCE6" };
const OP_CATS = Object.keys(OP_ICONS);
const OP_TYPES = ["Fixo", "Variável", "Extraordinário"];

// CALCULATIONS
function ingCostOfProduct(prod, ingredients) {
  return prod.ingredients.reduce((t, pi) => {
    const ing = ingredients.find(i => i.id === pi.ingredientId);
    return t + (ing ? ing.price * pi.qty : 0);
  }, 0);
}

function salePriceOfProduct(prod, ingredients) {
  const cost = ingCostOfProduct(prod, ingredients);
  if (prod.priceMode === "manual" && prod.manualPrice != null) return prod.manualPrice;
  return cost * prod.markup;
}

function costOfRecipe(recipe, products, ingredients) {
  return recipe.products.reduce((t, rp) => {
    const prod = products.find(p => p.id === rp.productId);
    if (!prod) return t;
    return t + salePriceOfProduct(prod, ingredients) * rp.qty;
  }, 0);
}

function toMonthly(oc) {
  if (oc.recurrence === "weekly") return oc.amount * 4.33;
  if (oc.recurrence === "annual") return oc.amount / 12;
  return oc.amount;
}

function opPerUnit(opCosts, recipes, recipeId) {
  const totalOp = opCosts.reduce((t, c) => t + toMonthly(c), 0);
  const totalU = recipes.reduce((t, r) => t + (r.monthlyBatches || 0) * (r.yield || 1), 0);
  if (!totalU) return 0;
  const recipe = recipes.find(r => r.id === recipeId);
  const myU = (recipe?.monthlyBatches || 0) * (recipe?.yield || 1);
  return (totalOp * (myU / totalU)) / myU;
}

function productSaleFromPriceMap(prod, priceMap) {
  const cost = prod.ingredients.reduce((t, pi) => t + ((priceMap[pi.ingredientId] || 0) * (parseFloat(pi.qty) || 0)), 0);
  return prod.priceMode === "manual" ? (parseFloat(prod.manualPrice) || 0) : cost * (parseFloat(prod.markup) || 1);
}

function recipeCostUnitFromPriceMap(recipe, prods, priceMap, opCosts, recipes) {
  const prodCost = recipe.products.reduce((t, rp) => {
    const p = prods.find(x => x.id === rp.productId);
    if (!p) return t;
    return t + productSaleFromPriceMap(p, priceMap) * (parseFloat(rp.qty) || 0);
  }, 0);
  return prodCost / (recipe.yield || 1) + opPerUnit(opCosts, recipes, recipe.id);
}

function recipeSaleUnitFromPriceMap(recipe, prods, priceMap, opCosts, recipes) {
  const totalU = recipeCostUnitFromPriceMap(recipe, prods, priceMap, opCosts, recipes);
  return totalU * (parseFloat(recipe.markup) || 1);
}

function priceTimelineFromHistory(ings, history, calcValue) {
  const currMap = Object.fromEntries(ings.map(i => [i.id, i.price]));
  const asc = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));
  if (!asc.length) return [{ date: new Date(), value: parseFloat(calcValue(currMap).toFixed(2)) }];

  const baseMap = { ...currMap };
  [...asc].reverse().forEach(h => { baseMap[h.ingredientId] = h.oldPrice; });

  const workMap = { ...baseMap };
  const points = asc.map(h => {
    workMap[h.ingredientId] = h.newPrice;
    return { date: new Date(h.date), value: parseFloat(calcValue(workMap).toFixed(2)) };
  });
  const latestValue = parseFloat(calcValue(currMap).toFixed(2));
  const last = points[points.length - 1];
  if (!last || last.value !== latestValue) points.push({ date: new Date(), value: latestValue });
  return points;
}

// Price history simulation for ingredients
function genHistory(ingredients) {
  const h = [];
  ingredients.forEach(ing => {
    let p = ing.price * 0.84;
    for (let i = 59; i >= 0; i--) {
      if (Math.random() < 0.15) {
        const np = Math.max(0.01, p + (Math.random() - 0.42) * p * 0.10);
        h.push({ id: uid(), ingredientId: ing.id, ingredientName: ing.name, oldPrice: p, newPrice: np, date: dAgo(i) });
        p = np;
      }
    }
    if (Math.abs(p - ing.price) > 0.01)
      h.push({ id: uid(), ingredientId: ing.id, ingredientName: ing.name, oldPrice: p, newPrice: ing.price, date: new Date() });
  });
  return h.sort((a, b) => a.date - b.date);
}

function recipeVersionSnapshot(recipe, version, changedAt, reason) {
  return {
    id: uid(),
    version,
    changedAt,
    reason,
    name: recipe.name,
    category: recipe.category,
    yield: recipe.yield,
    yieldUnit: recipe.yieldUnit,
    markup: recipe.markup,
    monthlyBatches: recipe.monthlyBatches,
    image: recipe.image,
    images: Array.isArray(recipe.images) ? recipe.images.filter(Boolean) : (recipe.image ? [recipe.image] : []),
    description: recipe.description || "",
    prepMode: recipe.prepMode || "",
    products: (recipe.products || []).map(p => ({ productId: p.productId, qty: p.qty })),
  };
}

function ensureRecipeVersions(recipe) {
  if (recipe?.versionHistory?.length) return recipe;
  const baseDate = recipe?.createdAt || new Date();
  return {
    ...recipe,
    versionHistory: [recipeVersionSnapshot(recipe, 1, baseDate, "create")],
  };
}

function withRecipeVersions(recipes) {
  return recipes.map(r => ensureRecipeVersions(r));
}

// ROOT
export default function App2() {
  const [themeMode, setThemeMode] = useState(() => {
    if (typeof window === "undefined") return "dark";
    const saved = window.localStorage.getItem(THEME_KEY);
    return saved === "light" ? "light" : "dark";
  });
  const [page, setPage] = useState("dashboard");
  const [recipeHistoryId, setRecipeHistoryId] = useState(null);
  const [ings, setIngs] = useState(SEED_ING);
  const [prods, setProds] = useState(SEED_PROD);
  const [recipes, setRecipes] = useState(() => withRecipeVersions(SEED_REC));
  const [opCosts, setOpCosts] = useState(SEED_OP);
  const [suppliers, setSuppliers] = useState(SEED_SUP);
  const [accountUsers, setAccountUsers] = useState(SEED_ACCOUNT_USERS);
  const [history, setHistory] = useState(() => genHistory(SEED_ING));
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const tRef = useRef();
  const isDark = themeMode === "dark";
  const loggedUserEmail = "usuario@exemplo.com";
  applyThemeStyles(themeMode);

  function showToast(msg, color = C.green) {
    setToast({ msg, color });
    clearTimeout(tRef.current);
    tRef.current = setTimeout(() => setToast(null), 3000);
  }

  function updateIngPrice(id, newPrice) {
    const ing = ings.find(i => i.id === id);
    if (!ing) return;
    setHistory(h => [...h, { id: uid(), ingredientId: id, ingredientName: ing.name, oldPrice: ing.price, newPrice, date: new Date() }]);
    setIngs(is => is.map(i => i.id === id ? { ...i, price: newPrice } : i));
    showToast(`${ing.name}: ${fmt(ing.price)} → ${fmt(newPrice)}`);
  }

  function toggleTheme() {
    setThemeMode(prev => {
      const next = prev === "dark" ? "light" : "dark";
      window.localStorage.setItem(THEME_KEY, next);
      return next;
    });
  }

  function handleLogout() {
    window.localStorage.removeItem("authToken");
    window.localStorage.removeItem("userEmail");
    setPage("dashboard");
  }

  const ctx = {
    ings, prods, recipes, opCosts, suppliers, history, setIngs, setProds, setRecipes, setOpCosts, setSuppliers, setHistory,
    updateIngPrice, showToast, setModal, setPage, recipeHistoryId, setRecipeHistoryId
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

  const totalOp = opCosts.reduce((t, c) => t + toMonthly(c), 0);
  const notifCount = Math.min(
    9,
    history.filter(h => (Date.now() - new Date(h.date).getTime()) <= 7 * 24 * 60 * 60 * 1000).length
  );

  return (
    <div style={S.root}>
      <style>{CSS}</style>

      {/* SIDEBAR */}
      <aside style={S.sidebar}>
        <div style={S.brand}>
          <div style={S.dot} />
          <span style={S.brandTxt}>CUSTO<span style={{ color: C.teal }}>LAB</span></span>
        </div>
        <nav style={S.nav}>
          {nav.map(({ key, label, Icon }) => {
            const on = page === key;
            return (
              <button key={key} style={{ ...S.navBtn, ...(on ? S.navOn : {}) }} onClick={() => setPage(key)}>
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
            aria-checked={!isDark}
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
              fontFamily: "'Mulish',sans-serif"
            }}
          >
            <span>{isDark ? "Dark mode" : "Light mode"}</span>
            <span
              style={{
                width: 44,
                height: 24,
                borderRadius: 999,
                background: isDark ? C.dim : C.teal + "33",
                border: `1px solid ${isDark ? C.border2 : C.teal + "66"}`,
                position: "relative",
                transition: "background .2s, border-color .2s"
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
                  transform: `translateX(${isDark ? 0 : 20}px)`,
                  transition: "transform .2s"
                }}
              >
                {isDark ? <IcoMoon sz={11} cl={C.muted} /> : <IcoSun sz={11} cl={C.amber} />}
              </span>
            </span>
          </button>
          <div style={S.sideChip}>
            <span style={S.sideChipLbl}>Op. Mensal</span>
            <span style={{ ...S.sideChipVal, color: C.rose }}>{fmtK(totalOp)}</span>
          </div>
          <div style={S.sideChip}>
            <span style={S.sideChipLbl}>Produtos</span>
            <span style={{ ...S.sideChipVal, color: C.teal }}>{prods.length}</span>
          </div>
          <button style={S.sidebarLogoutBtn} onClick={handleLogout}>
            <IcoLogout sz={14} cl={C.text} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={S.main}>
        <div style={S.topBar}>
          <span style={S.topBarTitle}>CustoLab</span>
          <div style={S.profileWrap}>
            <span style={S.profileEmail}>{loggedUserEmail}</span>
            <button
              style={{
                position: "relative",
                width: 30,
                height: 30,
                background: "transparent",
                border: "none",
                borderRadius: 0,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: C.text,
                padding: 0
              }}
              onClick={() => showToast(notifCount ? `${notifCount} notificação(ões) recente(s).` : "Sem notificações novas.", C.teal)}
              aria-label="Notificações"
            >
              <IcoBell sz={22} cl={C.teal} />
              {notifCount > 0 && (
                <span style={{
                  position: "absolute",
                  top: -4,
                  right: -6,
                  minWidth: 15,
                  height: 15,
                  padding: "0 3px",
                  borderRadius: 999,
                  background: C.rose,
                  color: "#fff",
                  fontSize: 9,
                  fontWeight: 700,
                  lineHeight: "15px",
                  textAlign: "center",
                  border: `1px solid ${C.surface}`
                }}>
                  {notifCount}
                </span>
              )}
            </button>
            <button
              style={{
                ...S.profileBtn,
                width: 34,
                height: 34,
                borderRadius: "50%",
                padding: 0,
                border: "none",
                background: "linear-gradient(135deg, #f59e0b, #f97316)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 12,
                fontFamily: "'Mulish',sans-serif",
                boxShadow: "0 2px 8px rgba(0,0,0,.22)"
              }}
              onClick={() => setPage("profile")}
              aria-label="Abrir perfil"
            >
              {String(loggedUserEmail || "U").charAt(0).toUpperCase()}
            </button>
          </div>
        </div>
        {page === "dashboard" && <PageDash    {...ctx} />}
        {page === "receitas" && <PageReceitas {...ctx} />}
        {page === "produtos" && <PageProdutos {...ctx} />}
        {page === "comparativo" && <PageComparativo {...ctx} />}
        {page === "custos" && <PageCustos  {...ctx} />}
        {page === "fornecedores" && <PageFornecedores {...ctx} />}
        {page === "lucro" && <PageLucro   {...ctx} />}
        {page === "receitaHistorico" && <PageReceitaHistorico {...ctx} />}
        {page === "profile" && (
          <PageProfile
            loggedUserEmail={loggedUserEmail}
            accountUsers={accountUsers}
            setAccountUsers={setAccountUsers}
            showToast={showToast}
          />
        )}
      </main>

      {/* MODALS */}
      {modal?.type === "prod" && <ModalProd prod={modal.data} ctx={ctx} onClose={() => setModal(null)} />}
      {modal?.type === "prodBulk" && <ModalProdBulk ctx={ctx} onClose={() => setModal(null)} />}
      {modal?.type === "recipe" && <ModalRecipe recipe={modal.data} ctx={ctx} onClose={() => setModal(null)} />}
      {modal?.type === "opcost" && <ModalOpCost oc={modal.data} ctx={ctx} onClose={() => setModal(null)} />}
      {modal?.type === "supplier" && <ModalSupplier supplier={modal.data} ctx={ctx} onClose={() => setModal(null)} />}
      {modal?.type === "prodDet" && <ModalProdDet prod={modal.data} ctx={ctx} onClose={() => setModal(null)} />}
      {modal?.type === "recDet" && <ModalRecDet recipe={modal.data} ctx={ctx} onClose={() => setModal(null)} />}
      <FloatingAIAssistant {...ctx} />

      {toast && <div style={{ ...S.toast, borderColor: toast.color, color: toast.color }}>{toast.msg}</div>}
    </div>
  );
}

// DASHBOARD
function PageDash({ ings, prods, recipes, opCosts, history, setModal }) {
  const totalOp = opCosts.reduce((t, c) => t + toMonthly(c), 0);
  const prodRevenue = prods.reduce((t, p) => t + salePriceOfProduct(p, ings), 0);
  const prodCost = prods.reduce((t, p) => t + ingCostOfProduct(p, ings), 0);
  const recRevenue = recipes.reduce((t, r) => {
    const cu = costOfRecipe(r, prods, ings) / r.yield + opPerUnit(opCosts, recipes, r.id);
    return t + cu * r.markup * r.yield * (r.monthlyBatches || 0);
  }, 0);
  const totalCost = prodCost + totalOp;
  const margin = recRevenue ? ((recRevenue - totalCost) / recRevenue * 100) : 0;

  // top products by margin
  const topProds = prods.map(p => {
    const cost = ingCostOfProduct(p, ings);
    const sale = salePriceOfProduct(p, ings);
    const m = sale ? ((sale - cost) / sale * 100) : 0;
    return { name: p.name, margin: parseFloat(m.toFixed(1)), cost: parseFloat(cost.toFixed(2)), sale: parseFloat(sale.toFixed(2)) };
  }).sort((a, b) => b.margin - a.margin);

  // cost vs price bars
  const prodBars = prods.slice(0, 6).map(p => ({
    name: p.name.split(" ").slice(0, 2).join(" "),
    custo: parseFloat(ingCostOfProduct(p, ings).toFixed(2)),
    venda: parseFloat(salePriceOfProduct(p, ings).toFixed(2)),
  }));

  // recent history
  const recent = [...history].sort((a, b) => b.date - a.date).slice(0, 6);

  // category pie
  const cats = {};
  prods.forEach(p => { cats[p.category] = (cats[p.category] || 0) + 1; });
  const pieData = Object.entries(cats).map(([name, value]) => ({ name, value }));

  return (
    <div style={S.page}>
      <Header eyebrow="Visão Geral" title="Dashboard" right={
        <div style={S.dateBadge}>{new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}</div>
      } />

      {/* KPIs */}
      <div style={{ ...S.grid4, marginBottom: 20 }}>
        {[
          { lbl: "Receita Mensal Est.", val: fmtK(recRevenue), color: C.teal, icon: "\uD83D\uDCB0" },
          { lbl: "Margem Líquida", val: `${margin.toFixed(1)}%`, color: margin > 25 ? C.green : C.amber, icon: "\uD83D\uDCC8" },
          { lbl: "Produtos Cadastrados", val: prods.length, color: C.violet, icon: "\uD83D\uDCE6" },
          { lbl: "Custo Op. Mensal", val: fmtK(totalOp), color: C.rose, icon: "\u26A1" },
        ].map((k, i) => (
          <KpiCard key={i} {...k} />
        ))}
      </div>

      {/* Charts row 1 */}
      <div style={{ ...S.row, marginBottom: 16 }}>
        <div style={{ ...S.card, flex: 2 }}>
          <ChartHeader title="Custo vs Preço de Venda por Produto" />
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={prodBars} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="name" tick={{ fill: C.muted, fontSize: 11 }} />
              <YAxis tick={{ fill: C.muted, fontSize: 11 }} tickFormatter={v => `R$${v}`} />
              <Tooltip contentStyle={TT} labelStyle={{ color: C.text }} itemStyle={{ color: C.text }} formatter={(v, n) => [fmt(v), n === "custo" ? "Custo Ing." : "Preço Venda"]} />
              <Bar dataKey="custo" fill={C.rose} radius={[4, 4, 0, 0]} name="custo" />
              <Bar dataKey="venda" fill={C.teal} radius={[4, 4, 0, 0]} name="venda" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ ...S.card, flex: 1 }}>
          <ChartHeader title="Produtos por Categoria" />
          <ResponsiveContainer width="100%" height={210}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={4}>
                {pieData.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
              </Pie>
              <Tooltip contentStyle={TT} labelStyle={{ color: C.text }} itemStyle={{ color: C.text }} />
              <Legend iconType="circle" wrapperStyle={{ color: C.muted, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div style={{ ...S.row, marginBottom: 16 }}>
        <div style={{ ...S.card, flex: 1 }}>
          <ChartHeader title="Ranking de Margem por Produto" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
            {topProds.map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ color: C.muted, fontSize: 11, width: 16, textAlign: "right" }}>{i + 1}</span>
                <span style={{ flex: 1, color: C.text, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</span>
                <div style={{ width: 100, height: 4, background: C.border, borderRadius: 2 }}>
                  <div style={{ width: `${Math.min(p.margin, 100)}%`, height: "100%", background: p.margin > 40 ? C.green : p.margin > 20 ? C.amber : C.rose, borderRadius: 2 }} />
                </div>
                <span style={{ color: p.margin > 40 ? C.green : p.margin > 20 ? C.amber : C.rose, fontFamily: "monospace", fontSize: 12, fontWeight: 700, width: 44, textAlign: "right" }}>{p.margin}%</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ ...S.card, flex: 1 }}>
          <ChartHeader title="Últimas Variações de Ingredientes" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {recent.map(h => {
              const up = h.newPrice > h.oldPrice;
              return (
                <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: up ? C.rose : C.green, flexShrink: 0 }} />
                  <span style={{ flex: 1, color: C.text, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.ingredientName}</span>
                  <span style={{ color: C.muted, fontSize: 11, textDecoration: "line-through" }}>{fmt(h.oldPrice)}</span>
                  <span style={{ color: up ? C.rose : C.green, fontWeight: 700, fontSize: 12 }}>{fmt(h.newPrice)}</span>
                  <span style={{ color: up ? C.rose : C.green, fontSize: 11, fontFamily: "monospace" }}>{up ? "+" : ""}{pct(h.newPrice, h.oldPrice)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function PageProfile({ loggedUserEmail, accountUsers, setAccountUsers, showToast }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("operacao");
  const [active, setActive] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [perms, setPerms] = useState(() => Object.fromEntries(ACCESS_PERMS.map(p => [p.key, false])));

  const owner = accountUsers.find(u => u.email.toLowerCase() === String(loggedUserEmail || "").toLowerCase()) || accountUsers[0];

  function resetForm() {
    setName("");
    setEmail("");
    setRole("operacao");
    setActive(true);
    setEditingId(null);
    setPerms(Object.fromEntries(ACCESS_PERMS.map(p => [p.key, false])));
  }

  function saveUser() {
    if (!name.trim() || !email.trim()) {
      showToast("Informe nome e email do usuario.", C.rose);
      return;
    }
    const normalizedEmail = email.trim().toLowerCase();
    const duplicated = accountUsers.some(u => u.email.toLowerCase() === normalizedEmail && u.id !== editingId);
    if (duplicated) {
      showToast("Ja existe usuario com este email vinculado.", C.rose);
      return;
    }
    const data = {
      id: editingId || uid(),
      name: name.trim(),
      email: normalizedEmail,
      role,
      active: role === "owner" ? true : !!active,
      perms: role === "owner" ? Object.fromEntries(ACCESS_PERMS.map(p => [p.key, true])) : { ...perms }
    };
    if (editingId) {
      setAccountUsers(us => us.map(u => u.id === editingId ? data : u));
      showToast("Usuario atualizado com sucesso!");
    } else {
      setAccountUsers(us => [...us, data]);
      showToast("Usuario vinculado com sucesso!");
    }
    resetForm();
  }

  function startEdit(user) {
    setEditingId(user.id);
    setName(user.name || "");
    setEmail(user.email || "");
    setRole(user.role || "operacao");
    setActive(!!user.active);
    setPerms(Object.fromEntries(ACCESS_PERMS.map(p => [p.key, !!user.perms?.[p.key]])));
  }

  function removeUser(user) {
    if (user.role === "owner") {
      showToast("Não é possível remover o usuário owner.", C.rose);
      return;
    }
    setAccountUsers(us => us.filter(u => u.id !== user.id));
    if (editingId === user.id) resetForm();
    showToast("Usuario removido da conta.", C.amber);
  }

  function toggleUserActive(user) {
    if (user.role === "owner") return;
    setAccountUsers(us => us.map(u => u.id === user.id ? { ...u, active: !u.active } : u));
    showToast(user.active ? "Usuario desativado." : "Usuario ativado.", user.active ? C.rose : C.green);
  }

  return (
    <div style={S.page}>
      <Header eyebrow="Conta" title="Perfil" right={<Tag color={C.teal}>Ativo</Tag>} />

      <div style={{ ...S.card, maxWidth: 980 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: C.border, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${C.border2}` }}>
            <IcoProfile sz={24} cl={C.teal} />
          </div>
          <div>
            <div style={{ color: C.text, fontSize: 18, fontWeight: 700 }}>Seu Perfil</div>
            <div style={{ color: C.muted, fontSize: 13 }}>Gerencie usuarios vinculados e permissoes de acesso</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div style={{ background: C.border, border: `1px solid ${C.border2}`, borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ color: C.muted, fontSize: 11, marginBottom: 6 }}>Nome</div>
            <div style={{ color: C.text, fontWeight: 600 }}>{owner?.name || "Usuario"}</div>
          </div>
          <div style={{ background: C.border, border: `1px solid ${C.border2}`, borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ color: C.muted, fontSize: 11, marginBottom: 6 }}>Email</div>
            <div style={{ color: C.text, fontWeight: 600 }}>{loggedUserEmail}</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.8fr", gap: 16 }}>
          <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: 12 }}>
            <div style={{ color: C.text, fontSize: 14, fontWeight: 700, marginBottom: 10 }}>
              {editingId ? "Editar Usuario Vinculado" : "Vincular Novo Usuario"}
            </div>
            <Field label="Nome">
              <input style={S.inp} value={name} onChange={e => setName(e.target.value)} placeholder="Nome completo" />
            </Field>
            <div style={{ height: 8 }} />
            <Field label="Email">
              <input style={S.inp} value={email} onChange={e => setEmail(e.target.value)} placeholder="usuario@empresa.com" />
            </Field>
            <div style={{ height: 8 }} />
            <Field label="Perfil">
              <select style={S.inp} value={role} onChange={e => setRole(e.target.value)}>
                <option value="owner">Owner</option>
                <option value="financeiro">Financeiro</option>
                <option value="operacao">Operação</option>
                <option value="analista">Analista</option>
              </select>
            </Field>
            <div style={{ height: 8 }} />
            <Field label="Permissoes de acesso" span>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {ACCESS_PERMS.map(p => (
                  <div key={p.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, border: `1px solid ${C.border}`, borderRadius: 10, padding: "7px 9px", background: C.surface }}>
                    <span style={{ color: C.text, fontSize: 12 }}>{p.label}</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={!!perms[p.key]}
                      onClick={() => setPerms(v => ({ ...v, [p.key]: !v[p.key] }))}
                      style={{
                        width: 38,
                        height: 22,
                        borderRadius: 999,
                        border: `1px solid ${perms[p.key] ? C.teal + "66" : C.border2}`,
                        background: perms[p.key] ? C.teal + "33" : C.border,
                        position: "relative",
                        cursor: "pointer"
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          top: 1,
                          left: 1,
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          background: C.surface,
                          border: `1px solid ${C.border2}`,
                          transform: `translateX(${perms[p.key] ? 16 : 0}px)`,
                          transition: "transform .18s ease"
                        }}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </Field>
            <div style={{ height: 8 }} />
            <label style={{ display: "flex", alignItems: "center", gap: 8, color: C.text, fontSize: 12 }}>
              <input type="checkbox" checked={role === "owner" ? true : active} onChange={e => setActive(e.target.checked)} disabled={role === "owner"} />
              Usuário ativo {role === "owner" ? "(obrigatório para owner)" : ""}
            </label>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button style={S.btnPrimary} onClick={saveUser}>{editingId ? "Salvar Alteracoes" : "Vincular Usuario"}</button>
              {editingId && <button style={S.btnOutline} onClick={resetForm}>Cancelar</button>}
            </div>
          </div>

          <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: 12 }}>
            <div style={{ color: C.text, fontSize: 14, fontWeight: 700, marginBottom: 10 }}>
              Usuarios Vinculados ({accountUsers.length})
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {accountUsers.map(user => {
                const granted = ACCESS_PERMS.filter(p => user.perms?.[p.key]).length;
                return (
                  <div key={user.id} style={{ border: `1px solid ${C.border}`, borderRadius: 10, background: C.surface, padding: "10px 12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ color: C.text, fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</span>
                          <Tag color={user.active ? C.green : C.rose}>{user.active ? "Ativo" : "Inativo"}</Tag>
                          <Tag color={C.violet}>{user.role}</Tag>
                        </div>
                        <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{user.email}</div>
                        <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>
                          {granted}/{ACCESS_PERMS.length} permissao(oes) concedida(s)
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                        <IcoBtn onClick={() => startEdit(user)}>{"\u270F\uFE0F"}</IcoBtn>
                        <IcoBtn onClick={() => toggleUserActive(user)}>{user.active ? "⏸" : "▶"}</IcoBtn>
                        <IcoBtn onClick={() => removeUser(user)}>{"\uD83D\uDDD1\uFE0F"}</IcoBtn>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// PRODUTOS
function PageProdutos({ ings, prods, recipes, suppliers, history, setProds, setModal, showToast }) {
  const PAGE_SIZE = 8;
  const [search, setSearch] = useState("");
  const [selId, setSelId] = useState(prods[0]?.id);
  const filtered = prods.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  const [listPage, setListPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(listPage, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const sel = prods.find(p => p.id === selId);

  // ingredient cost breakdown for selected product
  const ingBreak = sel ? sel.ingredients.map(pi => {
    const ing = ings.find(i => i.id === pi.ingredientId);
    return { name: (ing?.name || "?").split(" ").slice(0, 2).join(" "), value: parseFloat(((ing?.price || 0) * pi.qty).toFixed(2)) };
  }) : [];

  const usedInRecipes = sel ? recipes.filter(r => r.products.some(rp => rp.productId === sel.id)) : [];
  const prodHistory = useMemo(() => {
    if (!sel) return [];
    const tl = priceTimelineFromHistory(ings, history, (priceMap) => productSaleFromPriceMap(sel, priceMap));
    return tl.slice(-12).map(p => ({
      date: p.date,
      label: new Date(p.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      value: p.value
    }));
  }, [sel, ings, history]);

  return (
    <div style={S.page}>
      <Header eyebrow="Gestão" title="Produtos" right={
        <div style={{ display: "flex", gap: 8 }}>
          <button style={S.btnOutline} onClick={() => setModal({ type: "prodBulk" })}>Importar Planilha</button>
          <button style={S.btnPrimary} onClick={() => setModal({ type: "prod" })}>+ Novo Produto</button>
        </div>
      } />

      <div style={{ display: "flex", gap: 20 }}>
        {/* LIST */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <input style={S.search} placeholder="Buscar produto..." value={search} onChange={e => { setSearch(e.target.value); setListPage(1); }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {paged.map(p => {
              const cost = ingCostOfProduct(p, ings);
              const sale = salePriceOfProduct(p, ings);
              const mrg = sale ? ((sale - cost) / sale * 100) : 0;
              const active = p.id === selId;
              const inRec = recipes.some(r => r.products.some(rp => rp.productId === p.id));
              const supplierName = suppliers.find(s => s.id === p.supplierId)?.name || "Sem fornecedor";
              return (
                <div key={p.id} style={{ ...S.listRow, ...(active ? S.listRowOn : {}) }} onClick={() => setSelId(p.id)}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <Tag color={C.teal}>{p.category}</Tag>
                      <span style={S.listName}>{p.name}</span>
                      {inRec && <Tag color={C.violet}>Em receitas</Tag>}
                    </div>
                    <div style={{ color: C.muted, fontSize: 12, marginTop: 3 }}>
                      {p.priceMode === "manual" ? "Preço manual" : `Markup ${p.markup}×`} · Rendimento: {p.yield} {p.unit}
                    </div>
                    <div style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>
                      Fornecedor: {supplierName}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ color: C.teal, fontFamily: "monospace", fontWeight: 700, fontSize: 14 }}>{fmt(sale)}</div>
                    <div style={{ color: mrg > 30 ? C.green : mrg > 15 ? C.amber : C.rose, fontSize: 11, fontFamily: "monospace" }}>margem {mrg.toFixed(1)}%</div>
                  </div>
                  <div style={S.rowActs} onClick={e => e.stopPropagation()}>
                    <IcoBtn onClick={() => setModal({ type: "prodDet", data: p })}>{"\uD83D\uDD0D"}</IcoBtn>
                    <IcoBtn onClick={() => setModal({ type: "prod", data: p })}>{"\u270F\uFE0F"}</IcoBtn>
                    <IcoBtn onClick={() => { setProds(ps => ps.filter(x => x.id !== p.id)); showToast("Produto removido", C.rose); }}>{"\uD83D\uDDD1\uFE0F"}</IcoBtn>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && <div style={S.empty}>Nenhum produto encontrado</div>}
            {filtered.length > 0 && (
              <PaginationBar page={currentPage} totalPages={totalPages} onChange={setListPage} />
            )}
          </div>
        </div>

        {/* DETAIL PANEL */}
        {sel && (
          <div style={{ width: 340, flexShrink: 0 }}>
            <div style={S.card}>
              <div style={{ marginBottom: 12 }}>
                <div style={{ color: C.teal, fontSize: 10, fontWeight: 700, letterSpacing: 2, marginBottom: 4 }}>{sel.category}</div>
                <div style={{ color: C.text, fontWeight: 700, fontSize: 16 }}>{sel.name}</div>
                <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>
                  Fornecedor: {suppliers.find(s => s.id === sel.supplierId)?.name || "Sem fornecedor"}
                </div>
                {sel.description && <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{sel.description}</div>}
              </div>
              <ChartHeader title="Composição do Custo" />
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={ingBreak} innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                    {ingBreak.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={TT} labelStyle={{ color: C.text }} itemStyle={{ color: C.text }} formatter={v => [fmt(v)]} />
                </PieChart>
              </ResponsiveContainer>
              {/* stats */}
              {(() => {
                const cost = ingCostOfProduct(sel, ings);
                const sale = salePriceOfProduct(sel, ings);
                const mrg = sale ? ((sale - cost) / sale * 100) : 0;
                return (
                  <div style={S.quickStats}>
                    {[
                      { l: "Custo Ingredientes", v: fmt(cost), c: C.text },
                      { l: "Preço de Venda", v: fmt(sale), c: C.teal },
                      { l: "Margem", v: `${mrg.toFixed(1)}%`, c: mrg > 30 ? C.green : mrg > 15 ? C.amber : C.rose },
                      { l: "Modo de Preço", v: sel.priceMode === "manual" ? "Manual" : `Markup ${sel.markup}×`, c: C.muted },
                    ].map((s, i) => (
                      <div key={i} style={S.quickRow}>
                        <span style={{ color: C.muted, fontSize: 12 }}>{s.l}</span>
                        <span style={{ color: s.c, fontFamily: "monospace", fontSize: 12, fontWeight: 700 }}>{s.v}</span>
                      </div>
                    ))}
                  </div>
                );
              })()}
              {usedInRecipes.length > 0 && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
                  <div style={{ color: C.muted, fontSize: 11, marginBottom: 6 }}>USADO NAS RECEITAS</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {usedInRecipes.map(r => <Tag key={r.id} color={C.violet}>{r.name}</Tag>)}
                  </div>
                </div>
              )}
              {prodHistory.length > 1 && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
                  <ChartHeader title="Histórico de Preço" sub="por produto" />
                  <ResponsiveContainer width="100%" height={140}>
                    <LineChart data={prodHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                      <XAxis dataKey="label" tick={{ fill: C.muted, fontSize: 10 }} />
                      <YAxis tick={{ fill: C.muted, fontSize: 10 }} tickFormatter={(v) => fmt(v)} width={62} />
                      <Tooltip contentStyle={TT} labelStyle={{ color: C.text }} itemStyle={{ color: C.text }} formatter={(v) => [fmt(v), "Preço"]} labelFormatter={(_, p) => p?.[0]?.payload?.date ? new Date(p[0].payload.date).toLocaleDateString("pt-BR") : ""} />
                      <Line type="monotone" dataKey="value" stroke={C.teal} strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PageComparativo({ ings, prods, history }) {
  const [leftProdId, setLeftProdId] = useState(prods[0]?.id || "");
  const [rightProdId, setRightProdId] = useState(prods[1]?.id || prods[0]?.id || "");

  const leftProd = prods.find(p => p.id === leftProdId);
  const rightProd = prods.find(p => p.id === rightProdId);

  function costFromPriceMap(prod, priceMap) {
    if (!prod) return 0;
    return prod.ingredients.reduce((t, pi) => t + ((priceMap[pi.ingredientId] || 0) * (parseFloat(pi.qty) || 0)), 0);
  }

  const leftTl = useMemo(() => {
    if (!leftProd) return [];
    return priceTimelineFromHistory(ings, history, priceMap => costFromPriceMap(leftProd, priceMap)).slice(-20);
  }, [leftProd, ings, history]);

  const rightTl = useMemo(() => {
    if (!rightProd) return [];
    return priceTimelineFromHistory(ings, history, priceMap => costFromPriceMap(rightProd, priceMap)).slice(-20);
  }, [rightProd, ings, history]);

  const chartData = useMemo(() => {
    const byDate = new Map();
    leftTl.forEach(p => {
      const k = new Date(p.date).toLocaleDateString("pt-BR");
      byDate.set(k, { label: k, left: p.value, right: null, rawDate: p.date });
    });
    rightTl.forEach(p => {
      const k = new Date(p.date).toLocaleDateString("pt-BR");
      const prev = byDate.get(k) || { label: k, left: null, right: null, rawDate: p.date };
      prev.right = p.value;
      prev.rawDate = p.date;
      byDate.set(k, prev);
    });
    return Array.from(byDate.values()).sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate));
  }, [leftTl, rightTl]);

  const leftCurr = leftProd ? ingCostOfProduct(leftProd, ings) : 0;
  const rightCurr = rightProd ? ingCostOfProduct(rightProd, ings) : 0;
  const diffCurr = leftCurr - rightCurr;
  const leftVar = leftTl.length > 1 ? pct(leftTl[leftTl.length - 1].value, leftTl[0].value) : "—";
  const rightVar = rightTl.length > 1 ? pct(rightTl[rightTl.length - 1].value, rightTl[0].value) : "—";

  return (
    <div style={S.page}>
      <Header eyebrow="Análise" title="Comparativo de Custo no Tempo" />

      <div style={{ ...S.card, marginBottom: 18 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          <select style={S.inp} value={leftProdId} onChange={e => setLeftProdId(e.target.value)}>
            {!prods.length && <option value="">Nenhum produto</option>}
            {prods.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select style={S.inp} value={rightProdId} onChange={e => setRightProdId(e.target.value)}>
            {!prods.length && <option value="">Nenhum produto</option>}
            {prods.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        {leftProdId && rightProdId && leftProdId === rightProdId && (
          <div style={{ color: C.amber, fontSize: 12, marginBottom: 10 }}>
            Selecione produtos diferentes para comparar.
          </div>
        )}

        {leftProdId && rightProdId && leftProdId !== rightProdId && (
          <>
            <div style={{ display: "flex", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
              <Tag color={C.teal}>{leftProd?.name || "Produto A"}: {fmt(leftCurr)} ({leftVar})</Tag>
              <Tag color={C.violet}>{rightProd?.name || "Produto B"}: {fmt(rightCurr)} ({rightVar})</Tag>
              <Tag color={diffCurr <= 0 ? C.green : C.rose}>Diferença atual: {diffCurr > 0 ? "+" : ""}{fmt(diffCurr)}</Tag>
            </div>

            <ChartHeader title="Custo de Produção ao Longo do Tempo" sub="baseado no histórico de preços de ingredientes" />
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="label" tick={{ fill: C.muted, fontSize: 11 }} />
                <YAxis tick={{ fill: C.muted, fontSize: 11 }} tickFormatter={v => fmt(v)} width={72} />
                <Tooltip contentStyle={TT} labelStyle={{ color: C.text }} itemStyle={{ color: C.text }} formatter={(v, n) => [fmt(v), n === "left" ? (leftProd?.name || "Produto A") : (rightProd?.name || "Produto B")]} />
                <Legend />
                <Line type="monotone" dataKey="left" name={leftProd?.name || "Produto A"} stroke={C.teal} strokeWidth={2.5} dot={{ r: 2 }} activeDot={{ r: 4 }} />
                <Line type="monotone" dataKey="right" name={rightProd?.name || "Produto B"} stroke={C.violet} strokeWidth={2.5} dot={{ r: 2 }} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </>
        )}
      </div>
    </div>
  );
}

function FloatingAIAssistant({ ings, prods, recipes, opCosts, suppliers, history, showToast }) {
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState(() => window.localStorage.getItem("ia-openai-key") || "");
  const [model, setModel] = useState(() => window.localStorage.getItem("ia-openai-model") || "gpt-4.1-mini");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [useCtx, setUseCtx] = useState(true);
  const [messages, setMessages] = useState(() => [
    {
      id: uid(),
      role: "assistant",
      content: "Sou seu assistente de negócio. Pergunte sobre custos, margem, precificação, tendências e operação.",
      at: new Date()
    }
  ]);

  const businessSnapshot = useMemo(() => {
    const totalOp = opCosts.reduce((t, c) => t + toMonthly(c), 0);
    const recRevenue = recipes.reduce((t, r) => {
      const cu = costOfRecipe(r, prods, ings) / (r.yield || 1) + opPerUnit(opCosts, recipes, r.id);
      return t + cu * (r.markup || 1) * (r.yield || 1) * (r.monthlyBatches || 0);
    }, 0);
    const topExpIng = [...ings].sort((a, b) => (b.price || 0) - (a.price || 0))[0];
    const bestMargin = [...prods].map(p => {
      const cost = ingCostOfProduct(p, ings);
      const sale = salePriceOfProduct(p, ings);
      const m = sale ? ((sale - cost) / sale * 100) : 0;
      return { name: p.name, margin: m };
    }).sort((a, b) => b.margin - a.margin)[0];
    const recentChanges = [...history].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    return {
      totalOp,
      recRevenue,
      topExpIng,
      bestMargin,
      recentChanges
    };
  }, [ings, prods, recipes, opCosts, history]);

  function saveAiConfig() {
    window.localStorage.setItem("ia-openai-key", apiKey);
    window.localStorage.setItem("ia-openai-model", model);
    showToast("Configuracao do assistente salva.", C.green);
  }

  function fallbackAnswer(q) {
    const t = q.toLowerCase();
    if (t.includes("custo")) {
      return `Custo operacional mensal estimado: ${fmt(businessSnapshot.totalOp)}. O ingrediente mais caro hoje e ${businessSnapshot.topExpIng?.name || "-"} (${fmt(businessSnapshot.topExpIng?.price || 0)}).`;
    }
    if (t.includes("margem") || t.includes("lucro")) {
      return `Receita mensal estimada: ${fmtK(businessSnapshot.recRevenue)}. Produto com melhor margem no momento: ${businessSnapshot.bestMargin?.name || "-"} (${(businessSnapshot.bestMargin?.margin || 0).toFixed(1)}%).`;
    }
    if (t.includes("fornecedor")) {
      return `Você possui ${suppliers.length} fornecedor(es) cadastrado(s). Posso sugerir critérios de avaliação (preço, prazo, ruptura, qualidade) se quiser.`;
    }
    return `Resumo atual: ${prods.length} produtos, ${recipes.length} receitas, ${ings.length} ingredientes e custo operacional de ${fmt(businessSnapshot.totalOp)} por mes.`;
  }

  async function askAI(text) {
    const trimmed = String(text || "").trim();
    if (!trimmed || loading) return;

    const userMsg = { id: uid(), role: "user", content: trimmed, at: new Date() };
    setMessages(ms => [...ms, userMsg]);
    setQuestion("");
    setLoading(true);

    try {
      if (!apiKey.trim()) {
        const fb = fallbackAnswer(trimmed);
        setMessages(ms => [...ms, { id: uid(), role: "assistant", content: `${fb}\n\nPara respostas generativas completas, informe sua OpenAI API key acima.`, at: new Date() }]);
        return;
      }

      const contextText = useCtx
        ? `Contexto do negócio:
- Ingredientes: ${ings.length}
- Produtos: ${prods.length}
- Receitas: ${recipes.length}
- Fornecedores: ${suppliers.length}
- Custo operacional mensal: ${fmt(businessSnapshot.totalOp)}
- Receita mensal estimada: ${fmtK(businessSnapshot.recRevenue)}
- Ingrediente mais caro: ${businessSnapshot.topExpIng?.name || "-"} (${fmt(businessSnapshot.topExpIng?.price || 0)})
- Melhor margem: ${businessSnapshot.bestMargin?.name || "-"} (${(businessSnapshot.bestMargin?.margin || 0).toFixed(1)}%)
- Ultimas variacoes de insumos:
${businessSnapshot.recentChanges.map(h => `  * ${h.ingredientName}: ${fmt(h.oldPrice)} -> ${fmt(h.newPrice)} (${new Date(h.date).toLocaleDateString("pt-BR")})`).join("\n")}`
        : "";

      const body = {
        model: model || "gpt-4.1-mini",
        input: [
          {
            role: "system",
            content: [
              {
                type: "input_text",
                text: "Você é um consultor de gestão para confeitaria. Responda em português do Brasil, objetivo, com foco em ação e números."
              }
            ]
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: `${contextText}\n\nPergunta do usuario: ${trimmed}`
              }
            ]
          }
        ],
        temperature: 0.3,
        max_output_tokens: 700
      };

      const res = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey.trim()}`
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const errTxt = await res.text();
        throw new Error(errTxt || "Falha na chamada da API");
      }

      const data = await res.json();
      const content = data?.output_text
        || data?.output?.map(o => (o.content || []).map(c => c.text || "").join("")).join("\n").trim()
        || "Não consegui gerar resposta agora.";

      setMessages(ms => [...ms, { id: uid(), role: "assistant", content, at: new Date() }]);
    } catch (err) {
      const msg = String(err?.message || err || "Erro desconhecido");
      setMessages(ms => [...ms, { id: uid(), role: "assistant", content: `Erro ao consultar IA: ${msg}`, at: new Date() }]);
      showToast("Falha ao consultar IA.", C.rose);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ position: "fixed", right: 18, bottom: 18, zIndex: 30 }}>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            border: `2px solid ${C.teal}`,
            background: C.teal,
            color: "#ffffff",
            boxShadow: "0 10px 28px rgba(0,0,0,.28)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 1,
            fontSize: 22
          }}
          aria-label="Abrir assistente IA"
        >
          <IcoChatSpark sz={24} cl="#ffffff" />
          </button>
      )}

      {open && (
        <div style={{ width: 420, maxWidth: "calc(100vw - 24px)", height: 600, maxHeight: "calc(100vh - 40px)", background: C.surface, border: `1px solid ${C.border2}`, borderRadius: 14, boxShadow: C.shadow, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "10px 12px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ color: C.text, fontWeight: 700, fontSize: 14 }}>Assistente IA</div>
              <div style={{ color: C.muted, fontSize: 11 }}>Pergunte sobre seu negócio</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button style={{ ...S.btnOutline, padding: "6px 10px", fontSize: 11 }} onClick={saveAiConfig}>Salvar</button>
              <button style={{ ...S.btnOutline, padding: "6px 10px", fontSize: 11 }} onClick={() => setOpen(false)}>Fechar</button>
            </div>
          </div>

          <div style={{ padding: 10, borderBottom: `1px solid ${C.border}`, display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 8 }}>
            <input style={{ ...S.inp, fontSize: 12 }} type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="OpenAI Key (sk-...)" />
            <input style={{ ...S.inp, fontSize: 12 }} value={model} onChange={e => setModel(e.target.value)} placeholder="Modelo" />
            <button style={{ ...S.btnOutline, fontSize: 11, padding: "8px 10px" }} onClick={() => setUseCtx(v => !v)}>
              Ctx: {useCtx ? "ON" : "OFF"}
            </button>
          </div>

          <div style={{ padding: "8px 10px", borderBottom: `1px solid ${C.border}`, display: "flex", gap: 6, flexWrap: "wrap" }}>
            {[
              "Melhor margem hoje?",
              "Como reduzir custos?",
              "Risco de insumos?",
              "Priorizar receitas?"
            ].map(q => (
              <button key={q} style={{ ...S.btnOutline, fontSize: 11, padding: "5px 8px" }} onClick={() => askAI(q)}>{q}</button>
            ))}
          </div>

          <div style={{ flex: 1, overflow: "auto", padding: 10, display: "flex", flexDirection: "column", gap: 8 }}>
            {messages.map(m => (
              <div
                key={m.id}
                style={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "86%",
                  background: m.role === "user" ? C.teal + "22" : C.border,
                  border: `1px solid ${m.role === "user" ? C.teal + "44" : C.border2}`,
                  borderRadius: 10,
                  padding: "8px 10px"
                }}
              >
                <div style={{ color: m.role === "user" ? C.teal : C.text, fontSize: 11, fontWeight: 700, marginBottom: 3 }}>
                  {m.role === "user" ? "Você" : "Assistente"}
                </div>
                <div style={{ color: C.text, fontSize: 12, lineHeight: 1.45, whiteSpace: "pre-wrap" }}>{m.content}</div>
              </div>
            ))}
            {loading && <div style={{ color: C.muted, fontSize: 12 }}>Assistente pensando...</div>}
          </div>

          <div style={{ borderTop: `1px solid ${C.border}`, padding: 10, display: "grid", gridTemplateColumns: "1fr auto", gap: 8 }}>
            <textarea
              style={{ ...S.inp, minHeight: 72, resize: "vertical", fontSize: 12 }}
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="Pergunte qualquer coisa sobre o negócio..."
            />
            <button style={{ ...S.btnPrimary, minWidth: 90 }} onClick={() => askAI(question)} disabled={loading}>
              {loading ? "..." : "Enviar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// RECEITAS
function PageReceitas({ ings, prods, recipes, opCosts, history, setRecipes, setModal, showToast, setPage, setRecipeHistoryId }) {
  const [pageSize, setPageSize] = useState(8);
  const [search, setSearch] = useState("");
  const [catFilters, setCatFilters] = useState([]);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [selId, setSelId] = useState(recipes[0]?.id);
  const categories = useMemo(
    () => Array.from(new Set(recipes.map(r => (r.category || "").trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
    [recipes]
  );
  const filtered = recipes.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
    && (!catFilters.length || catFilters.includes(r.category))
  );
  const sorted = useMemo(() => {
    const dir = sortDir === "asc" ? 1 : -1;
    const saleUnitOf = (r) => {
      const cost = costOfRecipe(r, prods, ings);
      const opU = opPerUnit(opCosts, recipes, r.id);
      const totalU = cost / (r.yield || 1) + opU;
      return totalU * (r.markup || 1);
    };
    return [...filtered].sort((a, b) => {
      let av = 0;
      let bv = 0;
      if (sortBy === "name") {
        av = String(a.name || "").toLowerCase();
        bv = String(b.name || "").toLowerCase();
        return av.localeCompare(bv, "pt-BR") * dir;
      }
      if (sortBy === "price") {
        av = saleUnitOf(a);
        bv = saleUnitOf(b);
        return (av - bv) * dir;
      }
      av = new Date(a.createdAt || 0).getTime();
      bv = new Date(b.createdAt || 0).getTime();
      return (av - bv) * dir;
    });
  }, [filtered, sortBy, sortDir, prods, ings, opCosts, recipes]);
  const [listPage, setListPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(listPage, totalPages);
  const paged = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const sel = recipes.find(r => r.id === selId);
  function handleSortChange(val) {
    setSortBy(val);
    setListPage(1);
    if (val === "name") setSortDir("asc");
    else setSortDir("desc");
  }

  const prodBreak = sel ? sel.products.map(rp => {
    const p = prods.find(x => x.id === rp.productId);
    const sale = p ? salePriceOfProduct(p, ings) * rp.qty : 0;
    return { name: (p?.name || "?").split(" ").slice(0, 2).join(" "), value: parseFloat(sale.toFixed(2)) };
  }) : [];
  const recHistory = useMemo(() => {
    if (!sel) return [];
    const costTl = priceTimelineFromHistory(
      ings,
      history,
      (priceMap) => recipeCostUnitFromPriceMap(sel, prods, priceMap, opCosts, recipes)
    );
    const saleTl = priceTimelineFromHistory(
      ings,
      history,
      (priceMap) => recipeSaleUnitFromPriceMap(sel, prods, priceMap, opCosts, recipes)
    );
    return costTl.slice(-12).map((p, idx) => ({
      date: p.date,
      label: new Date(p.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      cost: p.value,
      price: saleTl[saleTl.length - costTl.slice(-12).length + idx]?.value ?? p.value
    }));
  }, [sel, ings, history, prods, opCosts, recipes]);

  return (
    <div style={S.page}>
      <Header eyebrow="Gestão" title="Receitas" right={
        <button style={S.btnPrimary} onClick={() => setModal({ type: "recipe" })}>+ Nova Receita</button>
      } />
      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 10, marginBottom: 10 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: 8, alignItems: "center", marginBottom: 8 }}>
              <input style={{ ...S.search, margin: 0 }} placeholder="Buscar receita..." value={search} onChange={e => { setSearch(e.target.value); setListPage(1); }} />
              <select style={{ ...S.inp, minWidth: 250 }} value={sortBy} onChange={e => handleSortChange(e.target.value)}>
                <option value="createdAt">Data de criação</option>
                <option value="name">Ordem alfabética</option>
                <option value="price">Preço</option>
              </select>
              <button
                style={{ ...S.btnOutline, padding: "8px 10px", fontSize: 12, minWidth: 110 }}
                onClick={() => { setSortDir(d => d === "asc" ? "desc" : "asc"); setListPage(1); }}
              >
                {sortDir === "asc" ? "A-Z / Menor" : "Z-A / Maior"}
              </button>
              <select
                style={{ ...S.inp, minWidth: 130 }}
                value={String(pageSize)}
                onChange={e => { setPageSize(parseInt(e.target.value) || 8); setListPage(1); }}
              >
                <option value="4">4 por página</option>
                <option value="8">8 por página</option>
                <option value="12">12 por página</option>
                <option value="20">20 por página</option>
              </select>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ color: C.muted, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
                Categorias
              </div>
              {(catFilters.length > 0 || search.trim()) && (
                <button
                  style={{ ...S.btnOutline, padding: "5px 8px", fontSize: 11 }}
                  onClick={() => { setSearch(""); setCatFilters([]); setListPage(1); }}
                >
                  Limpar filtros
                </button>
              )}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              <button
                style={{
                  border: `1px solid ${catFilters.length === 0 ? C.teal + "66" : C.border2}`,
                  background: catFilters.length === 0 ? C.teal + "22" : C.border,
                  color: catFilters.length === 0 ? C.teal : C.muted,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  padding: "4px 10px",
                  borderRadius: 20,
                  textTransform: "uppercase"
                }}
                onClick={() => { setCatFilters([]); setListPage(1); }}
              >
                Todas
              </button>
              {categories.map(cat => {
                const on = catFilters.includes(cat);
                return (
                  <button
                    key={cat}
                    style={{
                      border: `1px solid ${on ? C.teal + "66" : C.border2}`,
                      background: on ? C.teal + "22" : C.border,
                      color: on ? C.teal : C.muted,
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: 0.5,
                      padding: "4px 10px",
                      borderRadius: 20,
                      textTransform: "uppercase"
                    }}
                    onClick={() => {
                      setCatFilters(fs => fs.includes(cat) ? fs.filter(c => c !== cat) : [...fs, cat]);
                      setListPage(1);
                    }}
                  >
                    {on ? "✓ " : ""}{cat}
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {paged.map(r => {
              const cost = costOfRecipe(r, prods, ings);
              const opU = opPerUnit(opCosts, recipes, r.id);
              const totalU = cost / r.yield + opU;
              const saleU = totalU * r.markup;
              const mrg = saleU ? ((saleU - totalU) / saleU * 100) : 0;
              const active = r.id === selId;
              return (
                <div key={r.id} style={{ ...S.listRow, ...(active ? S.listRowOn : {}) }} onClick={() => setSelId(r.id)}>
                  <div style={{ width: 52, height: 52, borderRadius: 10, border: `1px solid ${C.border2}`, background: C.border, overflow: "hidden", flexShrink: 0 }}>
                    {r.image
                      ? <img src={r.image} alt={r.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: C.muted, fontSize: 20 }}>📷</div>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Tag color={C.amber}>{r.category}</Tag>
                      <span style={S.listName}>{r.name}</span>
                    </div>
                    <div style={{ color: C.muted, fontSize: 12, marginTop: 3 }}>
                      {r.products.length} produto(s) · Rend. {r.yield} {r.yieldUnit} · {r.monthlyBatches} lotes/mês · v{r.versionHistory?.length || 1}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ color: C.amber, fontFamily: "monospace", fontWeight: 700, fontSize: 14 }}>{fmt(saleU)}/unid</div>
                    <div style={{ color: mrg > 30 ? C.green : mrg > 15 ? C.amber : C.rose, fontSize: 11, fontFamily: "monospace" }}>margem {mrg.toFixed(1)}%</div>
                  </div>
                  <div style={S.rowActs} onClick={e => e.stopPropagation()}>
                    <IcoBtn onClick={() => setModal({ type: "recDet", data: r })}>{"\uD83D\uDD0D"}</IcoBtn>
                    <IcoBtn onClick={() => setModal({ type: "recipe", data: r })}>{"\u270F\uFE0F"}</IcoBtn>
                    <IcoBtn onClick={() => { setRecipes(rs => rs.filter(x => x.id !== r.id)); showToast("Receita removida", C.rose); }}>{"\uD83D\uDDD1\uFE0F"}</IcoBtn>
                  </div>
                </div>
              );
            })}
            {sorted.length === 0 && <div style={S.empty}>Nenhuma receita encontrada</div>}
            {sorted.length > 0 && (
              <PaginationBar page={currentPage} totalPages={totalPages} onChange={setListPage} showWhenSingle />
            )}
          </div>
        </div>

        {sel && (
          <div style={{ width: 340, flexShrink: 0 }}>
            <div style={S.card}>
              <div style={{ marginBottom: 12 }}>
                <Tag color={C.amber}>{sel.category}</Tag>
                <div style={{ color: C.text, fontWeight: 700, fontSize: 16, marginTop: 6 }}>{sel.name}</div>
              </div>
              <div style={{ width: "100%", height: 150, borderRadius: 10, border: `1px solid ${C.border2}`, background: C.border, overflow: "hidden", marginBottom: 12 }}>
                {sel.image
                  ? <img src={sel.image} alt={sel.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: C.muted }}>Sem imagem</div>}
              </div>
              {sel.prepMode && (
                <div style={{ marginBottom: 12, padding: "10px 12px", borderRadius: 10, border: `1px solid ${C.border}`, background: C.bg }}>
                  <div style={{ color: C.muted, fontSize: 11, marginBottom: 6 }}>MODO DE PREPARO</div>
                  <div style={{ color: C.text, fontSize: 12, lineHeight: 1.55, whiteSpace: "pre-wrap", maxHeight: 120, overflow: "auto" }}>{sel.prepMode}</div>
                </div>
              )}
              <ChartHeader title="Custo por Produto" />
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={prodBreak} innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                    {prodBreak.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={TT} labelStyle={{ color: C.text }} itemStyle={{ color: C.text }} formatter={v => [fmt(v)]} />
                </PieChart>
              </ResponsiveContainer>
              {(() => {
                const cost = costOfRecipe(sel, prods, ings);
                const opU = opPerUnit(opCosts, recipes, sel.id);
                const totalU = cost / sel.yield + opU;
                const saleU = totalU * sel.markup;
                const mrg = saleU ? ((saleU - totalU) / saleU * 100) : 0;
                return (
                  <div style={S.quickStats}>
                    {[
                      { l: "Custo Produtos", v: fmt(cost), c: C.text },
                      { l: "Op./unidade", v: fmt(opU), c: C.violet },
                      { l: "Custo/unidade", v: fmt(totalU), c: C.amber },
                      { l: "Venda/unidade", v: fmt(saleU), c: C.teal },
                      { l: "Margem real", v: `${mrg.toFixed(1)}%`, c: mrg > 30 ? C.green : mrg > 15 ? C.amber : C.rose },
                    ].map((s, i) => (
                      <div key={i} style={S.quickRow}>
                        <span style={{ color: C.muted, fontSize: 12 }}>{s.l}</span>
                        <span style={{ color: s.c, fontFamily: "monospace", fontSize: 12, fontWeight: 700 }}>{s.v}</span>
                      </div>
                    ))}
                  </div>
                );
              })()}
              {/* products list */}
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
                <div style={{ color: C.muted, fontSize: 11, marginBottom: 8 }}>PRODUTOS DA RECEITA</div>
                {sel.products.map((rp, i) => {
                  const p = prods.find(x => x.id === rp.productId);
                  const sale = p ? salePriceOfProduct(p, ings) * rp.qty : 0;
                  return (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ color: C.text, fontSize: 12 }}>{p?.name || "?"} ×{rp.qty}</span>
                      <span style={{ color: C.amber, fontFamily: "monospace", fontSize: 12 }}>{fmt(sale)}</span>
                    </div>
                  );
                })}
              </div>
              {recHistory.length > 0 && (
                <div
                  style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}`, cursor: "pointer" }}
                  onClick={() => { setRecipeHistoryId(sel.id); setPage("receitaHistorico"); }}
                  title="Abrir página do histórico da receita"
                >
                  <ChartHeader title="Histórico de Custo" sub="custo e preço por unidade" />
                  <ResponsiveContainer width="100%" height={140}>
                    <LineChart data={recHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                      <XAxis dataKey="label" tick={{ fill: C.muted, fontSize: 10 }} />
                      <YAxis tick={{ fill: C.muted, fontSize: 10 }} tickFormatter={(v) => fmt(v)} width={62} />
                      <Tooltip contentStyle={TT} labelStyle={{ color: C.text }} itemStyle={{ color: C.text }} formatter={(v, n) => [fmt(v), n === "cost" ? "Custo/unid" : "Preço/unid"]} labelFormatter={(_, p) => p?.[0]?.payload?.date ? new Date(p[0].payload.date).toLocaleDateString("pt-BR") : ""} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Line type="monotone" dataKey="cost" stroke={C.rose} strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 4 }} name="Custo" />
                      <Line type="monotone" dataKey="price" stroke={C.amber} strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 4 }} name="Preço" />
                    </LineChart>
                  </ResponsiveContainer>
                  <div style={{ color: C.muted, fontSize: 10, marginTop: 4 }}>Clique no gráfico para abrir em tela dedicada</div>
                  <div style={{ marginTop: 8, display: "flex", justifyContent: "flex-end" }}>
                    <button
                      style={{ ...S.btnOutline, padding: "6px 10px", fontSize: 11 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setRecipeHistoryId(sel.id);
                        setPage("receitaHistorico");
                      }}
                    >
                      Abrir gráfico expandido
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// CUSTOS OPERACIONAIS
function PageCustos({ opCosts, recipes, ings, prods, setOpCosts, setModal, showToast }) {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dashboardPeriod, setDashboardPeriod] = useState("monthly");
  const [sortBy, setSortBy] = useState("monthly_desc");
  const [pageSize, setPageSize] = useState(8);
  const [listPage, setListPage] = useState(1);

  const categories = useMemo(
    () => Array.from(new Set(opCosts.map(c => c.category).filter(Boolean))).sort((a, b) => a.localeCompare(b, "pt-BR")),
    [opCosts]
  );

  const filteredCosts = useMemo(() => {
    const q = normText(search.trim());
    return opCosts.filter(c => {
      if (catFilter !== "all" && c.category !== catFilter) return false;
      if (typeFilter !== "all" && (c.costType || "Fixo") !== typeFilter) return false;
      if (!q) return true;
      return normText(`${c.name} ${c.category} ${c.costType || ""} ${c.note || ""}`).includes(q);
    });
  }, [opCosts, search, catFilter, typeFilter]);

  const sortedCosts = useMemo(() => {
    const arr = [...filteredCosts];
    arr.sort((a, b) => {
      if (sortBy === "name_asc") return String(a.name || "").localeCompare(String(b.name || ""), "pt-BR");
      if (sortBy === "name_desc") return String(b.name || "").localeCompare(String(a.name || ""), "pt-BR");
      if (sortBy === "amount_desc") return (b.amount || 0) - (a.amount || 0);
      if (sortBy === "amount_asc") return (a.amount || 0) - (b.amount || 0);
      if (sortBy === "monthly_asc") return toMonthly(a) - toMonthly(b);
      return toMonthly(b) - toMonthly(a);
    });
    return arr;
  }, [filteredCosts, sortBy]);

  const totalFiltered = sortedCosts.reduce((t, c) => t + toMonthly(c), 0);
  const avgMonthly = sortedCosts.length ? totalFiltered / sortedCosts.length : 0;
  const totalPages = Math.max(1, Math.ceil(sortedCosts.length / pageSize));
  const currentPage = Math.min(listPage, totalPages);
  const paged = sortedCosts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const catSummary = useMemo(() => {
    const map = {};
    sortedCosts.forEach(c => {
      if (!map[c.category]) map[c.category] = { cat: c.category, total: 0, count: 0 };
      map[c.category].total += toMonthly(c);
      map[c.category].count += 1;
    });
    return Object.values(map)
      .sort((a, b) => b.total - a.total)
      .map(x => ({ ...x, pct: totalFiltered ? (x.total / totalFiltered * 100) : 0 }));
  }, [sortedCosts, totalFiltered]);

  const rateio = recipes.map(r => ({
    name: r.name.split(" ").slice(0, 2).join(" "),
    value: parseFloat((opPerUnit(opCosts, recipes, r.id) * r.yield * (r.monthlyBatches || 0)).toFixed(2)),
  }));

  const periodSeries = useMemo(() => {
    const map = {};
    sortedCosts.forEach(c => {
      const dt = new Date(c.date || new Date());
      let key = "";
      let label = "";
      if (dashboardPeriod === "daily") {
        key = dateInputOf(dt);
        label = dt.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
      } else if (dashboardPeriod === "annual") {
        key = String(dt.getFullYear());
        label = key;
      } else {
        const month = String(dt.getMonth() + 1).padStart(2, "0");
        key = `${dt.getFullYear()}-${month}`;
        label = dt.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
      }
      if (!map[key]) map[key] = { key, label, value: 0 };
      map[key].value += parseFloat(c.amount) || 0;
    });
    return Object.values(map).sort((a, b) => String(a.key).localeCompare(String(b.key)));
  }, [sortedCosts, dashboardPeriod]);

  const topCosts = useMemo(
    () => [...sortedCosts].sort((a, b) => (parseFloat(b.amount) || 0) - (parseFloat(a.amount) || 0)).slice(0, 5),
    [sortedCosts]
  );

  return (
    <div style={S.page}>
      <Header eyebrow="Gestão" title="Custos Operacionais" right={
        <button style={S.btnPrimary} onClick={() => setModal({ type: "opcost" })}>+ Novo Custo</button>
      } />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: 14, marginBottom: 16 }}>
        <KpiCard lbl="Total Mensal (Filtro)" val={fmtK(totalFiltered)} color={C.rose} icon="💸" />
        <KpiCard lbl="Média por Lançamento" val={fmt(avgMonthly)} color={C.violet} icon="📊" />
        <KpiCard lbl="Lançamentos" val={sortedCosts.length} color={C.teal} icon="🧾" />
      </div>

      <div style={{ ...S.card, marginBottom: 14, padding: "12px 14px" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
          {[{ k: "daily", l: "Diário" }, { k: "monthly", l: "Mensal" }, { k: "annual", l: "Anual" }].map(p => (
            <button key={p.k} style={{ ...S.toggleBtn, ...(dashboardPeriod === p.k ? S.toggleOn : {}) }} onClick={() => setDashboardPeriod(p.k)}>
              {p.l}
            </button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.7fr) minmax(260px,1fr)", gap: 12 }}>
          <div>
            <ChartHeader title="Evolução de Custos" sub={`visão ${dashboardPeriod === "daily" ? "diária" : dashboardPeriod === "annual" ? "anual" : "mensal"}`} />
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={periodSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="label" tick={{ fill: C.muted, fontSize: 11 }} />
                <YAxis tick={{ fill: C.muted, fontSize: 11 }} tickFormatter={(v) => fmt(v)} />
                <Tooltip contentStyle={TT} labelStyle={{ color: C.text }} itemStyle={{ color: C.text }} formatter={v => [fmt(v), "Valor"]} />
                <Bar dataKey="value" fill={C.teal} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <ChartHeader title="Maiores Custos" sub="top 5 do filtro atual" />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {topCosts.map(c => (
                <div key={c.id} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px 10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <span style={{ color: C.text, fontSize: 12, fontWeight: 700 }}>{c.name}</span>
                    <span style={{ color: C.amber, fontFamily: "monospace", fontSize: 12 }}>{fmt(c.amount)}</span>
                  </div>
                  <div style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>
                    {dateInputOf(c.date || new Date())} · {c.costType || "Fixo"}
                  </div>
                </div>
              ))}
              {topCosts.length === 0 && <div style={{ color: C.muted, fontSize: 12 }}>Sem dados.</div>}
            </div>
          </div>
        </div>
      </div>

      <div style={{ ...S.card, marginBottom: 14, padding: "12px 14px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 8 }}>
          <input
            style={{ ...S.search, margin: 0, gridColumn: "span 2" }}
            placeholder="Buscar custo..."
            value={search}
            onChange={e => { setSearch(e.target.value); setListPage(1); }}
          />
          <select style={S.inp} value={catFilter} onChange={e => { setCatFilter(e.target.value); setListPage(1); }}>
            <option value="all">Categorias</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select style={S.inp} value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setListPage(1); }}>
            <option value="all">Tipo de custo</option>
            {OP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select style={S.inp} value={sortBy} onChange={e => { setSortBy(e.target.value); setListPage(1); }}>
            <option value="monthly_desc">Maior custo/mês</option>
            <option value="monthly_asc">Menor custo/mês</option>
            <option value="name_asc">Nome A-Z</option>
            <option value="name_desc">Nome Z-A</option>
            <option value="amount_desc">Maior valor base</option>
            <option value="amount_asc">Menor valor base</option>
          </select>
          <select style={S.inp} value={String(pageSize)} onChange={e => { setPageSize(parseInt(e.target.value) || 8); setListPage(1); }}>
            <option value="6">6 / página</option>
            <option value="8">8 / página</option>
            <option value="12">12 / página</option>
            <option value="20">20 / página</option>
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.7fr) minmax(260px,1fr)", gap: 14, marginBottom: 16 }}>
        <div style={S.card}>
          <ChartHeader title="Lançamentos Operacionais" sub="visualização em cards" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
            {paged.map(oc => (
              <div key={oc.id} style={{ ...S.opRow, padding: "12px 14px" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ color: C.text, fontWeight: 700 }}>{oc.name}</span>
                    <Tag color={C.violet}>{OP_ICONS[oc.category] || "📦"} {oc.category}</Tag>
                    <Tag color={oc.costType === "Variável" ? C.amber : oc.costType === "Extraordinário" ? C.rose : C.teal}>{oc.costType || "Fixo"}</Tag>
                  </div>
                  <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>
                    {dateInputOf(oc.date || new Date())}{oc.note ? ` · ${oc.note}` : ""}
                  </div>
                </div>
                <div style={{ textAlign: "right", minWidth: 140 }}>
                  <div style={{ color: C.muted, fontSize: 11 }}>Valor</div>
                  <div style={{ color: C.amber, fontFamily: "monospace", fontWeight: 700 }}>{fmt(oc.amount)}</div>
                  <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>Equiv./mês</div>
                  <div style={{ color: C.text, fontFamily: "monospace", fontWeight: 700 }}>{fmt(toMonthly(oc))}</div>
                </div>
                <div style={{ ...S.rowActs, marginLeft: 8 }}>
                  <IcoBtn onClick={() => setModal({ type: "opcost", data: oc })}>{"\u270F\uFE0F"}</IcoBtn>
                  <IcoBtn onClick={() => { setOpCosts(cs => cs.filter(c => c.id !== oc.id)); showToast("Removido", C.rose); }}>{"\uD83D\uDDD1\uFE0F"}</IcoBtn>
                </div>
              </div>
            ))}
          </div>
          {sortedCosts.length === 0 && <div style={S.empty}>Nenhum custo encontrado com os filtros atuais.</div>}
          {sortedCosts.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <PaginationBar page={currentPage} totalPages={totalPages} onChange={setListPage} />
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={S.card}>
            <ChartHeader title="Categorias" sub="participação no custo filtrado" />
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
              {catSummary.slice(0, 6).map(c => (
                <div key={c.cat}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ color: C.text, fontSize: 12 }}>{OP_ICONS[c.cat] || "📦"} {c.cat}</span>
                    <span style={{ color: C.muted, fontFamily: "monospace", fontSize: 12 }}>{fmt(c.total)}</span>
                  </div>
                  <div style={{ height: 5, background: C.border, borderRadius: 999 }}>
                    <div style={{ width: `${Math.min(100, c.pct)}%`, height: "100%", borderRadius: 999, background: C.violet }} />
                  </div>
                </div>
              ))}
              {catSummary.length === 0 && <div style={{ color: C.muted, fontSize: 12 }}>Sem dados para exibir.</div>}
            </div>
          </div>

          {rateio.length > 0 && (
            <div style={S.card}>
              <ChartHeader title="Rateio por Receita" sub="equivalente mensal" />
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={rateio}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis dataKey="name" tick={{ fill: C.muted, fontSize: 11 }} />
                  <YAxis tick={{ fill: C.muted, fontSize: 11 }} tickFormatter={v => `R$${v}`} />
                  <Tooltip contentStyle={TT} labelStyle={{ color: C.text }} itemStyle={{ color: C.text }} formatter={v => [fmt(v)]} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {rateio.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {opCosts.length === 0 && <div style={S.empty}>Nenhum custo cadastrado.</div>}
    </div>
  );
}

function PageReceitaHistorico({ recipeHistoryId, recipes, ings, prods, opCosts, history, setPage }) {
  const recipe = recipes.find(r => r.id === recipeHistoryId) || recipes[0];
  const recHistory = useMemo(() => {
    if (!recipe) return [];
    const costTl = priceTimelineFromHistory(
      ings,
      history,
      (priceMap) => recipeCostUnitFromPriceMap(recipe, prods, priceMap, opCosts, recipes)
    );
    const saleTl = priceTimelineFromHistory(
      ings,
      history,
      (priceMap) => recipeSaleUnitFromPriceMap(recipe, prods, priceMap, opCosts, recipes)
    );
    const base = costTl.slice(-36);
    return base.map((p, idx) => ({
      date: p.date,
      label: new Date(p.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      cost: p.value,
      price: saleTl[saleTl.length - base.length + idx]?.value ?? p.value
    }));
  }, [recipe, ings, history, prods, opCosts, recipes]);
  function toInputDate(d) {
    const dt = new Date(d);
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, "0");
    const day = String(dt.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  useEffect(() => {
    if (!recHistory.length) {
      setStartDate("");
      setEndDate("");
      return;
    }
    setStartDate(toInputDate(recHistory[0].date));
    setEndDate(toInputDate(recHistory[recHistory.length - 1].date));
  }, [recipe?.id, recHistory.length]);

  const filteredHistory = useMemo(() => {
    if (!recHistory.length) return [];
    const startTs = startDate ? new Date(`${startDate}T00:00:00`).getTime() : -Infinity;
    const endTs = endDate ? new Date(`${endDate}T23:59:59`).getTime() : Infinity;
    return recHistory.filter(p => {
      const ts = new Date(p.date).getTime();
      return ts >= startTs && ts <= endTs;
    });
  }, [recHistory, startDate, endDate]);
  const minCost = filteredHistory.length ? Math.min(...filteredHistory.map(p => p.cost)) : 0;
  const maxCost = filteredHistory.length ? Math.max(...filteredHistory.map(p => p.cost)) : 0;

  if (!recipe) {
    return (
      <div style={S.page}>
        <Header eyebrow="Receitas" title="Histórico de Custo" right={<button style={S.btnOutline} onClick={() => setPage("receitas")}>Voltar</button>} />
        <div style={S.empty}>Nenhuma receita encontrada para exibir o histórico.</div>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, fontSize: 12 }}>
        <button style={{ ...S.btnOutline, padding: "5px 10px", fontSize: 11 }} onClick={() => setPage("receitas")}>Receitas</button>
        <span style={{ color: C.muted }}>/</span>
        <span style={{ color: C.muted }}>{recipe.name}</span>
        <span style={{ color: C.muted }}>/</span>
        <span style={{ color: C.text, fontWeight: 700 }}>Histórico de Custo</span>
      </div>

      <Header eyebrow="Receitas" title={`Histórico de Custo - ${recipe.name}`} right={
        <button style={S.btnOutline} onClick={() => setPage("receitas")}>Voltar para Receitas</button>
      } />

      <div style={{ ...S.card, marginBottom: 14, padding: "12px 14px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 10, alignItems: "end" }}>
          <Field label="Data inicial">
            <input style={S.inp} type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </Field>
          <Field label="Data final">
            <input style={S.inp} type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </Field>
          <button
            style={{ ...S.btnOutline, height: 36 }}
            onClick={() => {
              if (!recHistory.length) return;
              setStartDate(toInputDate(recHistory[0].date));
              setEndDate(toInputDate(recHistory[recHistory.length - 1].date));
            }}
          >
            Limpar filtro
          </button>
        </div>
      </div>

      <div style={{ ...S.card, marginBottom: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(120px, 1fr))", gap: 10 }}>
          {[
            { l: "Custo Atual/unid", v: fmt(filteredHistory[filteredHistory.length - 1]?.cost || 0), c: C.rose },
            { l: "Preço Atual/unid", v: fmt(filteredHistory[filteredHistory.length - 1]?.price || 0), c: C.teal },
            { l: "Mín. Custo (período)", v: fmt(minCost), c: C.amber },
            { l: "Máx. Custo (período)", v: fmt(maxCost), c: C.violet },
          ].map((k, i) => (
            <div key={i} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ color: C.muted, fontSize: 10, marginBottom: 4 }}>{k.l}</div>
              <div style={{ color: k.c, fontFamily: "monospace", fontWeight: 700 }}>{k.v}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={S.card}>
        <ChartHeader title="Evolução do Custo da Receita" sub="visualização ampliada por unidade" />
        {filteredHistory.length > 0 ? (
          <ResponsiveContainer width="100%" height={420}>
            <LineChart data={filteredHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="label" tick={{ fill: C.muted, fontSize: 11 }} />
              <YAxis tick={{ fill: C.muted, fontSize: 11 }} tickFormatter={(v) => fmt(v)} width={62} />
              <Tooltip contentStyle={TT} labelStyle={{ color: C.text }} itemStyle={{ color: C.text }} formatter={(v, n) => [fmt(v), n === "cost" ? "Custo/unid" : "Preço/unid"]} labelFormatter={(_, p) => p?.[0]?.payload?.date ? new Date(p[0].payload.date).toLocaleDateString("pt-BR") : ""} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="cost" stroke={C.rose} strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} name="Custo" />
              <Line type="monotone" dataKey="price" stroke={C.amber} strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} name="Preço" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ color: C.muted, fontSize: 12 }}>Sem dados para o intervalo selecionado.</div>
        )}
      </div>
    </div>
  );
}

function PageFornecedores({ suppliers, setSuppliers, setModal, showToast }) {
  const [search, setSearch] = useState("");
  const [nameOrder, setNameOrder] = useState("asc");
  const filtered = suppliers.filter(s =>
    [s.name, s.contact, s.email, s.city].join(" ").toLowerCase().includes(search.toLowerCase())
  );
  const sorted = useMemo(() => {
    const dir = nameOrder === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "pt-BR") * dir);
  }, [filtered, nameOrder]);

  return (
    <div style={S.page}>
      <Header eyebrow="Gestão" title="Fornecedores" right={
        <button style={S.btnPrimary} onClick={() => setModal({ type: "supplier" })}>+ Novo Fornecedor</button>
      } />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 170px", gap: 8, marginBottom: 10 }}>
        <input
          style={{ ...S.search, marginBottom: 0 }}
          placeholder="Buscar fornecedor..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select style={S.inp} value={nameOrder} onChange={e => setNameOrder(e.target.value)}>
          <option value="asc">Nome (A-Z)</option>
          <option value="desc">Nome (Z-A)</option>
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10 }}>
        {sorted.map(s => (
          <div key={s.id} style={{ ...S.card, padding: "14px 14px 12px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ color: C.text, fontWeight: 700, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name}</div>
                <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{s.contact ? `Contato: ${s.contact}` : "Sem contato"}</div>
              </div>
              {s.city && <Tag color={C.teal}>{s.city}</Tag>}
            </div>

            <div style={{ display: "grid", gap: 4, marginBottom: 10 }}>
              <div style={{ color: C.muted, fontSize: 12 }}>📞 {s.phone || "Sem telefone"}</div>
              <div style={{ color: C.muted, fontSize: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>✉️ {s.email || "Sem email"}</div>
              {s.note && (
                <div style={{ color: C.dim, fontSize: 11, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {s.note}
                </div>
              )}
            </div>

            <div style={{ ...S.rowActs, justifyContent: "flex-end", borderTop: `1px solid ${C.border}`, paddingTop: 8 }}>
              <IcoBtn onClick={() => setModal({ type: "supplier", data: s })}>{"\u270F\uFE0F"}</IcoBtn>
              <IcoBtn onClick={() => { setSuppliers(cs => cs.filter(x => x.id !== s.id)); showToast("Fornecedor removido", C.rose); }}>{"\uD83D\uDDD1\uFE0F"}</IcoBtn>
            </div>
          </div>
        ))}
      </div>

      {sorted.length === 0 && <div style={S.empty}>Nenhum fornecedor encontrado.</div>}
    </div>
  );
}

// LUCRATIVIDADE
function PageLucro({ ings, prods, recipes, opCosts }) {
  const [view, setView] = useState("produtos"); // "produtos" | "receitas"
  const totalOp = opCosts.reduce((t, c) => t + toMonthly(c), 0);

  const prodData = prods.map(p => {
    const cost = ingCostOfProduct(p, ings);
    const sale = salePriceOfProduct(p, ings);
    const mrg = sale ? (sale - cost) / sale * 100 : 0;
    const inRec = recipes.some(r => r.products.some(rp => rp.productId === p.id));
    return { id: p.id, name: p.name, category: p.category, cost, sale, mrg, inRec, mode: p.priceMode };
  }).sort((a, b) => b.mrg - a.mrg);

  const recData = recipes.map(r => {
    const cost = costOfRecipe(r, prods, ings);
    const opU = opPerUnit(opCosts, recipes, r.id);
    const totalU = cost / r.yield + opU;
    const saleU = totalU * r.markup;
    const mrg = saleU ? (saleU - totalU) / saleU * 100 : 0;
    const monthly = saleU * r.yield * (r.monthlyBatches || 0);
    const mCost = totalU * r.yield * (r.monthlyBatches || 0);
    return { id: r.id, name: r.name, category: r.category, cost, opU, totalU, saleU, mrg, monthly, mCost, monthlyProfit: monthly - mCost };
  }).sort((a, b) => b.mrg - a.mrg);

  // radar for products
  const radarData = prodData.slice(0, 6).map(p => ({
    name: p.name.split(" ")[0],
    margem: parseFloat(p.mrg.toFixed(1)),
    venda: parseFloat((p.sale / Math.max(...prodData.map(x => x.sale)) * 100).toFixed(1)),
  }));

  const totalProdRevenue = prodData.reduce((t, p) => t + p.sale, 0);
  const totalProdCost = prodData.reduce((t, p) => t + p.cost, 0);
  const totalRecRevenue = recData.reduce((t, r) => t + r.monthly, 0);
  const totalRecCost = recData.reduce((t, r) => t + r.mCost, 0);
  const totalProfit = recData.reduce((t, r) => t + r.monthlyProfit, 0);

  return (
    <div style={S.page}>
      <Header eyebrow="Análise" title="Lucratividade" />

      {/* toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {[{ k: "produtos", l: "Produtos" }, { k: "receitas", l: "Receitas" }].map(({ k, l }) => (
          <button key={k} style={{ ...S.toggleBtn, ...(view === k ? S.toggleOn : {}) }} onClick={() => setView(k)}>{l}</button>
        ))}
      </div>

      {view === "produtos" && (
        <>
          <div style={{ ...S.grid4, marginBottom: 20 }}>
            {[
              { lbl: "Receita Total (Venda)", val: fmtK(totalProdRevenue), color: C.teal },
              { lbl: "Custo Total (Ing.)", val: fmtK(totalProdCost), color: C.rose },
              { lbl: "Lucro Bruto", val: fmtK(totalProdRevenue - totalProdCost), color: C.green },
              { lbl: "Margem Média", val: `${prodData.length ? ((prodData.reduce((t, p) => t + p.mrg, 0)) / prodData.length).toFixed(1) : 0}%`, color: C.amber },
            ].map((k, i) => <KpiCard key={i} {...k} icon="" />)}
          </div>
          <div style={{ ...S.row, marginBottom: 16 }}>
            <div style={{ ...S.card, flex: 1 }}>
              <ChartHeader title="Margem por Produto" sub="ordenado por margem decrescente" />
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={prodData.map(p => ({ name: p.name.split(" ").slice(0, 2).join(" "), margem: parseFloat(p.mrg.toFixed(1)) }))} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis type="number" tick={{ fill: C.muted, fontSize: 11 }} tickFormatter={v => `${v}%`} />
                  <YAxis type="category" dataKey="name" tick={{ fill: C.muted, fontSize: 11 }} width={120} />
                  <Tooltip contentStyle={TT} labelStyle={{ color: C.text }} itemStyle={{ color: C.text }} formatter={v => [`${v}%`, "Margem"]} />
                  <Bar dataKey="margem" radius={[0, 6, 6, 0]}>
                    {prodData.map((p, i) => <Cell key={i} fill={p.mrg > 40 ? C.green : p.mrg > 20 ? C.amber : C.rose} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ ...S.card, flex: 1 }}>
              <ChartHeader title="Visão Radar — Top 6 Produtos" />
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke={C.border} />
                  <PolarAngleAxis dataKey="name" tick={{ fill: C.muted, fontSize: 11 }} />
                  <PolarRadiusAxis tick={{ fill: C.muted, fontSize: 9 }} />
                  <Radar name="Margem %" dataKey="margem" stroke={C.teal} fill={C.teal} fillOpacity={0.25} />
                  <Radar name="Venda rel." dataKey="venda" stroke={C.amber} fill={C.amber} fillOpacity={0.15} />
                  <Legend wrapperStyle={{ color: C.muted, fontSize: 12 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* table */}
          <div style={S.card}>
            <ChartHeader title="Tabela Detalhada de Produtos" />
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8 }}>
              <thead>
                <tr>{["Produto", "Categoria", "Modo", "Custo Ing.", "Preço Venda", "Margem", "Em Receitas"].map(h => (
                  <th key={h} style={S.th}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {prodData.map((p, i) => (
                  <tr key={p.id} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? "transparent" : C.surface + "88" }}>
                    <td style={S.td}>{p.name}</td>
                    <td style={S.td}><Tag color={C.teal}>{p.category}</Tag></td>
                    <td style={S.td}><span style={{ color: C.muted, fontSize: 11 }}>{p.mode === "manual" ? "Manual" : "Markup"}</span></td>
                    <td style={{ ...S.td, fontFamily: "monospace", color: C.rose }}>{fmt(p.cost)}</td>
                    <td style={{ ...S.td, fontFamily: "monospace", color: C.teal }}>{fmt(p.sale)}</td>
                    <td style={{ ...S.td, fontFamily: "monospace", color: p.mrg > 40 ? C.green : p.mrg > 20 ? C.amber : C.rose, fontWeight: 700 }}>{p.mrg.toFixed(1)}%</td>
                    <td style={S.td}>{p.inRec ? <Tag color={C.violet}>Sim</Tag> : <span style={{ color: C.dim }}>Não</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {view === "receitas" && (
        <>
          <div style={{ ...S.grid4, marginBottom: 20 }}>
            {[
              { lbl: "Receita Mensal Est.", val: fmtK(totalRecRevenue), color: C.teal },
              { lbl: "Custo Mensal Est.", val: fmtK(totalRecCost), color: C.rose },
              { lbl: "Lucro Mensal Est.", val: fmtK(totalProfit), color: totalProfit > 0 ? C.green : C.rose },
              { lbl: "Op. Mensal Alocado", val: fmtK(totalOp), color: C.violet },
            ].map((k, i) => <KpiCard key={i} {...k} icon="" />)}
          </div>
          <div style={S.card}>
            <ChartHeader title="Comparativo de Receitas: Receita vs Custo Mensal" />
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={recData.map(r => ({ name: r.name.split(" ").slice(0, 2).join(" "), receita: parseFloat(r.monthly.toFixed(2)), custo: parseFloat(r.mCost.toFixed(2)) }))}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                <XAxis dataKey="name" tick={{ fill: C.muted, fontSize: 11 }} />
                <YAxis tick={{ fill: C.muted, fontSize: 11 }} tickFormatter={v => fmtK(v)} />
                <Tooltip contentStyle={TT} labelStyle={{ color: C.text }} itemStyle={{ color: C.text }} formatter={(v, n) => [fmtK(v), n === "receita" ? "Receita" : "Custo"]} />
                <Bar dataKey="receita" fill={C.teal} radius={[4, 4, 0, 0]} name="receita" />
                <Bar dataKey="custo" fill={C.rose} radius={[4, 4, 0, 0]} name="custo" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ ...S.card, marginTop: 16 }}>
            <ChartHeader title="Tabela Detalhada de Receitas" />
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8 }}>
              <thead>
                <tr>{["Receita", "Custo Prod.", "Op./Unid", "Venda/Unid", "Margem", "Lucro/Mês"].map(h => (
                  <th key={h} style={S.th}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {recData.map((r, i) => (
                  <tr key={r.id} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? "transparent" : C.surface + "88" }}>
                    <td style={S.td}>{r.name}</td>
                    <td style={{ ...S.td, fontFamily: "monospace", color: C.muted }}>{fmt(r.cost)}</td>
                    <td style={{ ...S.td, fontFamily: "monospace", color: C.violet }}>{fmt(r.opU)}</td>
                    <td style={{ ...S.td, fontFamily: "monospace", color: C.teal }}>{fmt(r.saleU)}</td>
                    <td style={{ ...S.td, fontFamily: "monospace", color: r.mrg > 30 ? C.green : r.mrg > 15 ? C.amber : C.rose, fontWeight: 700 }}>{r.mrg.toFixed(1)}%</td>
                    <td style={{ ...S.td, fontFamily: "monospace", color: r.monthlyProfit > 0 ? C.green : C.rose, fontWeight: 700 }}>{fmtK(r.monthlyProfit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

// MODALS
function ModalProdBulk({ ctx, onClose }) {
  const { ings, suppliers, setProds, setIngs, showToast } = ctx;
  const [mode, setMode] = useState("csv"); // "csv" | "nfe"
  const [csvText, setCsvText] = useState("");
  const [rowsPreview, setRowsPreview] = useState([]);
  const [errors, setErrors] = useState([]);
  const [pendingIngs, setPendingIngs] = useState([]);
  const [aiKey, setAiKey] = useState(() => window.localStorage.getItem("ia-openai-key") || "");
  const [aiModel, setAiModel] = useState(() => window.localStorage.getItem("ia-openai-model") || "gpt-4.1-mini");
  const [nfImageDataUrl, setNfImageDataUrl] = useState("");
  const [nfFileName, setNfFileName] = useState("");
  const [nfLoading, setNfLoading] = useState(false);
  const [defaultSupplierId, setDefaultSupplierId] = useState(suppliers[0]?.id || "");

  function downloadTemplate() {
    const sample = [
      "name,category,description,unit,yield,supplier,priceMode,markup,manualPrice,ingredients",
      "Massa Base Premium,Massas,Base para bolos,unid,1,Atacado Doce Sul,markup,1.8,,Farinha de Trigo:0.30|Açúcar Refinado:0.25|Manteiga:0.15|Ovos:3",
      "Ganache Meio Amargo,Coberturas,Ganache cremosa,kg,0.5,Laticínios Serra,manual,,22.50,Chocolate em Pó 70%:0.20|Leite Integral:0.12|Manteiga:0.08",
    ].join("\n");
    const blob = new Blob([sample], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "modelo_importacao_produtos.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCsvText(String(reader.result || ""));
      setRowsPreview([]);
      setErrors([]);
    };
    reader.readAsText(file, "utf-8");
  }

  function handleInvoiceImage(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setNfImageDataUrl(String(reader.result || ""));
      setNfFileName(file.name || "");
      setRowsPreview([]);
      setErrors([]);
      setPendingIngs([]);
    };
    reader.readAsDataURL(file);
  }

  function extractJsonFromText(text) {
    const raw = String(text || "").trim();
    if (!raw) return "";
    const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced?.[1]) return fenced[1].trim();
    const firstObj = raw.indexOf("{");
    const lastObj = raw.lastIndexOf("}");
    if (firstObj >= 0 && lastObj > firstObj) return raw.slice(firstObj, lastObj + 1);
    return raw;
  }

  async function parseInvoiceWithAI() {
    if (!nfImageDataUrl) {
      showToast("Selecione a foto da nota fiscal.", C.rose);
      return [];
    }
    if (!aiKey.trim()) {
      showToast("Informe a OpenAI API Key para extrair a nota.", C.rose);
      return [];
    }

    setNfLoading(true);
    setErrors([]);
    setRowsPreview([]);
    setPendingIngs([]);
    try {
      const prompt = `Analise a imagem de uma nota fiscal brasileira e retorne APENAS JSON valido no formato:
{
  "invoice": { "supplier_name": "", "cnpj": "", "invoice_number": "", "issue_date": "" },
  "items": [
    { "name": "", "qty": 0, "unit": "", "unit_price": 0, "total": 0, "category": "" }
  ]
}
Regras:
- Não inclua markdown, apenas JSON.
- Use ponto para decimais.
- Se algum campo não existir, retorne string vazia ou 0.
- "category" pode ser "Insumos NF" quando não estiver claro.
`;

      const body = {
        model: aiModel || "gpt-4.1-mini",
        input: [
          {
            role: "user",
            content: [
              { type: "input_text", text: prompt },
              { type: "input_image", image_url: nfImageDataUrl }
            ]
          }
        ],
        temperature: 0.1,
        max_output_tokens: 1200
      };

      const res = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${aiKey.trim()}`
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Falha na extracao da nota");
      }

      const data = await res.json();
      const rawContent = data?.output_text
        || data?.output?.map(o => (o.content || []).map(c => c.text || "").join("")).join("\n")
        || "";
      const jsonText = extractJsonFromText(rawContent);
      const parsed = JSON.parse(jsonText);
      const items = Array.isArray(parsed?.items) ? parsed.items : [];
      if (!items.length) {
        setErrors(["A IA não encontrou itens válidos na nota. Tente uma foto mais nítida."]);
        showToast("Nenhum item detectado na nota.", C.rose);
        return [];
      }

      const supByName = new Map(suppliers.map(s => [normText(s.name), s]));
      const extractedSupplier = normText(parsed?.invoice?.supplier_name || "");
      const supplierFromNf = supByName.get(extractedSupplier);
      const supplierId = supplierFromNf?.id || defaultSupplierId;
      if (!supplierId) {
        setErrors(["Fornecedor da nota não localizado. Selecione um fornecedor padrão para importar."]);
        showToast("Fornecedor não definido para importação.", C.rose);
        return [];
      }

      const ingByName = new Map(ings.map(i => [normText(i.name), i]));
      const ingOps = [];
      const products = [];
      items.forEach((it) => {
        const name = String(it?.name || "").trim();
        const unit = String(it?.unit || "unid").trim() || "unid";
        const unitPrice = parseFloat(String(it?.unit_price ?? 0).replace(",", ".")) || 0;
        const category = String(it?.category || "Insumos NF").trim() || "Insumos NF";
        if (!name || unitPrice <= 0) return;

        const nk = normText(name);
        let ing = ingByName.get(nk);
        if (!ing) {
          ing = { id: uid(), name, unit, price: unitPrice };
          ingByName.set(nk, ing);
          ingOps.push({ type: "add", item: ing });
        } else if (Math.abs((ing.price || 0) - unitPrice) > 0.0001) {
          ingOps.push({ type: "update", item: { ...ing, price: unitPrice } });
        }

        products.push({
          id: uid(),
          name,
          category,
          description: `Importado de NF ${parsed?.invoice?.invoice_number ? `#${parsed.invoice.invoice_number}` : ""}`.trim(),
          unit,
          yield: 1,
          supplierId,
          priceMode: "manual",
          markup: 1,
          manualPrice: unitPrice,
          ingredients: [{ ingredientId: ing.id, qty: 1 }]
        });
      });

      if (!products.length) {
        setErrors(["Não foi possível transformar os itens extraídos em produtos válidos."]);
        showToast("Itens inválidos para importação.", C.rose);
        return [];
      }

      setRowsPreview(products);
      setPendingIngs(ingOps);
      showToast(`Nota processada: ${products.length} produto(s) pronto(s) para importar.`, C.teal);
      return products;
    } catch (err) {
      const msg = String(err?.message || err || "Erro desconhecido");
      setErrors([`Erro na extracao da nota: ${msg}`]);
      showToast("Falha ao extrair nota fiscal.", C.rose);
      return [];
    } finally {
      setNfLoading(false);
    }
  }

  function parseImport() {
    const parsed = parseCsvAuto(csvText);
    const hdrIdx = {};
    parsed.headers.forEach((h, i) => { hdrIdx[normText(h)] = i; });
    const pick = (cells, names) => {
      for (const n of names) {
        const idx = hdrIdx[n];
        if (idx != null) return String(cells[idx] || "").trim();
      }
      return "";
    };
    const hasName = hdrIdx.name != null || hdrIdx.nome != null;
    const hasSupplier = hdrIdx.supplier != null || hdrIdx.fornecedor != null;
    const hasIngredients = hdrIdx.ingredients != null || hdrIdx.ingredientes != null;
    if (!hasName || !hasSupplier || !hasIngredients) {
      const missing = [
        !hasName ? "name/nome" : null,
        !hasSupplier ? "supplier/fornecedor" : null,
        !hasIngredients ? "ingredients/ingredientes" : null,
      ].filter(Boolean).join(", ");
      setRowsPreview([]);
      setErrors([`Cabeçalho incompleto. Faltando: ${missing}`]);
      showToast("A planilha não possui as colunas mínimas.", C.rose);
      return [];
    }

    const products = [];
    const errs = [];
    const ingByName = new Map(ings.map(i => [normText(i.name), i]));
    const supByName = new Map(suppliers.map(s => [normText(s.name), s]));

    parsed.rows.forEach(r => {
      const name = pick(r.cells, ["name", "nome"]);
      const category = pick(r.cells, ["category", "categoria"]);
      const description = pick(r.cells, ["description", "descricao"]);
      const unit = pick(r.cells, ["unit", "unidade"]) || "unid";
      const yieldRaw = pick(r.cells, ["yield", "rendimento"]);
      const supplierRaw = pick(r.cells, ["supplier", "fornecedor"]);
      const modeRaw = normText(pick(r.cells, ["pricemode", "modo_preco", "modo"]));
      const markupRaw = pick(r.cells, ["markup"]);
      const manualRaw = pick(r.cells, ["manualprice", "preco_manual", "preco"]);
      const ingredientsRaw = pick(r.cells, ["ingredients", "ingredientes"]);

      const rowErrors = [];
      if (!name) rowErrors.push("nome obrigatório");
      if (!supplierRaw) rowErrors.push("fornecedor obrigatório");
      if (!ingredientsRaw) rowErrors.push("ingredientes obrigatórios");

      const supplier = supByName.get(normText(supplierRaw));
      if (supplierRaw && !supplier) rowErrors.push(`fornecedor não encontrado: ${supplierRaw}`);

      const items = [];
      if (ingredientsRaw) {
        ingredientsRaw.split("|").map(x => x.trim()).filter(Boolean).forEach(part => {
          const m = part.match(/^(.+?)\s*[:=]\s*([0-9.,]+)$/);
          if (!m) {
            rowErrors.push(`ingrediente invalido: ${part}`);
            return;
          }
          const ingName = m[1].trim();
          const qty = parseFloat(String(m[2]).replace(",", "."));
          const ing = ingByName.get(normText(ingName));
          if (!ing) {
            rowErrors.push(`ingrediente não encontrado: ${ingName}`);
            return;
          }
          if (!qty || qty <= 0) {
            rowErrors.push(`qtd invalida para ${ingName}`);
            return;
          }
          items.push({ ingredientId: ing.id, qty });
        });
      }

      const priceMode = modeRaw === "manual" ? "manual" : "markup";
      const markup = parseFloat(String(markupRaw).replace(",", ".")) || 1;
      const manualPrice = parseFloat(String(manualRaw).replace(",", "."));
      const yld = parseFloat(String(yieldRaw).replace(",", ".")) || 1;
      if (priceMode === "manual" && (!manualPrice || manualPrice <= 0)) {
        rowErrors.push("preço manual inválido");
      }
      if (!yld || yld <= 0) rowErrors.push("rendimento invalido");
      if (!items.length) rowErrors.push("sem ingredientes validos");

      if (rowErrors.length) {
        errs.push(`Linha ${r.line}: ${rowErrors.join("; ")}`);
        return;
      }

      products.push({
        id: uid(),
        name,
        category,
        description,
        unit,
        yield: yld,
        supplierId: supplier.id,
        priceMode,
        markup,
        manualPrice: priceMode === "manual" ? manualPrice : null,
        ingredients: items
      });
    });

    setRowsPreview(products);
    setErrors(errs);
    setPendingIngs([]);
    if (!products.length) showToast("Nenhum produto valido para importar.", C.rose);
    else showToast(`Pré-validação: ${products.length} produto(s) pronto(s).`, C.teal);
    return products;
  }

  function saveImport() {
    const ready = rowsPreview.length ? rowsPreview : (mode === "nfe" ? [] : parseImport());
    if (!ready || !ready.length) return;
    if (pendingIngs.length) {
      setIngs(curr => {
        let out = [...curr];
        pendingIngs.forEach(op => {
          if (op.type === "add") {
            out.push(op.item);
          } else if (op.type === "update") {
            out = out.map(i => i.id === op.item.id ? { ...i, price: op.item.price } : i);
          }
        });
        return out;
      });
    }
    setProds(ps => [...ps, ...ready]);
    showToast(`${ready.length} produto(s) importado(s)!`, C.green);
    onClose();
  }

  return (
    <Modal title="Importação Massiva de Produtos" onClose={onClose} wide>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <button style={{ ...S.toggleBtn, ...(mode === "csv" ? S.toggleOn : {}) }} onClick={() => { setMode("csv"); setRowsPreview([]); setErrors([]); }}>Planilha CSV</button>
        <button style={{ ...S.toggleBtn, ...(mode === "nfe" ? S.toggleOn : {}) }} onClick={() => { setMode("nfe"); setRowsPreview([]); setErrors([]); }}>Foto de Nota Fiscal (BR)</button>
      </div>

      {mode === "csv" && (
        <>
          <div style={{ color: C.muted, fontSize: 12, marginBottom: 10 }}>
            Use CSV com colunas: name, category, description, unit, yield, supplier, priceMode, markup, manualPrice, ingredients
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <button style={S.btnOutline} onClick={downloadTemplate}>Baixar Modelo CSV</button>
            <input style={S.inp} type="file" accept=".csv,text/csv" onChange={e => handleFile(e.target.files?.[0])} />
          </div>
          <textarea
            style={{ ...S.inp, minHeight: 160, resize: "vertical", fontFamily: "monospace" }}
            placeholder="Cole aqui o CSV ou use upload do arquivo..."
            value={csvText}
            onChange={e => { setCsvText(e.target.value); setRowsPreview([]); setErrors([]); setPendingIngs([]); }}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button style={S.btnPrimary} onClick={parseImport}>Validar Planilha</button>
          </div>
        </>
      )}

      {mode === "nfe" && (
        <>
          <div style={{ color: C.muted, fontSize: 12, marginBottom: 10 }}>
            Envie uma foto da nota fiscal brasileira. O sistema extrai os itens via IA e prepara a importação automaticamente.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
            <input style={S.inp} type="password" value={aiKey} onChange={e => setAiKey(e.target.value)} placeholder="OpenAI API Key (sk-...)" />
            <input style={S.inp} value={aiModel} onChange={e => setAiModel(e.target.value)} placeholder="Modelo (ex: gpt-4.1-mini)" />
            <select style={S.inp} value={defaultSupplierId} onChange={e => setDefaultSupplierId(e.target.value)}>
              <option value="">Fornecedor padrão (obrigatório)</option>
              {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "center" }}>
            <input style={S.inp} type="file" accept="image/*" onChange={e => handleInvoiceImage(e.target.files?.[0])} />
            <button
              style={S.btnPrimary}
              onClick={() => {
                window.localStorage.setItem("ia-openai-key", aiKey);
                window.localStorage.setItem("ia-openai-model", aiModel);
                parseInvoiceWithAI();
              }}
              disabled={nfLoading}
            >
              {nfLoading ? "Extraindo..." : "Extrair Dados da Nota"}
            </button>
          </div>
          {nfFileName && (
            <div style={{ color: C.muted, fontSize: 11, marginBottom: 8 }}>
              Arquivo: {nfFileName}
            </div>
          )}
          {nfImageDataUrl && (
            <div style={{ marginBottom: 8, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden", maxHeight: 180, background: C.bg }}>
              <img src={nfImageDataUrl} alt="Nota fiscal" style={{ width: "100%", objectFit: "contain", maxHeight: 180 }} />
            </div>
          )}
        </>
      )}

      {errors.length > 0 && (
        <div style={{ marginTop: 12, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: 10 }}>
          <div style={{ color: C.rose, fontSize: 12, marginBottom: 6 }}>Erros encontrados ({errors.length})</div>
          <div style={{ maxHeight: 120, overflow: "auto", color: C.muted, fontSize: 11, fontFamily: "monospace" }}>
            {errors.map((err, i) => <div key={i}>{err}</div>)}
          </div>
        </div>
      )}

      {rowsPreview.length > 0 && (
        <div style={{ marginTop: 12, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: 10 }}>
          <div style={{ color: C.green, fontSize: 12, marginBottom: 8 }}>
            Produtos prontos para importar: {rowsPreview.length}
          </div>
          {mode === "nfe" && pendingIngs.length > 0 && (
            <div style={{ color: C.muted, fontSize: 11, marginBottom: 8 }}>
              Ingredientes a criar/atualizar: {pendingIngs.length}
            </div>
          )}
          <div style={{ maxHeight: 160, overflow: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
            {rowsPreview.slice(0, 20).map(p => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span style={{ color: C.text }}>{p.name}</span>
                <span style={{ color: C.muted }}>{fmt(p.manualPrice || 0)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 14 }}>
        <ModalFooter onClose={onClose} onSave={saveImport} />
      </div>
    </Modal>
  );
}

function ModalProd({ prod, ctx, onClose }) {
  const { ings, suppliers, setIngs, setProds, showToast } = ctx;
  const [name, setName] = useState(prod?.name ?? "");
  const [cat, setCat] = useState(prod?.category ?? "");
  const [desc, setDesc] = useState(prod?.description ?? "");
  const [unit, setUnit] = useState(prod?.unit ?? "unid");
  const [supplierId, setSupplierId] = useState(prod?.supplierId ?? (suppliers[0]?.id || ""));
  const [yld, setYld] = useState(prod?.yield ?? 1);
  const [mode, setMode] = useState(prod?.priceMode ?? "markup");
  const [markup, setMarkup] = useState(prod?.markup ?? 2);
  const [manual, setManual] = useState(prod?.manualPrice ?? "");
  const [items, setItems] = useState(prod?.ingredients ?? []);
  const [newIngName, setNewIngName] = useState("");
  const [newIngUnit, setNewIngUnit] = useState("kg");
  const [newIngPrice, setNewIngPrice] = useState("");

  const cost = items.reduce((t, pi) => {
    const ing = ings.find(i => i.id === pi.ingredientId);
    return t + (ing ? ing.price * (parseFloat(pi.qty) || 0) : 0);
  }, 0);
  const sale = mode === "manual" ? (parseFloat(manual) || 0) : cost * (parseFloat(markup) || 1);
  const margin = sale ? ((sale - cost) / sale * 100) : 0;

  function addIngredient() {
    const nameTrim = newIngName.trim();
    const priceVal = parseFloat(newIngPrice) || 0;
    if (!nameTrim || priceVal <= 0) return;

    const existing = ings.find(i => i.name.trim().toLowerCase() === nameTrim.toLowerCase());
    if (existing) {
      setItems(it => [...it, { ingredientId: existing.id, qty: 1 }]);
      showToast("Ingrediente ja existente adicionado ao produto.", C.amber);
      setNewIngName("");
      setNewIngPrice("");
      return;
    }

    const newId = uid();
    setIngs(is => [...is, { id: newId, name: nameTrim, unit: newIngUnit, price: priceVal }]);
    setItems(it => [...it, { ingredientId: newId, qty: 1 }]);
    setNewIngName("");
    setNewIngPrice("");
    setNewIngUnit("kg");
    showToast("Ingrediente criado e adicionado ao produto!");
  }

  function save() {
    if (!name.trim()) return;
    if (!supplierId) {
      showToast("Selecione um fornecedor para o produto.", C.rose);
      return;
    }
    const data = {
      id: prod?.id || uid(), name, category: cat, description: desc, unit, yield: parseFloat(yld) || 1,
      supplierId,
      priceMode: mode, markup: parseFloat(markup) || 1, manualPrice: mode === "manual" ? (parseFloat(manual) || null) : null,
      ingredients: items.map(pi => ({ ingredientId: pi.ingredientId, qty: parseFloat(pi.qty) || 0 }))
    };
    if (prod) setProds(ps => ps.map(p => p.id === prod.id ? data : p));
    else setProds(ps => [...ps, data]);
    showToast(prod ? "Produto atualizado!" : "Produto criado!"); onClose();
  }

  return (
    <Modal title={prod ? "Editar Produto" : "Novo Produto"} onClose={onClose} wide>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
        <Field label="Nome *" span><input style={S.inp} value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Massa de Chocolate" /></Field>
        <Field label="Categoria"><input style={S.inp} value={cat} onChange={e => setCat(e.target.value)} placeholder="Ex: Massas" /></Field>
        <Field label="Descrição" span><input style={S.inp} value={desc} onChange={e => setDesc(e.target.value)} placeholder="Descrição opcional" /></Field>
        <Field label="Unidade de Venda"><select style={S.inp} value={unit} onChange={e => setUnit(e.target.value)}>
          {["unid", "kg", "g", "L", "ml", "porção", "caixa", "dúzia"].map(u => <option key={u}>{u}</option>)}
        </select></Field>
        <Field label="Fornecedor *"><select style={S.inp} value={supplierId} onChange={e => setSupplierId(e.target.value)}>
          {!suppliers.length && <option value="">Nenhum fornecedor cadastrado</option>}
          {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select></Field>
        <Field label="Rendimento (yield)"><input style={S.inp} type="number" step="0.1" value={yld} onChange={e => setYld(e.target.value)} /></Field>
        <Field label="Modo de Preço" span>
          <div style={{ display: "flex", gap: 8 }}>
            {[{ v: "markup", l: "Markup automático" }, { v: "manual", l: "Preço manual" }].map(({ v, l }) => (
              <button key={v} style={{ ...S.toggleBtn, ...(mode === v ? S.toggleOn : {}), flex: 1 }} onClick={() => setMode(v)}>{l}</button>
            ))}
          </div>
        </Field>
        {mode === "markup"
          ? <Field label="Markup (×)"><input style={S.inp} type="number" step="0.1" value={markup} onChange={e => setMarkup(e.target.value)} /></Field>
          : <Field label="Preço de Venda (R$)"><input style={S.inp} type="number" step="0.01" value={manual} onChange={e => setManual(e.target.value)} /></Field>}
      </div>
      {!suppliers.length && (
        <div style={{ color: C.rose, fontSize: 12, marginBottom: 14 }}>
          Cadastre um fornecedor antes de salvar o produto.
        </div>
      )}

      <div style={{ color: C.muted, fontSize: 10, fontWeight: 700, letterSpacing: 2, marginBottom: 10 }}>INGREDIENTES</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
        {items.map((pi, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <select style={{ ...S.inp, flex: 2 }} value={pi.ingredientId}
              onChange={e => setItems(items.map((x, j) => j === i ? { ...x, ingredientId: e.target.value } : x))}>
              {ings.map(ing => <option key={ing.id} value={ing.id}>{ing.name} — {fmt(ing.price)}/{ing.unit}</option>)}
            </select>
            <input style={{ ...S.inp, flex: 0.8 }} type="number" step="0.01" placeholder="Qtd" value={pi.qty}
              onChange={e => setItems(items.map((x, j) => j === i ? { ...x, qty: e.target.value } : x))} />
            <span style={{ color: C.muted, fontFamily: "monospace", fontSize: 12, minWidth: 60 }}>
              {fmt((ings.find(ii => ii.id === pi.ingredientId)?.price || 0) * (parseFloat(pi.qty) || 0))}
            </span>
            <IcoBtn onClick={() => setItems(items.filter((_, j) => j !== i))}>{"\u2716"}</IcoBtn>
          </div>
        ))}
        <button
          style={S.btnOutline}
          onClick={() => setItems([...items, { ingredientId: ings[0]?.id || "", qty: 1 }])}
          disabled={!ings.length}
        >
          + Ingrediente Existente
        </button>
      </div>

      <div style={{ color: C.muted, fontSize: 10, fontWeight: 700, letterSpacing: 2, marginBottom: 10 }}>NOVO INGREDIENTE</div>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr auto", gap: 8, marginBottom: 14 }}>
        <input style={S.inp} value={newIngName} onChange={e => setNewIngName(e.target.value)} placeholder="Nome do ingrediente" />
        <select style={S.inp} value={newIngUnit} onChange={e => setNewIngUnit(e.target.value)}>
          {["kg", "g", "L", "ml", "unid", "xicara", "colher", "pacote", "duzia"].map(u => <option key={u}>{u}</option>)}
        </select>
        <input style={S.inp} type="number" step="0.01" value={newIngPrice} onChange={e => setNewIngPrice(e.target.value)} placeholder="Preço/unid" />
        <button style={S.btnPrimary} onClick={addIngredient}>Criar e usar</button>
      </div>

      <div style={{ display: "flex", gap: 14, padding: "12px 16px", background: C.bg, borderRadius: 10, fontFamily: "monospace", fontSize: 12 }}>
        <span style={{ color: C.muted }}>Custo Ing: <span style={{ color: C.text }}>{fmt(cost)}</span></span>
        <span style={{ color: C.muted }}>Preço Venda: <span style={{ color: C.teal }}>{fmt(sale)}</span></span>
        <span style={{ color: C.muted }}>Margem: <span style={{ color: margin > 30 ? C.green : margin > 15 ? C.amber : C.rose, fontWeight: 700 }}>{margin.toFixed(1)}%</span></span>
      </div>
      <ModalFooter onClose={onClose} onSave={save} />
    </Modal>
  );
}

function ModalRecipe({ recipe, ctx, onClose }) {
  const { prods, ings, setRecipes, showToast } = ctx;
  const [name, setName] = useState(recipe?.name ?? "");
  const [cat, setCat] = useState(recipe?.category ?? "");
  const [desc, setDesc] = useState(recipe?.description ?? "");
  const [prepMode, setPrepMode] = useState(recipe?.prepMode ?? "");
  const [images, setImages] = useState(() => {
    if (Array.isArray(recipe?.images) && recipe.images.length) return recipe.images.filter(Boolean);
    if (recipe?.image) return [recipe.image];
    return [];
  });
  const [photoUrl, setPhotoUrl] = useState("");
  const [tab, setTab] = useState("dados");
  const [yld, setYld] = useState(recipe?.yield ?? 1);
  const [yUnit, setYUnit] = useState(recipe?.yieldUnit ?? "unidades");
  const [markup, setMarkup] = useState(recipe?.markup ?? 2);
  const [batches, setBatches] = useState(recipe?.monthlyBatches ?? 0);
  const [items, setItems] = useState(recipe?.products ?? []);

  const cost = items.reduce((t, rp) => {
    const p = prods.find(x => x.id === rp.productId);
    return t + (p ? salePriceOfProduct(p, ings) * (parseFloat(rp.qty) || 0) : 0);
  }, 0);
  const yieldNum = parseFloat(yld) || 1;
  const batchesNum = parseInt(batches) || 0;
  const unitCost = cost / yieldNum;
  const saleU = unitCost * (parseFloat(markup) || 1);
  const marginPct = saleU ? ((saleU - unitCost) / saleU * 100) : 0;
  const monthlyRevenue = saleU * yieldNum * batchesNum;
  const monthlyCost = unitCost * yieldNum * batchesNum;
  const monthlyProfit = monthlyRevenue - monthlyCost;
  const coverImage = images[0] || "";

  function handleImageFiles(fileList) {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    Promise.all(
      files.map(file => new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => resolve("");
        reader.readAsDataURL(file);
      }))
    ).then((newImages) => {
      const valid = newImages.filter(Boolean);
      if (!valid.length) return;
      setImages(prev => [...prev, ...valid]);
    });
  }

  function addImageFromUrl() {
    const next = photoUrl.trim();
    if (!next) return;
    setImages(prev => (prev.includes(next) ? prev : [...prev, next]));
    setPhotoUrl("");
  }

  function removeImageAt(idx) {
    setImages(prev => prev.filter((_, i) => i !== idx));
  }

  function save() {
    if (!name.trim()) return;
    const baseData = {
      id: recipe?.id || uid(), name, category: cat, yield: parseFloat(yld) || 1, yieldUnit: yUnit,
      markup: parseFloat(markup) || 1, monthlyBatches: parseInt(batches) || 0,
      image: coverImage,
      images,
      description: desc,
      prepMode,
      products: items.map(rp => ({ productId: rp.productId, qty: parseFloat(rp.qty) || 1 })),
      createdAt: recipe?.createdAt || new Date()
    };

    if (recipe) {
      setRecipes(rs => rs.map(r => {
        if (r.id !== recipe.id) return r;
        const normalized = ensureRecipeVersions(r);
        const versions = normalized.versionHistory || [];
        const nextVersion = (versions[versions.length - 1]?.version || versions.length) + 1;
        return {
          ...baseData,
          versionHistory: [
            ...versions,
            recipeVersionSnapshot(baseData, nextVersion, new Date(), "update"),
          ],
        };
      }));
    } else {
      const createdAt = new Date();
      const data = { ...baseData, createdAt };
      setRecipes(rs => [
        ...rs,
        {
          ...data,
          versionHistory: [recipeVersionSnapshot(data, 1, createdAt, "create")],
        },
      ]);
    }

    showToast(recipe ? "Receita atualizada!" : "Receita criada!"); onClose();
  }

  return (
    <Modal title={recipe ? "Editar Receita" : "Nova Receita"} onClose={onClose} wide>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { key: "dados", label: "Dados" },
            { key: "descricao", label: "Descrição" },
            { key: "fotos", label: "Fotos" },
            { key: "produtos", label: "Produtos" },
          ].map(t => (
            <button key={t.key} style={{ ...S.toggleBtn, ...(tab === t.key ? S.toggleOn : {}) }} onClick={() => setTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === "dados" && (
          <div style={{ ...S.card, padding: "14px 14px 12px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 10 }}>
              <Field label="Nome *" span><input style={S.inp} value={name} onChange={e => setName(e.target.value)} /></Field>
              <Field label="Categoria"><input style={S.inp} value={cat} onChange={e => setCat(e.target.value)} /></Field>
              <Field label="Rendimento"><input style={S.inp} type="number" value={yld} onChange={e => setYld(e.target.value)} /></Field>
              <Field label="Unidade"><input style={S.inp} value={yUnit} onChange={e => setYUnit(e.target.value)} /></Field>
              <Field label="Markup (x)"><input style={S.inp} type="number" step="0.1" value={markup} onChange={e => setMarkup(e.target.value)} /></Field>
              <Field label="Lotes/Mês"><input style={S.inp} type="number" value={batches} onChange={e => setBatches(e.target.value)} /></Field>
            </div>
          </div>
        )}

        {tab === "descricao" && (
          <div style={{ ...S.card, padding: "14px 14px 12px" }}>
            <Field label="Descrição da Receita">
              <textarea
                style={{ ...S.inp, minHeight: 120, resize: "vertical", fontFamily: "inherit" }}
                value={desc}
                onChange={e => setDesc(e.target.value)}
                placeholder="Descreva a receita, observações e diferenciais."
              />
            </Field>
            <div style={{ height: 10 }} />
            <Field label="Modo de Preparo">
              <textarea
                style={{ ...S.inp, minHeight: 150, resize: "vertical", fontFamily: "inherit" }}
                value={prepMode}
                onChange={e => setPrepMode(e.target.value)}
                placeholder={"Ex:\n1) Misture os ingredientes secos.\n2) Adicione os líquidos.\n3) Asse por 35 min a 180°C."}
              />
            </Field>
          </div>
        )}

        {tab === "fotos" && (
          <div style={{ ...S.card, padding: "14px 14px 12px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8, marginBottom: 8 }}>
              <input
                style={S.inp}
                placeholder="https://imagem..."
                value={photoUrl}
                onChange={e => setPhotoUrl(e.target.value)}
              />
              <button style={S.btnOutline} onClick={addImageFromUrl}>Adicionar URL</button>
            </div>
            <input style={S.inp} type="file" accept="image/*" multiple onChange={e => handleImageFiles(e.target.files)} />
            <div style={{ color: C.muted, fontSize: 11, marginTop: 8 }}>
              A primeira foto da lista é usada como capa da receita.
            </div>
            <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 8 }}>
              {images.map((img, idx) => (
                <div key={`${img}-${idx}`} style={{ position: "relative", borderRadius: 10, overflow: "hidden", border: `1px solid ${idx === 0 ? C.teal : C.border2}`, background: C.border, height: 96 }}>
                  <img src={img} alt={`Foto ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <button
                    style={{ position: "absolute", top: 6, right: 6, width: 22, height: 22, borderRadius: 999, border: "none", background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: 12 }}
                    onClick={() => removeImageAt(idx)}
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
            {!images.length && (
              <div style={{ marginTop: 10, color: C.muted, fontSize: 12 }}>
                Nenhuma foto adicionada.
              </div>
            )}
          </div>
        )}

        {tab === "produtos" && (
          <div style={{ ...S.card, padding: "14px 14px 12px" }}>
            <div style={{ color: C.muted, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, marginBottom: 8 }}>PRODUTOS DA RECEITA</div>
            {prods.length === 0 && <div style={{ color: C.rose, fontSize: 13, marginBottom: 10 }}>{"\u26A0"} Nenhum produto cadastrado. Cadastre produtos primeiro.</div>}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {items.map((rp, i) => {
                const prod = prods.find(p => p.id === rp.productId);
                const sub = (prod ? salePriceOfProduct(prod, ings) : 0) * (parseFloat(rp.qty) || 0);
                return (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 80px 100px 28px", gap: 8, alignItems: "center" }}>
                    <select
                      style={S.inp}
                      value={rp.productId}
                      onChange={e => setItems(items.map((x, j) => j === i ? { ...x, productId: e.target.value } : x))}
                    >
                      {prods.map(p => <option key={p.id} value={p.id}>{p.name} — {fmt(salePriceOfProduct(p, ings))}/{p.unit}</option>)}
                    </select>
                    <input
                      style={S.inp}
                      type="number"
                      step="0.01"
                      placeholder="Qtd"
                      value={rp.qty}
                      onChange={e => setItems(items.map((x, j) => j === i ? { ...x, qty: e.target.value } : x))}
                    />
                    <div style={{ color: C.amber, fontFamily: "monospace", fontWeight: 700, textAlign: "right" }}>{fmt(sub)}</div>
                    <IcoBtn onClick={() => setItems(items.filter((_, j) => j !== i))}>{"\u2716"}</IcoBtn>
                  </div>
                );
              })}
            </div>
            <button style={{ ...S.btnOutline, marginTop: 10 }} onClick={() => setItems([...items, { productId: prods[0]?.id || "", qty: 1 }])} disabled={!prods.length}>+ Adicionar Produto</button>
          </div>
        )}

        <div style={{ ...S.card, padding: "10px 12px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(100px,1fr))", gap: 8 }}>
            {[
              { l: "Custo total", v: fmt(cost), c: C.text },
              { l: "Custo/unid", v: fmt(unitCost), c: C.amber },
              { l: "Venda/unid", v: fmt(saleU), c: C.teal },
              { l: "Margem", v: `${marginPct.toFixed(1)}%`, c: marginPct > 30 ? C.green : marginPct > 15 ? C.amber : C.rose },
              { l: "Lucro/mês", v: fmt(monthlyProfit), c: monthlyProfit >= 0 ? C.green : C.rose },
            ].map((s, i) => (
              <div key={i} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 9, padding: "8px 10px" }}>
                <div style={{ color: C.muted, fontSize: 10, marginBottom: 4 }}>{s.l}</div>
                <div style={{ color: s.c, fontFamily: "monospace", fontWeight: 700, fontSize: 13 }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ModalFooter onClose={onClose} onSave={save} />
    </Modal>
  );
}

function ModalProdDet({ prod, ctx, onClose }) {
  const { ings, recipes } = ctx;
  const cost = ingCostOfProduct(prod, ings);
  const sale = salePriceOfProduct(prod, ings);
  const margin = sale ? ((sale - cost) / sale * 100) : 0;
  const usedIn = recipes.filter(r => r.products.some(rp => rp.productId === prod.id));
  const ingBreak = prod.ingredients.map(pi => {
    const ing = ings.find(i => i.id === pi.ingredientId);
    return { name: (ing?.name || "?").split(" ").slice(0, 2).join(" "), value: parseFloat(((ing?.price || 0) * pi.qty).toFixed(2)) };
  });

  return (
    <Modal title={prod.name} onClose={onClose} wide>
      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            <Tag color={C.teal}>{prod.category}</Tag>
            <Tag color={prod.priceMode === "manual" ? C.amber : C.violet}>{prod.priceMode === "manual" ? "Preço Manual" : `Markup ${prod.markup}×`}</Tag>
          </div>
          {prod.description && <div style={{ color: C.muted, fontSize: 13, marginBottom: 16 }}>{prod.description}</div>}
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>{["Ingrediente", "Qtd", "Preço/un", "Subtotal"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
            <tbody>
              {prod.ingredients.map((pi, i) => {
                const ing = ings.find(ii => ii.id === pi.ingredientId);
                const sub = (ing?.price || 0) * pi.qty;
                return (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={S.td}>{ing?.name}</td>
                    <td style={{ ...S.td, color: C.muted }}>{pi.qty} {ing?.unit}</td>
                    <td style={{ ...S.td, fontFamily: "monospace", color: C.muted }}>{fmt(ing?.price || 0)}</td>
                    <td style={{ ...S.td, fontFamily: "monospace", color: C.amber }}>{fmt(sub)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            {[
              { l: "Custo Ing.", v: fmt(cost), c: C.text },
              { l: "Preço Venda", v: fmt(sale), c: C.teal, a: true },
              { l: "Margem", v: `${margin.toFixed(1)}%`, c: margin > 30 ? C.green : margin > 15 ? C.amber : C.rose, a: true },
            ].map((s, i) => (
              <div key={i} style={{ flex: 1, background: C.border, borderRadius: 10, padding: "12px 14px", border: `1px solid ${s.a ? C.teal + "44" : C.border}` }}>
                <div style={{ color: C.muted, fontSize: 10, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{s.l}</div>
                <div style={{ color: s.c, fontWeight: 700, fontSize: 16, fontFamily: "monospace" }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ width: 200, flexShrink: 0 }}>
          <div style={{ color: C.muted, fontSize: 11, marginBottom: 8 }}>Composição</div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={ingBreak} innerRadius={35} outerRadius={60} dataKey="value" paddingAngle={3}>
                {ingBreak.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
              </Pie>
              <Tooltip contentStyle={TT} labelStyle={{ color: C.text }} itemStyle={{ color: C.text }} formatter={v => [fmt(v)]} />
            </PieChart>
          </ResponsiveContainer>
          {usedIn.length > 0 && (
            <>
              <div style={{ color: C.muted, fontSize: 11, margin: "12px 0 6px" }}>USADO NAS RECEITAS</div>
              {usedIn.map(r => <div key={r.id} style={{ ...Tag.style, marginBottom: 4 }}><Tag color={C.violet}>{r.name}</Tag></div>)}
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}

function ModalRecDet({ recipe, ctx, onClose }) {
  const { ings, prods, opCosts, recipes, history, setPage, setRecipeHistoryId } = ctx;
  const cost = costOfRecipe(recipe, prods, ings);
  const opU = opPerUnit(opCosts, recipes, recipe.id);
  const totalU = cost / recipe.yield + opU;
  const saleU = totalU * recipe.markup;
  const margin = saleU ? ((saleU - totalU) / saleU * 100) : 0;
  const gallery = Array.isArray(recipe.images) && recipe.images.length
    ? recipe.images.filter(Boolean)
    : (recipe.image ? [recipe.image] : []);
  const [imgIdx, setImgIdx] = useState(0);
  const currentImage = gallery[imgIdx] || "";
  const prodBreak = recipe.products.map(rp => {
    const p = prods.find(x => x.id === rp.productId);
    const sale = p ? salePriceOfProduct(p, ings) * rp.qty : 0;
    return { name: (p?.name || "?").split(" ").slice(0, 2).join(" "), value: parseFloat(sale.toFixed(2)) };
  });
  const versions = (recipe.versionHistory?.length
    ? recipe.versionHistory
    : [{ version: 1, changedAt: recipe.createdAt || new Date(), reason: "create" }]
  ).slice().reverse();
  const recHistory = useMemo(() => {
    const costTl = priceTimelineFromHistory(
      ings,
      history,
      (priceMap) => recipeCostUnitFromPriceMap(recipe, prods, priceMap, opCosts, recipes)
    );
    const saleTl = priceTimelineFromHistory(
      ings,
      history,
      (priceMap) => recipeSaleUnitFromPriceMap(recipe, prods, priceMap, opCosts, recipes)
    );
    const base = costTl.slice(-24);
    return base.map((p, idx) => ({
      date: p.date,
      label: new Date(p.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      cost: p.value,
      price: saleTl[saleTl.length - base.length + idx]?.value ?? p.value
    }));
  }, [recipe, ings, history, prods, opCosts, recipes]);
  function openHistoryPage() {
    setRecipeHistoryId(recipe.id);
    setPage("receitaHistorico");
    onClose();
  }

  return (
    <Modal title={recipe.name} onClose={onClose} wide>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ ...S.card, padding: "12px 14px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Tag color={C.amber}>{recipe.category || "Sem categoria"}</Tag>
            <Tag color={C.violet}>Rend. {recipe.yield} {recipe.yieldUnit}</Tag>
            <Tag color={C.teal}>{recipe.monthlyBatches || 0} lotes/mês</Tag>
            <Tag color={margin > 30 ? C.green : margin > 15 ? C.amber : C.rose}>Margem {margin.toFixed(1)}%</Tag>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: 12 }}>
            <div>
              <div style={{ width: "100%", height: 240, borderRadius: 12, border: `1px solid ${C.border2}`, background: C.border, overflow: "hidden" }}>
                {currentImage
                  ? <img src={currentImage} alt={recipe.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: C.muted }}>Sem foto</div>}
              </div>
              {gallery.length > 1 && (
                <div style={{ display: "flex", gap: 8, marginTop: 8, overflowX: "auto", paddingBottom: 2 }}>
                  {gallery.map((img, i) => (
                    <button
                      key={`${img}-${i}`}
                      style={{ width: 64, height: 64, borderRadius: 10, border: `2px solid ${i === imgIdx ? C.teal : C.border2}`, padding: 0, overflow: "hidden", background: C.border, flexShrink: 0 }}
                      onClick={() => setImgIdx(i)}
                    >
                      <img src={img} alt={`Foto ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              {[
                { l: "Custo Produtos", v: fmt(cost), c: C.text },
                { l: "Op./unidade", v: fmt(opU), c: C.violet },
                { l: "Total/unidade", v: fmt(totalU), c: C.amber },
                { l: "Venda/unidade", v: fmt(saleU), c: C.teal },
              ].map((s, i) => (
                <div key={i} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 12px" }}>
                  <div style={{ color: C.muted, fontSize: 10, marginBottom: 4 }}>{s.l}</div>
                  <div style={{ color: s.c, fontWeight: 700, fontSize: 15, fontFamily: "monospace" }}>{s.v}</div>
                </div>
              ))}
              <div style={{ ...S.card, padding: "10px 12px" }}>
                <ChartHeader title="Custo por Produto" sub="participação" />
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={prodBreak} innerRadius={34} outerRadius={58} dataKey="value" paddingAngle={3}>
                      {prodBreak.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={TT} labelStyle={{ color: C.text }} itemStyle={{ color: C.text }} formatter={v => [fmt(v)]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div style={{ ...S.card, padding: "12px 14px" }}>
          <div style={{ color: C.muted, fontSize: 11, marginBottom: 8 }}>DETALHES</div>
          {recipe.description && <div style={{ color: C.text, fontSize: 13, lineHeight: 1.6, marginBottom: recipe.prepMode ? 12 : 0 }}>{recipe.description}</div>}
          {recipe.prepMode && (
            <div style={{ color: C.text, fontSize: 12, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{recipe.prepMode}</div>
          )}
          {!recipe.description && !recipe.prepMode && (
            <div style={{ color: C.muted, fontSize: 12 }}>Nenhuma descrição ou modo de preparo cadastrado.</div>
          )}
        </div>

        <div style={{ ...S.card, padding: "12px 14px" }}>
          <ChartHeader title="Produtos da Receita" sub={`${recipe.products.length} item(ns)`} />
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>{["Produto", "Qtd", "Preço/unid", "Subtotal"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
            <tbody>
              {recipe.products.map((rp, i) => {
                const p = prods.find(x => x.id === rp.productId);
                const sale = p ? salePriceOfProduct(p, ings) * rp.qty : 0;
                return (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={S.td}>{p?.name}</td>
                    <td style={{ ...S.td, color: C.muted }}>{rp.qty}</td>
                    <td style={{ ...S.td, fontFamily: "monospace", color: C.muted }}>{fmt(p ? salePriceOfProduct(p, ings) : 0)}</td>
                    <td style={{ ...S.td, fontFamily: "monospace", color: C.amber }}>{fmt(sale)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 12 }}>
          <div style={{ ...S.card, padding: "12px 14px", cursor: "pointer" }} onClick={openHistoryPage} title="Abrir em página dedicada">
            <ChartHeader title="Histórico de Custo" sub="custo e preço por unidade" />
            <div style={{ marginBottom: 8, display: "flex", justifyContent: "flex-end" }}>
              <button
                style={{ ...S.btnOutline, padding: "6px 10px", fontSize: 11 }}
                onClick={(e) => {
                  e.stopPropagation();
                  openHistoryPage();
                }}
              >
                Abrir gráfico expandido
              </button>
            </div>
            {recHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={recHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis dataKey="label" tick={{ fill: C.muted, fontSize: 11 }} />
                  <YAxis tick={{ fill: C.muted, fontSize: 11 }} tickFormatter={(v) => fmt(v)} width={62} />
                  <Tooltip contentStyle={TT} labelStyle={{ color: C.text }} itemStyle={{ color: C.text }} formatter={(v, n) => [fmt(v), n === "cost" ? "Custo/unid" : "Preço/unid"]} labelFormatter={(_, p) => p?.[0]?.payload?.date ? new Date(p[0].payload.date).toLocaleDateString("pt-BR") : ""} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="cost" stroke={C.rose} strokeWidth={2} dot={false} activeDot={{ r: 4 }} name="Custo" />
                  <Line type="monotone" dataKey="price" stroke={C.amber} strokeWidth={2} dot={false} activeDot={{ r: 4 }} name="Preço" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ color: C.muted, fontSize: 12 }}>Sem histórico para exibir no momento.</div>
            )}
            <div style={{ color: C.muted, fontSize: 10, marginTop: 6 }}>Clique no gráfico para abrir em tela completa</div>
          </div>

          <div style={{ ...S.card, padding: "12px 14px" }}>
            <div style={{ color: C.muted, fontSize: 11, marginBottom: 8 }}>HISTÓRICO DE VERSÕES</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 280, overflow: "auto", paddingRight: 4 }}>
              {versions.map((v, i) => (
                <div key={v.id || i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, gap: 8 }}>
                  <span style={{ color: C.text }}>v{v.version} - {v.reason === "create" ? "Criação" : "Atualização"}</span>
                  <span style={{ color: C.muted, fontFamily: "monospace", whiteSpace: "nowrap" }}>{new Date(v.changedAt).toLocaleDateString("pt-BR")} {new Date(v.changedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function ModalOpCost({ oc, ctx, onClose }) {
  const { setOpCosts, showToast } = ctx;
  const [name, setName] = useState(oc?.name ?? "");
  const [cat, setCat] = useState(oc?.category ?? OP_CATS[0]);
  const [costType, setCostType] = useState(oc?.costType ?? OP_TYPES[0]);
  const [costDate, setCostDate] = useState(oc?.date ?? dateInputOf(new Date()));
  const [amt, setAmt] = useState(oc?.amount ?? "");
  const [rec, setRec] = useState(oc?.recurrence ?? "monthly");
  const [note, setNote] = useState(oc?.note ?? "");

  const monthly = (() => {
    const v = parseFloat(amt) || 0;
    if (rec === "weekly") return v * 4.33;
    if (rec === "annual") return v / 12;
    return v;
  })();

  function save() {
    if (!name.trim() || !amt) return;
    const data = { id: oc?.id || uid(), name, category: cat, costType, date: costDate, amount: parseFloat(amt), recurrence: rec, note };
    if (oc) setOpCosts(cs => cs.map(c => c.id === oc.id ? data : c));
    else setOpCosts(cs => [...cs, data]);
    showToast(oc ? "Custo atualizado!" : "Custo cadastrado!"); onClose();
  }

  return (
    <Modal title={oc ? "Editar Custo" : "Novo Custo Operacional"} onClose={onClose}>
      <Field label="Nome *"><input style={S.inp} value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Conta de Luz" /></Field>
      <div style={{ height: 12 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Categoria"><select style={S.inp} value={cat} onChange={e => setCat(e.target.value)}>
          {OP_CATS.map(c => <option key={c} value={c}>{OP_ICONS[c]} {c}</option>)}
        </select></Field>
        <Field label="Tipo de Custo"><select style={S.inp} value={costType} onChange={e => setCostType(e.target.value)}>
          {OP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select></Field>
        <Field label="Data"><input style={S.inp} type="date" value={costDate} onChange={e => setCostDate(e.target.value)} /></Field>
        <Field label="Recorrência"><select style={S.inp} value={rec} onChange={e => setRec(e.target.value)}>
          <option value="monthly">Mensal</option>
          <option value="weekly">Semanal</option>
          <option value="annual">Anual</option>
        </select></Field>
        <Field label="Valor (R$)" span><input style={S.inp} type="number" step="0.01" value={amt} onChange={e => setAmt(e.target.value)} /></Field>
        <Field label="Observação" span><input style={S.inp} value={note} onChange={e => setNote(e.target.value)} placeholder="Opcional" /></Field>
      </div>
      {amt && (
        <div style={{ marginTop: 14, padding: "10px 14px", background: C.bg, borderRadius: 10, display: "flex", gap: 20, fontFamily: "monospace", fontSize: 12 }}>
          <span style={{ color: C.muted }}>Equiv./mês: <span style={{ color: C.amber, fontWeight: 700 }}>{fmt(monthly)}</span></span>
          <span style={{ color: C.muted }}>Por dia: <span style={{ color: C.teal }}>{fmt(monthly / 30)}</span></span>
        </div>
      )}
      <ModalFooter onClose={onClose} onSave={save} />
    </Modal>
  );
}

function ModalSupplier({ supplier, ctx, onClose }) {
  const { setSuppliers, showToast } = ctx;
  const [name, setName] = useState(supplier?.name ?? "");
  const [contact, setContact] = useState(supplier?.contact ?? "");
  const [phone, setPhone] = useState(supplier?.phone ?? "");
  const [email, setEmail] = useState(supplier?.email ?? "");
  const [city, setCity] = useState(supplier?.city ?? "");
  const [note, setNote] = useState(supplier?.note ?? "");

  function save() {
    if (!name.trim()) return;
    const data = { id: supplier?.id || uid(), name, contact, phone, email, city, note };
    if (supplier) setSuppliers(cs => cs.map(c => c.id === supplier.id ? data : c));
    else setSuppliers(cs => [...cs, data]);
    showToast(supplier ? "Fornecedor atualizado!" : "Fornecedor cadastrado!");
    onClose();
  }

  return (
    <Modal title={supplier ? "Editar Fornecedor" : "Novo Fornecedor"} onClose={onClose}>
      <Field label="Nome *"><input style={S.inp} value={name} onChange={e => setName(e.target.value)} /></Field>
      <div style={{ height: 12 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Contato"><input style={S.inp} value={contact} onChange={e => setContact(e.target.value)} /></Field>
        <Field label="Telefone"><input style={S.inp} value={phone} onChange={e => setPhone(e.target.value)} /></Field>
        <Field label="Email" span><input style={S.inp} value={email} onChange={e => setEmail(e.target.value)} /></Field>
        <Field label="Cidade"><input style={S.inp} value={city} onChange={e => setCity(e.target.value)} /></Field>
        <Field label="Observação" span><input style={S.inp} value={note} onChange={e => setNote(e.target.value)} placeholder="Opcional" /></Field>
      </div>
      <ModalFooter onClose={onClose} onSave={save} />
    </Modal>
  );
}

// SHARED COMPONENTS
function Modal({ title, onClose, children, wide }) {
  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={{ ...S.modal, maxWidth: wide ? 980 : 520 }} onClick={e => e.stopPropagation()}>
        <div style={S.modalHead}>
          <h2 style={S.modalTitle}>{title}</h2>
          <button style={S.closeBtn} onClick={onClose}>{"\u2715"}</button>
        </div>
        <div style={S.modalBody}>{children}</div>
      </div>
    </div>
  );
}

function ModalFooter({ onClose, onSave }) {
  return (
    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
      <button style={S.btnOutline} onClick={onClose}>Cancelar</button>
      <button style={S.btnPrimary} onClick={onSave}>Salvar</button>
    </div>
  );
}

function Header({ eyebrow, title, right }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ ...S.pageHead, marginBottom: 12 }}>
        <div>
          <p style={S.eyebrow}>{eyebrow}</p>
          <h1 style={S.pageTitle}>{title}</h1>
        </div>
        {right}
      </div>
      <div style={{ height: 1, background: C.border }} />
    </div>
  );
}

function ChartHeader({ title, sub }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
      <span style={{ color: C.text, fontWeight: 600, fontSize: 14 }}>{title}</span>
      {sub && <span style={{ color: C.muted, fontSize: 11 }}>{sub}</span>}
    </div>
  );
}

function PaginationBar({ page, totalPages, onChange, showWhenSingle }) {
  if (totalPages <= 1 && !showWhenSingle) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 12 }}>
      <button
        style={{ ...S.btnOutline, padding: "6px 12px", fontSize: 12 }}
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page <= 1}
      >
        Anterior
      </button>
      <span style={{ color: C.muted, fontSize: 12, fontFamily: "monospace" }}>
        {page}/{totalPages}
      </span>
      <button
        style={{ ...S.btnOutline, padding: "6px 12px", fontSize: 12 }}
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
      >
        Próxima
      </button>
    </div>
  );
}

function KpiCard({ lbl, val, color, icon = "" }) {
  return (
    <div style={S.kpi} className="hov">
      {icon && <span style={{ fontSize: 20, marginBottom: 4 }}>{icon}</span>}
      <div style={{ color, fontFamily: "monospace", fontWeight: 700, fontSize: 24, margin: "4px 0 2px" }}>{val}</div>
      <div style={{ color: C.muted, fontSize: 12 }}>{lbl}</div>
      <div style={{ height: 3, background: color + "22", borderRadius: 2, marginTop: 10 }}>
        <div style={{ height: "100%", width: "65%", background: color, borderRadius: 2 }} />
      </div>
    </div>
  );
}

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

function IcoBtn({ children, onClick }) {
  return (
    <button style={{
      background: C.border, border: "none", borderRadius: 7, width: 28, height: 28,
      fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
    }}
      onClick={onClick}>{children}</button>
  );
}

function Field({ label, children, span }) {
  return (
    <div style={span ? { gridColumn: "span 2" } : {}}>
      <label style={{
        color: C.muted, fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
        textTransform: "uppercase", marginBottom: 6, display: "block"
      }}>{label}</label>
      {children}
    </div>
  );
}

// ICONS
const IcoGrid = ({ sz, cl }) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={cl} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>;
const IcoBook = ({ sz, cl }) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={cl} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>;
const IcoBox = ({ sz, cl }) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={cl} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>;
const IcoUsers = ({ sz, cl }) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={cl} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
const IcoBolt = ({ sz, cl }) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={cl} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>;
const IcoBell = ({ sz, cl }) => (
  <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={cl} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10.3 21a2.2 2.2 0 0 0 3.4 0" />
    <path d="M15.4 18H5.9a1 1 0 0 1-.7-1.7l1.1-1.1a1.8 1.8 0 0 0 .5-1.3v-3.2a5.2 5.2 0 1 1 10.4 0v3.2" />
    <circle cx="18.4" cy="16.8" r="2.1" fill={cl} stroke="none" />
  </svg>
);
const IcoBrain = ({ sz, cl }) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={cl} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2a3.5 3.5 0 0 0-3.5 3.5V7a3 3 0 0 0-2 2.82A3 3 0 0 0 6 12.64V14a3 3 0 0 0 2.34 2.93A3.5 3.5 0 0 0 11.5 21h1a3.5 3.5 0 0 0 3.16-2.07A3 3 0 0 0 18 16V14.64a3 3 0 0 0 2-2.82A3 3 0 0 0 18 9V7a3.5 3.5 0 0 0-3.5-3.5" /><path d="M9 7h.01" /><path d="M15 7h.01" /><path d="M10 11h4" /><path d="M9 15h6" /></svg>;
const IcoChatSpark = ({ sz, cl }) => (
  <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={cl} strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.2 6.2h9.6a2.6 2.6 0 0 1 2.6 2.6v4.4a2.6 2.6 0 0 1-2.6 2.6H9.5l-3 2.6v-2.6H4.2a2.6 2.6 0 0 1-2.6-2.6V8.8a2.6 2.6 0 0 1 2.6-2.6z" />
    <path d="M18.8 4.2l.55 1.45 1.45.55-1.45.55-.55 1.45-.55-1.45-1.45-.55 1.45-.55z" fill={cl} stroke="none" />
    <circle cx="21" cy="10.8" r="1" fill={cl} stroke="none" />
  </svg>
);
const IcoChart = ({ sz, cl }) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={cl} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>;
const IcoUser = ({ sz, cl }) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={cl} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="9" r="3" /><path d="M7 18c1.4-2.1 3-3 5-3s3.6.9 5 3" /></svg>;
const IcoProfile = ({ sz, cl }) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={cl} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21a8 8 0 0 0-16 0" /><circle cx="12" cy="8" r="4" /><rect x="3" y="3" width="18" height="18" rx="3" /></svg>;
const IcoLogout = ({ sz, cl }) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={cl} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>;
const IcoSun = ({ sz, cl }) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={cl} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><line x1="12" y1="2" x2="12" y2="5" /><line x1="12" y1="19" x2="12" y2="22" /><line x1="2" y1="12" x2="5" y2="12" /><line x1="19" y1="12" x2="22" y2="12" /><line x1="4.93" y1="4.93" x2="7.05" y2="7.05" /><line x1="16.95" y1="16.95" x2="19.07" y2="19.07" /><line x1="16.95" y1="7.05" x2="19.07" y2="4.93" /><line x1="4.93" y1="19.07" x2="7.05" y2="16.95" /></svg>;
const IcoMoon = ({ sz, cl }) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={cl} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3c0 5.25 4.26 9.5 9.79 9.79z" /></svg>;

// TOOLTIP
let TT = { background: C.surface, border: `1px solid ${C.border2}`, borderRadius: 8, color: C.text, fontSize: 12 };

// CSS & STYLES
let CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700;800&family=JetBrains+Mono:wght@400;700&family=Mulish:wght@300;400;500;600&display=swap');
  * { box-sizing:border-box; margin:0; padding:0; }
  body { background:${C.bg}; font-family:'Mulish',sans-serif; }
  ::-webkit-scrollbar { width:4px; }
  ::-webkit-scrollbar-track { background:${C.bg}; }
  ::-webkit-scrollbar-thumb { background:${C.border2}; border-radius:2px; }
  .hov:hover { transform:translateY(-2px); box-shadow:0 8px 32px rgba(6,182,212,0.08); transition:transform .2s, box-shadow .2s; }
  input:focus,select:focus { outline:none; border-color:${C.teal} !important; }
  .recharts-default-tooltip { background:${C.surface} !important; border:1px solid ${C.border2} !important; border-radius:8px !important; box-shadow:0 8px 24px rgba(0,0,0,.25) !important; }
  .recharts-tooltip-label, .recharts-tooltip-item, .recharts-tooltip-item-name, .recharts-tooltip-item-value { color:${C.text} !important; }
  button { cursor:pointer; transition:opacity .15s; }
  button:hover { opacity:.85; }
`;

let S = {
  root: { display: "flex", minHeight: "100vh", background: C.bg },
  sidebar: { width: 220, background: C.surface, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", padding: "24px 14px", position: "sticky", top: 0, height: "100vh" },
  brand: { display: "flex", alignItems: "center", gap: 9, marginBottom: 32 },
  dot: { width: 8, height: 8, background: C.teal, borderRadius: "50%", boxShadow: `0 0 8px ${C.teal}` },
  brandTxt: { fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 17, fontWeight: 800, color: C.text, letterSpacing: 2 },
  nav: { display: "flex", flexDirection: "column", gap: 3, flex: 1 },
  navBtn: { display: "flex", alignItems: "center", gap: 9, padding: "9px 11px", background: "transparent", border: "none", borderRadius: 9, color: C.muted, fontSize: 13, fontFamily: "'Mulish',sans-serif", position: "relative" },
  navOn: { color: C.text, background: C.border },
  navBar: { position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", width: 3, height: 16, background: C.teal, borderRadius: "2px 0 0 2px", boxShadow: `0 0 8px ${C.teal}` },
  sideFooter: { paddingTop: 16, borderTop: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 8 },
  sideChip: { background: C.border, borderRadius: 10, padding: "10px 12px" },
  sideChipLbl: { display: "block", color: C.muted, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 },
  sideChipVal: { display: "block", fontFamily: "'JetBrains Mono',monospace", fontSize: 18, fontWeight: 700 },
  sidebarLogoutBtn: { marginTop: 6, height: 36, borderRadius: 10, border: `1px solid ${C.border2}`, background: C.border, color: C.text, fontSize: 12, fontWeight: 700, fontFamily: "'Mulish',sans-serif", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 },
  topBar: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", borderBottom: `1px solid ${C.border}`, background: C.surface, position: "sticky", top: 0, zIndex: 5 },
  topBarTitle: { color: C.text, fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: 0.5 },
  profileWrap: { display: "flex", alignItems: "center", gap: 10 },
  profileEmail: { color: C.muted, fontSize: 12, fontWeight: 600, maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  profileBtn: { width: 34, height: 34, borderRadius: "50%", border: `1px solid ${C.border2}`, background: C.border, display: "inline-flex", alignItems: "center", justifyContent: "center" },
  main: { flex: 1, overflow: "auto" },
  page: { padding: "36px 42px", maxWidth: 1200, margin: "0 auto" },
  pageHead: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 },
  eyebrow: { color: C.teal, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 },
  pageTitle: { fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 32, fontWeight: 800, color: C.text },
  dateBadge: { color: C.muted, fontSize: 12, padding: "7px 14px", background: C.surface, borderRadius: 8, border: `1px solid ${C.border}` },
  grid4: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 },
  kpi: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 18px", display: "flex", flexDirection: "column" },
  row: { display: "flex", gap: 16 },
  card: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 20px" },
  listRow: { display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, cursor: "pointer", transition: "border-color .15s" },
  listRowOn: { borderColor: C.teal + "55", background: C.surface },
  listName: { color: C.text, fontWeight: 600, fontSize: 14 },
  rowActs: { display: "flex", gap: 5 },
  quickStats: { display: "flex", flexDirection: "column", gap: 7, marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.border}` },
  quickRow: { display: "flex", justifyContent: "space-between" },
  ingGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))", gap: 14 },
  ingCard: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 13, padding: 16 },
  priceIn: { background: C.bg, border: `1px solid ${C.teal}`, borderRadius: 7, padding: "4px 8px", fontSize: 16, color: C.teal, fontFamily: "'JetBrains Mono',monospace", width: 120 },
  opRow: { display: "flex", alignItems: "center", gap: 14, padding: "11px 14px", background: C.surface, borderRadius: 10, border: `1px solid ${C.border}` },
  search: { width: "100%", padding: "9px 14px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 13, color: C.text, marginBottom: 12, fontFamily: "'Mulish',sans-serif" },
  toggleBtn: { background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, padding: "7px 16px", color: C.muted, fontSize: 13, fontFamily: "'Mulish',sans-serif" },
  toggleOn: { background: C.teal + "22", borderColor: C.teal, color: C.teal },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,.82)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 },
  modal: { background: C.surface, border: `1px solid ${C.border2}`, borderRadius: 18, width: "100%", maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 24px 80px rgba(0,0,0,.6)" },
  modalHead: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 22px", borderBottom: `1px solid ${C.border}` },
  modalTitle: { fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 20, fontWeight: 700, color: C.text },
  closeBtn: { background: C.border, border: "none", borderRadius: 7, width: 28, height: 28, color: C.muted, fontSize: 13 },
  modalBody: { padding: "20px 22px", overflow: "auto", flex: 1 },
  inp: { width: "100%", padding: "9px 12px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 13, fontFamily: "'Mulish',sans-serif" },
  btnPrimary: { background: C.teal, color: C.bg, padding: "9px 20px", borderRadius: 9, border: "none", fontWeight: 700, fontSize: 13, fontFamily: "'Mulish',sans-serif" },
  btnOutline: { background: "transparent", color: C.muted, padding: "9px 20px", borderRadius: 9, border: `1px solid ${C.border}`, fontWeight: 600, fontSize: 13, fontFamily: "'Mulish',sans-serif" },
  toast: { position: "fixed", bottom: 22, right: 22, background: C.surface, border: "1px solid", padding: "10px 18px", borderRadius: 10, fontWeight: 600, zIndex: 200, fontSize: 12, fontFamily: "'JetBrains Mono',monospace" },
  th: { padding: "8px 12px", textAlign: "left", color: C.muted, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, borderBottom: `1px solid ${C.border}` },
  td: { padding: "9px 12px", color: C.text, fontSize: 13 },
  empty: { color: C.muted, textAlign: "center", padding: "48px 20px", fontSize: 14 },
};
const BASE_C = { ...THEMES.dark };
const BASE_TT = { ...TT };
const BASE_CSS = CSS;
const BASE_S = Object.fromEntries(
  Object.entries(S).map(([key, val]) => [key, { ...val }])
);

function applyThemeStyles(mode) {
  Object.assign(C, BASE_C);
  PALETTE.splice(0, PALETTE.length, BASE_C.teal, BASE_C.green, BASE_C.amber, BASE_C.rose, BASE_C.violet, BASE_C.blue);
  TT = { ...BASE_TT };
  CSS = BASE_CSS;
  S = Object.fromEntries(
    Object.entries(BASE_S).map(([key, val]) => [key, { ...val }])
  );

  if (mode === "dark") return;

  const theme = THEMES.light;
  Object.assign(C, theme);

  PALETTE.splice(0, PALETTE.length, C.teal, C.green, C.amber, C.rose, C.violet, C.blue);

  TT.background = C.surface;
  TT.border = `1px solid ${C.border2}`;
  TT.color = C.text;

  CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700;800&family=JetBrains+Mono:wght@400;700&family=Mulish:wght@300;400;500;600&display=swap');
    * { box-sizing:border-box; margin:0; padding:0; }
    body { background:${C.bg}; font-family:'Mulish',sans-serif; }
    ::-webkit-scrollbar { width:4px; }
    ::-webkit-scrollbar-track { background:${C.bg}; }
    ::-webkit-scrollbar-thumb { background:${C.border2}; border-radius:2px; }
    .hov:hover { transform:translateY(-2px); box-shadow:${C.hover}; transition:transform .2s, box-shadow .2s; }
    input:focus,select:focus { outline:none; border-color:${C.teal} !important; }
    .recharts-default-tooltip { background:${C.surface} !important; border:1px solid ${C.border2} !important; border-radius:8px !important; box-shadow:0 8px 24px rgba(0,0,0,.16) !important; }
    .recharts-tooltip-label, .recharts-tooltip-item, .recharts-tooltip-item-name, .recharts-tooltip-item-value { color:${C.text} !important; }
    button { cursor:pointer; transition:opacity .15s; }
    button:hover { opacity:.85; }
  `;

  Object.assign(S.root, { background: C.bg });
  Object.assign(S.sidebar, { background: C.surface, borderRight: `1px solid ${C.border}` });
  Object.assign(S.brandTxt, { color: C.text });
  Object.assign(S.navBtn, { color: C.muted });
  Object.assign(S.navOn, { color: C.text, background: C.border });
  Object.assign(S.navBar, { background: C.teal, boxShadow: `0 0 8px ${C.teal}` });
  Object.assign(S.sideFooter, { borderTop: `1px solid ${C.border}` });
  Object.assign(S.sideChip, { background: C.border });
  Object.assign(S.sideChipLbl, { color: C.muted });
  Object.assign(S.sidebarLogoutBtn, { background: C.border, border: `1px solid ${C.border2}`, color: C.text });
  Object.assign(S.topBar, { background: C.surface, borderBottom: `1px solid ${C.border}` });
  Object.assign(S.topBarTitle, { color: C.text });
  Object.assign(S.profileEmail, { color: C.muted });
  Object.assign(S.profileBtn, { background: C.border, border: `1px solid ${C.border2}` });
  Object.assign(S.main, { background: C.bg });
  Object.assign(S.eyebrow, { color: C.teal });
  Object.assign(S.pageTitle, { color: C.text });
  Object.assign(S.dateBadge, { color: C.muted, background: C.surface, border: `1px solid ${C.border}` });
  Object.assign(S.kpi, { background: C.surface, border: `1px solid ${C.border}` });
  Object.assign(S.card, { background: C.surface, border: `1px solid ${C.border}` });
  Object.assign(S.listRow, { background: C.surface, border: `1px solid ${C.border}` });
  Object.assign(S.listRowOn, { background: C.surface, borderColor: C.teal + "55" });
  Object.assign(S.listName, { color: C.text });
  Object.assign(S.quickStats, { borderTop: `1px solid ${C.border}` });
  Object.assign(S.ingCard, { background: C.surface, border: `1px solid ${C.border}` });
  Object.assign(S.priceIn, { background: C.bg, border: `1px solid ${C.teal}`, color: C.teal });
  Object.assign(S.opRow, { background: C.surface, border: `1px solid ${C.border}` });
  Object.assign(S.search, { background: C.bg, border: `1px solid ${C.border}`, color: C.text });
  Object.assign(S.toggleBtn, { border: `1px solid ${C.border}`, color: C.muted });
  Object.assign(S.toggleOn, { background: C.teal + "22", borderColor: C.teal, color: C.teal });
  Object.assign(S.overlay, { background: C.overlay });
  Object.assign(S.modal, { background: C.surface, border: `1px solid ${C.border2}`, boxShadow: C.shadow });
  Object.assign(S.modalHead, { borderBottom: `1px solid ${C.border}` });
  Object.assign(S.modalTitle, { color: C.text });
  Object.assign(S.closeBtn, { background: C.border, color: C.muted });
  Object.assign(S.inp, { background: C.bg, border: `1px solid ${C.border}`, color: C.text });
  Object.assign(S.btnPrimary, { background: C.teal, color: C.bg });
  Object.assign(S.btnOutline, { color: C.muted, border: `1px solid ${C.border}` });
  Object.assign(S.toast, { background: C.surface });
  Object.assign(S.th, { color: C.muted, borderBottom: `1px solid ${C.border}` });
  Object.assign(S.td, { color: C.text });
  Object.assign(S.empty, { color: C.muted });
}


