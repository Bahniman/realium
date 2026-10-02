import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, AlertTriangle, TrendingUp, Landmark } from "lucide-react";
import { BASE_FINANCE_INPUT, calculateFinanceScenario } from "@/lib/finance-scenario";

type Preset = {
  label: string;
  amount: number;
  days: number;
  tier: number; // 1 = Tier 1 (50%), 2 = Standard (60%), 3 = Tier 2 (72%), 4 = Tier 3 (85%)
  deductions: number;
};

const presets: Preset[] = [
  {
    label: "MH Road-works (Standard)",
    amount: 1863900,
    days: 148,
    tier: 2,
    deductions: 0,
  },
  {
    label: "School Construction (Tier 1)",
    amount: 5000000,
    days: 90,
    tier: 1,
    deductions: 1,
  },
  {
    label: "RCC Bridge Project (Tier 3)",
    amount: 15000000,
    days: 120,
    tier: 4,
    deductions: 4,
  },
];

const tiers = [
  { id: 1, label: "Tier 1: New", rate: 50, desc: "New contractor, first cycles" },
  { id: 2, label: "Standard", rate: 60, desc: "Standard baseline advance rate" },
  { id: 3, label: "Tier 2: 6+ Cycles", rate: 72, desc: "6+ consecutive clean deliveries" },
  { id: 4, label: "Tier 3: Established", rate: 85, desc: "Established record, maximum advance" },
];

