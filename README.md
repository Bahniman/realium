# Realium

*Last updated: 1 October 2026*

**Live site:** <https://bahniman.github.io/realium/>

Realium is a student project proposing a way to connect evidence of public-works progress, accountable approvals, and financing against certified receivables. The site explains the proposal and lets visitors inspect a few local, illustrative scenarios. It is not a live payments product or a validated financing offer.

## Explore the site

- **Process board:** switch among proposed Measure, Approve, and Model stages for one sample work item; each stage distinguishes illustrative input from proposed controls and unvalidated financing assumptions.
- **Certification-flow scenario:** step through a sample work item and see how proposed evidence and approval stages relate.
- **Mandate playground:** change a sample mandate and inspect which example actions it would allow.
- **Liquidity calculator:** compare modeled financing assumptions, including fees, deductions, released holdback, and shortfall recovery when charges exceed the holdback.
- **Context, validation, and sources:** review the rationale, open questions, and references presented with the concept.

All figures and timings in the interactive scenarios are assumptions. The site does not connect to a public-works department, bank, payment rail, production ledger, or AI service; it does not certify work or trigger payment. Cryptographic signing, audit storage, actual lender terms, and live settlement remain implementation and validation work. Related prototype code in other repositories is not a production integration.

## Design and accessibility

Realium uses the shared Riso Poster visual system: paper-like cream surfaces, blue/pink/yellow accents, outlined components, and bold editorial type. Its selectable hero process board frames Measure, Approve, and Model as proposed stages, not completed live operations. The headline and process board enter in a staggered sequence; section content reveals as you read, and buttons respond with a small lift and press. The board keeps Realium's public-works process at the center of the shared visual language. The responsive header links the four projects and collapses section links into a native disclosure menu at smaller widths; the light/dark choice is saved locally. Wheel input uses smooth scrolling, while touch gestures and the browser scrollbar remain native. Section links update the URL fragment, move focus to the destination, and support browser back/forward. The header marks the current section and shows reading progress. A back-to-top link returns focus to the main content. Reduced-motion preferences keep reveals static.

The page includes a skip-to-content link, semantic sections and headings, labeled controls, keyboard-operable buttons, pressed states, and a reduced-motion mode. These are implemented interface features, not a formal accessibility certification.

## Run locally

Requires Node.js 22.12+ and npm.

```bash
npm install
npm run dev       # local Vite development server
npm run build     # production assets in docs/
npm run preview   # preview the production build
npx tsc --noEmit  # TypeScript check
```

The `docs/` directory is the configured static build output for the `/realium/` GitHub Pages path.

## Source map

- `src/page.tsx` — page sections and narrative.
- `src/components/pipeline-visualizer.tsx` — selectable Measure/Approve/Model hero board, explicitly illustrative.
- `src/lib/finance-scenario.ts` — local scenario calculations.
- `src/components/suite-header.tsx`, `src/components/suite-motion.tsx` — shared navigation, anchor focus/history, active-section state, progress, and back-to-top behavior.
- `src/riso-tokens.css`, `src/riso-suite.css`, `src/riso-motion.css` — shared Riso tokens, components, and motion/reduced-motion rules.
- `src/main.tsx`, `src/styles.css` — app entry and page styling.
- `vite.config.ts` — Vite, aliases, base path, and `docs/` output.

## License

MIT. See [`LICENSE`](LICENSE).