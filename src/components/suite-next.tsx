const PROJECTS = [
  { name: "Realium", tag: "Fintech", line: "Public-works contractors wait months to be paid. A flow from site-verified work to a claim a bank can fund." },
  { name: "Heirloom", tag: "Knowledge", line: "A firm's memory in a format the firm owns, with role-based access and a clean export." },
  { name: "Turnstile", tag: "Commerce", line: "Tell people, shopping agents and scrapers apart, then serve each the right storefront." },
  { name: "Windtunnel", tag: "Pricing", line: "Rehearse a price change on 500 simulated runs before customers react to the real one." },
];

export function SuiteNext({ current }: { current: string }) {
  const others = PROJECTS.filter(project => project.name !== current);
  return (
    <section className="pk-next pk-wrap" aria-labelledby="next-title">
      <div className="pk-head">
        <p className="pk-kick"><span className="n">Next</span> Same notebook, different problem</p>
        <h2 id="next-title">Three more <em>prototypes.</em></h2>
      </div>
      <div className="pk-next-grid">
        {others.map(project => (
          <a key={project.name} href={`/${project.name.toLowerCase()}/`}>
            <span className="pk-kick">{project.tag}</span>
            <b>{project.name}</b>
            <p>{project.line}</p>
            <span className="go">Open it →</span>
          </a>
        ))}
      </div>
      <div className="pk-home">
        <p>Built by Bahniman Talukdar. <em>The rest of the story is on the portfolio.</em></p>
        <div className="pk-cta" style={{ marginTop: 0 }}>
          <a className="pk-btn pri" href="https://bahniman.github.io/">Portfolio</a>
          <a className="pk-btn" href={`https://github.com/Bahniman/${current.toLowerCase()}`} target="_blank" rel="noreferrer">Source ↗</a>
        </div>
      </div>
    </section>
  );
}