export function LiquidityCalculator() {
  const [invoiceAmount, setInvoiceAmount] = useState<number>(BASE_FINANCE_INPUT.invoiceAmount);
  const [daysToSettle, setDaysToSettle] = useState<number>(BASE_FINANCE_INPUT.daysToSettle);
  const [selectedTier, setSelectedTier] = useState<number>(2); // Default to Standard (60%)
  const [deductionsPercent, setDeductionsPercent] = useState<number>(BASE_FINANCE_INPUT.deductionsPercent);

  const advanceRate = useMemo(() => {
    const tierObj = tiers.find((t) => t.id === selectedTier);
    return tierObj ? tierObj.rate : 60;
  }, [selectedTier]);

  const {
    advanceAmount, holdbackAmount, bankDiscount, platformFee, deductionsAmount,
    remainingHoldback, contractorNetTake, contractorNetTakePercent,
    traditionalInterest, traditionalNetTake, traditionalNetTakePercent,
    principalExposed, deficitAmount,
  } = useMemo(
    () => calculateFinanceScenario({ invoiceAmount, daysToSettle, advanceRate, deductionsPercent }),
    [invoiceAmount, daysToSettle, advanceRate, deductionsPercent],
  );
  const loadPreset = (p: Preset) => {
    setInvoiceAmount(p.amount);
    setDaysToSettle(p.days);
    setSelectedTier(p.tier);
    setDeductionsPercent(p.deductions);
  };

  return (
    <div className="money-demo">
      {/* Title / Description */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-xl font-bold text-foreground">
            Follow the money
          </h3>
          <p className="mt-1 text-xs text-on-surface-variant">
            Move the bill, the delay and the deductions. Compare Realium with borrowing from an informal lender at 18% a year.
          </p>
        </div>
        {/* Presets */}
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => loadPreset(p)}
              aria-pressed={invoiceAmount === p.amount && daysToSettle === p.days && selectedTier === p.tier && deductionsPercent === p.deductions}
              className="rounded-lg border border-outline bg-surface-container-low px-3 py-1.5 text-[11px] font-medium text-on-surface hover:bg-on-surface/8 transition-colors cursor-pointer"
            >
              {p.label.split(" (")[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_1.3fr]">
        {/* Controls */}
        <div className="space-y-6">
          {/* Invoice Amount */}
          <div>
            <div className="flex justify-between text-xs text-foreground/80">
              <label htmlFor="scenario-invoice" className="font-medium uppercase tracking-wider text-[10px]">Invoice amount</label>
              <span className="font-mono text-primary font-bold text-sm">
                ₹{invoiceAmount.toLocaleString("en-IN")}
              </span>
            </div>
            <input
              id="scenario-invoice"
              type="range"
              min={500000}
              max={25000000}
              step={100}
              value={invoiceAmount}
              onChange={(e) => setInvoiceAmount(Number(e.target.value))}
              className="mt-2.5 w-full accent-primary cursor-pointer"
            />
            <div className="mt-1 flex justify-between font-mono text-[10px] text-on-surface-variant">
              <span>₹5 Lakhs</span>
              <span>₹2.5 Crores</span>
            </div>
          </div>

          {/* Reliability Tiers */}
          <div>
            <span className="block text-xs font-medium uppercase tracking-wider text-[10px] text-foreground/80">
              Contractor Reliability Tier (Advance Rate)
            </span>
            <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {tiers.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={selectedTier === t.id}
                  onClick={() => setSelectedTier(t.id)}
                  className={`flex flex-col items-center justify-center rounded-lg border p-2 text-center transition-all cursor-pointer ${
                    selectedTier === t.id
                      ? "border-primary bg-primary-container text-on-primary-container font-bold"
                      : "border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-on-surface/8"
                  }`}
                >
                  <span className="font-mono text-xs font-bold">{t.rate}%</span>
                  <span className="mt-0.5 text-[9px] uppercase tracking-wider leading-none">
                    {t.label.split(":")[0]}
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-xs text-on-surface-variant leading-normal">
              {tiers.find((t) => t.id === selectedTier)?.desc}
            </p>
          </div>

          {/* Days to Settle */}
          <div>
            <div className="flex justify-between text-xs text-foreground/80">
              <label htmlFor="scenario-delay" className="font-medium uppercase tracking-wider text-[10px]">Days until the treasury pays</label>
              <span className="font-mono text-tertiary font-bold text-sm">
                {daysToSettle} Days
              </span>
            </div>
            <input
              id="scenario-delay"
              type="range"
              min={15}
              max={240}
              step={1}
              value={daysToSettle}
              onChange={(e) => setDaysToSettle(Number(e.target.value))}
              className="mt-2.5 w-full accent-tertiary cursor-pointer"
            />
            <div className="mt-1 flex justify-between font-mono text-[10px] text-on-surface-variant">
              <span>15 Days (Pilot target)</span>
              <span>240 Days (Historic high)</span>
            </div>
          </div>

          {/* Deductions */}
          <div>
            <div className="flex justify-between text-xs text-foreground/80">
              <label htmlFor="scenario-deductions" className="font-medium uppercase tracking-wider text-[10px]">Deductions</label>
              <span className="font-mono text-error font-bold text-sm">
                {deductionsPercent}% (₹{deductionsAmount.toLocaleString("en-IN")})
              </span>
            </div>
            <input
              id="scenario-deductions"
              type="range"
              min={0}
              max={15}
              step={0.5}
              value={deductionsPercent}
              onChange={(e) => setDeductionsPercent(Number(e.target.value))}
              className="mt-2.5 w-full accent-error cursor-pointer"
            />
            <div className="mt-1 flex justify-between font-mono text-[10px] text-on-surface-variant">
              <span>0% (Clean work)</span>
              <span>15% (Heavy penalty)</span>
            </div>
          </div>
        </div>

        {/* Dynamic Visualization & Output */}
        <div className="flex flex-col justify-between money-out">
          <div>
            <div className="flex items-center justify-between border-b border-outline-variant pb-3">
              <div className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
                Where the invoice goes
              </div>
              <div className="flex items-center gap-1.5 rate-chip">
                <ShieldCheck className="h-3.5 w-3.5" /> Bank rate: 11% a year
              </div>
            </div>

            {/* Dynamic Bar Diagram */}
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-xs font-mono">
                <span className="text-on-surface-variant">Total Invoice (100%)</span>
                <span className="text-foreground font-medium">₹{invoiceAmount.toLocaleString("en-IN")}</span>
              </div>
              
              {/* Stacked Progress Bar */}
              <div className="wf-bar relative h-9 w-full overflow-hidden flex">
                {/* Advance Amount */}
                <motion.div
                  layout
                  className="h-full wf-adv relative flex items-center justify-center"
                  style={{ width: `${(Math.max(0, advanceAmount - deficitAmount) / invoiceAmount) * 100}%` }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                >
                  <span className="font-mono text-[10px] font-bold select-none">
                    {principalExposed ? `${((Math.max(0, advanceAmount - deficitAmount) / invoiceAmount) * 100).toFixed(1)}% net` : `${advanceRate}%`}
                  </span>
                </motion.div>

                {/* Remaining Release (Net Holdback) */}
                {remainingHoldback > 0 && (
                  <motion.div
                    layout
                    className="h-full wf-hold relative"
                    style={{ width: `${(remainingHoldback / invoiceAmount) * 100}%` }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  />
                )}

                {/* Bank Discount Interest + Platform Fee */}
                {((bankDiscount + platformFee) / invoiceAmount) * 100 > 0 && (
                  <motion.div
                    layout
                    className="h-full wf-fee relative"
                    style={{ width: `${((bankDiscount + platformFee) / invoiceAmount) * 100}%` }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  />
                )}

                {/* Deductions */}
                {deductionsPercent > 0 && (
                  <motion.div
                    layout
                    className="h-full wf-ded relative"
                    style={{ width: `${deductionsPercent}%` }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  />
                )}
              </div>

              {/* Legends with Values */}
              <div className="mt-5 space-y-2.5 text-xs select-none">
                <div className="flex items-center justify-between border-b border-outline-variant pb-2">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 shrink-0 wf-dot wf-adv" />
              <span className="text-on-surface-variant">Cash on day one</span>
                  </div>
                  <span className="font-mono font-bold text-foreground">
                    ₹{advanceAmount.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-outline-variant pb-2">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 shrink-0 wf-dot wf-hold" />
                    <span className="text-on-surface-variant">Released Holdback</span>
                  </div>
                  <span className="font-mono font-bold text-primary">
                    ₹{remainingHoldback.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-outline-variant pb-2">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 shrink-0 wf-dot wf-fee" />
                    <span className="text-on-surface-variant">Financing Fees</span>
                  </div>
                  <span className="font-mono font-bold text-foreground">
                    ₹{(bankDiscount + platformFee).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 shrink-0 wf-dot wf-ded" />
                    <span className="text-on-surface-variant">Deductions/Penalties</span>
                  </div>
                  <span className="font-mono font-bold text-error">
                    ₹{deductionsAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Principal Exposure Alert */}
            <div className="mt-4 min-h-[84px]" aria-live="polite" aria-atomic="true">
            <AnimatePresence>
              {principalExposed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 overflow-hidden"
                >
                  <div className="rounded-lg border border-error/35 bg-error-container p-3 text-xs text-on-error-container flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium">Shortfall:</span> Fees and deductions exceed the holdback by <span className="font-mono font-bold">₹{deficitAmount.toLocaleString("en-IN")}</span>. Net proceeds below assume recovery of this amount from the advance. An actual agreement would need to define recovery and loss allocation.
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            </div>
          </div>

          {/* Comparison Card */}
          <div className="mt-6 border-t border-outline-variant pt-5">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
              What the contractor keeps
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Realium */}
              <div className="keep-card keep-win">
                <div className="keep-label">
                  <TrendingUp className="h-3.5 w-3.5" /> With Realium
                </div>
                <div className="keep-num">
                  {contractorNetTakePercent.toFixed(1)}%
                </div>
                <div className="keep-sub">
                  ₹{contractorNetTake.toLocaleString("en-IN")}
                </div>
              </div>

              {/* Traditional */}
              <div className="keep-card">
                <div className="keep-label">
                  <Landmark className="h-3.5 w-3.5" /> Informal loan at 18%
                </div>
                <div className="keep-num">
                  {traditionalNetTakePercent.toFixed(1)}%
                </div>
                <div className="keep-sub">
                  ₹{traditionalNetTake.toLocaleString("en-IN")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
