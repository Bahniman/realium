import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Cpu, Fingerprint, Banknote, ShieldCheck } from "lucide-react";

type Node = {
  id: number;
  label: string;
  subLabel: string;
  icon: typeof Camera;
  color: string;
  glowColor: string;
  x: number;
  y: number;
  details: {
    title: string;
    description: string;
    logKey: string;
    logVal: string;
    metric: string;
  };
};

const nodes: Node[] = [
  {
    id: 0,
    label: "01 Evidence",
    subLabel: "Drone Site Capture",
    icon: Camera,
    color: "text-emerald-400",
    glowColor: "rgba(16, 185, 129, 0.45)",
    x: 80,
    y: 80,
    details: {
      title: "BVLOS Drone site capture",
      description: "Continuous photogrammetry and handset scans capture construction ground truth. Frames hashed and geo-tagged instantly.",
      logKey: "TELEMETRY",
      logVal: "GPS 19.0760° N · 4,812 frames · SHA-256 secure",
      metric: "T+0 site capture",
    },
  },
  {
    id: 1,
    label: "02 Audit",
    subLabel: "AI Quantity Check",
    icon: Cpu,
    color: "text-emerald-400",
    glowColor: "rgba(16, 185, 129, 0.45)",
    x: 260,
    y: 80,
    details: {
      title: "AI quantity audit vs. BOQ",
      description: "Vision AI calculates material volume (Bituminous concrete layers) and flags variances against the Bill of Quantities.",
      logKey: "AI_AUDIT",
      logVal: "1,240 m² segment · variance +0.4% (in tolerance)",
      metric: "98.2% AI confidence",
    },
  },
  {
    id: 2,
    label: "03 Authority",
    subLabel: "Cryptographic Mandate",
    icon: Fingerprint,
    color: "text-indigo-400",
    glowColor: "rgba(99, 102, 241, 0.45)",
    x: 260,
    y: 240,
    details: {
      title: "Accountable Ed25519 signing",
      description: "SDE reviews on-device, signs with key scoped to work_id. Threshold mandates enforce budgets and circle boundaries in code.",
      logKey: "MANDATE",
      logVal: "SDE key 0xF4B9 · scope: PWD-MH-1863900 · single-cap OK",
      metric: "RFC 8032 verified",
    },
  },
  {
    id: 3,
    label: "04 Liquidity",
    subLabel: "T+1 Payout & Settlement",
    icon: Banknote,
    color: "text-amber-400",
    glowColor: "rgba(245, 158, 11, 0.45)",
    x: 440,
    y: 240,
    details: {
      title: "Reliability-based liquidity waterfall",
      description: "Receivable discounts at T+1. Bank advances 60%, holding 40% buffer. Treasury settles, release released minus charges.",
      logKey: "WATERFALL",
      logVal: "T+1 advance: ₹11,18,340 · holdback: ₹7,45,560 · 11% p.a.",
      metric: "1 day vs 148 days",
    },
  },
];

