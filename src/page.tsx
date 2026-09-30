import { Fragment, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Trophy,

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
import { SuiteHeader } from "@/components/suite-header";
import { BASE_FINANCE_SCENARIO } from "@/lib/finance-scenario";
import { LiquidityCalculator } from "@/components/liquidity-calculator";
import { GlowCard } from "@/components/glow-card";
import { PipelineVisualizer } from "@/components/pipeline-visualizer";


const fadeUp = {
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: "easeOut" as const },
} as const;

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

/* ============================ HERO ============================ */

function Hero() {
  return (
    <section className="riso-hero realium-hero">
      <div className="realium-hero-layout">
        <div className="realium-hero-copy">
          <p className="realium-edition">A public-works settlement proposal</p>
          <h1 className="realium-display" aria-label="Measure work. Model liquidity.">
            <span className="realium-overprint" data-print="Measure work." aria-hidden="true">
              <span>Measure work.</span><span>Measure work.</span>
            </span>
            <em>Model liquidity.</em>
          </h1>
          <p className="realium-lede">
            Realium proposes a settlement rail for public works. Its worked example models a next-day
            advance against a 148-day treasury settlement; the financing terms and timing remain unvalidated.
          </p>
          <div className="realium-actions">
            <a href="#architecture" className="realium-action realium-action-primary">
              See the architecture <ArrowRight aria-hidden="true" size={18} />
            </a>
            <a href="#redteam" className="realium-action realium-action-secondary">Addressing bottlenecks</a>
          </div>
          <p className="realium-proof-context">
            Presented to the ReEnvision conclave&apos;s senior technology panel, including CIOs,
            CTOs, and CDIOs from banking, logistics, and consumer sectors.
          </p>
          <a href="#problem" className="realium-scroll-link">Scroll to explore <span aria-hidden="true">↓</span></a>
        </div>

        <div className="realium-art-wrap">
          <div className="realium-proof-stamp" aria-label="Top 3, ReEnvision 5.0, XLRI Conclave, July 2026">
            <Trophy aria-hidden="true" size={17} />
            <strong>Top 3</strong>
            <span>ReEnvision 5.0</span>
            <span>XLRI · July 2026</span>
          </div>
          <PipelineVisualizer />
          <p className="realium-art-caption">An illustrative chain from field evidence to modeled receivable.</p>
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
    body: "An April 2026 report cited unpaid contractor dues in Maharashtra.",
    src: "1",
  },
  {
    stat: "Dispute risk",
    label: "Pilot question",
    body: "A pilot would need to evaluate disputed bills, ownership of claims, and the time to resolution.",
    src: "scenario",
  },
  {
    stat: "18% p.a.",
    label: "Scenario input",
    body: "The local comparison uses an 18% annual-rate assumption. It is not a survey of informal-credit pricing.",
    src: "scenario",
  },
];

