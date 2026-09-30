import { useState } from "react";
import { Eye, Cpu, Fingerprint, Banknote } from "lucide-react";

const steps = [
  {
    label: "Evidence",
    subLabel: "e-MB site entry",
    icon: Eye,
    title: "e-MB site measurement entry",
    description: "Site engineers record digital measurement entries and attach geo-tagged photos to log finished public works.",
    logKey: "e-MB_SYNC",
    logVal: "Sample location · 12 items · 6 example photos",
    metric: "Example input",
  },
  {
    label: "Audit",
    subLabel: "AI quantity check",
    icon: Cpu,
    title: "AI quantity audit vs. BOQ",
    description: "Vision AI is proposed to compare measured material quantities with the Bill of Quantities. The value shown is illustrative.",
    logKey: "AI_AUDIT",
    logVal: "Sample 1,240 m² segment · assumed variance +0.4%",
    metric: "Illustrative output",
  },
  {
    label: "Authority",
    subLabel: "Proposed approval",
    icon: Fingerprint,
    title: "Work-scoped approval",
    description: "The proposal gives approvals a defined work scope and accountable owner. Cryptographic signing and mandate enforcement remain implementation requirements.",
    logKey: "EXAMPLE_SCOPE",
    logVal: "PWD-MH-1863900 · sample approval",
    metric: "Proposed control",
  },
  {
    label: "Liquidity",
    subLabel: "Modeled payout",
    icon: Banknote,
    title: "Illustrative liquidity waterfall",
    description: "A scenario models a 60% advance, 40% holdback, and later settlement. No bank offer or payment cycle has been validated.",
    logKey: "MODEL_INPUTS",
    logVal: "₹11,18,340 advance · ₹7,45,560 holdback · assumed 11% p.a.",
    metric: "Scenario only",
  },
];

export function PipelineVisualizer() {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = steps[activeIndex]!;
  const Icon = current.icon;

  return (
    <section aria-label="Illustrative Realium process" className="rounded-[16px] border border-outline-variant bg-surface-container p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-outline-variant pb-3">
        <h3 className="font-mono text-[11px] font-bold uppercase tracking-wider text-on-surface">Illustrative process</h3>
        <span className="font-mono text-[10px] text-on-surface-variant">Select a step</span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label="Select a process step">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = index === activeIndex;
          return (
            <button
              key={step.label}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActiveIndex(index)}
              className="pipeline-step flex min-h-[72px] flex-col items-start justify-center gap-1 rounded px-3 py-2 text-left"
              data-active={isActive}
            >
              <span className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wide">
                <StepIcon aria-hidden="true" className="h-4 w-4" />
                <span>0{index + 1} {step.label}</span>
              </span>
              <span className="pipeline-step-note pl-6 text-[11px] leading-snug">{step.subLabel}</span>
            </button>
          );
        })}
      </div>

      <div aria-live="polite" aria-atomic="true" className="pipeline-details mt-4 min-h-[272px] rounded border-2 border-foreground bg-card p-4">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-outline-variant pb-3">
          <h4 className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wide text-foreground">
            <Icon aria-hidden="true" className="pipeline-icon h-4 w-4" />
            {current.title}
          </h4>
          <span className="rounded border border-outline bg-background px-2 py-1 font-mono text-[10px] font-bold text-foreground">
            {current.metric}
          </span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{current.description}</p>
        <div className="mt-3 flex flex-wrap gap-x-2 gap-y-1 border-t border-outline-variant pt-3 font-mono text-xs">
          <span className="pipeline-key font-bold">[{current.logKey}]</span>
          <span className="text-muted-foreground">{current.logVal}</span>
        </div>
      </div>
    </section>
  );
}
