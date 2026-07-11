import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, AlertTriangle, TrendingUp, Landmark } from "lucide-react";

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
    deductions: 2,
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
  const [invoiceAmount, setInvoiceAmount] = useState<number>(1863900);
  const [daysToSettle, setDaysToSettle] = useState<number>(148);
  const [selectedTier, setSelectedTier] = useState<number>(2); // Default to Standard (60%)
  const [deductionsPercent, setDeductionsPercent] = useState<number>(2);

  const advanceRate = useMemo(() => {
    const tierObj = tiers.find((t) => t.id === selectedTier);
    return tierObj ? tierObj.rate : 60;
  }, [selectedTier]);

  // Calculations
  const advanceAmount = useMemo(() => {
    return Math.round(invoiceAmount * (advanceRate / 100));
  }, [invoiceAmount, advanceRate]);

  const holdbackAmount = useMemo(() => {
    return invoiceAmount - advanceAmount;
  }, [invoiceAmount, advanceAmount]);

  const bankInterestRate = 0.11; // 11% p.a.
  const platformFeeRate = 0.0035; // 35 bps

  const bankDiscount = useMemo(() => {
    return Math.round(advanceAmount * bankInterestRate * (daysToSettle / 365));
  }, [advanceAmount, daysToSettle]);

  const platformFee = useMemo(() => {
    return Math.round(invoiceAmount * platformFeeRate);
  }, [invoiceAmount]);

  const deductionsAmount = useMemo(() => {
    return Math.round(invoiceAmount * (deductionsPercent / 100));
  }, [invoiceAmount, deductionsPercent]);

  // Realium Net release from holdback
  const remainingHoldback = useMemo(() => {
    return Math.max(0, holdbackAmount - bankDiscount - platformFee - deductionsAmount);
  }, [holdbackAmount, bankDiscount, platformFee, deductionsAmount]);

  const contractorNetTake = useMemo(() => {
    return advanceAmount + remainingHoldback;
  }, [advanceAmount, remainingHoldback]);

  const contractorNetTakePercent = useMemo(() => {
    return (contractorNetTake / invoiceAmount) * 100;
  }, [contractorNetTake, invoiceAmount]);

  // Traditional scenario: Contractor borrows 100% of required capital in informal market at 18% p.a.
  const traditionalInterestRate = 0.18;
  const traditionalInterest = useMemo(() => {
    return Math.round(invoiceAmount * traditionalInterestRate * (daysToSettle / 365));
  }, [invoiceAmount, daysToSettle]);

  const traditionalNetTake = useMemo(() => {
    return Math.max(0, invoiceAmount - traditionalInterest - deductionsAmount);
  }, [invoiceAmount, traditionalInterest, deductionsAmount]);

  const traditionalNetTakePercent = useMemo(() => {
    return (traditionalNetTake / invoiceAmount) * 100;
  }, [traditionalNetTake, invoiceAmount]);

  const principalExposed = useMemo(() => {
    return (bankDiscount + platformFee + deductionsAmount) > holdbackAmount;
  }, [bankDiscount, platformFee, deductionsAmount, holdbackAmount]);

  const deficitAmount = useMemo(() => {
    if (!principalExposed) return 0;
    return (bankDiscount + platformFee + deductionsAmount) - holdbackAmount;
  }, [principalExposed, bankDiscount, platformFee, deductionsAmount, holdbackAmount]);

  const loadPreset = (p: Preset) => {
    setInvoiceAmount(p.amount);
    setDaysToSettle(p.days);
    setSelectedTier(p.tier);
    setDeductionsPercent(p.deductions);
  };

  return (
    <div className="glass rounded-2xl p-6 md:p-8">
      {/* Title / Description */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-foreground">
            Liquidity & Cost Simulator
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Adjust the parameters to see how Realium T+1 advances compare to traditional informal bridge financing.
          </p>
        </div>
        {/* Presets */}
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={() => loadPreset(p)}
              className="rounded-md border border-foreground/10 bg-foreground/5 px-2.5 py-1 text-[11px] font-medium text-foreground transition-all hover:bg-foreground/10 cursor-pointer"
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
            <div className="flex justify-between text-xs text-foreground/70">
              <label className="font-medium">Certified Invoice Value</label>
              <span className="font-mono text-emerald-400 font-semibold">
                ₹{invoiceAmount.toLocaleString("en-IN")}
              </span>
            </div>
            <input
              type="range"
              min={500000}
              max={25000000}
              step={100000}
              value={invoiceAmount}
              onChange={(e) => setInvoiceAmount(Number(e.target.value))}
              className="mt-2.5 w-full accent-emerald-500 cursor-pointer"
            />
            <div className="mt-1 flex justify-between font-mono text-xs text-foreground/30">
              <span>₹5 Lakhs</span>
              <span>₹2.5 Crores</span>
            </div>
          </div>

          {/* Reliability Tiers */}
          <div>
            <label className="block text-xs font-medium text-foreground/70">
              Contractor Reliability Tier (Advance Rate)
            </label>
            <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {tiers.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTier(t.id)}
                  className={`flex flex-col items-center justify-center rounded-lg border p-2 text-center transition-all cursor-pointer ${
                    selectedTier === t.id
                      ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                      : "border-foreground/10 bg-foreground/5 text-foreground/60 hover:text-foreground hover:bg-foreground/[0.08]"
                  }`}
                >
                  <span className="font-mono text-xs font-bold">{t.rate}%</span>
                  <span className="mt-0.5 text-[11px] uppercase tracking-wider opacity-85 leading-none">
                    {t.label.split(":")[0]}
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground leading-normal">
              {tiers.find((t) => t.id === selectedTier)?.desc}
            </p>
          </div>

          {/* Days to Settle */}
          <div>
            <div className="flex justify-between text-xs text-foreground/70">
              <label className="font-medium">Treasury Settlement Delay</label>
              <span className="font-mono text-indigo-400 font-semibold">
                {daysToSettle} Days
              </span>
            </div>
            <input
              type="range"
              min={15}
              max={240}
              step={1}
              value={daysToSettle}
              onChange={(e) => setDaysToSettle(Number(e.target.value))}
              className="mt-2.5 w-full accent-indigo-500 cursor-pointer"
            />
            <div className="mt-1 flex justify-between font-mono text-xs text-foreground/30">
              <span>15 Days (Pilot target)</span>
              <span>240 Days (Historic high)</span>
            </div>
          </div>

          {/* Deductions */}
          <div>
            <div className="flex justify-between text-xs text-foreground/70">
              <label className="font-medium">Govt Deductions & Penalties</label>
              <span className="font-mono text-rose-400 font-semibold">
                {deductionsPercent}% (₹{deductionsAmount.toLocaleString("en-IN")})
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={15}
              step={0.5}
              value={deductionsPercent}
              onChange={(e) => setDeductionsPercent(Number(e.target.value))}
              className="mt-2.5 w-full accent-rose-500 cursor-pointer"
            />
            <div className="mt-1 flex justify-between font-mono text-xs text-foreground/30">
              <span>0% (Clean work)</span>
              <span>15% (Heavy penalty)</span>
            </div>
          </div>
        </div>

        {/* Dynamic Visualization & Output */}
        <div className="flex flex-col justify-between rounded-xl border border-foreground/10 bg-foreground/[0.01] p-5">
          <div>
            <div className="flex items-center justify-between border-b border-foreground/5 pb-3">
              <div className="font-mono text-xs uppercase tracking-widest text-foreground/40">
                On-Chain Payout Waterfall
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-0.5 text-xs text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" /> Lock: 11% Bank Yield
              </div>
            </div>

            {/* Dynamic Bar Diagram */}
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-xs font-mono">
                <span className="text-foreground/40">Total Invoice (100%)</span>
                <span className="text-foreground/70">₹{invoiceAmount.toLocaleString("en-IN")}</span>
              </div>
              
              {/* Stacked Progress Bar */}
              <div className="relative h-6 w-full overflow-hidden rounded-md bg-foreground/5 flex">
                {/* Advance Amount */}
                <motion.div
                  layout
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 relative flex items-center justify-center"
                  style={{ width: `${advanceRate}%` }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                >
                  <span className="font-mono text-[10px] font-bold text-background select-none">
                    {advanceRate}%
                  </span>
                </motion.div>

                {/* Remaining Release (Net Holdback) */}
                {remainingHoldback > 0 && (
                  <motion.div
                    layout
                    className="h-full bg-emerald-500/30 border-l border-r border-background/25 relative"
                    style={{ width: `${(remainingHoldback / invoiceAmount) * 100}%` }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  />
                )}

                {/* Bank Discount Interest + Platform Fee */}
                {((bankDiscount + platformFee) / invoiceAmount) * 100 > 0 && (
                  <motion.div
                    layout
                    className="h-full bg-indigo-500/40 border-r border-background/25 relative"
                    style={{ width: `${((bankDiscount + platformFee) / invoiceAmount) * 100}%` }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  />
                )}

                {/* Deductions */}
                {deductionsPercent > 0 && (
                  <motion.div
                    layout
                    className="h-full bg-rose-500/45 relative"
                    style={{ width: `${deductionsPercent}%` }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  />
                )}
              </div>

              {/* Legends with Values */}
              <div className="mt-5 space-y-2.5 text-xs select-none">
                <div className="flex items-center justify-between border-b border-foreground/[0.04] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 shrink-0 rounded bg-emerald-500" />
                    <span className="text-foreground/60">T+1 Cash Advance</span>
                  </div>
                  <span className="font-mono font-semibold text-foreground/95">
                    ₹{advanceAmount.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-foreground/[0.04] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 shrink-0 rounded bg-emerald-500/30" />
                    <span className="text-foreground/60">Released Holdback</span>
                  </div>
                  <span className="font-mono font-semibold text-emerald-400">
                    ₹{remainingHoldback.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-foreground/[0.04] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 shrink-0 rounded bg-indigo-500/40" />
                    <span className="text-foreground/60">Financing Fees</span>
                  </div>
                  <span className="font-mono font-semibold text-foreground/95">
                    ₹{(bankDiscount + platformFee).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 shrink-0 rounded bg-rose-500/45" />
                    <span className="text-foreground/60">Deductions/Penalties</span>
                  </div>
                  <span className="font-mono font-semibold text-rose-400">
                    ₹{deductionsAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Principal Exposure Alert */}
            <AnimatePresence>
              {principalExposed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 overflow-hidden"
                >
                  <div className="rounded-lg border border-rose-500/35 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
                    <div>
                      <span className="font-semibold">Bank Principal Exposed!</span> Deductions exceed the holdback buffer by <span className="font-mono font-bold">₹{deficitAmount.toLocaleString("en-IN")}</span>. Realium will auto-downgrade this contractor&apos;s reliability tier, reducing future advance caps to prevent default.
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Comparison Card */}
          <div className="mt-6 border-t border-foreground/10 pt-5">
            <div className="mb-3 font-mono text-xs uppercase tracking-widest text-foreground/40">
              Net Capital Take-Home Comparison
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Realium */}
              <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/[0.04] p-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5" /> Realium (T+1 cash)
                </div>
                <div className="mt-1 font-mono text-2xl font-bold text-foreground">
                  {contractorNetTakePercent.toFixed(1)}%
                </div>
                <div className="mt-0.5 font-mono text-xs text-foreground/60">
                  ₹{contractorNetTake.toLocaleString("en-IN")}
                </div>
              </div>

              {/* Traditional */}
              <div className="rounded-lg border border-foreground/10 bg-foreground/5 p-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-foreground/45 flex items-center gap-1">
                  <Landmark className="h-3.5 w-3.5" /> Status Quo (T+{daysToSettle} wait)
                </div>
                <div className="mt-1 font-mono text-2xl font-bold text-foreground/75">
                  {traditionalNetTakePercent.toFixed(1)}%
                </div>
                <div className="mt-0.5 font-mono text-xs text-foreground/55">
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