function Problem() {
  return (
    <section id="problem" className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 xl:px-16 pt-8 pb-16">
      <motion.div {...fadeUp} className="mb-12 max-w-3xl">
        <div className="text-xs uppercase tracking-[0.2em] text-rose-400/80">
          The problem
        </div>
        <h2 className="mt-3 text-3xl font-medium text-foreground sm:text-5xl">
          A significant working-capital challenge.
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          In public-works contracting, completed work can precede payment by months as
          measurements, approvals and treasury settlement progress. Contractors may face a
          working-capital gap during that period. Realium proposes a way to make the evidence
          and financing assumptions easier to inspect.
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
              <div className="text-3xl font-medium text-foreground tabular-nums sm:text-4xl text-neon-emerald">
                <CountUpStat text={c.stat} />
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-widest text-muted-foreground">
                {c.label} <span className="text-muted-foreground/60">[{c.src}]</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {c.body}
              </p>
            </GlowCard>
          </motion.div>
        ))}
      </div>

      {/* Why digitisation alone may not be enough */}
      <motion.div
        {...fadeUp}
        className="mt-10"
      >
        <GlowCard className="border-outline bg-surface-container-low p-8 rounded-lg" showTechBrackets={false}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.3fr]">
            <div>
              <div className="text-xs uppercase tracking-widest text-primary">
                Why digitisation alone may not be enough
              </div>
              <h3 className="mt-2 text-2xl font-medium text-foreground">
                CPWD&apos;s e-Measurement Book already exists. [2]
              </h3>
              <div className="mt-3 font-mono text-sm text-primary font-bold">
                Digital measurement records do not set settlement timing.
              </div>
            </div>
            <div className="text-foreground/90 space-y-4">
              <p>
              A digital measurement record does not automatically become a
                financeable receivable. Lenders still need dependable evidence,
                accountable approvals, and a way to understand payment timing:
              </p>
              <ul className="mt-3 space-y-3">
                <li className="flex items-start gap-2.5 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-[2px] bg-[#FF4D00]" />
                  <span>
                    <strong className="text-foreground">Evidence needs a lender-ready form:</strong> Digitized measurements alone may not give a lender enough structured evidence to price an advance.
                  </span>
                </li>
                <li className="flex items-start gap-2.5 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-[2px] bg-[#FF4D00]" />
                  <span>
                    <strong className="text-foreground">Approval timing is hard to price:</strong> A lender may not have a consistent view of where a bill is in a department&apos;s approval process.
                  </span>
                </li>
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">
                Realium proposes a chain from site evidence to an engineer&apos;s
                certification and a financeable record. A future implementation
                would also log approvals and processing events for auditability.
              </p>
            </div>
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
    icon: Eye,
    color: "emerald",
    title: "Proof: Digital measurements replace paper registers.",
    body: "The proposed flow pairs geo-tagged site evidence and digital measurement entries with a quantity check against the BOQ. An authorized engineer would review and certify the result.",
    bullets: [
      "Geo-tagged evidence: photos and measurements are tied to the contract site",
      "Quantity check: compare measurements with sanctioned BOQ items",
      "Two-key review: automated checks plus an authorized engineer certification",
      "Proposed output: a record a lender can inspect and evaluate",
    ],
    footnote: "These controls are proposed system behavior; this page does not connect to live work records or a lender.",
  },
  {
    n: "02",
    key: "authority",
    tag: "Authority",
    icon: UserCheck,
    color: "indigo",
    title: "Authority: Make approval ownership visible.",
    body: "The proposal assigns approvers clear roles and records approval events with names and timestamps. An audit trail could show which step is waiting and how long it has been there.",
    bullets: [
      "Fixed approval limits: limits who can approve what and where",
      "Named and timestamped: record key approval actions",
      "Visible queue: make the current workflow step easier to inspect",
      "Aging items: flag delays for follow-up rather than infer intent",
    ],
    footnote: "Event signing and audit storage remain implementation requirements, not features of this prototype.",
  },
  {
    n: "03",
    key: "liquidity",
    tag: "Liquidity",
    icon: Banknote,
    color: "amber",
    title: "Liquidity: Model an advance against a certified bill.",
    body: "The example assumes a partner bank advances 60% on Day 1, with 40% held back until treasury settlement. The advance rate, pricing, and timing are pilot hypotheses, not a committed bank offer.",
    bullets: [
      "Worked example: a 60% Day-1 advance assumption",
      "Holdback: reserve 40% for later deductions and settlement",
      "Net proceeds: compare modeled charges with an informal-finance scenario",
      "Risk still to validate: lender terms, deductions, and treasury timing",
    ],
    footnote: "Illustrative scenario only; financing is not committed and no payment cycle has been run.",
  },
 ] satisfies Array<{ n: string; key: string; tag: string; icon: typeof Eye; color: string; title: string; body: string; bullets: string[]; footnote: string }>;

