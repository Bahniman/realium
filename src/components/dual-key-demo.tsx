import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlowCard } from "./glow-card";
import {
  Play,
  Loader2,
  CheckCircle2,
  Fingerprint,
  Camera,
  Cpu,
  Banknote,
  RefreshCw,
  Activity,
  FileCheck2,
  Landmark,
  Stamp,
  ClipboardList,
} from "lucide-react";

type Step = {
  key: string;
  day: string;
  actor: string;
  actorTone: "emerald" | "indigo" | "sky" | "amber";
  label: string;
  detail: string;
  icon: typeof Camera;
  duration: number;
};

// The exact lifecycle a work item follows in production, compressed.
const steps: Step[] = [
  {
    key: "capture",
    day: "DAY 0 · 11:40",
    actor: "Contractor site team",
    actorTone: "amber",
    label: "Site capture, geo-fenced",
    detail: "Drone pass + handset video · geo:19.0760,72.8777 · 4,812 frames · SHA 0x9a…c1",
    icon: Camera,
    duration: 2600,
  },
  {
    key: "assess",
    day: "DAY 0 · 11:43",
    actor: "Realium vision engine",
    actorTone: "emerald",
    label: "AI quantity assessment vs. BOQ",
    detail: "Bituminous concrete · 1,240 m² ±0.8% · confidence 0.982 · variance 0.4%",
    icon: Cpu,
    duration: 2800,
  },
  {
    key: "prefill",
    day: "DAY 0 · 11:45",
    actor: "Realium → dept. system",
    actorTone: "emerald",
    label: "Measurement Book prefilled",
    detail: "Item 3.2 · Ch. 12+400 to 13+640 · linked to tamper-evident ledger",
    icon: ClipboardList,
    duration: 2400,
  },
  {
    key: "sign",
    day: "DAY 0 · 17:10",
    actor: "Site Engineer (SDE, PWD)",
    actorTone: "indigo",
    label: "Dual-key certification — human signs",
    detail: "Reviews evidence on device · Ed25519 key scoped to work_id/PWD-MH-1863900",
    icon: Fingerprint,
    duration: 0,
  },
  {
    key: "mint",
    day: "DAY 0 · 17:12",
    actor: "Realium ledger",
    actorTone: "emerald",
    label: "Bank-grade e-invoice minted",
    detail: "Certified receivable · payer: State PWD Division IV · reliability score attached",
    icon: FileCheck2,
    duration: 2200,
  },
  {
    key: "advance",
    day: "DAY 1 · 09:00",
    actor: "Partner bank",
    actorTone: "sky",
    label: "60% advanced to contractor",
    detail: "₹11,18,340 credited via NEFT · 40% holdback pool funded (₹7,45,560)",
    icon: Banknote,
    duration: 2600,
  },
  {
    key: "chain",
    day: "DAY 2 → 90",
    actor: "Dept. approvers, under mandate",
    actorTone: "indigo",
    label: "Approval chain runs — visibly",
    detail: "AE → EE → accounts · every touch signed + timestamped · queue attributable",
    icon: Stamp,
    duration: 2600,
  },
  {
    key: "settle",
    day: "~DAY 148",
    actor: "State treasury → bank",
    actorTone: "sky",
    label: "Treasury settles, holdback releases",
    detail: "₹18,63,900 to bank · balance minus itemized charges → contractor · score updates",
    icon: Landmark,
    duration: 3000,
  },
];

