import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Edit3,
  Eraser,
  LineChart,
  Play,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  Wallet,
} from "lucide-react";

const palette = ["#22d3ee", "#f472b6", "#a3e635", "#facc15", "#818cf8", "#fb7185", "#34d399", "#f97316"];

const sampleStocks = [
  { id: crypto.randomUUID(), name: "AlphaTech", purchaseValue: 3000, expectedProfit: 900 },
  { id: crypto.randomUUID(), name: "GreenEnergy", purchaseValue: 5000, expectedProfit: 1200 },
  { id: crypto.randomUUID(), name: "MedNova", purchaseValue: 2000, expectedProfit: 760 },
  { id: crypto.randomUUID(), name: "FinEdge", purchaseValue: 4500, expectedProfit: 990 },
  { id: crypto.randomUUID(), name: "UrbanFoods", purchaseValue: 2500, expectedProfit: 525 },
];

const starterStocks = [
  { id: crypto.randomUUID(), name: "AlphaTech", purchaseValue: 3000, expectedProfit: 900 },
  { id: crypto.randomUUID(), name: "GreenEnergy", purchaseValue: 5000, expectedProfit: 1200 },
  { id: crypto.randomUUID(), name: "MedNova", purchaseValue: 2000, expectedProfit: 760 },
];

const codeLines = [
  "function fractionalKnapsack(stocks, budget) {",
  "  const capacity = budget;",
  "  const ranked = stocks.map(stock => ({",
  "    ...stock,",
  "    weight: stock.purchaseValue,",
  "    value: stock.expectedProfit,",
  "    ratio: stock.expectedProfit / stock.purchaseValue",
  "  })).sort((a, b) => b.ratio - a.ratio);",
  "",
  "  let remainingBudget = capacity;",
  "  let totalExpectedProfit = 0;",
  "  const selected = [];",
  "",
  "  for (const stock of ranked) {",
  "    if (remainingBudget === 0) break;",
  "    const investmentTaken = Math.min(stock.weight, remainingBudget);",
  "    const fractionTaken = investmentTaken / stock.weight;",
  "    const profitGained = stock.value * fractionTaken;",
  "    selected.push({ stock, investmentTaken, fractionTaken, profitGained });",
  "    remainingBudget -= investmentTaken;",
  "    totalExpectedProfit += profitGained;",
  "  }",
  "",
  "  return { selected, remainingBudget, totalExpectedProfit };",
  "}",
];

function currency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(Number.isFinite(value) ? value : 0);
}