export function PipelineVisualizer() {
  const [activeId, setActiveId] = useState<number>(0);

  // Auto-cycle nodes when idle
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveId((id) => (id + 1) % nodes.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const cur = nodes[activeId]!;
  const Icon = cur.icon;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-foreground/10 bg-[#040405] p-6 font-sans">
      {/* Grid pattern background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* SVG Canvas for pipeline connections */}
      <div className="relative h-[280px] w-full">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 520 320">
          <defs>
            <linearGradient id="grad-green-indigo" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="grad-indigo-amber" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.6" />
            </linearGradient>
          </defs>

          {/* Connection Lines (Glow & Base) */}
          {/* Path 1: Node 0 -> Node 1 */}
          <line x1="80" y1="80" x2="260" y2="80" stroke="rgba(16,185,129,0.15)" strokeWidth="4" />
          <line 
            x1="80" y1="80" x2="260" y2="80" 
            stroke="#10B981" strokeWidth="2" 
            strokeDasharray="6 8" 
            style={{ animation: "scroll-dash 2s linear infinite" }} 
          />

          {/* Path 2: Node 1 -> Node 2 */}
          <line x1="260" y1="80" x2="260" y2="240" stroke="url(#grad-green-indigo)" strokeWidth="3" opacity="0.4" />
          <line 
            x1="260" y1="80" x2="260" y2="240" 
            stroke="#6366F1" strokeWidth="2" 
            strokeDasharray="6 8" 
            style={{ animation: "scroll-dash 2s linear infinite" }} 
          />

          {/* Path 3: Node 2 -> Node 3 */}
          <line x1="260" y1="240" x2="440" y2="240" stroke="url(#grad-indigo-amber)" strokeWidth="3" opacity="0.4" />
          <line 
            x1="260" y1="240" x2="440" y2="240" 
            stroke="#F59E0B" strokeWidth="2" 
            strokeDasharray="6 8" 
            style={{ animation: "scroll-dash 2s linear infinite" }} 
          />

          <style>{`
            @keyframes scroll-dash {
              to { stroke-dashoffset: -20; }
            }
          `}</style>

          {/* Render Interactive Nodes */}
          {nodes.map((n) => {
            const NodeIcon = n.icon;
            const isActive = n.id === activeId;
            return (
              <g 
                key={n.id} 
                className="cursor-pointer group" 
                onClick={() => setActiveId(n.id)}
                onMouseEnter={() => setActiveId(n.id)}
              >
                {/* Active glow halo */}
                {isActive && (
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r="32"
                    fill="none"
                    stroke={n.color.includes("emerald") ? "#10B981" : n.color.includes("indigo") ? "#6366F1" : "#F59E0B"}
                    strokeWidth="1.5"
                    className="animate-ping opacity-25"
                    style={{ animationDuration: "3s" }}
                  />
                )}
                
                {/* Node Outer Circle */}
                <circle
                  cx={n.x}
                  cy={n.y}
                  r="24"
                  fill="#0c0c0e"
                  stroke={isActive ? (n.color.includes("emerald") ? "#10B981" : n.color.includes("indigo") ? "#6366F1" : "#F59E0B") : "rgba(255,255,255,0.1)"}
                  strokeWidth={isActive ? "2" : "1.5"}
                  className="transition-all duration-300 group-hover:stroke-foreground/40"
                />

                {/* Icon wrapper inside SVG */}
                <foreignObject x={n.x - 10} y={n.y - 10} width="20" height="20">
                  <div className={`flex h-full w-full items-center justify-center ${isActive ? n.color : "text-foreground/40 group-hover:text-foreground/80"} transition-colors duration-300`}>
                    <NodeIcon className="h-4.5 w-4.5" />
                  </div>
                </foreignObject>

                {/* Node Text labels */}
                <text
                  x={n.x}
                  y={n.y - 34}
                  textAnchor="middle"
                  className={`font-mono text-[9px] uppercase tracking-wider ${isActive ? "fill-foreground font-semibold" : "fill-foreground/40"} transition-all duration-300`}
                >
                  {n.label}
                </text>
                <text
                  x={n.x}
                  y={n.y + 36}
                  textAnchor="middle"
                  className={`text-[9px] ${isActive ? "fill-foreground/80" : "fill-foreground/30"} transition-all duration-300`}
                >
                  {n.subLabel}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Detail HUD Display panel */}
      <div className="mt-4 rounded-xl border border-foreground/10 bg-foreground/[0.02] p-4 relative">
        {/* Tech corners */}
        <div className="absolute top-2 left-2 w-4 h-1 border-t border-l border-foreground/10" />
        <div className="absolute top-2 right-2 w-4 h-1 border-t border-r border-foreground/10" />
        <div className="absolute bottom-2 left-2 w-4 h-1 border-b border-l border-foreground/10" />
        <div className="absolute bottom-2 right-2 w-4 h-1 border-b border-r border-foreground/10" />

        <AnimatePresence mode="wait">
          <motion.div
            key={cur.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="space-y-2.5 font-mono text-xs"
          >
            <div className="flex items-center justify-between border-b border-foreground/5 pb-2">
              <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-foreground">
                <Icon className={`h-4.5 w-4.5 ${cur.color}`} />
                {cur.details.title}
              </span>
              <span className={`rounded-full border border-foreground/10 bg-foreground/5 px-2 py-0.5 text-[10px] ${cur.color}`}>
                {cur.details.metric}
              </span>
            </div>
            
            <p className="text-foreground/65 leading-relaxed font-sans text-[11px] sm:text-xs">
              {cur.details.description}
            </p>

            <div className="flex items-center gap-2 rounded border border-foreground/5 bg-black/40 p-2 text-[10px]">
              <span className={`shrink-0 font-bold ${cur.color}`}>[{cur.details.logKey}]</span>
              <span className="truncate text-foreground/55">{cur.details.logVal}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
