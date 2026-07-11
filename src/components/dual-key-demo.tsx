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
    duration: 1600, // expanded duration to let animation play out nicely
  },
  {
    key: "assess",
    label: "AI quantity assessment",
    detail: "Bituminous concrete · 1,240 m² ±0.8% · confidence 0.982",
    icon: Cpu,
    duration: 1800,
  },
  {
    key: "prefill",
    label: "Measurement Book prefilled",
    detail: "Item 3.2 · Ch. 12+400 to 13+640 · variance vs. BOQ 0.4%",
    icon: CheckCircle2,
    duration: 1400,
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
    duration: 1600,
  },
];

export function DualKeyDemo() {
  const [active, setActive] = useState<number>(-1);
  const [signed, setSigned] = useState(false);
  const [done, setDone] = useState(false);

  // Telemetry frame counter animation for Step 0
  const [frameCount, setFrameCount] = useState(0);

  useEffect(() => {
    if (active === 0) {
      setFrameCount(0);
      const startTime = performance.now();
      const duration = 1400; // slightly less than step duration
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
                      <div className="truncate text-sm font-medium text-foreground">
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
                    <div className="mt-0.5 truncate font-mono text-[11px] text-foreground/50">
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
              <div className="flex-1 flex flex-col justify-center">
                {active === -1 && !done && (
                  <div className="text-center text-foreground/40 py-2">
                    <p className="animate-pulse">AWAITING SYSTEM VERIFICATION PASS...</p>
                    <p className="mt-1 text-[10px]">Click &quot;Run verification&quot; to begin scanning.</p>
                  </div>
                )}

                {active === 0 && (
                  <div className="space-y-1.5 text-emerald-400">
                    <div className="flex items-center justify-between">
                      <span>DRONE_TELEMETRY: CONNECTED</span>
                      <span className="animate-pulse">●</span>
                    </div>
                    <div className="grid grid-cols-2 text-[10px] text-foreground/60">
                      <span>GPS: 19.0760° N, 72.8777° E</span>
                      <span>ALT: 42.5m (BVLOS)</span>
                    </div>
                    <div className="text-[10px] text-foreground/60">
                      SPEED: 4.8 m/s · HEADING: 182° S
                    </div>
                    <div className="pt-1 flex items-center justify-between border-t border-emerald-500/10 text-sm font-semibold">
                      <span>FRAMES SCANNING:</span>
                      <span className="font-mono tabular-nums">{frameCount} / 4812</span>
                    </div>
                  </div>
                )}

                {active === 1 && (
                  <div className="space-y-1.5 text-emerald-300">
                    <div className="flex items-center justify-between">
                      <span>AI_ENGINE: MODEL SEGMENTATION</span>
                      <Loader2 className="h-3 w-3 animate-spin text-emerald-400" />
                    </div>
                    
                    {/* Visual road layer cross section scanning */}
                    <div className="relative h-6 w-full rounded border border-emerald-500/20 bg-emerald-500/5 overflow-hidden my-1 flex">
                      <div className="h-full bg-emerald-500/20 border-r border-emerald-500/30 flex items-center justify-center text-[8px] select-none" style={{ width: "30%" }}>SUB-BASE</div>
                      <div className="h-full bg-emerald-500/35 border-r border-emerald-500/30 flex items-center justify-center text-[8px] select-none" style={{ width: "40%" }}>BASE</div>
                      <div className="h-full bg-emerald-500/50 flex items-center justify-center text-[8px] select-none" style={{ width: "30%" }}>BITUMINOUS</div>
                      <motion.div 
                        className="absolute top-0 bottom-0 w-0.5 bg-emerald-400 shadow-[0_0_8px_rgb(52,211,153)]"
                        animate={{ left: ["0%", "100%", "0%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      />
                    </div>

                    <div className="grid grid-cols-2 text-[10px] text-foreground/65 leading-none">
                      <div>BOQ: Bituminous concrete</div>
                      <div className="text-right">Variance: +0.4%</div>
                      <div>Quantity: 1,240 m²</div>
                      <div className="text-right">Confidence: 98.2%</div>
                    </div>
                  </div>
                )}

                {active === 2 && (
                  <div className="space-y-1.5 text-emerald-300">
                    <div className="flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-emerald-400" />
                      <span>e-MB PRE-FILL SERVICE</span>
                    </div>
                    <div className="text-[10px] text-foreground/70 bg-foreground/5 p-1.5 rounded border border-foreground/10 space-y-0.5 leading-snug">
                      <div>[ITEM CODE 3.2] Prefilling measurement record...</div>
                      <div>[CHAINAGE] Ch. 12+400 to 13+640 · OK</div>
                      <div>[STATUS] Tamper-evident ledger link: hash_block_1982</div>
                    </div>
                  </div>
                )}

                {active === 3 && (
                  <div className="space-y-2 text-indigo-300">
                    <div className="flex items-center gap-1.5">
                      <Key className="h-3.5 w-3.5 text-indigo-400 animate-bounce" />
                      <span>AWAITING ACCOUNTABLE SIGNATURE</span>
                    </div>
                    <p className="text-[10px] text-foreground/70 leading-normal">
                      Security policy: scope restricted to PWD-MH-1863900. Mandate value cap ₹50.0L is verified. 
                    </p>
                    <div className="flex items-center gap-2 rounded border border-indigo-500/25 bg-indigo-500/5 p-1.5 text-[10px]">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
                      </span>
                      <span>Authorized SDE Cryptographic Key Required.</span>
                    </div>
                  </div>
                )}

                {active === 4 && (
                  <div className="space-y-2 text-emerald-300">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                        <CheckCircle2 className="h-3.5 w-3.5" /> PAYOUT VERIFIED & ENQUEUED
                      </span>
                    </div>
                    <div className="space-y-0.5 text-[10px] text-foreground/75 leading-tight">
                      <div>UTR: TX_982631892_PWD_INIT</div>
                      <div>CREDIT: ₹11,18,340 (60% advance T+1)</div>
                      <div>HOLDBACK: ₹7,45,560 (40% buffer)</div>
                      <div className="truncate">HASH: 0x8b3fd21f22e89643d9f21ab2cd97e021</div>
                    </div>
                  </div>
                )}

                {done && (
                  <div className="space-y-2 text-emerald-400">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>LEDGER WRITTEN SUCCESSFUL</span>
                    </div>
                    <p className="text-[10px] text-foreground/60 leading-normal">
                      Tamper-evident chain is locked. Attestation receipt is generated. Receiver bank discount enqueued.
                    </p>
                  </div>
                )}
              </div>

              {/* Console footer */}
              <div className="border-t border-foreground/10 pt-1 text-[8px] text-foreground/30 flex justify-between select-none">
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
