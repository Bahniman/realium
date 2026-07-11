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
  FileText,
  Key,
  ShieldAlert,
} from "lucide-react";

type Step = {
  key: string;
  label: string;
  detail: string;
  icon: typeof Camera;
  duration: number;
};

const steps: Step[] = [
  {
    key: "capture",
    label: "Drone pass captured",
    detail: "geo:19.0760,72.8777 · 4,812 frames · SHA 0x9a…c1",
    icon: Camera,
    duration: 2600,
  },
  {
    key: "assess",
    label: "AI quantity assessment",
    detail: "Bituminous concrete · 1,240 m² ±0.8% · confidence 0.982",
    icon: Cpu,
    duration: 2800,
  },
  {
    key: "prefill",
    label: "Measurement Book prefilled",
    detail: "Item 3.2 · Ch. 12+400 to 13+640 · variance vs. BOQ 0.4%",
    icon: CheckCircle2,
    duration: 2400,
  },
  {
    key: "sign",
    label: "Awaiting human signature",
    detail: "SDE (PWD) · Ed25519 key · scope: work_id/PWD-MH-1863900",
    icon: Fingerprint,
    duration: 0,
  },
  {
    key: "payout",
    label: "T+2 bank payout initiated",
    detail: "₹18,63,900 · IFSC HDFC0000240 · UTR pending",
    icon: Banknote,
    duration: 2800,
  },
];

