import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlowCard } from "./glow-card";
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
    blocker: "Public-works payment timelines can constrain contractor cash flow; local baselines vary.",
    unlock: "Test whether reviewable evidence and approval records can help lenders assess eligible bills.",
    metric: { days: "Baseline TBD", tam: "Pilot and buyer research" },
  },
  {
    key: "insurance",
    label: "Insurance",
    icon: Umbrella,
    blocker: "Physical claims may rely on inspection and supporting documents; insurer processes vary.",
    unlock: "Explore whether a structured evidence record could make parts of claim review easier to inspect.",
    metric: { days: "Baseline TBD", tam: "Insurer interviews" },
  },
  {
    key: "trade",
    label: "Trade & banking",
    icon: Ship,
    blocker: "Trade-finance reviews can involve documents and collateral checks across organizations.",
    unlock: "Test whether portable, sourced attestations can support collateral review between counterparties.",
    metric: { days: "Baseline TBD", tam: "Lender research" },
  },
  {
    key: "carbon",
    label: "Carbon & ESG",
    icon: Leaf,
    blocker: "Carbon claims rely on evidence and review processes that differ across methodologies.",
    unlock: "Explore whether a clearer evidence trail helps reviewers assess a project claim.",
    metric: { days: "Baseline TBD", tam: "Methodology research" },
  },
  {
    key: "agri",
    label: "Agriculture",
    icon: Wheat,
    blocker: "Crop-loss reviews and warehouse records can affect lending and insurance decisions.",
    unlock: "Study whether field evidence can be packaged for clearer review by lenders or insurers.",
    metric: { days: "Baseline TBD", tam: "Buyer research" },
  },
];

export function VerticalsSwitcher() {
  const [active, setActive] = useState(verticals[0].key);
  const cur = verticals.find((v) => v.key === active)!;
  const Icon = cur.icon;

  return (
    <GlowCard className="overflow-hidden p-0" showTechBrackets={false}>
      <div className="flex flex-wrap gap-1 border-b border-outline-variant p-2">
        {verticals.map((v) => {
          const IconV = v.icon;
          const on = v.key === active;
          return (
            <button
              key={v.key}
              type="button"
              aria-pressed={on}
              onClick={() => setActive(v.key)}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all ${
                on
                  ? "bg-primary text-on-primary font-medium"
                  : "text-on-surface-variant hover:bg-on-surface/8 hover:text-on-surface"
              }`}
            >
              <IconV className="h-4 w-4" />
              {v.label}
            </button>
          );
        })}
      </div>

      <p className="px-4 pt-3 text-xs text-on-surface-variant">
        These are adjacent use-case hypotheses. No sector-specific pilot or settlement-time reduction is validated.
      </p>

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
            <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-lg border border-primary/30 bg-primary-container">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="text-xs uppercase tracking-widest text-error">
              Where verification blocks the money
            </div>
            <p className="mt-2 text-on-surface-variant">{cur.blocker}</p>

            <div className="mt-6 text-xs uppercase tracking-widest text-primary">
              What this proposal could test
            </div>
            <p className="mt-2 text-on-surface-variant">{cur.unlock}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 self-start">
            <div className="rounded-lg border border-outline-variant bg-surface-container-low p-5">
              <div className="text-xs uppercase tracking-widest text-on-surface-variant/70">
                Research status
              </div>
              <div className="mt-2 font-mono text-2xl text-primary">
                {cur.metric.days}
              </div>
            </div>
            <div className="rounded-lg border border-outline-variant bg-surface-container-low p-5">
              <div className="text-xs uppercase tracking-widest text-on-surface-variant/70">
                Next evidence
              </div>
              <div className="mt-2 text-sm text-on-surface-variant">{cur.metric.tam}</div>
            </div>
            <div className="col-span-2 rounded-lg border border-outline-variant bg-surface-container-high p-4 font-mono text-[11px] text-on-surface-variant">
              expansion order: public works → insurance → agri → trade →
              carbon
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </GlowCard>
  );
}
