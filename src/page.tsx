import { Fragment, useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Trophy,
  Camera,
  Fingerprint,
  Banknote,
  Clock,
  AlertTriangle,
  Eye,
  Scale,
  Users,
  Cpu,
  UserCheck,
  BadgeCheck,
  BookOpen,
} from "lucide-react";
import { DualKeyDemo } from "@/components/dual-key-demo";
import { SuretyPlayground } from "@/components/surety-playground";
import { ThemeToggle } from "@/components/theme-toggle";
import { LiquidityCalculator } from "@/components/liquidity-calculator";
import { GlowCard } from "@/components/glow-card";
import { PipelineVisualizer } from "@/components/pipeline-visualizer";


const fadeUp = {
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: "easeOut" },
};

/* ============================ HOOKS / HELPERS ============================ */

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string>(ids[0] ?? "");
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive((e.target as HTMLElement).id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [ids]);
  return active;
}

function useCountUp(target: number, duration = 1400) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(target * eased);
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);
  return { val, ref };
}

function CountUpStat({ text }: { text: string }) {
  const match = text.match(/^([^\d]*)(\d[\d,]*(?:\.\d+)?)(.*)$/);
  if (!match) return <>{text}</>;
  const [, prefix, num, suffix] = match;
  const target = parseFloat(num.replace(/,/g, ""));
  const decimals = num.includes(".") ? (num.split(".")[1]?.length ?? 0) : 0;
  const { val, ref } = useCountUp(target);
  const shown =
    decimals > 0
      ? val.toFixed(decimals)
      : Math.round(val).toLocaleString("en-IN");
  return (
    <span ref={ref}>
      {prefix}
      {shown}
      {suffix}
    </span>
  );
}

/* ============================ NAV ============================ */

