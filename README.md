# Realium

*Last updated: 2 October 2026*

**Live site:** <https://bahniman.github.io/realium/>

**Paid next day, not 148 days after the road is finished.** Realium turns verified public works into a claim a bank will fund: evidence from the site, a signature from an accountable engineer, then 60% of the bill in the contractor's account the next day. It placed 3rd of 15 teams at ReEnvision 5.0, XLRI's Digital Transformation Conclave, in July 2026.

## Explore the site

- **The argument:** why a digital measurement is not yet something a bank will lend against, with sourced figures on unpaid contractor dues in Maharashtra and CPWD's e-Measurement Book.
- **Follow the money:** a payout calculator on a ₹18,63,900 road bill settled in 148 days. Change the bill, the wait, the contractor's track record and the deductions, and compare what the contractor keeps with an 18% informal loan (97.0% against 92.7% at the defaults).
- **Watch who can sign:** an engineer's mandate (value cap, work categories, state circle). Each certification attempt is allowed, sent for a co-signature, or blocked, with the reason.
- **Pilot plan and weak spots:** how a one-division pilot would run, and the three questions a banker would ask, each with an answer.

Both models run in the browser on the worked example. The signing, payout and mandate engines live as tested code in the companion [GroundTruth](https://github.com/Bahniman/groundtruth) and [Surety](https://github.com/Bahniman/surety) repositories.

## Design

The site uses the Riso Poster system shared with [the portfolio](https://bahniman.github.io/): cream paper (dark ink in dark mode), blue and pink overprinted inks, yellow stickers, 2.5px ink outlines and hard offset shadows; Bricolage Grotesque, Newsreader and Space Mono. Every project page is built from the same poster kit (`src/poster.css`): an overprinted headline beside a tilted demo board, a ticket strip of key facts, a blue statement band, stamped cards, a framed live demo, objection cards and a strip linking to the other three prototypes. Each page keeps its own board, ink order and subject.

Motion follows the portfolio: a staged hero entrance, scroll reveals with a slight tilt, smooth wheel scrolling, lift-and-press buttons, a reading-progress rule and a back-to-top sticker. Reduced-motion settings turn all of it off. The page has a skip link, labelled controls, visible focus and keyboard-operable demos.

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

- `src/poster.css`, `src/components/suite-next.tsx`: shared poster kit and the next-prototype strip.
- `src/page.tsx`: page sections and narrative.
- `src/components/pipeline-visualizer.tsx`: selectable Measure/Approve/Model hero board, explicitly illustrative.
- `src/lib/finance-scenario.ts`: local scenario calculations.
- `src/components/suite-header.tsx`, `src/components/suite-motion.tsx`: shared navigation, anchor focus/history, active-section state, progress, and back-to-top behavior.
- `src/riso-tokens.css`, `src/riso-suite.css`, `src/riso-motion.css`: shared Riso tokens, components, and motion/reduced-motion rules.
- `src/main.tsx`, `src/styles.css`: app entry and page styling.
- `vite.config.ts`: Vite, aliases, base path, and `docs/` output.

## License

MIT. See [`LICENSE`](LICENSE).