function numberValue(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function runFractionalKnapsack(stocks, budget) {
  const capacity = numberValue(budget);
  const ranked = stocks
    .map((stock, index) => {
      const weight = numberValue(stock.purchaseValue);
      const value = numberValue(stock.expectedProfit);
      return {
        ...stock,
        color: palette[index % palette.length],
        purchaseValue: weight,
        expectedProfit: value,
        ratio: weight > 0 ? value / weight : 0,
      };
    })
    .filter((stock) => stock.name.trim() && stock.purchaseValue > 0 && stock.expectedProfit >= 0)
    .sort((a, b) => b.ratio - a.ratio);

  let remainingBudget = capacity;
  let totalExpectedProfit = 0;
  const selected = [];
  const events = [
    {
      line: 1,
      title: "Capacity is the budget",
      message: `Budget capacity is ${currency(capacity)}.`,
      remainingBudget,
      totalExpectedProfit,
    },
    {
      line: 7,
      title: "Rank by ratio",
      message: "Stocks are sorted by expected profit per rupee invested.",
      remainingBudget,
      totalExpectedProfit,
    },
  ];

  for (const stock of ranked) {
    if (remainingBudget <= 0) break;

    const investmentTaken = Math.min(stock.purchaseValue, remainingBudget);
    const fractionTaken = investmentTaken / stock.purchaseValue;
    const profitGained = stock.expectedProfit * fractionTaken;
    const isFractional = fractionTaken < 1;

    remainingBudget -= investmentTaken;
    totalExpectedProfit += profitGained;

    const pick = {
      ...stock,
      investmentTaken,
      fractionTaken,
      profitGained,
      remainingBudget,
      totalExpectedProfit,
      isFractional,
    };

    selected.push(pick);
    events.push({
      line: isFractional ? 16 : 15,
      title: isFractional ? "Fractional selection" : "Full selection",
      message: isFractional
        ? `Investing ${currency(investmentTaken)} in ${stock.name} as fractional selection`
        : `Investing full ${currency(investmentTaken)} in ${stock.name}`,
      remainingBudget,
      totalExpectedProfit,
      pick,
    });
  }

  events.push({
    line: 23,
    title: "Maximum profit found",
    message: `Maximum total expected profit is ${currency(totalExpectedProfit)}.`,
    remainingBudget,
    totalExpectedProfit,
  });

  return {
    capacity,
    ranked,
    selected,
    events,
    remainingBudget,
    budgetUsed: capacity - remainingBudget,
    totalExpectedProfit,
  };
}

function MetricCard({ label, value, icon: Icon }) {
  return (
    <motion.div
      layout
      className="glass rounded-2xl p-4"
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
    >
      <div className="flex items-center gap-3 text-sm text-white/70">
        <Icon className="h-4 w-4 text-cyan-200" />
        {label}
      </div>
      <div className="mt-2 break-words text-xl font-black tracking-tight sm:text-2xl">{value}</div>
    </motion.div>
  );
}

function NeonButton({ children, icon: Icon, className = "", variant = "primary", ...props }) {
  const styles =
    variant === "danger"
      ? "from-rose-500 to-orange-400 shadow-rose-500/30"
      : variant === "quiet"
        ? "from-white/16 to-white/8 shadow-cyan-500/10"
        : "from-cyan-400 to-fuchsia-500 shadow-cyan-500/30";

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -2 }}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r ${styles} px-4 py-2.5 text-sm font-bold text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {Icon ? <Icon className="h-4 w-4" /> : null}
      {children}
    </motion.button>
  );
}