export function DualKeyDemo() {
  const [active, setActive] = useState<number>(-1);
  const [signed, setSigned] = useState(false);
  const [done, setDone] = useState(false);

  // Telemetry frame counter animation for Step 0
  const [frameCount, setFrameCount] = useState(0);
  const [consoleLines, setConsoleLines] = useState<string[]>([]);

  useEffect(() => {
    if (active === 0) {
      setFrameCount(0);
      const startTime = performance.now();
      const duration = 2400; // slightly less than step duration
      let animFrameId: number;

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        // cubic ease out
        const eased = 1 - Math.pow(1 - progress, 3);
        setFrameCount(Math.round(4812 * eased));

        if (progress < 1) {
          animFrameId = requestAnimationFrame(animate);
        }
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
        addLine("✔ PAYOUT VERIFIED & ENQUEUED", 100);
        addLine("✔ LEDGER WRITTEN SUCCESSFUL", 400);
        addLine("Tamper-evident chain is locked. Attestation receipt generated.", 800);
        addLine("UTR: TX_982631892_PWD_INIT", 1200);
        addLine("CREDIT: ₹11,18,340 (60% advance T+1)", 1500);
        addLine("HOLDBACK: ₹7,45,560 (40% buffer)", 1800);
        addLine("SYSTEM READY: escrows completed.", 2200);
      } else {
        addLine("AWAITING SYSTEM VERIFICATION PASS...", 100);
        addLine("Click 'Run verification' to begin scanning.", 400);
      }
    } else if (active === 0) {
      addLine("DRONE_TELEMETRY: CONNECTING TO SECURE CORE...", 100);
      addLine("GPS witness lock: OK (19.0760° N, 72.8777° E)", 500);
      addLine("Alt: 42.5m (BVLOS) · Speed: 4.8 m/s · S-Heading 182°", 1000);
      addLine("Scanning video frames into enclave for verification...", 1500);
      addLine("Encrypting image hashes with RFC 8032 signature...", 2000);
    } else if (active === 1) {
      addLine("AI_ENGINE: INITIALIZING CONVOLUTIONAL MODEL...", 100);
      addLine("Segmentation: Bituminous Concrete surface layer detected", 600);
      addLine("Calculating cross section depth & volume...", 1200);
      addLine("Measured Area: 1,240 m² (Variance: +0.4% in tolerance)", 1800);
      addLine("Model Confidence score: 98.2% · PASS", 2300);
    } else if (active === 2) {
      addLine("e-MB PRE-FILL SERVICE: INITIALIZING ESCROW DATA...", 100);
      addLine("Writing item code 3.2 (Bituminous Concrete) pre-fills...", 600);
      addLine("Validating chainage scope: Ch. 12+400 to 13+640", 1200);
      addLine("Linking tamper-evident ledger block: hash_block_1982", 1700);
      addLine("System verification audit: PASSED", 2100);
    } else if (active === 3) {
      addLine("AWAITING ACCOUNTABLE HUMAN SIGNATURE...", 100);
      addLine("Restricted scope: work_id/PWD-MH-1863900", 500);
      addLine("Mandate check (value cap ₹50.0L vs. ₹18.6L): OK", 1000);
      addLine("Attestation hash: 0x8b3fd21f22e89643d9f21ab2cd97e021", 1500);
      addLine("Authorized SDE Cryptographic Key Required.", 2000);
    } else if (active === 4) {
      addLine("AUTHENTICATING SDE SIGNATURE (0xF4...9C)...", 100);
      addLine("Authorizing SDE Maharashtra Key... SIGNED OK", 500);
      addLine("Broadcasting attestations to ledger network...", 1000);
      addLine("Writing UTR receipts: TX_982631892_PWD_INIT", 1500);
      addLine("ESCROW DIRECTIVES: 60% T+1, 40% holdback buffer", 2000);
      addLine("Writing transaction receipts to disk...", 2400);
    }

    return () => timers.forEach(clearTimeout);
  }, [active, done]);

  const run = async () => {
    setDone(false);
    setSigned(false);
    // Run step 0, 1, 2
    for (let i = 0; i < 3; i++) {
      setActive(i);
      await new Promise((r) => setTimeout(r, steps[i].duration));
    }
    setActive(3); // waiting for sign
  };

  const sign = async () => {
    setSigned(true);
    setActive(4);
    await new Promise((r) => setTimeout(r, steps[4].duration));
    setDone(true);
    setActive(-1); // Reset active back to -1 so the done state console logs show
  };

  const reset = () => {
    setActive(-1);
    setSigned(false);
    setDone(false);
    setFrameCount(0);
  };

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

      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.2fr]">
        {/* steps */}
        <div className="border-foreground/10 p-6 lg:border-r">
          <ol className="space-y-3">
            {steps.map((s, i) => {
              const state =
                i < active || done
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
                  className={`flex items-start gap-3 rounded-lg border p-3 transition-all ${
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
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-medium text-foreground">
                        {s.label}
                      </div>
                      {state === "await" && (
                        <button
                          onClick={sign}
                          className="shrink-0 rounded-md bg-indigo-500 px-2.5 py-1 text-[11px] font-semibold text-foreground transition-transform btn-press hover:scale-105 cursor-pointer shadow-lg shadow-indigo-500/20"
                        >
                          Sign with SDE key
                        </button>
                      )}
                    </div>
                    <div className="mt-0.5 font-mono text-[11px] text-foreground/50 whitespace-normal break-all">
                      {s.detail}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Console & attestation details */}
        <div className="flex flex-col justify-between p-6">
          {/* Real-time telemetry console */}
          <div className="relative mb-5 min-h-[175px] rounded-xl border border-foreground/10 bg-[#040405] p-4 font-mono text-xs text-foreground overflow-hidden">
            {/* Grid overlay */}
            <div className="absolute inset-0 -z-0 opacity-40 bg-[linear-gradient(rgba(16,185,129,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.04)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
            
            <div className="relative z-10 flex h-full flex-col justify-between gap-3">
              {/* Console header */}
              <div className="flex items-center justify-between border-b border-foreground/10 pb-1.5 text-[9px] uppercase tracking-wider text-foreground/45 select-none">
                <span className="flex items-center gap-1.5">
                  <Activity className="h-3 w-3 text-emerald-400 animate-pulse" />
                  Console // Telemetry stream
                </span>
                <span>SYS_STATUS: {active === -1 ? "IDLE" : active === 3 ? "AWAIT_AUTH" : "ACTIVE"}</span>
              </div>

              {/* Console content based on active step */}
              <div className="flex-1 flex flex-col justify-start overflow-y-auto space-y-1.5 min-h-[135px] max-h-[155px] pr-1 select-none">
                {consoleLines.length === 0 && (
                  <div className="text-center text-foreground/40 py-8 font-mono">
                    <p className="animate-pulse">AWAITING SYSTEM VERIFICATION PASS...</p>
                    <p className="mt-1 text-[10px]">Click &quot;Run verification&quot; to begin scanning.</p>
                  </div>
                )}
                {consoleLines.map((line, idx) => {
                  const isSuccess = line.startsWith("✔") || line.includes("SIGNED") || line.includes("PASSED") || line.includes("OK");
                  const isWarning = line.includes("AWAITING") || line.includes("Required") || line.includes("Verification") || line.includes("RESTRICTION") || line.includes("Action");
                  const isIndigo = active === 3 || line.includes("SDE") || line.includes("Authorized") || line.includes("AUTHENTICATING");

                  return (
                    <div 
                      key={idx} 
                      className={`leading-relaxed text-[11px] font-mono transition-opacity duration-200 ${
                        isSuccess 
                          ? "text-emerald-400 font-semibold" 
                          : isWarning 
                            ? "text-amber-400 font-semibold"
                            : isIndigo 
                              ? "text-indigo-400" 
                              : "text-foreground/75"
                      }`}
                    >
                      {line}
                    </div>
                  );
                })}

                {/* Inline frame counter during active === 0 */}
                {active === 0 && consoleLines.length >= 3 && (
                  <div className="mt-2 pt-2 border-t border-emerald-500/10 text-[11px] font-semibold text-emerald-400 flex items-center justify-between">
                    <span>SCAN RATE: 120 fps</span>
                    <span className="font-mono tabular-nums">FRAMES: {frameCount} / 4812</span>
                  </div>
                )}

                {/* Inline segmentation visual scan bar during active === 1 */}
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

                {/* Inline ping warning for co-signing during active === 3 */}
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

              {/* Console footer */}
              <div className="border-t border-foreground/10 pt-1 text-[10px] text-foreground/30 flex justify-between select-none">
                <span>SECURE ENCLAVE v1.02 // Ed25519</span>
                <span>HASHCHAIN: OK</span>
              </div>
            </div>
          </div>

          {/* Attestation receipt */}
          <div>
            <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-foreground/40">
              Attestation certificate
            </div>
            <div className="space-y-2 font-mono text-xs">
              {[
                ["invoice", "1863900"],
                ["amount", "₹18,63,900"],
                ["days_traditional", "148"],
                ["days_groundtruth", done ? "2" : "—"],
                ["ai_witness", "gt-vision-v3"],
                ["human_signer", signed ? "SDE · 0xF4…9C" : "pending"],
                ["cert_hash", done ? "0x8b…d21f" : "—"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-center justify-between border-b border-foreground/5 pb-1.5"
                >
                  <span className="text-foreground/40">{k}</span>
                  <span
                    className={
                      v === "pending" || v === "—"
                        ? "text-foreground/40"
                        : done && (k === "days_groundtruth" || k === "cert_hash")
                          ? "text-emerald-400 font-semibold"
                          : "text-foreground/85"
                    }
                  >
                    {v}
                  </span>
                </div>
              ))}
            </div>

            <AnimatePresence>
              {done && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300"
                >
                  Certified receivable created. Bank discount available at 0.28% ·
                  T+2 payout enqueued.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </GlowCard>
  );
}
