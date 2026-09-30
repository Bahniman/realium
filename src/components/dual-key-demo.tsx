import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlowCard } from "./glow-card";
import {
  Play,
  Loader2,
  CheckCircle2,
  Fingerprint,
  Eye,
  Cpu,
  Banknote,
  RefreshCw,
  Activity,
  FileCheck2,
  Landmark,
  Stamp,
  ClipboardList,
} from "lucide-react";
import { BASE_FINANCE_INPUT, BASE_FINANCE_SCENARIO } from "@/lib/finance-scenario";

const formatINR = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

type Step = {
  key: string;
  day: string;
  actor: string;
  actorTone: "emerald" | "indigo" | "sky" | "amber";
  label: string;
  detail: string;
  icon: typeof Eye;
  duration: number;
};

// One illustrative scenario for explaining the proposed lifecycle.
const steps: Step[] = [
  {
    key: "capture",
    day: "DAY 0 · 11:40",
    actor: "Contractor site team",
    actorTone: "amber",
    label: "Example measurement record",
    detail: "Sample site photos and measurements · example location · 12 items",
    icon: Eye,
    duration: 2600,
  },
  {
    key: "assess",
    day: "DAY 0 · 11:43",
    actor: "Illustrative quantity model",
    actorTone: "emerald",
    label: "Modeled quantity assessment",
    detail: "Bituminous concrete · assumed 1,240 m² · illustrative variance 0.4%",
    icon: Cpu,
    duration: 2800,
  },
  {
    key: "prefill",
    day: "DAY 0 · 11:45",
    actor: "Proposed department connector",
    actorTone: "emerald",
    label: "Proposed measurement record",
    detail: "Item 3.2 · Ch. 12+400 to 13+640 · ledger connection not implemented",
    icon: ClipboardList,
    duration: 2400,
  },
  {
    key: "sign",
    day: "DAY 0 · 17:10",
    actor: "Site Engineer (SDE, PWD)",
    actorTone: "indigo",
    label: "Proposed engineer review",
    detail: "A future engineer would review sample evidence against a work-scoped approval",
    icon: Fingerprint,
    duration: 0,
  },
  {
    key: "mint",
    day: "DAY 0 · 17:12",
    actor: "Proposed audit record",
    actorTone: "emerald",
    label: "Illustrative receivable record",
    detail: "Example payer and reliability fields · no instrument or score is issued",
    icon: FileCheck2,
    duration: 2200,
  },
  {
    key: "advance",
    day: "DAY 1 · 09:00",
    actor: "Partner bank",
    actorTone: "sky",
    label: "Modeled 60% advance",
    detail: "₹11,18,340 assumed advance · 40% holdback assumption (₹7,45,560)",
    icon: Banknote,
    duration: 2600,
  },
  {
    key: "chain",
    day: "DAY 2 → 90",
    actor: "Dept. approvers, under mandate",
    actorTone: "indigo",
    label: "Proposed approval timeline",
    detail: "AE → EE → accounts · example timestamps and owners for discussion",
    icon: Stamp,
    duration: 2600,
  },
  {
    key: "settle",
    day: "~DAY 148",
    actor: "State treasury → bank",
    actorTone: "sky",
    label: "Modeled treasury settlement",
    detail: "₹18,63,900 assumed settlement · modeled charges and remaining holdback",
    icon: Landmark,
    duration: 3000,
  },
];

const toneChip: Record<Step["actorTone"], string> = {
  emerald: "border-primary/20 bg-primary/5 text-primary",
  indigo: "border-secondary/20 bg-secondary/5 text-secondary",
  sky: "border-tertiary/20 bg-tertiary/5 text-tertiary",
  amber: "border-error/20 bg-error/5 text-error",
};

