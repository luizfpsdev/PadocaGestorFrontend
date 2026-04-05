import HeaderPage from "../../components/HeaderPages";
import useStyle from "../../components/Hooks/UseStyle";
import ChartHeader from "../../components/ChartHeader";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis,
} from "recharts";

import KpiCard from "./KpiCard";

import formaterReal, {  fmtK, pct } from "../../components/Utils/formaterReal";

import { uid, dAgo } from "../../components/Utils/helpers";

const DashboardPage = () => {
  const { S,theme } = useStyle();

  let TT = { background: theme.surface, border: `1px solid ${theme.border2}`, borderRadius: 8, color: theme.text, fontSize: 12 };

  const PALETTE = [theme.teal, theme.green, theme.amber, theme.rose, theme.violet, theme.blue];

  const prodBars = [
    { name: "Pão Francês", custo: 0.5, venda: 1.5 },
    { name: "Croissant", custo: 0.8, venda: 2.5 },
    { name: "Baguete", custo: 0.6, venda: 1.8 },
  ]

  const pieData = [
    { name: "Pães", value: 40 },
    { name: "Doces", value: 25 },
    { name: "Salgados", value: 20 },
    { name: "Bebidas", value: 15 },
  ];


  const prods = [
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


const ings = [
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

  const topProds = prods.map(p => {
    const cost = ingCostOfProduct(p, ings);
    const sale = salePriceOfProduct(p, ings);
    const m = sale ? ((sale - cost) / sale * 100) : 0;
    return { name: p.name, margin: parseFloat(m.toFixed(1)), cost: parseFloat(cost.toFixed(2)), sale: parseFloat(sale.toFixed(2)) };
  }).sort((a, b) => b.margin - a.margin);



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


  const history = genHistory(ings);

  const recent = [...history].sort((a, b) => b.date - a.date).slice(0, 6);

  return (
    <div
      style={{
        backgroundColor: theme.bg,
        color: theme.text,
        display: "flex",
        justifyContent: "center",
      }}
    >

      <div style={{ width: "70%" }}>

      <HeaderPage
        eyebrow="Visão Geral"
        title="Dashboard"
        right={
          <div style={{ display: "flex", gap: 8 }}>
            <div style={S.dateBadge}>
              {new Date().toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </div>
          </div>
        }
        headerStyleCustom={{ width: "100%", marginBottom: 0 }}
      />

      
        <div style={{padding:22}}>
          {/* KPIs */}
          <div style={{ ...S.grid4, marginBottom: 20 }}>
            {[
              {
                lbl: "Produtos Cadastrados",
                val: 100,
                color: theme.violet,
                icon: "\uD83D\uDCE6",
              },
              {
                lbl: "Custo Op. Mensal",
                val: fmtK(100),
                color: theme.rose,
                icon: "\u26A1",
              },
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
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: theme.muted, fontSize: 11 }}
                  />
                  <YAxis
                    tick={{ fill: theme.muted, fontSize: 11 }}
                    tickFormatter={(v) => `R$${v}`}
                  />
                  <Tooltip
                    contentStyle={TT}
                    labelStyle={{ color: theme.text }}
                    itemStyle={{ color: theme.text }}
                    formatter={(v, n) => [
                      formaterReal(v),
                      n === "custo" ? "Custo Ing." : "Preço Venda",
                    ]}
                  />
                  <Bar
                    dataKey="custo"
                    fill={theme.rose}
                    radius={[4, 4, 0, 0]}
                    name="custo"
                  />
                  <Bar
                    dataKey="venda"
                    fill={theme.teal}
                    radius={[4, 4, 0, 0]}
                    name="venda"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ ...S.card, flex: 1 }}>
              <ChartHeader title="Produtos por Categoria" />
              <ResponsiveContainer width="100%" height={210}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    dataKey="value"
                    paddingAngle={4}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={TT}
                    labelStyle={{ color: theme.text }}
                    itemStyle={{ color: theme.text }}
                  />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ color: theme.muted, fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Charts row 2 */}
          <div style={{ ...S.row, marginBottom: 16 }}>
            <div style={{ ...S.card, flex: 1 }}>
              <ChartHeader title="Ranking de Margem por Produto" />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  marginTop: 4,
                }}
              >
                {topProds.map((p, i) => (
                  <div
                    key={i}
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <span
                      style={{
                        color: theme.muted,
                        fontSize: 11,
                        width: 16,
                        textAlign: "right",
                      }}
                    >
                      {i + 1}
                    </span>
                    <span
                      style={{
                        flex: 1,
                        color: theme.text,
                        fontSize: 13,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {p.name}
                    </span>
                    <div
                      style={{
                        width: 100,
                        height: 4,
                        background: theme.border,
                        borderRadius: 2,
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.min(p.margin, 100)}%`,
                          height: "100%",
                          background:
                            p.margin > 40
                              ? theme.green
                              : p.margin > 20
                                ? theme.amber
                                : theme.rose,
                          borderRadius: 2,
                        }}
                      />
                    </div>
                    <span
                      style={{
                        color:
                          p.margin > 40
                            ? theme.green
                            : p.margin > 20
                              ? theme.amber
                              : theme.rose,
                        fontFamily: "monospace",
                        fontSize: 12,
                        fontWeight: 700,
                        width: 44,
                        textAlign: "right",
                      }}
                    >
                      {p.margin}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ ...S.card, flex: 1 }}>
              <ChartHeader title="Últimas Variações de Ingredientes" />
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {recent.map((h) => {
                  const up = h.newPrice > h.oldPrice;
                  return (
                    <div
                      key={h.id}
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <div
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: up ? theme.rose : theme.green,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          flex: 1,
                          color: theme.text,
                          fontSize: 12,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h.ingredientName}
                      </span>
                      <span
                        style={{
                          color: theme.muted,
                          fontSize: 11,
                          textDecoration: "line-through",
                        }}
                      >
                        {formaterReal(h.oldPrice)}
                      </span>
                      <span
                        style={{
                          color: up ? theme.rose : theme.green,
                          fontWeight: 700,
                          fontSize: 12,
                        }}
                      >
                        {formaterReal(h.newPrice)}
                      </span>
                      <span
                        style={{
                          color: up ? theme.rose : theme.green,
                          fontSize: 11,
                          fontFamily: "monospace",
                        }}
                      >
                        {up ? "+" : ""}
                        {pct(h.newPrice, h.oldPrice)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
      </div>
        </div>
    </div>
  );
};

export default DashboardPage;