const toneChip: Record<Step["actorTone"], string> = {
  emerald: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  indigo: "border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  sky: "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400",
  amber: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

export function DualKeyDemo() {
  const [active, setActive] = useState<number>(-1);
  const [reached, setReached] = useState<number>(-1); // highest step completed
  const [signed, setSigned] = useState(false);
  const [done, setDone] = useState(false);

  // Telemetry frame counter animation for Step 0
  const [frameCount, setFrameCount] = useState(0);
  const [consoleLines, setConsoleLines] = useState<string[]>([]);

  useEffect(() => {
    if (active === 0) {
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
        addLine("✔ LIFECYCLE COMPLETE — measurement to settled money", 100);
        addLine("Day 1: ₹11,18,340 advanced (60% tier) · T+1 09:00 IST", 500);
        addLine("Day 148: treasury settled ₹18,63,900 to bank", 900);
        addLine("Charges: ₹49,880 interest (11% p.a. × 148d) + ₹6,524 fee", 1300);
        addLine("Holdback released: ₹6,89,156 → contractor", 1700);
        addLine("✔ CONTRACTOR TOTAL: ₹18,07,496 (97.0% of invoice)", 2100),
        addLine("Reliability 0.91 → 0.92 · next advance tier improves", 2500);
      } else {
        addLine("AWAITING SYSTEM VERIFICATION PASS...", 100);
        addLine("Click 'Run verification' to begin scanning.", 400);
      }
    } else if (active === 0) {
      addLine("DRONE_TELEMETRY: CONNECTING TO SECURE CORE...", 100);
      addLine("GPS witness lock: OK (19.0760° N, 72.8777° E)", 500);
      addLine("Geo-fence check vs. sanctioned alignment: INSIDE", 1000);
      addLine("Alt: 42.5m (BVLOS) · Speed: 4.8 m/s · S-Heading 182°", 1500);
      addLine("Encrypting image hashes with Ed25519 signature...", 2000);
    } else if (active === 1) {
      addLine("AI_ENGINE: INITIALIZING SEGMENTATION MODEL...", 100);
      addLine("Bituminous concrete surface layer detected", 600);
      addLine("Computing area against BOQ item 3.2...", 1200);
      addLine("Measured: 1,240 m² (variance +0.4%, in tolerance)", 1800);
      addLine("Model confidence: 98.2% · PASS", 2300);
    } else if (active === 2) {
      addLine("e-MB PREFILL: WRITING MEASUREMENT ENTRY...", 100);
      addLine("Item 3.2 (Bituminous Concrete) · Ch. 12+400 → 13+640", 600);
      addLine("Human hasn't touched a register — entry is machine-drafted", 1200);
      addLine("Linked to tamper-evident ledger block: hash_block_1982", 1700);
      addLine("Ready for accountable human review: PASSED", 2100);
    } else if (active === 3) {
      addLine("AWAITING ACCOUNTABLE HUMAN SIGNATURE...", 100);
      addLine("In real life: the SDE reviews evidence on their phone", 500);
      addLine("Mandate check (value cap ₹50.0L vs. ₹18.6L): OK", 1000);
      addLine("Category + geography fence: roads.bituminous · MH: OK", 1500);
      addLine("Authorized SDE cryptographic key required.", 2000);
    } else if (active === 4) {
      addLine("MINTING BANK-GRADE E-INVOICE #1863900...", 100);
      addLine("Instrument: certified receivable · payer: State PWD Div IV", 600);
      addLine("Evidence hashes sealed inside the signature — tamper-proof", 1100);
      addLine("Listed to partner bank credit desk · reliability 0.91", 1700);
    } else if (active === 5) {
      addLine("PARTNER BANK: validating instrument offline...", 100);
      addLine("Signature chain OK · sanction match OK · geo-fence OK", 600);
      addLine("Advance approved per standing facility · 60% tier", 1200);
      addLine("NEFT ₹11,18,340 → M/s Borah Constructions · T+1 09:00", 1800);
      addLine("Holdback pool funded: ₹7,45,560 (bank's buffer)", 2300);
    } else if (active === 6) {
      addLine("APPROVAL CHAIN: AE → EE → division accounts", 100);
      addLine("Contractor already has cash — chain runs at govt pace", 700);
      addLine("Day 34: EE co-signs · Day 61: accounts passed", 1400);
      addLine("Every touch signed + timestamped · no invisible delay", 2100);
    } else if (active === 7) {
      addLine("DAY 148: TREASURY SETTLEMENT ₹18,63,900 RECEIVED", 100);
      addLine("Charges: ₹49,880 interest (11% p.a. × 148d) + ₹6,524 fee", 700);
      addLine("Holdback released: ₹6,89,156 → contractor", 1400);
      addLine("Contractor total: ₹18,07,496 · 97.0% of invoice", 2000);
      addLine("Reliability score: 0.91 → 0.92 · next cycle improves", 2600);
    }

    return () => timers.forEach(clearTimeout);
  }, [active, done]);

  const run = async () => {
    setDone(false);
    setSigned(false);
    setReached(-1);
    // Run steps 0-2 (machine side)
    for (let i = 0; i < 3; i++) {
      setActive(i);
      await new Promise((r) => setTimeout(r, steps[i].duration));
      setReached(i);
    }
    setActive(3); // waiting for human signature
  };

  const sign = async () => {
    setSigned(true);
    setReached(3);
    // Run steps 4-7 (money side)
    for (let i = 4; i < steps.length; i++) {
      setActive(i);
      await new Promise((r) => setTimeout(r, steps[i].duration));
      setReached(i);
    }
    setDone(true);
    setActive(-1); // show the done-state summary in the console
  };

  const reset = () => {
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
            work_id · PWD-MH-1863900 · Ch. 12+400 → 13+640
          </span>
        </div>
        <div className="flex items-center gap-2">
          {active === -1 && !done && (
            <button
              onClick={run}
              className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-background transition-transform btn-press hover:scale-105 cursor-pointer"
            >
              <Play className="h-3 w-3" /> Run verification
            </button>
          )}
          {(active >= 0 || done) && (
            <button
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-md border border-foreground/15 bg-foreground/5 px-3 py-1.5 text-xs text-foreground/70 hover:bg-foreground/10 cursor-pointer"
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
            The lifecycle · who does what, and when
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
                      ? "border-foreground/5 opacity-45"
                      : state === "run"
                        ? "border-emerald-500/30 bg-emerald-500/5 shadow-[0_0_12px_rgba(16,185,129,0.05)]"
                        : state === "await"
                          ? "border-indigo-500/40 bg-indigo-500/10 shadow-[0_0_12px_rgba(99,102,241,0.05)]"
                          : "border-foreground/10 bg-foreground/[0.02]"
                  }`}
                >
                  <div
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
                      state === "done"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : state === "await"
                          ? "bg-indigo-500/15 text-indigo-400 animate-pulse"
                          : state === "run"
                            ? "bg-foreground/10 text-foreground"
                            : "bg-foreground/5 text-foreground/50"
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
                        className={`rounded-full border px-1.5 py-px text-[9px] font-semibold uppercase tracking-wide ${toneChip[s.actorTone]}`}
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
                          onClick={sign}
                          className="shrink-0 rounded-md bg-indigo-500 px-2.5 py-1 text-[11px] font-semibold text-white transition-transform btn-press hover:scale-105 cursor-pointer shadow-lg shadow-indigo-500/20"
                        >
                          Sign with SDE key
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
          <div className="relative mb-5 min-h-[175px] rounded-xl border border-white/10 bg-[#040405] p-4 font-mono text-xs text-zinc-300 overflow-hidden">
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
                    <p className="mt-1 text-[10px]">Click &quot;Run verification&quot; to begin scanning.</p>
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
                          ? "text-emerald-400 font-semibold"
                          : isMoney
                            ? "text-sky-300 font-semibold"
                            : isWarning
                              ? "text-amber-400 font-semibold"
                              : isIndigo
                                ? "text-indigo-400"
                                : "text-zinc-300"
                      }`}
                    >
                      {line}
                    </div>
                  );
                })}

                {active === 0 && consoleLines.length >= 3 && (
                  <div className="mt-2 pt-2 border-t border-emerald-500/10 text-[11px] font-semibold text-emerald-400 flex items-center justify-between">
                    <span>SCAN RATE: 120 fps</span>
                    <span className="font-mono tabular-nums">FRAMES: {frameCount} / 4812</span>
                  </div>
                )}

                {active === 1 && consoleLines.length >= 2 && (
                  <div className="mt-1 space-y-1">
                    <div className="relative h-6 w-full rounded border border-emerald-500/20 bg-emerald-500/5 overflow-hidden flex select-none">
                      <div className="h-full bg-emerald-500/15 border-r border-emerald-500/20 flex items-center justify-center text-[7px] text-emerald-400/80 font-bold" style={{ width: "30%" }}>SUB-BASE</div>
                      <div className="h-full bg-emerald-500/25 border-r border-emerald-500/20 flex items-center justify-center text-[7px] text-emerald-400/80 font-bold" style={{ width: "40%" }}>BASE</div>
                      <div className="h-full bg-emerald-500/40 flex items-center justify-center text-[7px] text-emerald-400/80 font-bold" style={{ width: "30%" }}>BITUMINOUS</div>
                      <motion.div
                        className="absolute top-0 bottom-0 w-0.5 bg-emerald-400 shadow-[0_0_8px_rgb(52,211,153)]"
                        animate={{ left: ["0%", "100%", "0%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      />
                    </div>
                  </div>
                )}

                {active === 3 && consoleLines.length >= 4 && (
                  <div className="mt-2 flex items-center gap-2 rounded border border-indigo-500/25 bg-indigo-500/5 p-1.5 text-[10px] text-indigo-400 animate-pulse">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
                    </span>
                    <span>Action required: co-sign with SDE key on the left panel.</span>
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 pt-1 text-[10px] text-zinc-600 flex justify-between select-none">
                <span>SECURE ENCLAVE v1.02 // Ed25519</span>
                <span>HASHCHAIN: OK</span>
              </div>
            </div>
          </div>

          {/* Settlement receipt — fills in as the lifecycle progresses */}
          <div>
            <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-foreground/40">
              Instrument &amp; settlement
            </div>
            <div className="space-y-2 font-mono text-xs">
              {(
                [
                  ["certified invoice", "₹18,63,900", 2],
                  ["ai_witness", "gt-vision-v3", 1],
                  ["human_signer", signed ? "SDE · 0xF4…9C" : "pending", 3],
                  ["cert_hash", stage >= 4 ? "0x8b…d21f" : "—", 4],
                  ["advance (60%, Day 1)", stage >= 5 ? "₹11,18,340" : "—", 5],
                  ["holdback pool (40%)", stage >= 5 ? "₹7,45,560" : "—", 5],
                  ["treasury settles", stage >= 7 ? "Day 148 · ₹18,63,900" : "—", 7],
                  ["charges (interest + fee)", stage >= 7 ? "₹56,404" : "—", 7],
                  ["holdback released", stage >= 7 ? "₹6,89,156" : "—", 7],
                  ["contractor total", done ? "₹18,07,496 · 97.0%" : "—", 8],
                ] as const
              ).map(([k, v, gate]) => {
                const lit = v !== "—" && v !== "pending";
                const highlight =
                  done && (k === "contractor total" || k === "advance (60%, Day 1)");
                return (
                  <div
                    key={k}
                    className={`flex items-center justify-between gap-3 border-b border-foreground/5 pb-1.5 ${
                      highlight ? "rounded-md border border-emerald-500/25 bg-emerald-500/[0.06] px-2 pt-1" : ""
                    }`}
                  >
                    <span className={highlight ? "text-emerald-600 dark:text-emerald-300/90" : "text-foreground/40"}>
                      {k}
                    </span>
                    <span
                      className={
                        !lit
                          ? "text-foreground/40"
                          : highlight
                            ? "font-semibold text-emerald-500 dark:text-emerald-400"
                            : gate >= 5
                              ? "text-sky-600 dark:text-sky-300"
                              : "text-foreground/85"
                      }
                    >
                      {v}
                    </span>
                  </div>
                );
              })}
            </div>

            <AnimatePresence>
              {done && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-700 dark:text-emerald-300"
                >
                  Full lifecycle complete: work measured on Day 0, contractor liquid on
                  Day 1, treasury settled on its own clock behind the holdback. Days to
                  first cash: <b>1 vs 148</b>.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </GlowCard>
  );
}