export function DualKeyDemo() {
  const runToken = useRef(0);
  const [active, setActive] = useState<number>(-1);
  const [reached, setReached] = useState<number>(-1); // highest step completed
  const [signed, setSigned] = useState(false);
  const [done, setDone] = useState(false);

  // Telemetry frame counter animation for Step 0
  const [frameCount, setFrameCount] = useState(0);
  const [consoleLines, setConsoleLines] = useState<string[]>([]);

  useEffect(() => {
    if (active === 0) {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setFrameCount(4812);
        return;
      }
      setFrameCount(0);
      const startTime = performance.now();
      const duration = 2400;
      let animFrameId: number;

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        setFrameCount(Math.round(4812 * eased));
        if (progress < 1) animFrameId = requestAnimationFrame(animate);
      };

      animFrameId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animFrameId);
    } else if (active > 0 || done) {
      setFrameCount(4812);
    } else {
      setFrameCount(0);
    }
  }, [active, done]);

  // Telemetry stream generator that writes lines line-by-line
  useEffect(() => {
    setConsoleLines([]);
    const timers: number[] = [];

    const addLine = (text: string, delay: number) => {
      const t = window.setTimeout(() => {
        setConsoleLines((prev) => [...prev, text]);
      }, delay);
      timers.push(t);
    };

    if (active === -1) {
      if (done) {
        addLine("✔ ILLUSTRATIVE SCENARIO COMPLETE", 100);
        addLine("Modeled Day 1 advance: ₹11,18,340 (assumed 60%)", 500);
        addLine("Modeled Day 148 settlement: ₹18,63,900", 900);
        addLine(`Modeled charges: ${formatINR(BASE_FINANCE_SCENARIO.bankDiscount)} interest + ${formatINR(BASE_FINANCE_SCENARIO.platformFee)} fee + ${formatINR(BASE_FINANCE_SCENARIO.deductionsAmount)} deductions`, 1300);
        addLine(`Modeled holdback release: ${formatINR(BASE_FINANCE_SCENARIO.remainingHoldback)}`, 1700);
        addLine(`✔ Modeled contractor proceeds: ${formatINR(BASE_FINANCE_SCENARIO.contractorNetTake)} (${BASE_FINANCE_SCENARIO.contractorNetTakePercent.toFixed(1)}%)`, 2100);
        addLine("Illustrative assumptions only · no payment or reliability data", 2500);
      } else {
        addLine("AWAITING SYSTEM VERIFICATION PASS...", 100);
        addLine("Choose 'Play scenario' to step through the sample flow.", 400);
      }
    } else if (active === 0) {
        addLine("SCENARIO: SAMPLE MEASUREMENT RECORD", 100);
      addLine("Example location: 19.0760° N, 72.8777° E", 500);
      addLine("Proposed geo-boundary check: sample point inside", 1000);
      addLine("Sample record: 12 BOQ items · 6 example photos", 1500);
      addLine("No measurement hash or cryptographic signature is created", 2000);
    } else if (active === 1) {
      addLine("ILLUSTRATIVE QUANTITY MODEL: SAMPLE RUN...", 100);
      addLine("Bituminous concrete surface layer detected", 600);
      addLine("Computing area against BOQ item 3.2...", 1200);
      addLine("Measured: 1,240 m² (variance +0.4%, in tolerance)", 1800);
      addLine("Illustrative model score: 98.2% · not independently validated", 2300);
    } else if (active === 2) {
      addLine("e-MB PREFILL: WRITING MEASUREMENT ENTRY...", 100);
      addLine("Item 3.2 (Bituminous Concrete) · Ch. 12+400 → 13+640", 600);
      addLine("Example measurement entry drafted from sample inputs for review", 1200);
      addLine("Proposed next step: associate the entry with an audit record", 1700);
      addLine("Example is ready for a human review step", 2100);
    } else if (active === 3) {
      addLine("AWAITING ACCOUNTABLE HUMAN SIGNATURE...", 100);
      addLine("Proposed human step: the SDE reviews evidence on a device", 500);
      addLine("Sample policy: ₹50.0L cap vs. ₹18.6L amount", 1000);
      addLine("Sample category + geography: roads.bituminous · MH", 1500);
      addLine("Approval policy is modeled locally; no key is checked", 2000);
    } else if (active === 4) {
        addLine("SCENARIO: ILLUSTRATIVE RECEIVABLE RECORD", 100);
      addLine("Example payer: State PWD Div IV · no instrument is issued", 600);
      addLine("Sample event: evidence hashes associated with the signature", 1100);
      addLine("A partner-bank review is a proposed next step · no score measured", 1700);
    } else if (active === 5) {
      addLine("Illustrative partner-bank review step", 100);
      addLine("Sample checks shown for discussion · no live validation", 600);
      addLine("Modeled advance input: 60% · no facility or approval", 1200);
      addLine("Assumed advance: ₹11,18,340 · timing not validated", 1800);
      addLine("Assumed holdback: ₹7,45,560", 2300);
    } else if (active === 6) {
      addLine("APPROVAL CHAIN: AE → EE → division accounts", 100);
      addLine("Illustrative sequence separates proposed funding from approvals", 700);
      addLine("Day 34: EE co-signs · Day 61: accounts passed", 1400);
      addLine("Proposed event log: approval actions carry signer and time", 2100);
    } else if (active === 7) {
      addLine("MODELED DAY 148 SETTLEMENT: ₹18,63,900", 100);
      addLine(`Modeled charges: ${formatINR(BASE_FINANCE_SCENARIO.bankDiscount)} interest + ${formatINR(BASE_FINANCE_SCENARIO.platformFee)} fee + ${formatINR(BASE_FINANCE_SCENARIO.deductionsAmount)} deductions`, 700);
      addLine(`Modeled holdback release: ${formatINR(BASE_FINANCE_SCENARIO.remainingHoldback)}`, 1400);
      addLine(`Modeled contractor proceeds: ${formatINR(BASE_FINANCE_SCENARIO.contractorNetTake)} (${BASE_FINANCE_SCENARIO.contractorNetTakePercent.toFixed(1)}%)`, 2000);
      addLine("Scenario assumptions only · no reliability score measured", 2600);
    }

    return () => timers.forEach(clearTimeout);
  }, [active, done]);

  const wait = (ms: number) => window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? Promise.resolve()
    : new Promise<void>((resolve) => window.setTimeout(resolve, ms));

  useEffect(() => () => { runToken.current += 1; }, []);

  const run = async () => {
    const token = ++runToken.current;
    setDone(false);
    setSigned(false);
    setReached(-1);
    // Run steps 0-2 (machine side)
    for (let i = 0; i < 3; i++) {
      setActive(i);
      await wait(steps[i].duration);
      if (token !== runToken.current) return;
      setReached(i);
    }
    setActive(3); // waiting for human signature
  };

  const sign = async () => {
    const token = ++runToken.current;
    setSigned(true);
    setReached(3);
    // Run steps 4-7 (money side)
    for (let i = 4; i < steps.length; i++) {
      setActive(i);
      await wait(steps[i].duration);
      if (token !== runToken.current) return;
      setReached(i);
    }
    setDone(true);
    setActive(-1); // show the done-state summary in the console
  };

  const reset = () => {
    runToken.current += 1;
    setActive(-1);
    setReached(-1);
    setSigned(false);
    setDone(false);
    setFrameCount(0);
  };

  const stage = done ? steps.length - 1 : reached;

  return (
    <GlowCard className="overflow-hidden p-0" showTechBrackets={true}>
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-foreground/10 px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-foreground/60">
            Sample work item · PWD-MH-1863900 · Ch. 12+400 → 13+640
          </span>
        </div>
        <div className="flex items-center gap-2">
          {active === -1 && !done && (
            <button
              type="button"
              onClick={run}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-on-primary transition-all hover:bg-primary/90 active:bg-primary/80 cursor-pointer"
            >
              <Play className="h-3 w-3" /> Play scenario
            </button>
          )}
          {(active >= 0 || done) && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-lg border border-outline bg-surface-container px-3 py-1.5 text-xs text-on-surface hover:bg-on-surface/8 cursor-pointer transition-colors"
            >
              <RefreshCw className="h-3 w-3" /> Reset
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1.1fr]">
        {/* steps — the real-life lifecycle */}
        <div className="border-foreground/10 p-6 lg:border-r">
          <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-foreground/40">
            Proposed sequence · roles and timing
          </div>
          <ol className="space-y-2.5">
            {steps.map((s, i) => {
              const state =
                i <= reached || done
                  ? "done"
                  : i === active
                    ? i === 3 && !signed
                      ? "await"
                      : "run"
                    : "idle";
              const Icon = s.icon;
              return (
                <li
                  key={s.key}
                  className={`flex items-start gap-3 rounded-lg border p-2.5 transition-all ${
                    state === "idle"
                      ? "border-outline-variant/40"
                      : state === "run"
                        ? "border-primary/30 bg-primary-container/20"
                        : state === "await"
                          ? "border-secondary/40 bg-secondary-container/20"
                          : "border-outline-variant bg-surface-container-low"
                  }`}
                >
                  <div
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
                      state === "done"
                        ? "bg-primary-container text-primary"
                        : state === "await"
                          ? "bg-secondary-container text-secondary animate-pulse"
                          : state === "run"
                            ? "bg-surface-container text-on-surface"
                            : "bg-surface-container-low text-on-surface-variant/55"
                    }`}
                  >
                    {state === "run" ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : state === "done" ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <Icon className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="font-mono text-[10px] tabular-nums text-foreground/40">
                        {s.day}
                      </span>
                      <span
                        className={`rounded-full border px-1.5 py-px text-[9px] font-medium uppercase tracking-wide ${toneChip[s.actorTone]}`}
                      >
                        {s.actor}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center justify-between gap-2">
                      <div className="text-sm font-medium text-foreground">
                        {s.label}
                      </div>
                      {state === "await" && (
                        <button
                          type="button"
                          onClick={sign}
                          className="shrink-0 rounded-lg bg-secondary px-2.5 py-1 text-[11px] font-medium text-on-secondary hover:bg-secondary/90 cursor-pointer transition-colors"
                        >
                          Simulate engineer sign-off
                        </button>
                      )}
                    </div>
                    <div className="mt-0.5 font-mono text-[11px] leading-relaxed text-foreground/50">
                      {s.detail}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Console & settlement receipt */}
        <div className="flex flex-col justify-between p-6">
          {/* Real-time telemetry console */}
          <div className="relative mb-5 min-h-[175px] rounded-lg border border-outline-variant bg-surface-container-high p-4 font-mono text-xs text-on-surface overflow-hidden">
            <div className="absolute inset-0 -z-0 opacity-40 bg-[linear-gradient(rgba(16,185,129,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.04)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

            <div className="relative z-10 flex h-full flex-col justify-between gap-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-1.5 text-[9px] uppercase tracking-wider text-zinc-500 select-none">
                <span className="flex items-center gap-1.5">
                  <Activity className="h-3 w-3 text-emerald-400 animate-pulse" />
                  Console // Telemetry stream
                </span>
                <span>
                  SYS_STATUS:{" "}
                  {active === -1 ? (done ? "SETTLED" : "IDLE") : active === 3 ? "AWAIT_AUTH" : "ACTIVE"}
                </span>
              </div>

              <div className="flex-1 flex flex-col justify-start overflow-y-auto space-y-1.5 min-h-[135px] max-h-[165px] pr-1 select-none">
                {consoleLines.length === 0 && (
                  <div className="text-center text-zinc-500 py-8 font-mono">
                    <p className="animate-pulse">AWAITING SYSTEM VERIFICATION PASS...</p>
                    <p className="mt-1 text-[10px]">Choose &quot;Play scenario&quot; to begin.</p>
                  </div>
                )}
                {consoleLines.map((line, idx) => {
                  const isSuccess =
                    line.startsWith("✔") ||
                    line.includes("SIGNED") ||
                    line.includes("PASSED") ||
                    line.includes("PASS") ||
                    line.includes("OK");
                  const isWarning =
                    line.includes("AWAITING") ||
                    line.includes("required") ||
                    line.includes("Required");
                  const isIndigo =
                    active === 3 ||
                    line.includes("SDE") ||
                    line.includes("EE") ||
                    line.includes("AUTHENTICATING");
                  const isMoney =
                    line.includes("₹") && (line.includes("NEFT") || line.includes("released") || line.includes("advanced") || line.includes("TOTAL"));

                  return (
                    <div
                      key={idx}
                      className={`leading-relaxed text-[11px] font-mono transition-opacity duration-200 ${
                        isSuccess
                          ? "text-primary font-medium"
                          : isMoney
                            ? "text-tertiary font-medium"
                            : isWarning
                              ? "text-error font-medium"
                              : isIndigo
                                ? "text-secondary"
                                : "text-on-surface"
                      }`}
                    >
                      {line}
                    </div>
                  );
                })}

                {active === 0 && consoleLines.length >= 3 && (
                  <div className="mt-2 pt-2 border-t border-outline-variant/30 text-[11px] font-medium text-primary flex items-center justify-between">
                    <span>SCAN RATE: 120 fps</span>
                    <span className="font-mono tabular-nums">FRAMES: {frameCount} / 4812</span>
                  </div>
                )}

                {active === 1 && consoleLines.length >= 2 && (
                  <div className="mt-1 space-y-1">
                    <div className="relative h-6 w-full rounded border border-outline-variant/40 bg-surface-container overflow-hidden flex select-none">
                      <div className="h-full bg-primary/10 border-r border-outline-variant/40 flex items-center justify-center text-[7px] text-primary/80 font-bold" style={{ width: "30%" }}>SUB-BASE</div>
                      <div className="h-full bg-primary/20 border-r border-outline-variant/40 flex items-center justify-center text-[7px] text-primary/80 font-bold" style={{ width: "40%" }}>BASE</div>
                      <div className="h-full bg-primary/30 flex items-center justify-center text-[7px] text-primary/80 font-bold" style={{ width: "30%" }}>BITUMINOUS</div>
                      <motion.div
                        className="absolute top-0 bottom-0 w-0.5 bg-primary"
                        animate={{ left: ["0%", "100%", "0%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      />
                    </div>
                  </div>
                )}

                {active === 3 && consoleLines.length >= 4 && (
                  <div className="mt-2 flex items-center gap-2 rounded border border-secondary/30 bg-secondary-container/10 p-1.5 text-[10px] text-secondary animate-pulse">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary" />
                    </span>
                    <span>Action required: co-sign with SDE key on the left panel.</span>
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 pt-1 text-[10px] text-zinc-600 flex justify-between select-none">
                <span>Illustrative data · no system connection</span>
                <span>Sample values</span>
              </div>
            </div>
          </div>

          {/* Settlement receipt — fills in as the lifecycle progresses */}
          <div>
            <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-foreground/40">
              Sample inputs &amp; modeled settlement
            </div>
            <div className="space-y-2 font-mono text-xs">
              {(
                [
                  ["sample invoice input", formatINR(BASE_FINANCE_INPUT.invoiceAmount), 2],
                  ["quantity model", "illustrative", 1],
                  ["engineer review (sample)", signed ? "simulated" : "pending", 3],
                  ["audit record", stage >= 4 ? "proposed · not created" : "—", 4],
                  ["assumed advance (60%)", stage >= 5 ? formatINR(BASE_FINANCE_SCENARIO.advanceAmount) : "—", 5],
                  ["assumed holdback (40%)", stage >= 5 ? formatINR(BASE_FINANCE_SCENARIO.holdbackAmount) : "—", 5],
                  ["modeled settlement", stage >= 7 ? `Day ${BASE_FINANCE_INPUT.daysToSettle} · ${formatINR(BASE_FINANCE_INPUT.invoiceAmount)}` : "—", 7],
                  ["charges + modeled deductions", stage >= 7 ? formatINR(BASE_FINANCE_SCENARIO.bankDiscount + BASE_FINANCE_SCENARIO.platformFee + BASE_FINANCE_SCENARIO.deductionsAmount) : "—", 7],
                  ["modeled holdback release", stage >= 7 ? formatINR(BASE_FINANCE_SCENARIO.remainingHoldback) : "—", 7],
                  ["modeled contractor proceeds", done ? `${formatINR(BASE_FINANCE_SCENARIO.contractorNetTake)} (${BASE_FINANCE_SCENARIO.contractorNetTakePercent.toFixed(1)}%)` : "—", 8],
                ] as const
              ).map(([k, v, gate]) => {
                const lit = v !== "—" && v !== "pending";
                const highlight =
                  done && (k === "modeled contractor proceeds" || k === "assumed advance (60%)");
                return (
                  <div
                    key={k}
                    className={`flex items-center justify-between gap-3 border-b border-foreground/5 pb-1.5 ${
                      highlight ? "rounded-md border border-emerald-500/25 bg-emerald-500/[0.06] px-2 pt-1" : ""
                    }`}
                  >
                    <span className={highlight ? "text-emerald-600" : "text-foreground/40"}>
                      {k}
                    </span>
                    <span
                      className={
                        !lit
                          ? "text-foreground/40"
                          : highlight
                            ? "font-medium text-emerald-500"
                            : gate >= 5
                              ? "text-sky-600"
                              : "text-foreground/85"
                      }
                    >
                      {v}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 min-h-[88px]" aria-live="polite" aria-atomic="true">
            <AnimatePresence>
              {done && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-700"
                >
                  Model outcome: the proposed flow shows first cash on Day 1; the example
                  treasury settlement is Day 148. These are assumptions, not measured
                  results.
                </motion.div>
              )}
            </AnimatePresence>
            {!done && <p className="mt-4 text-xs text-muted-foreground">Play the scenario to reveal the modeled example.</p>}
            </div>
          </div>
        </div>
      </div>
    </GlowCard>
  );
}
