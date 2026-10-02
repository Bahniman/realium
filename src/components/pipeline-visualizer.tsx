import { useState } from "react";
import { ArrowDown, Banknote, ClipboardCheck, HardHat } from "lucide-react";

const steps = [
  {
    label: "Measure",
    icon: HardHat,
    title: "Field evidence",
    description: "The site engineer logs the measurement in the e-MB with geo-tagged photos. Software checks the quantity against the bill of quantities and flags any gap.",
    logKey: "SITE ENTRY",
    logVal: "1,240 m² segment · +0.4% against BOQ",
    metric: "Evidence",
  },
  {
    label: "Approve",
    icon: ClipboardCheck,
    title: "Human certification",
    description: "A named engineer reviews the evidence and signs. The signature only counts inside that engineer's mandate: value cap, work category, state circle.",
    logKey: "SIGNED BY",
    logVal: "Executive engineer · within mandate",
    metric: "Authority",
  },
  {
    label: "Model",
    icon: Banknote,
    title: "Modeled receivable",
    description: "The signed bill becomes a claim a bank can fund: 60% paid the next day, 40% held back until the treasury settles.",
    logKey: "PAYOUT",
    logVal: "60% day-one advance · 40% holdback",
    metric: "Liquidity",
  },
];

export function PipelineVisualizer() {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = steps[activeIndex]!;
  const Icon = current.icon;

  return (
    <section aria-label="Realium process" className="realium-process">
      <div className="realium-process-heading">
        <span>The route</span>
        <span>Work item · PWD-MH-1863900</span>
      </div>

      <div className="realium-stage-controls" role="group" aria-label="Choose a stage">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = index === activeIndex;
          return (
            <button
              key={step.label}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActiveIndex(index)}
              className="realium-stage-button"
              data-active={isActive}
            >
              <span className="realium-stage-topline">
                <StepIcon aria-hidden="true" size={16} />
                <span>0{index + 1}</span>
              </span>
              <strong>{step.label}</strong>
              {index < steps.length - 1 && <ArrowDown aria-hidden="true" className="realium-stage-arrow" size={13} />}
            </button>
          );
        })}
      </div>

      <article aria-live="polite" aria-atomic="true" className="realium-process-slip">
        <div className="realium-slip-head">
          <div>
            <span className="realium-slip-kicker">{current.metric}</span>
            <h2><Icon aria-hidden="true" size={18} />{current.title}</h2>
          </div>
          <span className="realium-slip-stamp">{String(activeIndex + 1).padStart(2, "0")}/03</span>
        </div>
        <p>{current.description}</p>
        <div className="realium-slip-data">
          <strong>{current.logKey}</strong>
          <span>{current.logVal}</span>
        </div>
      </article>
      <p className="realium-process-note">Tap a stage: measure, approve, model.</p>
    </section>
  );
}
