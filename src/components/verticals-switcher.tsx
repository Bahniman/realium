import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HardHat,
  Umbrella,
  Ship,
  Leaf,
  Wheat,
} from "lucide-react";

const verticals = [
  {
    key: "public-works",
    label: "Public works",
    icon: HardHat,
    blocker:
      "Hand-measured work. ₹1–3 lakh crore stuck in delayed payments; arbitration averages 7–8 years.",
    unlock:
      "Certified measurement → bank-financeable receivable. Contractors paid in days, not months.",
    metric: { days: "148 → 2", tam: "₹20,000 Cr/yr already digital in CPWD" },
  },
  {
    key: "insurance",
    label: "Insurance",
    icon: Umbrella,
    blocker:
      "Physical claim inspection. Adjustment cost and fraud both scale with the delay.",
    unlock:
      "Drone + dual-key attestation on damage extent. Settlement collapses from weeks to hours.",
    metric: { days: "22 → 1", tam: "$8B loss-adjustment spend" },
  },
  {
    key: "trade",
    label: "Trade & banking",
    icon: Ship,
    blocker:
      "Paper bills of lading and collateral audits. Global trade-finance gap is measured in trillions.",
    unlock:
      "Portable, tamper-evident warehouse attestations. Instant collateral release across banks.",
    metric: { days: "35 → 3", tam: "$2.5T trade-finance gap" },
  },
  {
    key: "carbon",
    label: "Carbon & ESG",
    icon: Leaf,
    blocker:
      "Verification scandals are the market's central crisis. Buyer trust has collapsed.",
    unlock:
      "Every credit backed by geo-tagged, human-signed evidence. Ratings priced off the log.",
    metric: { days: "180 → 14", tam: "$2B voluntary carbon" },
  },
  {
    key: "agri",
    label: "Agriculture",
    icon: Wheat,
    blocker:
      "Crop-loss assessment and warehouse receipts gate all downstream lending.",
    unlock:
      "Field-level attestations flow into pre-approved crop loans and insurance payouts.",
    metric: { days: "60 → 4", tam: "$50B agri credit demand" },
  },
];

export function VerticalsSwitcher() {
  const [active, setActive] = useState(verticals[0].key);
  const cur = verticals.find((v) => v.key === active)!;
  const Icon = cur.icon;

  return (
    <div className="glass overflow-hidden rounded-2xl">
      <div className="flex flex-wrap gap-1 border-b border-foreground/10 p-2">
        {verticals.map((v) => {
          const IconV = v.icon;
          const on = v.key === active;
          return (
            <button
              key={v.key}
              onClick={() => setActive(v.key)}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all ${
                on
                  ? "bg-foreground text-background"
                  : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
              }`}
            >
              <IconV className="h-4 w-4" />
              {v.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={cur.key}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 gap-6 p-8 md:grid-cols-2"
        >
          <div>
            <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10">
              <Icon className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="text-xs uppercase tracking-widest text-rose-400/80">
              Where verification blocks the money
            </div>
            <p className="mt-2 text-foreground/85">{cur.blocker}</p>

            <div className="mt-6 text-xs uppercase tracking-widest text-emerald-400/80">
              What GroundTruth unlocks
            </div>
            <p className="mt-2 text-foreground/85">{cur.unlock}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 self-start">
            <div className="rounded-xl border border-foreground/10 bg-foreground/[0.02] p-5">
              <div className="text-xs uppercase tracking-widest text-foreground/40">
                Days to settle
              </div>
              <div className="mt-2 font-mono text-2xl text-emerald-400">
                {cur.metric.days}
              </div>
            </div>
            <div className="rounded-xl border border-foreground/10 bg-foreground/[0.02] p-5">
              <div className="text-xs uppercase tracking-widest text-foreground/40">
                Addressable
              </div>
              <div className="mt-2 text-sm text-foreground/85">{cur.metric.tam}</div>
            </div>
            <div className="col-span-2 rounded-xl border border-foreground/10 bg-foreground/40 p-4 font-mono text-[11px] text-foreground/50">
              expansion order: public works → insurance → agri → trade →
              carbon
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
