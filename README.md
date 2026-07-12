# Realium

**Money that moves at the speed of verified reality.**

🏆 **Top 3 — ReEnvision 5.0**, XLRI's Digital Transformation Conclave (Human-AI Synergy), July 2026. Presented to the conclave's panel of senior technology leaders.

**Live site:** https://bahniman.github.io/realium/

---

## What Realium is

Realium is a settlement rail for public works. It turns site-verified construction progress into a bank-grade, financeable instrument — in days, not months — through one connected chain of **Evidence, Authority, and Liquidity**.

### The problem

Every rupee of Indian government construction moves on the Measurement Book — the handwritten register where an engineer records completed work. Between a bill being raised and a contractor being paid, months disappear:

| The number | What it means |
|---|---|
| **₹96,000 crore** | Contractor dues reported in Maharashtra alone (2025 strike notice) |
| **₹1–3 lakh crore** | Estimated capital stuck nationally in delayed public-works payments |
| **7–8 years** | Average construction arbitration duration; ~85% of claims pending |
| **18–24% p.a.** | What contractors pay informal lenders to survive the wait — priced into every future bid |

Digitization alone did not fix this: CPWD's electronic Measurement Book already pays ~₹20,000 crore/year, and the money is still slow. A digital record is not a financial instrument, and a stalled file has no attributable owner.

### The three layers

1. **Evidence** — geo-tagged handset site measurements and digital e-MB logs, AI quantity assessment against the BOQ, and a dual-key certificate: machine evidence + an accountable engineer's Ed25519 signature, hash-chained into a tamper-evident ledger. Output: a verified e-invoice a bank can price.
2. **Authority** — every certifier and approver acts under a signed, scoped, revocable mandate (value caps, category caps, geography fences, auto-revocation on transfer). Every approval — and every non-approval — is a signed, timestamped event. The queue becomes attributable.
3. **Liquidity** — a bank advances 60% at T+1 against the certified receivable, on a reliability-based curve that steps 50%→85% with clean history. A 40% holdback absorbs deductions first; treasury settles at its own pace; the balance is released minus itemized charges.

**Worked example** (₹18,63,900 invoice, treasury settles day 148): contractor receives ₹11,18,340 the next morning and nets **97%** of the invoice after all charges, vs ~91% today after months of informal bridge finance. Days to first cash: **1 vs 148**.

### Managing systemic bottlenecks and structural delays

Infrastructure projects can face complex administrative routing and cash-rationing bottlenecks in treasury queues. Realium addresses this structurally in three ways: **attributable** (processing steps and delays are logged with clear workflow accountability), **priced** (paying divisions are underwritten based on historical cycle times, encouraging structural department efficiency), and **pre-allocated budget targeting** (capital deployment focuses on accounts with secure, centrally-funded budgets).

### Human-AI synergy (the conclave theme, as architecture)

AI does what scales: observes sites continuously, estimates quantities deterministically, enforces mandates in code. Humans do what carries legal weight: attest measurements, hold mandates, approve above thresholds. **Neither side moves money alone** — dual-key, enforced at every layer.

## Validation

- **Working engines:** 47 unit tests including Ed25519 verified against RFC 8032 test vectors — see [groundtruth](https://github.com/Bahniman/groundtruth) (financing waterfall + reliability flywheel, 22 tests) and [surety](https://github.com/Bahniman/surety) (mandate policy engine, 25 tests).
- **Live interactive demos** on the site: the dual-key certification flow and the certification-mandate playground.
- **Precedent stack:** UPI, GST e-invoicing, TReDS, CPWD e-MB (~₹20,000 Cr/yr digital), Digital Signatures (IT Act 2000) — everything Realium relies on already exists in India.
- **Roadmap:** prototype done → one PWD division + one bank partner, 6 months, measurement-to-payment 90 → 15 days → multi-state expansion behind a published attestation standard, second vertical (insurance claims) on the same certificate primitive.

## This repository

The Realium site as a standalone Vite + React + Tailwind v4 SPA (framer-motion, lucide-react), deployed to GitHub Pages from `docs/`.

```bash
npm install
npm run dev       # local dev
npm run build     # builds to docs/ (GitHub Pages serves this)
```

## Team

**Team Realium — Group 10, PGDM-GM, XLRI Jamshedpur:** Ananthanarayan · Bahniman · Nandini · Srishti · Uditanshu

## Credits & AI Contributors

Realium was built with pair-programming assistance from:
- **Antigravity** (Google DeepMind) — Overhauled the visual layouts, implemented responsive widescreen side rails, restructured CPWD bottlenecks lists, fixed e-MB visualizer contrasts, and integrated adaptation filters.
- **Claude** (Anthropic) — Assisted in initial prototype implementation steps.

MIT License.