function Architecture() {
  return (
    <section id="architecture" className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 xl:px-16 py-16 sm:py-24 lg:py-32">
      <motion.div {...fadeUp} className="mb-14 max-w-3xl">
        <div className="text-xs uppercase tracking-[0.2em] text-emerald-600">
          The solution · one platform, three layers
        </div>
        <h2 className="mt-3 text-3xl font-medium text-foreground sm:text-5xl">
          Evidence &rarr; Authority &rarr; Liquidity.
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Realium is one connected chain of custody. Each layer produces the
          input a later review step may need. The proposed flow keeps evidence and approval distinct.
        </p>
      </motion.div>

      {/* horizontal chain diagram — desktop */}
      <div className="mb-14 hidden lg:grid grid-cols-[1fr_auto_1fr_auto_1fr] items-stretch gap-0 select-none">
        {layers.map((l, i) => (
          <Fragment key={l.key}>
            <a
              href={l.key === "evidence" ? "#try" : l.key === "authority" ? "#mandate" : "#flow"}
              className="flex h-full min-h-[104px] flex-col justify-center rounded-lg border border-outline-variant bg-surface-container p-5 hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-on-surface-variant">
                  {l.n}
                </span>
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${
                  l.color === "emerald"
                    ? "bg-primary-container text-on-primary-container"
                    : l.color === "indigo"
                      ? "bg-secondary-container text-on-secondary-container"
                      : "bg-tertiary-container text-on-tertiary-container"
                }`}>
                  {l.tag}
                </span>
              </div>
              <div className="mt-2 text-xs text-on-surface-variant font-medium">
                {l.key === "evidence"
                  ? "site → certified e-invoice"
                  : l.key === "authority"
                    ? "signed mandate → signed action"
                    : "instrument → advance → settle"}
              </div>
            </a>
            {i < layers.length - 1 && (
              <div className="flex items-center self-center px-2">
                <span
                  className="h-px w-6 bg-[#d4d4d4]"
                />
                <span className="mx-1 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background shadow-sm">
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                </span>
                <span
                  className="h-px w-6 bg-[#d4d4d4]"
                />
              </div>
            )}
          </Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {layers.map((l, i) => {
          const Icon = l.icon;
          return (
            <Fragment key={l.key}>
              <motion.div
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.08 }}
                className="h-full"
              >
                <a
                  href={`#${l.key === 'evidence' ? 'try' : l.key === 'authority' ? 'mandate' : 'flow'}`}
                  className="block h-full text-foreground no-underline"
                  aria-label={`Explore ${l.title}`}
                >
                <GlowCard 
                  className="flex flex-col h-full cursor-pointer group" 
                  showTechBrackets={true} 
                  id={l.key} 
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`inline-flex h-11 w-11 items-center justify-center rounded-lg border ${
                        l.color === "emerald"
                          ? "bg-primary text-on-primary border-primary"
                          : l.color === "indigo"
                            ? "bg-secondary text-on-secondary border-secondary"
                            : "bg-tertiary text-on-tertiary border-tertiary"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className={`font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      l.color === "emerald"
                        ? "bg-primary-container text-on-primary-container"
                        : l.color === "indigo"
                          ? "bg-secondary-container text-on-secondary-container"
                          : "bg-tertiary-container text-on-tertiary-container"
                    }`}>
                      {l.tag}
                    </div>
                  </div>
                  <div className="mt-5 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                    Pillar {l.n} / 03
                  </div>
                  <h3 className="mt-1 text-xl font-medium text-foreground">
                    {l.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {l.body}
                  </p>
                  <ul className="mt-5 space-y-3 border-t border-foreground/10 pt-5">
                    {l.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex gap-2.5 text-sm text-foreground/90"
                      >
                        <span
                          className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-[2px] ${
                            l.color === "emerald"
                              ? "bg-primary"
                              : l.color === "indigo"
                                ? "bg-secondary"
                                : "bg-tertiary"
                          }`}
                        />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  {l.footnote && (
                    <div className="mt-5 rounded-md border border-outline-variant bg-surface-container p-3 text-[11px] text-on-surface-variant">
                      {l.footnote}
                    </div>
                  )}

                  {/* Interactivity prompt */}
                  <div className="mt-auto pt-6 flex items-center justify-between border-t border-outline-variant font-mono text-[9px] text-on-surface-variant group-hover:text-on-surface transition-colors">
                    <span className="flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${
                        l.color === "emerald"
                          ? "bg-primary"
                          : l.color === "indigo"
                            ? "bg-secondary"
                            : "bg-tertiary"
                      }`} />
                      EXPLORE THE MODEL
                    </span>
                    <span className="flex items-center gap-1">
                      <span>Go to Sandbox</span>
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </GlowCard>
                </a>
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
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background shadow-sm">
                    <ArrowRight className="h-3 w-3 rotate-90 text-muted-foreground" />
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
    title: "eMB entry + AI audit",
    body: "Illustrative input: a site engineer records measurements with location-tagged photos. A proposed audit model compares 1,240 m² of bituminous concrete against the bill of quantities; the 0.4% variance is a scenario assumption.",
  },
  {
    day: "Day 0",
    title: "Dual-key certification",
    body: "Proposed control: an authorised engineer reviews the evidence and approves it against a work-scoped mandate. Cryptographic signing and audit storage remain implementation requirements, not features of this prototype.",
  },
  {
    day: "Day 1",
    title: "Bank advance",
    body: "Illustrative assumption: a partner bank advances 60% of ₹18,63,900 (₹11,18,340) at an assumed ~11% annual rate, with 40% held back. No financing partner or offer is committed.",
  },
  {
    day: "Day 2 → 90",
    title: "Approval chain runs — visibly",
    body: "In the proposal, approvers act under scoped mandates and key processing actions are timestamped. A pilot would test whether this gives teams a useful view of delays.",
  },
  {
    day: "T+N",
    title: "Treasury settles",
    body: "Illustrative settlement logic: apply modeled deductions to the holdback, then calculate the remaining balance. A reliability score is a proposed input, not a measured outcome.",
  },
];

function MoneyFlow() {
  return (
    <section id="flow" className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 xl:px-16 py-16 sm:py-24 lg:py-32">
      <motion.div {...fadeUp} className="mb-12 max-w-3xl">
        <div className="text-xs uppercase tracking-[0.2em] text-emerald-600">
          How money moves
        </div>
        <h2 className="mt-3 text-3xl font-medium text-foreground sm:text-5xl">
          From site to bank account.
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          An illustrative ₹18,63,900 road-works bill. The 148-day baseline and
          modeled 60% Day 1 advance are scenario inputs to test; no live
          settlement or financing offer has been validated.
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
                    <div className="text-sm font-medium text-foreground">
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
    title: "Make administrative steps attributable.",
    body: "The proposal records approvals and processing actions as signed, timestamped events in a tamper-evident chain. A future implementation could identify where a bill is waiting and give teams a clear owner for the delay.",
  },
  {
    icon: Scale,
    tag: "Priced",
    title: "The paying division is underwritten, not just the contractor.",
    body: "The proposed underwriting model would use historical transaction cycle times by paying division when pricing receivables. Whether that changes department behavior remains to be tested.",
  },
  {
    icon: Users,
    tag: "Beachhead",
    title: "Target pre-allocated budgets first.",
    body: "The proposed pilot would start with scheme accounts that have pre-allocated funds. This is a targeting hypothesis; payment reliability and pilot eligibility need validation with a PWD and bank.",
  },
];

function RedTeam() {
  return (
    <section id="redteam" className="relative overflow-hidden py-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
      </div>
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 xl:px-16">
        <motion.div {...fadeUp} className="mb-12 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-rose-400">
            <AlertTriangle className="h-3.5 w-3.5" />
            Red team · systemic challenges
          </div>
          <h2 className="mt-3 text-3xl font-medium text-foreground sm:text-5xl">
            The systemic challenge:
            <br />
            <span className="text-rose-400/90">
              what if the bottlenecks are structural?
            </span>
          </h2>
          <p className="mt-5 max-w-3xl text-foreground/80">
            Infrastructure budgets can face complex administrative routing, leading to structural delays and cash-rationing bottlenecks in treasury queues. Standardizing verification alone does not clear these queues. Realium addresses this by introducing operational transparency and underwriting discipline.
          </p>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Realium is designed to tackle these systemic bottlenecks in three ways.
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
                    className="mt-1 text-lg font-medium text-foreground"
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
          Financing cannot remove payment risk. A pilot would need to test
          which payment conditions lenders could support and how timing varies.
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
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Event theme · Human-AI Synergy
        </div>
        <h2 className="mt-3 text-3xl font-medium text-foreground sm:text-4xl">
          Divide the work by what only each side can do.
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <motion.div {...fadeUp} className="h-full">
          <GlowCard className="h-full border-outline bg-surface-container-low" showTechBrackets={false}>
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg border border-primary/25 bg-primary-container text-primary">
              <Cpu className="h-5 w-5" />
            </div>
            <div className="text-[11px] uppercase tracking-widest font-medium text-primary">
              AI does what scales
            </div>
            <ul className="mt-3 space-y-2 text-on-surface-variant">
              <li>· Could organize site evidence for later review</li>
              <li>· Could compare quantities with the bill of quantities</li>
              <li>· Could flag sample actions against a proposed mandate</li>
            </ul>
          </GlowCard>
        </motion.div>
        <motion.div {...fadeUp} className="h-full">
          <GlowCard className="h-full border-outline bg-surface-container-low" showTechBrackets={false}>
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg border border-secondary/25 bg-secondary-container text-secondary">
              <Fingerprint className="h-5 w-5" />
            </div>
            <div className="text-[11px] uppercase tracking-widest font-medium text-secondary">
              Humans do what carries legal weight
            </div>
            <ul className="mt-3 space-y-2 text-on-surface-variant">
              <li>· Attest that the measurement matches reality</li>
              <li>· Hold and exercise scoped mandates</li>
              <li>· Approve above thresholds, accountable in the chain</li>
            </ul>
          </GlowCard>
        </motion.div>
      </div>
      <div className="mt-6 text-center font-mono text-sm text-muted-foreground">
        The proposed sequence separates supporting evidence from accountable
        approval; the prototype does not trigger payments.
      </div>
    </section>
  );
}

/* ============================ VALUE ============================ */

const valueCards = [
  {
    who: "Contractor",
    hi: `Modeled ${BASE_FINANCE_SCENARIO.contractorNetTakePercent.toFixed(1)}% take-home with day-one liquidity`,
    lo: `Compared with a modeled ${BASE_FINANCE_SCENARIO.traditionalNetTakePercent.toFixed(1)}% informal-finance scenario; actual costs vary.`,
    color: "emerald",
  },
  {
    who: "Bank",
    hi: "Illustrative ~11% annual rate on a modeled receivable",
    lo: "A 40% holdback and itemized deductions are assumptions, not a risk rating.",
    color: "indigo",
  },
  {
    who: "Platform",
    hi: "Potential fee, software, and data-service revenue",
    lo: "A repeat-settlement data advantage is a hypothesis to validate; no rate lift or competitive edge is established.",
    color: "amber",
  },
];

function Value() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <motion.div {...fadeUp} className="mb-12 max-w-3xl">
        <div className="text-xs uppercase tracking-[0.2em] text-emerald-600">
          Value
        </div>
        <h2 className="mt-3 text-3xl font-medium text-foreground sm:text-5xl">
          The proposal depends on aligned incentives.
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
            <a
              href="#flow"
              className="block h-full text-foreground no-underline"
              aria-label={`Open liquidity calculator for ${v.who.toLowerCase()}`}
            >
            <GlowCard 
              className="flex flex-col h-full border-foreground/10 cursor-pointer group" 
              showTechBrackets={true}
            >
              <div
                className={`text-[11px] uppercase tracking-widest font-medium ${
                  v.color === "emerald"
                    ? "text-emerald-600"
                    : v.color === "indigo"
                      ? "text-indigo-600"
                      : "text-amber-600"
                }`}
              >
                {v.who}
              </div>
              <div className="mt-2 text-2xl font-medium text-foreground">
                {v.hi}
              </div>
              <p className="mt-3 text-sm text-muted-foreground mb-6">{v.lo}</p>

              {/* Simulator redirect */}
              <div className="mt-auto pt-6 flex items-center justify-between border-t border-border font-mono text-[9px] text-muted-foreground group-hover:text-foreground transition-colors">
                <span className="flex items-center gap-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${
                    v.color === "emerald"
                      ? "bg-emerald-500"
                      : v.color === "indigo"
                        ? "bg-indigo-500"
                        : "bg-amber-500"
                  }`} />
                  SIMULATE VALUE
                </span>
                <span className="flex items-center gap-1">
                  <span>Open Calculator</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </GlowCard>
            </a>
          </motion.div>
        ))}
      </div>

      <motion.div
        {...fadeUp}
        className="mt-8"
      >
        <GlowCard showTechBrackets={false} className="border-outline bg-surface-container-low p-7 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary-container text-primary">
              <BadgeCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest font-medium text-primary">
                The flywheel
              </div>
              <p className="mt-2 max-w-3xl text-foreground/90">
                If a pilot can capture reliable payment timing and dispute data,
                that history may help improve underwriting over time. This is a
                defensibility hypothesis; Realium has no settlement history yet.
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
    <section id="try" className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 xl:px-16 py-20 sm:py-28 lg:py-36">
      <motion.div {...fadeUp} className="mb-10 max-w-3xl">
          <div className="text-xs uppercase tracking-[0.2em] text-emerald-600">
          Illustrative model · sample scenario
        </div>
        <h2 className="mt-3 text-3xl font-medium text-foreground sm:text-5xl">
          Follow a proposed work item from evidence to settlement.
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          This local scenario uses illustrative records and timing to explain
          the proposed flow. It does not connect to a PWD, bank, payment rail,
          ledger, or production AI system. The one-day advance and 148-day
          settlement are model assumptions, not measured results.
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
    <section id="mandate" className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 xl:px-16 py-20 sm:py-28 lg:py-36">
      <motion.div {...fadeUp} className="mb-10 max-w-3xl">
        <div className="text-xs uppercase tracking-[0.2em] text-indigo-600">
          Local model · Layer 2 · Approver mandate
        </div>
        <h2 className="mt-3 text-3xl font-medium text-foreground sm:text-5xl">
          Change the mandate. Watch what an engineer can and can&apos;t
          certify.
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Change the value cap, category allowlist, or state circle to see how
          the proposed policy would classify an attempt. This playground is a
          local simulation; it does not sign or write events to a live chain.
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
    tag: "Related code",
    title: "47 unit tests, including Ed25519 vs RFC 8032 vectors",
    body: "The related GroundTruth and Surety repositories contain financial and mandate engines with tests; those engines are not connected to the page simulations.",
  },
  {
    tag: "Interactive models",
    title: "Two local scenarios on this page",
    body: "The certification flow and mandate playground illustrate the proposed interactions with sample data. No PWD or bank services are connected.",
  },
  {
    tag: "Precedent stack",
    title: "Precedents informing the proposal",
    body: "UPI (real-time payment rails), GST e-invoicing (structured invoice records), TReDS (bill-discounting exchanges), CPWD e-MB (digital measurement records), and Drone Rules 2021 provide adjacent examples; they do not validate this proposal.",
  },
  {
    tag: "Demand proof",
    title: "Adjacent financing models offer questions to test",
    body: "Private-sector construction finance can inform research into underwriting, repayment, and project evidence. It does not establish the public-works market size or prove the same approach will work with government receivables.",
  },
];