function App() {
  const [budget, setBudget] = useState(7000);
  const [stocks, setStocks] = useState(starterStocks);
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const result = useMemo(() => runFractionalKnapsack(stocks, budget), [stocks, budget]);
  const visibleStep = Math.min(activeStep, result.events.length - 1);
  const currentEvent = result.events[visibleStep] ?? result.events[0];
  const visibleSelections = result.selected.slice(0, Math.max(0, visibleStep - 1));
  const currentMetrics = currentEvent ?? {
    remainingBudget: result.capacity,
    totalExpectedProfit: 0,
  };

  const investedSoFar = result.capacity - (currentMetrics.remainingBudget ?? result.capacity);

  function updateStock(id, field, value) {
    setStocks((current) => current.map((stock) => (stock.id === id ? { ...stock, [field]: value } : stock)));
    setActiveStep(0);
    setIsPlaying(false);
  }

  function addStock() {
    setStocks((current) => [
      ...current,
      { id: crypto.randomUUID(), name: `Stock ${current.length + 1}`, purchaseValue: 1000, expectedProfit: 200 },
    ]);
    setActiveStep(0);
  }

  function deleteStock(id) {
    setStocks((current) => current.filter((stock) => stock.id !== id));
    setActiveStep(0);
  }

  function loadSamples() {
    setBudget(8000);
    setStocks(sampleStocks.map((stock) => ({ ...stock, id: crypto.randomUUID() })));
    setActiveStep(0);
    setIsPlaying(false);
  }

  function reset() {
    setBudget(7000);
    setStocks(starterStocks.map((stock) => ({ ...stock, id: crypto.randomUUID() })));
    setActiveStep(0);
    setIsPlaying(false);
  }

  function playVisualization() {
    setIsPlaying(true);
    setActiveStep(0);
    result.events.forEach((_, index) => {
      window.setTimeout(() => {
        setActiveStep(index);
        if (index === result.events.length - 1) setIsPlaying(false);
      }, index * 1200);
    });
  }

  return (
    <main className="min-h-screen overflow-x-hidden px-3 py-5 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.header
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 py-2 text-sm text-cyan-100 backdrop-blur">
              <LineChart className="h-4 w-4" />
              Fractional Knapsack through stock investing
            </div>
            <h1 className="max-w-4xl break-words text-[2rem] font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              StockKnapsack: Budget-Based Fractional Knapsack Visualizer
            </h1>
          </div>
          <div className="glass w-full rounded-2xl p-4 lg:w-80">
            <label className="text-sm font-semibold text-white/75" htmlFor="budget">
              Total budget capacity
            </label>
            <div className="mt-2 flex items-center gap-2">
              <Wallet className="h-5 w-5 text-emerald-200" />
              <input
                id="budget"
                type="number"
                min="0"
                value={budget}
                onChange={(event) => {
                  setBudget(event.target.value);
                  setActiveStep(0);
                  setIsPlaying(false);
                }}
                className="min-w-0 w-full rounded-xl border border-white/20 bg-black/20 px-4 py-3 text-xl font-black outline-none ring-cyan-300/50 transition focus:ring-4"
              />
            </div>
          </div>
        </motion.header>

        <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Remaining budget" value={currency(currentMetrics.remainingBudget)} icon={Wallet} />
          <MetricCard label="Investment taken" value={currency(currentEvent?.pick?.investmentTaken ?? investedSoFar)} icon={BarChart3} />
          <MetricCard
            label="Fraction taken"
            value={currentEvent?.pick ? `${(currentEvent.pick.fractionTaken * 100).toFixed(1)}%` : "0%"}
            icon={RefreshCw}
          />
          <MetricCard label="Total expected profit" value={currency(currentMetrics.totalExpectedProfit)} icon={LineChart} />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="min-w-0 space-y-6">
            <motion.div layout className="glass w-full min-w-0 overflow-hidden rounded-3xl p-4 sm:p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-black">Stock Inputs</h2>
                  <p className="text-sm text-white/70">Ratio = expected profit / purchase value.</p>
                </div>
                <div className="grid w-full grid-cols-1 gap-2 sm:w-auto sm:grid-cols-3">
                  <NeonButton icon={Plus} onClick={addStock} className="w-full">Add stock</NeonButton>
                  <NeonButton icon={Save} variant="quiet" onClick={loadSamples} className="w-full">Sample data</NeonButton>
                  <NeonButton icon={Eraser} variant="danger" onClick={reset} className="w-full">Reset</NeonButton>
                </div>
              </div>

              <div className="hidden md:block">
                <div className="table-scroll overflow-x-auto">
                <table className="w-full min-w-[720px] border-separate border-spacing-y-2 text-left text-sm">
                  <thead className="text-white/65">
                    <tr>
                      <th className="px-3 py-2">Stock name</th>
                      <th className="px-3 py-2">Purchase value</th>
                      <th className="px-3 py-2">Expected profit</th>
                      <th className="px-3 py-2">Profit per rupee</th>
                      <th className="px-3 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stocks.map((stock, index) => {
                      const ratio = numberValue(stock.purchaseValue) ? numberValue(stock.expectedProfit) / numberValue(stock.purchaseValue) : 0;
                      return (
                        <motion.tr key={stock.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white/10">
                          <td className="rounded-l-2xl px-3 py-3">
                            <div className="flex items-center gap-2">
                              <span className="h-3 w-3 rounded-full" style={{ background: palette[index % palette.length] }} />
                              <input
                                value={stock.name}
                                onChange={(event) => updateStock(stock.id, "name", event.target.value)}
                                className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-300/60"
                              />
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <input
                              type="number"
                              min="0"
                              value={stock.purchaseValue}
                              onChange={(event) => updateStock(stock.id, "purchaseValue", event.target.value)}
                              className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-300/60"
                            />
                          </td>
                          <td className="px-3 py-3">
                            <input
                              type="number"
                              min="0"
                              value={stock.expectedProfit}
                              onChange={(event) => updateStock(stock.id, "expectedProfit", event.target.value)}
                              className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-300/60"
                            />
                          </td>
                          <td className="px-3 py-3 font-black text-cyan-100">{ratio.toFixed(4)}</td>
                          <td className="rounded-r-2xl px-3 py-3 text-right">
                            <button
                              type="button"
                              title="Delete stock"
                              onClick={() => deleteStock(stock.id)}
                              className="rounded-full border border-white/15 bg-white/10 p-2 text-rose-100 transition hover:bg-rose-500/35"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
                </div>
              </div>

              <div className="w-full min-w-0 space-y-3 md:hidden">
                {stocks.map((stock, index) => {
                  const ratio = numberValue(stock.purchaseValue) ? numberValue(stock.expectedProfit) / numberValue(stock.purchaseValue) : 0;
                  return (
                    <motion.div
                      key={stock.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                    className="w-full min-w-0 overflow-hidden rounded-2xl border border-white/15 bg-black/20 p-3"
                    >
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: palette[index % palette.length] }} />
                          <span className="truncate text-sm font-black">Stock {index + 1}</span>
                        </div>
                        <button
                          type="button"
                          title="Delete stock"
                          onClick={() => deleteStock(stock.id)}
                          className="shrink-0 rounded-full border border-white/15 bg-white/10 p-2 text-rose-100 transition hover:bg-rose-500/35"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid gap-3">
                        <label className="grid w-full min-w-0 gap-1 overflow-hidden text-xs font-semibold text-white/65">
                          Stock name
                          <input
                            value={stock.name}
                            onChange={(event) => updateStock(stock.id, "name", event.target.value)}
                            className="w-full min-w-0 rounded-xl border border-white/15 bg-black/25 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-cyan-300/60"
                          />
                        </label>
                        <div className="grid gap-3">
                          <label className="grid w-full min-w-0 gap-1 overflow-hidden text-xs font-semibold text-white/65">
                            Purchase value
                            <input
                              type="number"
                              min="0"
                              value={stock.purchaseValue}
                              onChange={(event) => updateStock(stock.id, "purchaseValue", event.target.value)}
                              className="w-full min-w-0 rounded-xl border border-white/15 bg-black/25 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-cyan-300/60"
                            />
                          </label>
                          <label className="grid w-full min-w-0 gap-1 overflow-hidden text-xs font-semibold text-white/65">
                            Expected profit
                            <input
                              type="number"
                              min="0"
                              value={stock.expectedProfit}
                              onChange={(event) => updateStock(stock.id, "expectedProfit", event.target.value)}
                              className="w-full min-w-0 rounded-xl border border-white/15 bg-black/25 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-cyan-300/60"
                            />
                          </label>
                        </div>
                        <div className="grid gap-1 rounded-xl bg-cyan-300/12 px-3 py-2 text-sm">
                          <span className="text-white/60">Profit per rupee</span>
                          <span className="font-black text-cyan-100">{ratio.toFixed(4)}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div layout className="glass w-full min-w-0 overflow-hidden rounded-3xl p-4 sm:p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-black">Animated Budget Bar</h2>
                  <p className="text-sm text-white/70">{currentEvent?.message}</p>
                </div>
                <NeonButton icon={Play} className="w-full sm:w-auto" disabled={isPlaying || result.ranked.length === 0 || result.capacity === 0} onClick={playVisualization}>
                  Run algorithm
                </NeonButton>
              </div>

              <div className="relative h-16 overflow-hidden rounded-2xl border border-white/20 bg-black/25 sm:h-20">
                <div className="absolute inset-0 grid grid-cols-4 opacity-20">
                  <span className="border-r border-white" />
                  <span className="border-r border-white" />
                  <span className="border-r border-white" />
                  <span />
                </div>
                <div className="flex h-full">
                  <AnimatePresence initial={false}>
                    {visibleSelections.map((pick) => (
                      <motion.div
                        key={`${pick.id}-${pick.investmentTaken}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${result.capacity ? (pick.investmentTaken / result.capacity) * 100 : 0}%` }}
                        exit={{ width: 0 }}
                        transition={{ duration: 0.65, ease: "easeOut" }}
                        className="flex h-full min-w-0 items-center justify-center overflow-hidden text-[11px] font-black text-slate-950 sm:text-xs"
                        style={{ background: pick.color }}
                        title={`${pick.name}: ${currency(pick.investmentTaken)}`}
                      >
                        <span className="truncate px-2">{pick.name}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl bg-black/20 p-3">
                  <div className="text-xs text-white/60">Profit gained now</div>
                  <div className="break-words text-base font-black sm:text-lg">{currency(currentEvent?.pick?.profitGained ?? 0)}</div>
                </div>
                <div className="rounded-2xl bg-black/20 p-3">
                  <div className="text-xs text-white/60">Total budget used</div>
                  <div className="break-words text-base font-black sm:text-lg">{currency(investedSoFar)}</div>
                </div>
                <div className="rounded-2xl bg-black/20 p-3">
                  <div className="text-xs text-white/60">Current selected stock</div>
                  <div className="break-words text-base font-black sm:text-lg">{currentEvent?.pick?.name ?? "None yet"}</div>
                </div>
                <div className="rounded-2xl bg-black/20 p-3">
                  <div className="text-xs text-white/60">Budget fill</div>
                  <div className="break-words text-base font-black sm:text-lg">{result.capacity ? `${((investedSoFar / result.capacity) * 100).toFixed(1)}%` : "0%"}</div>
                </div>
              </div>
            </motion.div>

            <div className="grid gap-6 lg:grid-cols-2">
              <TableCard title="Sorted by Ratio" rows={result.ranked} ranked />
              <TableCard title="Final Output" rows={result.selected} selected />
            </div>
          </div>

          <div className="min-w-0 space-y-6">
            <motion.div layout className="glass w-full min-w-0 overflow-hidden rounded-3xl p-4 sm:p-5">
              <h2 className="mb-4 text-2xl font-black">Algorithm Steps</h2>
              <div className="space-y-3">
                {result.events.map((event, index) => (
                  <motion.button
                    key={`${event.title}-${index}`}
                    type="button"
                    onClick={() => {
                      setActiveStep(index);
                      setIsPlaying(false);
                    }}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      visibleStep === index ? "border-cyan-200 bg-cyan-300/20 shadow-neon" : "border-white/15 bg-black/18 hover:bg-white/12"
                    }`}
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-black">{index + 1}. {event.title}</span>
                      <span className="text-xs text-white/65">line {event.line + 1}</span>
                    </div>
                    <p className="mt-1 text-sm text-white/75">{event.message}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <motion.div layout className="glass w-full min-w-0 overflow-hidden rounded-3xl p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-fuchsia-200" />
                <h2 className="text-2xl font-black">JavaScript Code</h2>
              </div>
              <pre className="max-h-[460px] overflow-auto rounded-2xl border border-white/15 bg-slate-950/80 p-3 text-[11px] leading-6 text-slate-200 sm:p-4 sm:text-sm">
                {codeLines.map((line, index) => (
                  <div
                    key={`${line}-${index}`}
                    className={`rounded px-2 transition ${
                      currentEvent?.line === index ? "bg-cyan-300/25 text-white shadow-[0_0_18px_rgba(34,211,238,0.28)]" : ""
                    }`}
                  >
                    <span className="mr-3 select-none text-slate-500">{String(index + 1).padStart(2, "0")}</span>
                    <code>{line || " "}</code>
                  </div>
                ))}
              </pre>
            </motion.div>

            <motion.div layout className="glass w-full min-w-0 overflow-hidden rounded-3xl p-4 sm:p-5">
              <h2 className="mb-3 text-2xl font-black">Educational Explanation</h2>
              <p className="text-white/78">
                In this model, the budget represents the knapsack capacity. Each stock has a purchase value and an expected profit. The algorithm chooses stocks with the highest expected profit per rupee first to maximize total expected profit.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/15 bg-black/20 p-4">
                  <h3 className="font-black text-rose-100">0/1 Knapsack</h3>
                  <p className="mt-1 text-sm text-white/70">Invest fully in a stock or skip it.</p>
                </div>
                <div className="rounded-2xl border border-cyan-200/40 bg-cyan-300/15 p-4">
                  <h3 className="font-black text-cyan-100">Fractional Knapsack</h3>
                  <p className="mt-1 text-sm text-white/70">Invest partially if remaining budget is not enough.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </main>
  );
}

function TableCard({ title, rows, ranked = false, selected = false }) {
  return (
    <motion.div layout className="glass w-full min-w-0 overflow-hidden rounded-3xl p-4">
      <h2 className="mb-3 text-xl font-black">{title}</h2>
      <div className="hidden sm:block">
        <div className="table-scroll overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="text-white/60">
            <tr>
              <th className="py-2 pr-3">Stock</th>
              <th className="py-2 pr-3">{selected ? "Investment" : "Purchase"}</th>
              <th className="py-2 pr-3">{selected ? "Fraction" : "Profit"}</th>
              <th className="py-2 pr-3">{selected ? "Profit gained" : "Ratio"}</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-6 text-center text-white/60">No rows yet.</td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={`${row.id}-${index}`} className="border-t border-white/10">
                  <td className="py-3 pr-3 font-bold">
                    <span className="mr-2 inline-block h-3 w-3 rounded-full" style={{ background: row.color ?? palette[index % palette.length] }} />
                    {row.name}
                  </td>
                  <td className="py-3 pr-3">{currency(selected ? row.investmentTaken : row.purchaseValue)}</td>
                  <td className="py-3 pr-3">{selected ? row.fractionTaken.toFixed(3) : currency(row.expectedProfit)}</td>
                  <td className="py-3 pr-3 font-black text-cyan-100">{selected ? currency(row.profitGained) : row.ratio.toFixed(4)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>
      <div className="w-full min-w-0 space-y-3 sm:hidden">
        {rows.length === 0 ? (
          <div className="rounded-2xl border border-white/15 bg-black/20 py-6 text-center text-sm text-white/60">No rows yet.</div>
        ) : (
          rows.map((row, index) => (
            <div key={`${row.id}-${index}`} className="w-full min-w-0 overflow-hidden rounded-2xl border border-white/15 bg-black/20 p-3 text-sm">
              <div className="mb-3 flex min-w-0 items-center gap-2 font-black">
                <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: row.color ?? palette[index % palette.length] }} />
                <span className="truncate">{row.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-white/8 p-2">
                  <div className="text-[11px] text-white/55">{selected ? "Investment" : "Purchase"}</div>
                  <div className="break-words font-bold">{currency(selected ? row.investmentTaken : row.purchaseValue)}</div>
                </div>
                <div className="rounded-xl bg-white/8 p-2">
                  <div className="text-[11px] text-white/55">{selected ? "Fraction" : "Profit"}</div>
                  <div className="break-words font-bold">{selected ? row.fractionTaken.toFixed(3) : currency(row.expectedProfit)}</div>
                </div>
                <div className="col-span-2 rounded-xl bg-cyan-300/12 p-2">
                  <div className="text-[11px] text-white/55">{selected ? "Profit gained" : "Ratio"}</div>
                  <div className="break-words font-black text-cyan-100">{selected ? currency(row.profitGained) : row.ratio.toFixed(4)}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {ranked ? <p className="mt-3 text-xs text-white/58">Highest ratio appears first, so the greedy choice is visible before the run.</p> : null}
    </motion.div>
  );
}

export default App;
