import { useState } from "react";
import { ArrowDown, Banknote, ClipboardCheck, HardHat } from "lucide-react";

const steps = [
  {
    label: "Measure",
    icon: HardHat,
    title: "Field evidence",
    description: "A proposed site record pairs e-MB entries and geo-tagged photos with a quantity check against the BOQ. Any automated comparison remains a proposal; the sample variance is illustrative.",
    logKey: "EXAMPLE INPUT",
    logVal: "1,240 m² segment · assumed +0.4% variance",
    metric: "Illustrative input",
  },
  {
    label: "Approve",
    icon: ClipboardCheck,
    title: "Human certification",
    description: "An authorized engineer would review and certify the evidence. Named owners, scoped authority, and signed events are proposed controls, not live approvals in this prototype.",
    logKey: "PROPOSED OWNER",
    logVal: "Authorized engineer · no signed event",
    metric: "Proposed control",
  },
  {
    label: "Model",
    icon: Banknote,
    title: "Modeled receivable",
    description: "A scenario models a 60% advance, 40% holdback, and later treasury settlement. No bank offer, payment cycle, or timing assumption has been validated.",
    logKey: "SCENARIO ONLY",
    logVal: "60% day-one advance · 40% holdback",
    metric: "Unvalidated model",
  },
];

export function PipelineVisualizer() {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = steps[activeIndex]!;
  const Icon = current.icon;

  return (
    <section aria-label="Illustrative Realium process" className="realium-process suite-reveal">
      <div className="realium-process-heading">
        <span>Proposed route</span>
        <span>Sample work item · PWD-MH-1863900</span>
      </div>

      <div className="realium-stage-controls" role="group" aria-label="Choose a proposed process stage">
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
      <p className="realium-process-note">Illustrative concept only · no live PWD, bank, payment rail, ledger, or production AI connection</p>
    </section>
  );
}