function Validation() {
  return (
    <section id="validation" className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 xl:px-16 py-24 sm:py-32">
      <motion.div {...fadeUp} className="mb-12 max-w-3xl">
        <div className="text-xs uppercase tracking-[0.2em] text-emerald-600">
          Validation
        </div>
        <h2 className="mt-3 text-3xl font-medium text-foreground sm:text-5xl">
          A prototype proposal informed by adjacent precedents.
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
              <div className="text-[11px] uppercase tracking-widest font-medium text-emerald-600">
                {v.tag}
              </div>
              <div className="mt-2 text-lg font-medium text-foreground">
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
      "Approver mandate policy engine · 25 tests in the related Surety repository",
      "Persistence and a hash-chained ledger in related prototype code",
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
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Roadmap
        </div>
        <h2 className="mt-3 text-3xl font-medium text-foreground sm:text-5xl">
          Prototype available. Pilot validation proposed. Shared standards are a longer-term goal.
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
                <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  Phase {i + 1}
                </div>
                <div
                  className={`rounded-full border px-2 py-0.5 font-mono text-[10px] ${
                    p.color === "emerald"
                      ? "border-primary/30 bg-primary-container text-primary"
                      : p.color === "indigo"
                        ? "border-secondary/30 bg-secondary-container text-secondary"
                        : "border-tertiary/30 bg-tertiary-container text-tertiary"
                  }`}
                >
                  {p.when}
                </div>
              </div>
              <h3 className="text-2xl font-medium text-foreground">
                {p.phase}
              </h3>
              <ul className="mt-5 space-y-3">
                {p.items.map((item, j) => (
                  <li key={j} className="flex gap-3 text-sm text-foreground/90">
                    <Clock
                      className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${
                        p.color === "emerald"
                          ? "text-primary"
                          : p.color === "indigo"
                            ? "text-secondary"
                            : "text-tertiary"
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
    label: "Maharashtra contractor dues: April 2026 coverage",
    href: "https://www.hindustantimes.com/cities/mumbai-news/contractors-flag-96k-cr-dues-give-state-govt-apr-7-deadline-101775243698708.html",
  },
  {
    n: 2,
    label:
      "CPWD e-Measurement Book launch — PIB, 13 April 2018",
    href: "https://www.pib.gov.in/newsite/PrintRelease.aspx?lang=2&reg=48&relid=178664",
  },
];

function Sources() {
  return (
    <section id="sources" className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 xl:px-16 py-20">
      <motion.div {...fadeUp} className="mb-8 max-w-3xl">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <BookOpen className="h-3.5 w-3.5" /> Sources
        </div>
        <h2 className="mt-3 text-2xl font-medium text-foreground sm:text-3xl">
          Source notes for the cited public figures and related examples.
        </h2>
      </motion.div>
      <ol className="glass space-y-3 rounded-2xl p-6 text-sm text-foreground/90">
        {sources.map((n) => (
          <li key={n.n} className="flex gap-3">
            <span className="w-6 shrink-0 font-mono text-muted-foreground">
              [{n.n}]
            </span>
            <a
              href={n.href}
              target="_blank"
              rel="noreferrer"
              className="hover:text-emerald-600 hover:underline"
            >
              {n.label}
            </a>
          </li>
        ))}
      </ol>
      <p className="mt-4 max-w-3xl text-xs text-muted-foreground">
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
        <h3 className="mx-auto max-w-3xl text-3xl font-medium text-foreground sm:text-5xl">
          Test the 90-to-15-day hypothesis.
        </h3>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          The proposed pilot would test a faster path to first cash with one
          PWD division and a bank partner. The prototype has not run a live
          payment cycle; its timing targets still need validation.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#try"
            className="btn-press inline-flex items-center gap-2 rounded-md bg-foreground px-6 py-3 font-medium text-background transition-all hover:scale-105"
          >
            Try the illustrative model <ArrowRight className="h-4 w-4" />
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
            <div className="mt-1 text-sm text-foreground">
              Ananthanarayan · Bahniman · Nandini · Srishti · Uditanshu
            </div>
          </div>
          <div className="font-mono text-[11px] text-muted-foreground">
            PGDM-GM, XLRI Jamshedpur · Built for ReEnvision 5.0 (Group 10)
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-3 text-sm text-muted-foreground sm:flex-row w-full">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">Realium</span>
            <span className="mx-2 text-border">|</span>
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

  // Dynamic Scroll Progress percentage text for widescreen rails
  const progressPercent = useTransform(scrollYProgress, (v) => `${Math.round(v * 100)}%`);

  // Active section name tracking
  const sectionIds = ["problem", "architecture", "flow", "redteam", "validation"];
  const active = useActiveSection(sectionIds);
  const labelMap: Record<string, string> = {
    problem: "PROBLEM",
    architecture: "PLATFORM",
    flow: "MONEY FLOW",
    redteam: "THE HARD QUESTION",
    validation: "VALIDATION",
  };
  const activeLabel = active && labelMap[active] ? labelMap[active] : "INTRO";

  return (
    <main id="main" className="relative min-h-screen bg-transparent text-foreground overflow-hidden">
      {/* Base solid background color */}
      <div className="pointer-events-none fixed inset-0 -z-[100] bg-background" />



      {/* Structural layout rails on left and right margins to fill the widescreen gaps */}
      <div className="pointer-events-none fixed inset-y-0 left-1/2 -z-10 h-full w-full max-w-[1440px] -translate-x-1/2 border-x border-border/10 hidden 2xl:block">
        {/* Left rail vertical details */}
        <div className="absolute top-48 -left-14 flex flex-col gap-10 font-mono text-[9px] text-muted-foreground/45 tracking-[0.2em] select-none">
          <div className="flex items-center gap-3 [writing-mode:vertical-lr] rotate-180">
            <span className="text-foreground/70 font-medium uppercase">Realium Protocol</span>
            <span className="h-10 w-px bg-border/20" />
            <span className="text-[8px] opacity-80">SYS_LOC: LAT 19.0760° N</span>
          </div>
          <div className="flex items-center gap-3 [writing-mode:vertical-lr] rotate-180">
            <span className="uppercase text-emerald-500/80 font-bold">Ledger: proposed</span>
            <span className="h-10 w-px bg-border/20" />
            <span className="text-[8px] opacity-80">MANDATE_V1.02</span>
          </div>
        </div>

        {/* Right rail vertical details */}
        <div className="absolute top-48 -right-14 flex flex-col items-center gap-10 font-mono text-[9px] text-muted-foreground/45 tracking-[0.2em] select-none">
          <div className="flex items-center gap-3 [writing-mode:vertical-lr]">
            <span className="text-foreground/70 font-medium uppercase">Scroll Progress</span>
            <span className="h-10 w-px bg-border/20" />
            <motion.span className="tabular-nums text-indigo-500 font-bold">{progressPercent}</motion.span>
          </div>
          <div className="flex items-center gap-3 [writing-mode:vertical-lr]">
            <span className="text-[8px] uppercase">Active: {activeLabel}</span>
          </div>
        </div>
      </div>

      <SuiteHeader name="Realium" sections={[
        { label: "Problem", href: "#problem" },
        { label: "Platform", href: "#architecture" },
        { label: "Money flow", href: "#flow" },
        { label: "Try the model", href: "#try" },
        { label: "Validation", href: "#validation" },
      ]} />
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
