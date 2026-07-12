import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ShieldAlert, ShieldX, Send } from "lucide-react";
import { GlowCard } from "./glow-card";

type Attempt = {
  id: number;
  category: string;
  workId: string;
  amount: number;
  verdict: "allow" | "escrow" | "block";
  reason: string;
};

// Executive Engineer's certification mandate — realistic PWD scenarios.
const scenarios = [
  { category: "roads.bituminous", workId: "PWD-MH-1863900", amount: 1863900 },
  { category: "roads.bituminous", workId: "PWD-MH-2140050", amount: 6240000 },
  { category: "bridges.rcc", workId: "PWD-MH-BR-0442", amount: 3200000 },
  { category: "buildings.school", workId: "PWD-MH-SCH-118", amount: 980000 },
  { category: "roads.bituminous", workId: "PWD-KA-9921", amount: 2100000 }, // wrong geography
];

export function SuretyPlayground() {
  const [cap, setCap] = useState(5000000); // ₹50 L per single certification
  const [categories, setCategories] = useState(
    "roads.bituminous, buildings.school",
  );
  const [geo, setGeo] = useState("MH"); // Maharashtra circle
  const [revoked, setRevoked] = useState(false);
  const [log, setLog] = useState<Attempt[]>([]);
  const [next, setNext] = useState(0);

  const allowedCats = useMemo(
    () =>
      categories
        .split(",")
        .map((d) => d.trim().toLowerCase())
        .filter(Boolean),
    [categories],
  );

  const trigger = () => {
    const s = scenarios[next % scenarios.length];
    let verdict: Attempt["verdict"] = "allow";
    let reason = "In scope · signed & logged to chain";
    const catOk = allowedCats.includes(s.category);
    const geoOk = s.workId.startsWith(`PWD-${geo}-`);
    if (revoked) {
      verdict = "block";
      reason = "Mandate revoked (officer transferred) — cannot certify";
    } else if (!geoOk) {
      verdict = "block";
      reason = `Outside geography fence · mandate scoped to ${geo} circle`;
    } else if (!catOk) {
      verdict = "block";
      reason = `Category ${s.category} not in mandate`;
    } else if (s.amount > cap) {
      verdict = "escrow";
      reason = `Exceeds single-certification cap ₹${cap.toLocaleString("en-IN")} — routed to SE for co-sign`;
    }
    setLog((l) =>
      [{ id: Date.now(), ...s, verdict, reason }, ...l].slice(0, 6),
    );
    setNext(next + 1);
  };

  return (
    <GlowCard className="grid grid-cols-1 gap-6 overflow-hidden lg:grid-cols-[1fr_1.2fr]">
      {/* controls */}
      <div>
        <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#000DFF]">
          Certification mandate · Executive Engineer
        </div>
        <div className="mb-6 font-mono text-[10px] text-muted-foreground">
          mandate:0x7a4c…e021 · Ed25519 · auto-revoke on transfer
        </div>

        <label className="block text-xs font-semibold uppercase tracking-wider text-[10px] text-foreground/80">
          Single-certification cap
        </label>
        <div className="mt-2 flex items-center gap-3">
          <input
            type="range"
            min={500000}
            max={10000000}
            step={100000}
            value={cap}
            onChange={(e) => setCap(Number(e.target.value))}
            className="w-full accent-[#000DFF] cursor-pointer"
          />
          <div className="w-28 shrink-0 rounded-md border border-border bg-card px-2 py-1 text-right font-mono text-sm text-foreground shadow-[1px_1px_0px_var(--border)]">
            ₹{(cap / 100000).toFixed(1)}L
          </div>
        </div>

        <label className="mt-6 block text-xs font-semibold uppercase tracking-wider text-[10px] text-foreground/80">
          Category caps (allowlist)
        </label>
        <input
          type="text"
          value={categories}
          onChange={(e) => setCategories(e.target.value)}
          className="mt-2 w-full rounded-md border border-border bg-card px-3 py-2 font-mono text-xs text-foreground outline-none focus:border-[#000DFF] shadow-[1px_1px_0px_var(--border)]"
        />

        <label className="mt-6 block text-xs font-semibold uppercase tracking-wider text-[10px] text-foreground/80">
          Geography fence (state circle)
        </label>
        <div className="mt-2 flex gap-2">
          {["MH", "KA", "TN", "GJ"].map((g) => (
            <button
              key={g}
              onClick={() => setGeo(g)}
              className={`flex-1 rounded-md border px-2 py-1.5 font-mono text-xs transition-colors cursor-pointer ${
                geo === g
                  ? "border-[#000DFF] bg-[#000DFF] text-white font-bold shadow-[2px_2px_0px_#161616]"
                  : "border-border bg-card text-foreground hover:bg-muted"
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        <label className="mt-6 flex items-center gap-2 text-xs font-medium text-foreground/80 cursor-pointer">
          <input
            type="checkbox"
            checked={revoked}
            onChange={(e) => setRevoked(e.target.checked)}
            className="accent-[#FF4D00]"
          />
          Simulate officer transfer (auto-revoke)
        </label>

        <button
          onClick={trigger}
          className="group btn-press mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#000DFF] border border-[#000DFF] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-x-[2px] hover:-translate-y-[2px] shadow-[2px_2px_0px_#161616] hover:shadow-[4px_4px_0px_#161616] active:translate-x-0 active:translate-y-0 active:shadow-none cursor-pointer"
        >
          <Send className="h-4 w-4" /> Simulate certification attempt
        </button>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[10px] font-bold uppercase tracking-wider">
          <div className="rounded-md border border-[#0BDB00]/30 bg-[#0BDB00]/10 py-1.5 text-emerald-700">
            Allow
          </div>
          <div className="rounded-md border border-[#FF4D00]/30 bg-[#FF4D00]/10 py-1.5 text-[#FF4D00]">
            Escrow
          </div>
          <div className="rounded-md border border-[#161616]/30 bg-[#161616]/10 py-1.5 text-foreground">
            Block
          </div>
        </div>
      </div>

      {/* action log */}
      <div className="rounded-xl border border-border bg-card p-4 flex flex-col h-full min-h-[340px] shadow-[2px_2px_0px_var(--border)]">
        <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <span>Signed approval chain</span>
          <span>tamper-evident · ledger</span>
        </div>

        {log.length === 0 && (
          <div className="flex flex-1 items-center justify-center text-center text-xs text-muted-foreground min-h-[220px]">
            Every approval, non-approval, and block is a signed, timestamped event. Try a certification.
          </div>
        )}

        <ul className="space-y-2 flex-1 overflow-y-auto">
          <AnimatePresence initial={false}>
            {log.map((a) => {
              const Icon =
                a.verdict === "allow"
                  ? ShieldCheck
                  : a.verdict === "escrow"
                    ? ShieldAlert
                    : ShieldX;
              const toneText =
                a.verdict === "allow"
                  ? "text-emerald-700"
                  : a.verdict === "escrow"
                    ? "text-[#FF4D00]"
                    : "text-rose-600";
              const toneBorder =
                a.verdict === "allow"
                  ? "border-[#0BDB00]/20 bg-[#0BDB00]/5"
                  : a.verdict === "escrow"
                    ? "border-[#FF4D00]/20 bg-[#FF4D00]/5"
                    : "border-rose-500/20 bg-rose-500/5";
              return (
                <motion.li
                  key={a.id}
                  layout
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex items-start gap-3 rounded-lg border p-3 ${toneBorder}`}
                >
                  <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${toneText}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 font-mono text-xs text-foreground/80">
                      <span className="break-all whitespace-normal font-semibold">
                        certify({a.workId}, {a.category}, ₹{a.amount.toLocaleString("en-IN")})
                      </span>
                      <span
                        className={`shrink-0 text-[10px] uppercase tracking-widest font-bold self-start sm:self-auto ${toneText}`}
                      >
                        {a.verdict}
                      </span>
                    </div>
                    <div className="mt-1 text-[11px] text-muted-foreground whitespace-normal">
                      {a.reason}
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      </div>
    </GlowCard>
  );
}