function Nav() {
  const links = [
    { label: "Problem", id: "problem" },
    { label: "Platform", id: "architecture" },
    { label: "Money flow", id: "flow" },
    { label: "The hard question", id: "redteam" },
    { label: "Validation", id: "validation" },
  ];
  const active = useActiveSection(links.map((l) => l.id));
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.2,
  });
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <motion.div
        style={{ scaleX: progress }}
        className="absolute top-0 left-0 right-0 h-0.5 origin-left bg-gradient-to-r from-emerald-500 to-indigo-500"
      />
      <div className="mx-auto mt-4 max-w-7xl px-4">
        <div className="glass flex items-center justify-between rounded-2xl px-4 py-3 sm:px-6">
          <a href="#" className="flex items-center gap-2.5">
            <span className="text-base font-semibold tracking-tight text-foreground">
              Realium
            </span>
          </a>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const isActive = active === l.id;
              return (
                <a
                  key={l.id}
                  href={`#${l.id}`}
                  className={`relative rounded-md px-3 py-1.5 text-sm transition-colors ${
                    isActive
                      ? "text-foreground"
                      : "text-foreground/55 hover:text-foreground"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-md bg-foreground/8 ring-1 ring-inset ring-foreground/10"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  {l.label}
                </a>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a
              href="#try"
              className="btn-press rounded-lg border border-foreground/10 bg-foreground/5 px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-emerald-400/50 hover:bg-emerald-500/10 hover:shadow-[0_0_20px_rgb(16,185,129,0.35)]"
            >
              Try the demo
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ============================ HERO ============================ */

function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-8 sm:pt-36 lg:pt-40">
      {/* Background blobs with new slow float animations */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="animate-blob-1 absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full bg-indigo-500/20 blur-[130px]" />
        <div className="animate-blob-2 absolute -bottom-40 left-[-10%] h-[520px] w-[520px] rounded-full bg-emerald-500/15 blur-[130px]" />
        <div className="grid-bg absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left: Text copy */}
          <div className="text-left lg:col-span-7 xl:col-span-6 space-y-6">
            <motion.div {...fadeUp} className="flex justify-start">
              <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-amber-400/20 bg-gradient-to-r from-amber-500/10 via-foreground/[0.03] to-emerald-500/10 px-4 py-1.5 text-xs text-foreground/80 shadow-[0_0_40px_-10px_rgb(245,158,11,0.25)] backdrop-blur">
                <Trophy className="h-3.5 w-3.5 text-amber-400" />
                <span className="font-semibold text-foreground">Top 3</span>
                <span className="text-foreground/40">·</span>
                <span>ReEnvision 5.0 — XLRI Conclave</span>
                <span className="text-foreground/40">·</span>
                <span className="text-foreground/60">July 2026</span>
              </div>
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.04 }}
              className="text-[11px] leading-relaxed text-muted-foreground sm:text-xs"
            >
              Presented to the conclave&apos;s panel of senior technology leaders — CIOs,
              CTOs and CDIOs from leading firms across banking, logistics, and consumer sectors.
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.08 }}
              className="flex justify-start"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/5 px-3.5 py-1 text-[11px] text-foreground/60 backdrop-blur">
                <Sparkles className="h-3 w-3 text-emerald-400" />
                Built for ReEnvision 5.0
                <span className="mx-1 h-1 w-1 rounded-full bg-foreground/30" />
                Human-AI Synergy · XLRI · Group 10
              </div>
            </motion.div>

            <motion.h1
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.05 }}
              className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.1]"
            >
              <span className="bg-gradient-to-r from-emerald-400 via-foreground to-indigo-400 bg-clip-text text-transparent">
                Money that moves at the speed of verified reality.
              </span>
            </motion.h1>

            <motion.p
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.1 }}
              className="text-base text-muted-foreground sm:text-lg max-w-xl"
            >
              Realium is the settlement rail for public works. It turns physical,
              site-verified progress into records a bank trusts enough to pay out
              immediately — cutting contractor wait times from 148 days to 1.
            </motion.p>

            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.15 }}
              className="flex flex-col gap-3 sm:flex-row pt-4"
            >
              <a
                href="#architecture"
                className="group btn-press inline-flex items-center justify-center gap-2 rounded-md bg-foreground px-6 py-3 font-semibold text-background shadow-lg shadow-foreground/20 transition-all hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/20"
              >
                See the architecture
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="#redteam"
                className="btn-press inline-flex items-center justify-center gap-2 rounded-md border border-foreground/20 px-6 py-3 text-foreground transition-colors hover:bg-foreground/10"
              >
                The uncomfortable question
              </a>
            </motion.div>

            {/* Scroll indicator prompt urging users to scroll down */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              transition={{ delay: 1.2, duration: 1 }}
              onClick={() => document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' })}
              className="mt-14 inline-flex items-center gap-3 text-[10px] sm:text-xs uppercase tracking-[0.25em] text-foreground/50 select-none cursor-pointer hover:text-foreground/80 transition-colors"
            >
              <span>Scroll to explore</span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="flex h-7 w-4 items-start justify-center rounded-full border border-foreground/30 p-1"
              >
                <div className="h-1.5 w-1 rounded-full bg-emerald-400" />
              </motion.div>
            </motion.div>
          </div>

          {/* Right: Pipeline Visualizer */}
          <div className="lg:col-span-5 xl:col-span-6 w-full">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <PipelineVisualizer />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================ PROBLEM ============================ */

const problemStats = [
  {
    stat: "₹96,000 Cr",
    label: "Maharashtra alone",
    body: "Contractor dues that triggered the 2025 statewide work stoppage. One state. One department.",
    src: "1",
  },
  {
    stat: "₹1–3 Lakh Cr",
    label: "National range",
    body: "Estimated capital stuck in delayed public-works payments across India — NITI Aayog member estimate to industry high.",
    src: "2",
  },
  {
    stat: "7–8 Years",
    label: "Arbitration",
    body: "Average duration of Indian construction arbitrations. ~85% of claims remain pending.",
    src: "3",
  },
  {
    stat: "18–24% p.a.",
    label: "Bridge finance",
    body: "What contractors pay in the informal market to survive the wait. It gets priced into every bid.",
    src: "—",
  },
];

function Problem() {
  return (
    <section id="problem" className="mx-auto max-w-7xl px-4 pt-8 pb-16">
      <motion.div {...fadeUp} className="mb-12 max-w-3xl">
        <div className="text-xs uppercase tracking-[0.2em] text-rose-400/80">
          The problem
        </div>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
          The largest working-capital sink in the Indian economy.
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Imagine you build a road for the government. You finish the job. You send the bill.
          And then... nothing. You wait months, sometimes years. Realium solves this gap:
          the wait between finishing work and actually getting paid.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {problemStats.map((c, i) => (
          <motion.div
            key={i}
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: i * 0.06 }}
            className="h-full"
          >
            <GlowCard className="h-full border-foreground/10" showTechBrackets={true}>
              <div className="text-3xl font-semibold tracking-tight text-foreground tabular-nums sm:text-4xl text-neon-emerald">
                <CountUpStat text={c.stat} />
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-widest text-foreground/40">
                {c.label} <span className="text-foreground/25">[{c.src}]</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {c.body}
              </p>
            </GlowCard>
          </motion.div>
        ))}
      </div>

      {/* Why digitisation alone failed */}
      <motion.div
        {...fadeUp}
        className="mt-10"
      >
        <GlowCard className="grid grid-cols-1 gap-6 border-amber-500/20 bg-amber-500/[0.04] p-8 lg:grid-cols-[1fr_1.3fr] rounded-2xl" showTechBrackets={false}>
          <div>
            <div className="text-xs uppercase tracking-widest text-amber-400/90">
              Why &quot;just digitise it&quot; failed
            </div>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              CPWD&apos;s e-Measurement Book already exists.
            </h3>
            <div className="mt-3 font-mono text-sm text-foreground/60">
              ~₹20,000 Cr/yr paid on it. Money is still slow.
            </div>
          </div>
          <div className="text-foreground/80">
            <p>
              A digital record is not a financial instrument. An e-MB entry sits
              in a state IT system that no bank underwrites and no queue makes
              attributable. The bottleneck was never the paper — it was that
              (a) the record isn&apos;t bank-grade, and (b) when the file stalls,
              no one can point to whose desk it&apos;s sitting on.
            </p>
            <p className="mt-3 text-sm text-foreground/60">
              Realium closes both. Verified evidence becomes a signed
              instrument, and every human touch on that instrument is a signed,
              timestamped event in a tamper-evident chain.
              <span className="text-foreground/30"> [4]</span>
            </p>
          </div>
        </GlowCard>
      </motion.div>
    </section>
  );
}

/* ============================ ARCHITECTURE — 3 LAYERS ============================ */

const layers = [
  {
    n: "01",
    key: "evidence",
    tag: "Evidence",
    icon: Camera,
    color: "emerald",
    title: "Proof: Drones and phones record construction ground truth.",
    body: "A drone and a phone record the finished work, and AI checks the measurements against the contract. The site engineer confirms it with a secure digital signature. Two locks on the same door: the machine's check and the human's sign-off.",
    bullets: [
      "Geo-locked capture: frames, hashes, and GPS location match the contract",
      "AI quantity audit vs. BOQ: checks how much road was actually laid",
      "Two locks on one door: machine evidence + site engineer digital signature",
      "Result: proof of real work turned into a trusted digital record",
    ],
  },
  {
    n: "02",
    key: "authority",
    tag: "Authority",
    icon: UserCheck,
    color: "indigo",
    title: "Permission: Every approval is signed, named, and timestamped.",
    body: "Everyone who approves the bill has a clearly defined role and a digital signature. Every 'yes', every 'no', and every silence is recorded with a name. 'The file is moving' stops being an excuse when the system shows whose desk it has sat on for 47 days.",
    bullets: [
      "Fixed approval limits: limits who can approve what and where",
      "Named and timestamped: every touch is recorded on a tamper-evident ledger",
      "Active attribution: makes the approval queue fully visible to everyone",
      "Non-approval is an event: files cannot be quietly ignored",
    ],
  },
  {
    n: "03",
    key: "liquidity",
    tag: "Liquidity",
    icon: Banknote,
    color: "amber",
    title: "Money: Payout is routed the very next day.",
    body: "The moment proof is locked in, a bank pays the contractor 60% of the bill on Day 1. The remaining 40% settles behind a holdback buffer that absorbs deductions first. Months of waiting become days.",
    bullets: [
      "Day-1 Cash Advance: bank pays 60% of the bill immediately",
      "40% Holdback Buffer: absorbs any government deductions first",
      "Contractor nets ~97%: avoids high informal market interest rates",
      "Bank gets a safe investment: backed by site proof and sovereign payout",
    ],
  },
];

function Architecture() {
  return (
    <section id="architecture" className="mx-auto max-w-7xl px-4 py-16">
      <motion.div {...fadeUp} className="mb-14 max-w-3xl">
        <div className="text-xs uppercase tracking-[0.2em] text-emerald-400/80">
          The solution · one platform, three layers
        </div>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Evidence &rarr; Authority &rarr; Liquidity.
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Realium is one connected chain of custody. Each layer produces the
          input the next layer needs. Nothing moves money alone.
        </p>
      </motion.div>

      {/* horizontal chain diagram — desktop */}
      <div className="mb-14 hidden lg:grid grid-cols-[1fr_auto_1fr_auto_1fr] items-stretch gap-0 select-none">
        {layers.map((l, i) => (
          <Fragment key={l.key}>
            <div
              onClick={() => document.getElementById(l.key)?.scrollIntoView({ behavior: 'smooth' })}
              className={`flex h-full min-h-[104px] flex-col justify-center rounded-xl border p-5 backdrop-blur transition-all hover:-translate-y-1 hover:scale-[1.01] hover:shadow-lg cursor-pointer active:scale-[0.99] ${
                l.color === "emerald"
                  ? "border-emerald-500/40 bg-emerald-500/[0.06] hover:border-emerald-400/60 hover:shadow-emerald-500/10"
                  : l.color === "indigo"
                    ? "border-indigo-500/40 bg-indigo-500/[0.06] hover:border-indigo-400/60 hover:shadow-indigo-500/10"
                    : "border-amber-500/40 bg-amber-500/[0.06] hover:border-amber-400/60 hover:shadow-amber-500/10"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-foreground/40">
                  {l.n}
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {l.tag}
                </span>
              </div>
              <div className="mt-1.5 text-xs text-foreground/60">
                {l.key === "evidence"
                  ? "site → certified e-invoice"
                  : l.key === "authority"
                    ? "signed mandate → signed action"
                    : "instrument → advance → settle"}
              </div>
            </div>
            {i < layers.length - 1 && (
              <div className="flex items-center self-center px-2">
                <span
                  className={`h-px w-6 bg-gradient-to-r ${
                    i === 0
                      ? "from-emerald-500/60 to-indigo-500/60"
                      : "from-indigo-500/60 to-amber-500/60"
                  }`}
                />
                <span className="mx-1 flex h-8 w-8 items-center justify-center rounded-full border border-foreground/15 bg-background shadow-sm">
                  <ArrowRight className="h-3.5 w-3.5 text-foreground/60" />
                </span>
                <span
                  className={`h-px w-6 bg-gradient-to-r ${
                    i === 0
                      ? "from-emerald-500/60 to-indigo-500/60"
                      : "from-indigo-500/60 to-amber-500/60"
                  }`}
                />
              </div>
            )}
          </Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {layers.map((l, i) => {
          const Icon = l.icon;
          const accent =
            l.color === "emerald"
              ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
              : l.color === "indigo"
                ? "text-indigo-400 border-indigo-500/30 bg-indigo-500/10"
                : "text-amber-400 border-amber-500/30 bg-amber-500/10";
          return (
            <Fragment key={l.key}>
              <motion.div
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.08 }}
                className="h-full"
              >
                <GlowCard 
                  className="flex flex-col h-full cursor-pointer group" 
                  showTechBrackets={true} 
                  id={l.key} 
                  onClick={() => document.getElementById(l.key === 'evidence' ? 'try' : l.key === 'authority' ? 'mandate' : 'flow')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border ${accent}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="font-mono text-xs text-foreground/40">
                      Layer {l.n}
                    </div>
                  </div>
                  <div
                    className={`mt-5 text-[11px] uppercase tracking-widest ${
                      l.color === "emerald"
                        ? "text-emerald-400/90"
                        : l.color === "indigo"
                          ? "text-indigo-400/90"
                          : "text-amber-400/90"
                    }`}
                  >
                    {l.tag}
                  </div>
                  <h3 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
                    {l.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {l.body}
                  </p>
                  <ul className="mt-5 space-y-3 border-t border-foreground/10 pt-5">
                    {l.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex gap-2.5 text-sm text-foreground/75"
                      >
                        <span
                          className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                            l.color === "emerald"
                              ? "bg-emerald-400"
                              : l.color === "indigo"
                                ? "bg-indigo-400"
                                : "bg-amber-400"
                          }`}
                        />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  {l.footnote && (
                    <div className="mt-5 rounded-md border border-foreground/10 bg-foreground/[0.03] p-3 text-[11px] text-foreground/50">
                      {l.footnote}
                    </div>
                  )}

                  {/* Interactivity prompt */}
                  <div className="mt-auto pt-6 flex items-center justify-between border-t border-foreground/5 font-mono text-[9px] text-foreground/40 group-hover:text-foreground/75 transition-colors">
                    <span className="flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${
                        l.color === "emerald"
                          ? "bg-emerald-400"
                          : l.color === "indigo"
                            ? "bg-indigo-400"
                            : "bg-amber-400"
                      }`} />
                      TEST LIVE ENGINE
                    </span>
                    <span className="flex items-center gap-1">
                      <span>Go to Sandbox</span>
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </GlowCard>
              </motion.div>
              {i < layers.length - 1 && (
                <div
                  aria-hidden
                  className="flex flex-col items-center justify-center gap-1 lg:hidden"
                >
                  <span
                    className={`h-6 w-px bg-gradient-to-b ${
                      i === 0
                        ? "from-emerald-500/60 to-indigo-500/60"
                        : "from-indigo-500/60 to-amber-500/60"
                    }`}
                  />
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-foreground/15 bg-background shadow-sm">
                    <ArrowRight className="h-3 w-3 rotate-90 text-foreground/60" />
                  </span>
                  <span
                    className={`h-6 w-px bg-gradient-to-b ${
                      i === 0
                        ? "from-emerald-500/60 to-indigo-500/60"
                        : "from-indigo-500/60 to-amber-500/60"
                    }`}
                  />
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
    </section>
  );
}

/* ============================ MONEY FLOW ============================ */

const flowSteps = [
  {
    day: "Day 0",
    title: "Site capture + AI prefill",
    body: "Drone pass + handset video. AI computes 1,240 m² of bituminous concrete against BOQ. Variance 0.4%.",
  },
  {
    day: "Day 0",
    title: "Dual-key certification",
    body: "SDE reviews on-device, signs with Ed25519 key scoped to work_id PWD-MH-1863900. Certificate hashed into ledger.",
  },
  {
    day: "Day 1",
    title: "Bank advance",
    body: "60% of ₹18,63,900 = ₹11,18,340 advanced to contractor at ~11% p.a. Holdback pool funded with 40%.",
  },
  {
    day: "Day 2 → 90",
    title: "Approval chain runs — visibly",
    body: "Each approver acts under a signed mandate. Every touch is timestamped. No touch, no invisible delay.",
  },
  {
    day: "T+N",
    title: "Treasury settles",
    body: "Deductions are absorbed by the holdback first. Balance released minus itemised charges. Reliability score updates.",
  },
];

function MoneyFlow() {
  return (
    <section id="flow" className="mx-auto max-w-7xl px-4 py-16">
      <motion.div {...fadeUp} className="mb-12 max-w-3xl">
        <div className="text-xs uppercase tracking-[0.2em] text-emerald-400/80">
          How money moves
        </div>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
          From site to bank account.
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          A worked ₹18,63,900 road-works bill. Traditional path: 148 days.
          Realium path: 60% cash on Day 1, treasury settles behind a
          holdback buffer.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.2fr]">
        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-emerald-500/60 via-foreground/10 to-indigo-500/60" />
          <ol className="space-y-4">
            {flowSteps.map((s, i) => (
              <motion.li
                key={i}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.05 }}
                className="relative pl-10"
              >
                <span className="absolute left-1.5 top-3 h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-background" />
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-foreground">
                      {s.title}
                    </div>
                    <div className="rounded-md border border-foreground/10 bg-foreground/5 px-2 py-0.5 font-mono text-[10px] text-foreground/60">
                      {s.day}
                    </div>
                  </div>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {s.body}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        {/* Interactive Liquidity Waterfall & Calculator */}
        <motion.div {...fadeUp} className="w-full">
          <LiquidityCalculator />
        </motion.div>
      </div>
    </section>
  );
}

/* ============================ RED TEAM — DELIBERATE DELAY ============================ */

const redteamAnswers = [
  {
    icon: Eye,
    tag: "Attributable",
    title: "&quot;The file is moving&quot; stops working as an excuse.",
    body: "Every approval and every non-approval is a signed, timestamped event in a tamper-evident chain. When a bill has sat on a specific officer\u2019s desk for 47 days, the system says so. Sunlight on the queue is the disinfectant.",
  },
  {
    icon: Scale,
    tag: "Priced",
    title: "The payer gets underwritten, not just the contractor.",
    body: "Realium scores payment behavior per paying division, not just per contractor. Divisions that deliberately delay see their contractors offered worse advance terms — contractors price that into bids — those divisions\u2019 projects cost more. Delay stops being free.",
  },
  {
    icon: Users,
    tag: "Beachhead",
    title: "Launch where the money exists, avoid where it doesn\u2019t.",
    body: "Start with centrally-funded scheme accounts where funds are allocated but the process is slow. The payer-score keeps the bank out of deliberately-slow queues on its own. That is underwriting discipline, not a limitation we hide.",
  },
];

function RedTeam() {
  return (
    <section id="redteam" className="relative overflow-hidden py-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500/[0.08] blur-[140px]" />
      </div>
      <div className="mx-auto max-w-7xl px-4">
        <motion.div {...fadeUp} className="mb-12 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-rose-400">
            <AlertTriangle className="h-3.5 w-3.5" />
            Red team · we&apos;ll ask it before you do
          </div>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
            The uncomfortable question:
            <br />
            <span className="text-rose-400/90">
              what if the delay is deliberate?
            </span>
          </h2>
          <p className="mt-5 max-w-3xl text-foreground/80">
            In India, payments are sometimes deliberately delayed. Works
            sanctioned beyond the budget so treasuries ration cash by queuing
            bills. Fiscal-year-end games. A discretionary queue that invites
            rent-seeking. Political deprioritisation of certain contractors or
            regions. If we don&apos;t say this out loud, the judges will.
          </p>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Realium doesn&apos;t pretend to abolish this. It attacks it in
            three ways.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {redteamAnswers.map((a, i) => {
            const Icon = a.icon;
            return (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.08 }}
                className="h-full"
              >
                <GlowCard className="h-full border-rose-500/25 bg-rose-500/[0.02]" showTechBrackets={true}>
                  <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-rose-500/35 bg-rose-500/10 text-rose-450 text-neon-indigo">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="text-[11px] uppercase tracking-widest text-rose-400/80">
                    {a.tag}
                  </div>
                  <h3
                    className="mt-1 text-lg font-semibold text-foreground"
                    dangerouslySetInnerHTML={{ __html: a.title }}
                  />
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {a.body}
                  </p>
                </GlowCard>
              </motion.div>
            );
          })}
        </div>

        <motion.blockquote
          {...fadeUp}
          className="mx-auto mt-12 max-w-4xl rounded-2xl border-l-2 border-rose-400/60 bg-foreground/[0.03] py-6 pl-6 pr-8 text-lg italic text-foreground/85 sm:text-xl"
        >
          &ldquo;Where non-payment is a funded political choice, no fintech
          fixes it. Realium&apos;s job is to detect those payers and price
          them out. That is underwriting discipline, not a limitation we
          hide.&rdquo;
        </motion.blockquote>
      </div>
    </section>
  );
}

/* ============================ HUMAN-AI SYNERGY ============================ */

function Synergy() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <motion.div {...fadeUp} className="mb-10 max-w-3xl">
        <div className="text-xs uppercase tracking-[0.2em] text-foreground/60">
          Event theme · Human-AI Synergy
        </div>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Divide the work by what only each side can do.
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <motion.div {...fadeUp} className="h-full">
          <GlowCard className="h-full border-emerald-500/20 bg-emerald-500/[0.02]" showTechBrackets={true}>
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              <Cpu className="h-5 w-5" />
            </div>
            <div className="text-[11px] uppercase tracking-widest text-emerald-400/90">
              AI does what scales
            </div>
            <ul className="mt-3 space-y-2 text-foreground/85">
              <li>· Observes sites continuously without fatigue</li>
              <li>· Estimates quantities against the BOQ</li>
              <li>· Enforces mandates on every action, deterministically</li>
            </ul>
          </GlowCard>
        </motion.div>
        <motion.div {...fadeUp} className="h-full">
          <GlowCard className="h-full border-indigo-500/20 bg-indigo-500/[0.02]" showTechBrackets={true}>
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
              <Fingerprint className="h-5 w-5" />
            </div>
            <div className="text-[11px] uppercase tracking-widest text-indigo-400/90">
              Humans do what carries legal weight
            </div>
            <ul className="mt-3 space-y-2 text-foreground/85">
              <li>· Attest that the measurement matches reality</li>
              <li>· Hold and exercise scoped mandates</li>
              <li>· Approve above thresholds, accountable in the chain</li>
            </ul>
          </GlowCard>
        </motion.div>
      </div>
      <div className="mt-6 text-center font-mono text-sm text-foreground/50">
        Neither side moves money alone. Dual-key, enforced in code at every
        layer.
      </div>
    </section>
  );
}

/* ============================ VALUE ============================ */

const valueCards = [
  {
    who: "Contractor",
    hi: "97% take-home with day-1 liquidity",
    lo: "vs ~91% today after informal 18–24% p.a. bridge finance",
    color: "emerald",
  },
  {
    who: "Bank",
    hi: "~11% p.a. on holdback-buffered paper",
    lo: "near-sovereign risk profile, 40% principal buffer, itemised deductions",
    color: "indigo",
  },
  {
    who: "Platform",
    hi: "35 bps + SaaS + the reliability data layer",
    lo: "the flywheel: clean settlement history raises advance rates 50→85%; competitors can\u2019t replicate the data",
    color: "amber",
  },
];

function Value() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <motion.div {...fadeUp} className="mb-12 max-w-3xl">
        <div className="text-xs uppercase tracking-[0.2em] text-emerald-400/80">
          Value
        </div>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Every side of the table is better off. That&apos;s why it moves.
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {valueCards.map((v, i) => (
          <motion.div
            key={v.who}
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: i * 0.08 }}
            className="h-full"
          >
            <GlowCard 
              className="flex flex-col h-full border-foreground/10 cursor-pointer group" 
              showTechBrackets={true}
              onClick={() => document.getElementById('flow')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <div
                className={`text-[11px] uppercase tracking-widest ${
                  v.color === "emerald"
                    ? "text-emerald-400/90"
                    : v.color === "indigo"
                      ? "text-indigo-400/90"
                      : "text-amber-400/90"
                }`}
              >
                {v.who}
              </div>
              <div className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                {v.hi}
              </div>
              <p className="mt-3 text-sm text-muted-foreground mb-6">{v.lo}</p>

              {/* Simulator redirect */}
              <div className="mt-auto pt-6 flex items-center justify-between border-t border-foreground/5 font-mono text-[9px] text-foreground/40 group-hover:text-foreground/75 transition-colors">
                <span className="flex items-center gap-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${
                    v.color === "emerald"
                      ? "bg-emerald-400"
                      : v.color === "indigo"
                        ? "bg-indigo-400"
                        : "bg-amber-400"
                  }`} />
                  SIMULATE VALUE
                </span>
                <span className="flex items-center gap-1">
                  <span>Open Calculator</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </GlowCard>
          </motion.div>
        ))}
      </div>

      <motion.div
        {...fadeUp}
        className="mt-8"
      >
        <GlowCard showTechBrackets={false} className="border-emerald-500/20 bg-emerald-500/[0.03] p-7 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              <BadgeCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-emerald-400/90">
                The flywheel
              </div>
              <p className="mt-2 max-w-3xl text-foreground/85">
                Every settled cycle mints proprietary data on payer and payee
                behavior. That data steps the advance rate for the next cycle.
                Competitors can copy the UI in a weekend; they cannot copy five
                years of on-chain settlement history.
              </p>
            </div>
          </div>
        </GlowCard>
      </motion.div>
    </section>
  );
}

/* ============================ LIVE DEMO ============================ */

function LiveDemo() {
  return (
    <section id="try" className="mx-auto max-w-7xl px-4 py-20">
      <motion.div {...fadeUp} className="mb-10 max-w-3xl">
        <div className="text-xs uppercase tracking-[0.2em] text-emerald-400/80">
          Live · Layer 1 · try it
        </div>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Sign a real work item. Watch the payout unlock.
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          A PWD site engineer certifies an AI-prefilled Measurement Book entry
          with an Ed25519 key. The certificate becomes a bank-financeable
          receivable in the same session.
        </p>
      </motion.div>
      <motion.div {...fadeUp}>
        <DualKeyDemo />
      </motion.div>
    </section>
  );
}

function MandateSection() {
  return (
    <section id="mandate" className="mx-auto max-w-7xl px-4 py-20">
      <motion.div {...fadeUp} className="mb-10 max-w-3xl">
        <div className="text-xs uppercase tracking-[0.2em] text-indigo-400/80">
          Live · Layer 2 · Approver mandate playground
        </div>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Change the mandate. Watch what an engineer can and can&apos;t
          certify.
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Move the value cap, edit the category allowlist, change the state
          circle, or simulate a transfer. Every attempt — allowed, escrowed,
          or blocked — becomes a signed event on the chain.
        </p>
      </motion.div>
      <motion.div {...fadeUp}>
        <SuretyPlayground />
      </motion.div>
    </section>
  );
}

/* ============================ VALIDATION ============================ */

const validation = [
  {
    tag: "Working code",
    title: "47 unit tests, including Ed25519 vs RFC 8032 vectors",
    body: "Signature engine verified against the RFC test vectors. Financial waterfall and mandate policy have their own test suites (22 + 18).",
  },
  {
    tag: "Live demos",
    title: "Two interactive demos on this page",
    body: "Dual-key certification flow and the mandate playground — both driven by the same policy code, no mocks.",
  },
  {
    tag: "Precedent stack",
    title: "Everything Realium relies on already exists in India",
    body: "UPI (real-time rails), GST e-invoicing (bank-grade digital instruments), TReDS (bill-discounting exchanges), CPWD e-MB (~₹20,000 Cr/yr digital), Drone Rules 2021 (BVLOS site capture).",
  },
  {
    tag: "Demand proof",
    title: "Powerplay does $10M ARR financing the private side",
    body: "A pure-private-sector analogue is already at scale. The public-works side is 30x larger and has no incumbent settlement rail. [5]",
  },
];

function Validation() {
  return (
    <section id="validation" className="mx-auto max-w-7xl px-4 py-24">
      <motion.div {...fadeUp} className="mb-12 max-w-3xl">
        <div className="text-xs uppercase tracking-[0.2em] text-emerald-400/80">
          Validation
        </div>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Not a deck. A working system with precedent.
        </h2>
      </motion.div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {validation.map((v, i) => (
          <motion.div
            key={v.tag}
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: i * 0.06 }}
            className="h-full"
          >
            <GlowCard className="h-full border-foreground/10" showTechBrackets={true}>
              <div className="text-[11px] uppercase tracking-widest text-emerald-400/80">
                {v.tag}
              </div>
              <div className="mt-2 text-lg font-semibold text-foreground">
                {v.title}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{v.body}</p>
            </GlowCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ============================ ROADMAP ============================ */

const roadmap = [
  {
    phase: "Prototype",
    when: "Done",
    color: "emerald",
    items: [
      "Ed25519 dual-key certificate engine · 47 tests pass · RFC 8032 vectors",
      "60/40 settlement waterfall + reliability curve · 22 tests",
      "Approver mandate policy engine · 18 tests · demoed on this page",
      "SQLite persistence, tamper-evident hash-chained ledger",
    ],
  },
  {
    phase: "Pilot",
    when: "6 months",
    color: "indigo",
    items: [
      "One state PWD division · works ₹15L to ₹5Cr",
      "Target: measurement-to-payment 90 → 15 days",
      "Bank partnership discounting certified receivables",
      "Payer-score published to participating divisions",
    ],
  },
  {
    phase: "Scale",
    when: "12+ months",
    color: "amber",
    items: [
      "Multi-state expansion behind published attestation standard",
      "Second vertical (insurance claims) using the same certificate primitive",
      "Reliability data layer opened to consortium banks",
    ],
  },
];

function Roadmap() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24">
      <motion.div {...fadeUp} className="mb-12 max-w-3xl">
        <div className="text-xs uppercase tracking-[0.2em] text-foreground/60">
          Roadmap
        </div>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Prototype done. Pilot next. Scale on a published standard.
        </h2>
      </motion.div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {roadmap.map((p, i) => (
          <motion.div
            key={p.phase}
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: i * 0.08 }}
            className="h-full"
          >
            <GlowCard className="h-full border-foreground/10" showTechBrackets={true}>
              <div className="mb-4 flex items-center justify-between">
                <div className="font-mono text-[11px] uppercase tracking-widest text-foreground/40">
                  Phase {i + 1}
                </div>
                <div
                  className={`rounded-full border px-2 py-0.5 font-mono text-[10px] ${
                    p.color === "emerald"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                      : p.color === "indigo"
                        ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-400"
                        : "border-amber-500/30 bg-amber-500/10 text-amber-400"
                  }`}
                >
                  {p.when}
                </div>
              </div>
              <h3 className="text-2xl font-semibold tracking-tight text-foreground">
                {p.phase}
              </h3>
              <ul className="mt-5 space-y-3">
                {p.items.map((item, j) => (
                  <li key={j} className="flex gap-3 text-sm text-foreground/75">
                    <Clock
                      className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${
                        p.color === "emerald"
                          ? "text-emerald-400"
                          : p.color === "indigo"
                            ? "text-indigo-400"
                            : "text-amber-400"
                      }`}
                    />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </GlowCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ============================ SOURCES ============================ */

const sources = [
  {
    n: 1,
    label: "Maharashtra ₹96,000 Cr contractor dues (2025 strike coverage)",
    href: "https://whalesbook.com/news/maharashtra-contractors-strike",
  },
  {
    n: 2,
    label:
      "National delayed-payments range: NITI Aayog member estimate (₹1 lakh Cr) to industry analyses (up to ₹3 lakh Cr)",
    href: "https://www.niti.gov.in/",
  },
  {
    n: 3,
    label:
      "Construction arbitration duration & pendency — Global Arbitration Review, India construction chapter",
    href: "https://globalarbitrationreview.com/insight/know-how/construction-arbitration/report/india",
  },
  {
    n: 4,
    label:
      "CPWD e-Measurement Book — PIB release ID 1786064; Business Standard coverage",
    href: "https://pib.gov.in/PressReleasePage.aspx?PRID=1786064",
  },
  {
    n: 5,
    label: "Powerplay $10M ARR — EPC World",
    href: "https://www.epcworld.in/",
  },
];

function Sources() {
  return (
    <section id="sources" className="mx-auto max-w-7xl px-4 py-20">
      <motion.div {...fadeUp} className="mb-8 max-w-3xl">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-foreground/60">
          <BookOpen className="h-3.5 w-3.5" /> Sources
        </div>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Every number above traces back to a public source.
        </h2>
      </motion.div>
      <ol className="glass space-y-3 rounded-2xl p-6 text-sm text-foreground/75">
        {sources.map((s) => (
          <li key={s.n} className="flex gap-3">
            <span className="w-6 shrink-0 font-mono text-foreground/40">
              [{s.n}]
            </span>
            <a
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="hover:text-emerald-400 hover:underline"
            >
              {s.label}
            </a>
          </li>
        ))}
      </ol>
      <p className="mt-4 max-w-3xl text-xs text-foreground/50">
        Disclaimer: worked-example figures on this page are illustrative.
        Financing assumptions — 11% p.a. bank yield, 0.35% platform fee, and
        the 50→85% reliability advance curve — are stated as assumptions, not
        committed terms.
      </p>
    </section>
  );
}

/* ============================ CTA + FOOTER ============================ */

function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-24">
      <motion.div
        {...fadeUp}
        className="glass relative overflow-hidden rounded-3xl p-10 text-center sm:p-16"
      >
        <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[600px] -translate-x-1/2 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[600px] -translate-x-1/2 rounded-full bg-indigo-500/15 blur-3xl" />
        <h3 className="mx-auto max-w-3xl text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
          One division. One quarter. 90 days to 15.
        </h3>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          We&apos;re looking for one PWD division and one bank partner to run
          the first live cycle. The code is written; the receivables are
          waiting.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#try"
            className="btn-press inline-flex items-center gap-2 rounded-md bg-foreground px-6 py-3 font-semibold text-background transition-all hover:scale-105"
          >
            Try the live demo <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="https://github.com/Bahniman/realium"
            target="_blank"
            rel="noreferrer"
            className="btn-press inline-flex items-center gap-2 rounded-md border border-foreground/20 px-6 py-3 text-foreground transition-colors hover:bg-foreground/10"
          >
            View GitHub Code
          </a>
        </div>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-foreground/10">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="glass mb-6 flex flex-col items-start gap-3 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-emerald-400/80">
              Team Realium
            </div>
            <div className="mt-1 text-sm text-foreground/85">
              Ananthanarayan · Bahniman · Nandini · Srishti · Uditanshu
            </div>
          </div>
          <div className="font-mono text-[11px] text-foreground/50">
            PGDM-GM, XLRI Jamshedpur · Built for ReEnvision 5.0 (Group 10)
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-3 text-sm text-foreground/50 sm:flex-row w-full">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground/80">Realium</span>
            <span className="mx-2 text-foreground/20">|</span>
            <span>
              Top 3 · ReEnvision 5.0 · XLRI Digital Transformation Conclave · July 2026
            </span>
          </div>
          <div className="flex items-center gap-4 font-mono text-xs">
            <a 
              href="https://github.com/Bahniman/realium" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-foreground/80 hover:underline"
            >
              GitHub Codebase
            </a>
            <span className="text-foreground/20">·</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ============================ DIVIDER ============================ */

function SectionDivider() {
  return (
    <div className="py-12 lg:py-16" />
  );
}

/* ============================ PAGE ============================ */

function LandingPage() {
  const { scrollYProgress } = useScroll();

  // Parallax transforms for the interactive background image
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1.3, 1.15]);
  const bgRotate = useTransform(scrollYProgress, [0, 1], ["0deg", "4deg"]);

  // Transform scroll progress into shifting positions and scales for background color blobs
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const x1 = useTransform(scrollYProgress, [0, 1], ["-10%", "15%"]);
  const scale1 = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.25, 0.85]);

  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["10%", "-15%"]);
  const scale2 = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.85, 1.25]);

  return (
    <main className="relative min-h-screen bg-transparent text-foreground overflow-hidden">
      {/* Solid Background Color Base (Stacking index -100) */}
      <div className="pointer-events-none fixed inset-0 -z-[100] bg-background" />

      {/* Interactive CSS Network Grid Background — works on both light and dark */}
      <div className="pointer-events-none fixed inset-0 -z-[90] overflow-hidden select-none">
        <motion.div
          style={{ y: bgY, scale: bgScale, rotate: bgRotate }}
          className="absolute inset-0 h-[120%] w-[120%] -left-[10%] -top-[10%]"
        >
          {/* Fine grid lines */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(16,185,129,0.18) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(16,185,129,0.18) 1px, transparent 1px)
              `,
              backgroundSize: '80px 80px',
            }}
          />
          {/* Secondary finer sub-grid */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(99,102,241,0.10) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(99,102,241,0.10) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
            }}
          />
          {/* Radial glow pulse — top-left */}
          <div className="absolute -top-[20%] -left-[10%] h-[800px] w-[800px] rounded-full bg-emerald-500/15 dark:bg-emerald-500/10 blur-[100px] animate-pulse" />
          {/* Radial glow pulse — bottom-right */}
          <div className="absolute -bottom-[20%] -right-[10%] h-[700px] w-[700px] rounded-full bg-indigo-500/15 dark:bg-indigo-500/10 blur-[100px] animate-pulse [animation-delay:2s]" />
          {/* Scattered dot nodes at grid intersections */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(16,185,129,0.35) 2px, transparent 2px)`,
              backgroundSize: '80px 80px',
              backgroundPosition: '0 0',
            }}
          />
        </motion.div>
      </div>

      {/* Shifting Ambient Background Blobs */}
      <div className="pointer-events-none fixed inset-0 -z-30 overflow-hidden select-none">
        {/* Blob 1 (Emerald) */}
        <motion.div 
          style={{ y: y1, x: x1, scale: scale1 }}
          className="absolute -top-20 left-[-15%] h-[650px] w-[650px] rounded-full bg-emerald-500/8 dark:bg-emerald-500/[0.04] blur-[150px]" 
        />
        {/* Blob 2 (Indigo) */}
        <motion.div 
          style={{ y: y2, x: x2, scale: scale2 }}
          className="absolute bottom-[-10%] right-[-15%] h-[650px] w-[650px] rounded-full bg-indigo-500/8 dark:bg-indigo-500/[0.04] blur-[150px]" 
        />
      </div>

      {/* Fine dot grid overlay */}
      <div 
        className="pointer-events-none fixed inset-0 -z-50 opacity-40 dark:opacity-30" 
        style={{
          backgroundImage: `radial-gradient(rgba(120, 119, 198, 0.18) 1.5px, transparent 1.5px)`,
          backgroundSize: "28px 28px"
        }} 
      />

      <Nav />
      <Hero />
      <Problem />
      <Architecture />
      <MoneyFlow />
      <RedTeam />
      <Synergy />
      <Value />
      <LiveDemo />
      <MandateSection />
      <Validation />
      <Roadmap />
      <Sources />
      <CTA />
      <Footer />
    </main>
  );
}

export default LandingPage;
