import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Loader2,
  CheckCircle2,
  Fingerprint,
  Camera,
  Cpu,
  Banknote,
  RefreshCw,
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
    duration: 900,
  },
  {
    key: "assess",
    label: "AI quantity assessment",
    detail: "Bituminous concrete · 1,240 m² ±0.8% · confidence 0.982",
    icon: Cpu,
    duration: 1000,
  },
  {
    key: "prefill",
    label: "Measurement Book prefilled",
    detail: "Item 3.2 · Ch. 12+400 to 13+640 · variance vs. BOQ 0.4%",
    icon: CheckCircle2,
    duration: 700,
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
    duration: 900,
  },
];

export function DualKeyDemo() {
  const [active, setActive] = useState<number>(-1);
  const [signed, setSigned] = useState(false);
  const [done, setDone] = useState(false);

  const run = async () => {
    setDone(false);
    setSigned(false);
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
  };

  return (
    <div className="glass overflow-hidden rounded-2xl">
      <div className="flex items-center justify-between border-b border-foreground/10 px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgb(16,185,129,0.8)]" />
          <span className="font-mono text-xs text-foreground/60">
            work_id · PWD-MH-1863900 · Ch. 12+400 → 13+640
          </span>
        </div>
        <div className="flex items-center gap-2">
          {active === -1 && !done && (
            <button
              onClick={run}
              className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-background transition-transform btn-press hover:scale-105"
            >
              <Play className="h-3 w-3" /> Run verification
            </button>
          )}
          {(active >= 0 || done) && (
            <button
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-md border border-foreground/15 bg-foreground/5 px-3 py-1.5 text-xs text-foreground/70 hover:bg-foreground/10"
            >
              <RefreshCw className="h-3 w-3" /> Reset
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr]">
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
                      ? "border-foreground/5 opacity-40"
                      : state === "run"
                        ? "border-emerald-500/30 bg-emerald-500/5"
                        : state === "await"
                          ? "border-indigo-500/40 bg-indigo-500/10"
                          : "border-foreground/10 bg-foreground/[0.02]"
                  }`}
                >
                  <div
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
                      state === "done"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : state === "await"
                          ? "bg-indigo-500/15 text-indigo-400"
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
                          className="shrink-0 rounded-md bg-indigo-500 px-2.5 py-1 text-[11px] font-semibold text-foreground transition-transform btn-press hover:scale-105"
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

        {/* receipt */}
        <div className="p-6">
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
                        ? "text-emerald-400"
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
  );
}
