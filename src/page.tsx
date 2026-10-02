import { SuretyPlayground } from "@/components/surety-playground";
import { SuiteHeader } from "@/components/suite-header";
import { LiquidityCalculator } from "@/components/liquidity-calculator";
import { PipelineVisualizer } from "@/components/pipeline-visualizer";
import { SuiteNext } from "@/components/suite-next";
import { BASE_FINANCE_SCENARIO } from "@/lib/finance-scenario";

const pct = (value: number) => `${value.toFixed(1)}%`;

export default function LandingPage() {
  const s = BASE_FINANCE_SCENARIO;
  return (
    <div className="realium-page pk">

      <SuiteHeader name="Realium" sections={[
        { label: "The gap", href: "#problem" },
        { label: "How it works", href: "#how" },
        { label: "The money", href: "#money" },
        { label: "The signature", href: "#mandate" },
        { label: "Weak spots", href: "#limits" },
      ]} />

      <main id="main" className="suite-main">

        {/* ------------------------------ the poster ------------------------------ */}
        <section className="pk-wrap pk-hero">
          <div className="pk-hero-copy">
            <p className="pk-kick"><span className="n">01</span> Prototype · Fintech</p>
            <h1 className="pk-big">
              <span className="a">Paid</span>
              <span className="b">next day.</span>
              <span className="c">Not 148 days after the road is finished.</span>
            </h1>
            <p className="pk-dek">
              Realium turns verified public works into a claim a bank will fund: <b>evidence</b> from the site,
              a <b>signature</b> from an accountable engineer, then <b>60% of the bill</b> in the contractor's account the next day.
            </p>
            <div className="pk-cta">
              <a href="#money" className="pk-btn pri">Follow the money ↓</a>
              <a href="#problem" className="pk-btn">Why it matters</a>
            </div>
          </div>

          <div className="pk-board">
            <span className="pk-sticker">Top 3<small>ReEnvision 5.0</small></span>
            <PipelineVisualizer />
          </div>
        </section>

        <div className="pk-wrap">
          <div className="pk-glance">
            <dl className="pk-facts">
              <div><dt>₹96k Cr</dt><dd>owed to contractors in Maharashtra alone, April 2026 <a className="lnk" href="#sources">[1]</a></dd></div>
              <div><dt>148</dt><dd>days to settlement in the worked example</dd></div>
              <div><dt>60%</dt><dd>of the bill advanced the day after sign-off</dd></div>
              <div><dt>{pct(s.contractorNetTakePercent)}</dt><dd>reaches the contractor, against {pct(s.traditionalNetTakePercent)} borrowing at 18%</dd></div>
            </dl>
            <ul className="pk-rows">
              <li><span>What</span><b>A settlement rail for public-works contractors</b></li>
              <li><span>Built</span><b>Signing, payout and approval-rule engines, plus the two models on this page</b></li>
              <li><span>For</span><b>State works departments, contractors and the banks that fund them</b></li>
              <li><span>Result</span><b>3rd of 15 teams at ReEnvision 5.0, XLRI, July 2026</b></li>
            </ul>
          </div>
        </div>

        {/* ------------------------------- the band ------------------------------- */}
        <section className="pk-band">
          <div className="pk-wrap">
            <p className="pk-kick on-blue"><span className="n">The bet</span></p>
            <p className="line">The road is finished. <em>The money is five months away.</em></p>
            <p className="by">A contractor who has already paid for labour, cement and bitumen waits on measurements, approvals and the treasury queue. Until it arrives, the contractor carries the cost.</p>
          </div>
        </section>

        {/* ---------------------------- two calendars ---------------------------- */}
        <section className="pk-wrap pk-sec" id="wait" aria-labelledby="wait-title">
          <div className="pk-head">
            <p className="pk-kick"><span className="dot" /> The same bill</p>
            <h2 id="wait-title">One road bill, <em>two calendars.</em></h2>
          </div>
          <div className="rl-cal">
            <div className="rl-axis" aria-hidden="true">
              {[0, 30, 60, 90, 120, 148].map(day => <span key={day} style={{ left: `${(day / 148) * 100}%` }}>Day {day}</span>)}
            </div>
            <div className="rl-lane">
              <p className="rl-name">Today<small>Wait for the treasury</small></p>
              <div className="rl-track">
                <span className="rl-gap" style={{ left: 0, width: "100%" }}>148 days carrying labour, cement and bitumen on credit</span>
                <span className="rl-pay rl-pay--late" style={{ left: "100%" }}><b>₹18.6L</b> arrives</span>
              </div>
            </div>
            <div className="rl-lane">
              <p className="rl-name">With Realium<small>Signed bill, funded</small></p>
              <div className="rl-track">
                <span className="rl-pay rl-pay--early" style={{ left: `${(1 / 148) * 100}%` }}><b>₹11.2L</b> day 1</span>
                <span className="rl-gap rl-gap--quiet" style={{ left: `${(1 / 148) * 100}%`, width: `${(147 / 148) * 100}%` }}>work continues, crew paid</span>
                <span className="rl-pay rl-pay--late" style={{ left: "100%" }}><b>₹6.9L</b> the rest, after fees</span>
              </div>
            </div>
            <p className="rl-foot">Fees and interest come out of the held-back 40%, so the contractor keeps {pct(s.contractorNetTakePercent)} of the bill. Borrowing the same money informally at 18% leaves {pct(s.traditionalNetTakePercent)}.</p>
          </div>
        </section>

        {/* ------------------------------- the gap -------------------------------- */}
        <section className="pk-wrap pk-sec" id="problem">
          <div className="pk-head">
            <p className="pk-kick"><span className="dot" /> The gap</p>
            <h2>Measured is not <em>the same as fundable.</em></h2>
          </div>
          <div className="pk-split">
            <div className="pk-prose">
              <p>
                In April 2026 contractors in Maharashtra said the state owed them around <b>₹96,000 crore</b> in
                unpaid bills <a className="lnk" href="#sources">[1]</a>. The work behind those bills was done. The cash was not there.
              </p>
              <p>
                Digital measurement is not the missing piece. CPWD launched its <b>e-Measurement Book</b> in 2018
                <a className="lnk" href="#sources"> [2]</a>. A digital entry still isn't something a bank will lend against, because
                the bank cannot tell who verified it, whether that person was allowed to, or where the bill sits in the
                approval queue.
              </p>
              <p>
                Realium's answer is a chain of custody. Each step produces exactly what the next one needs, so by the time
                a bill is signed, a lender can price it like any other receivable.
              </p>
            </div>
            <figure className="pk-quote">
              <p>A bank doesn't lend against a photo. <em>It lends against a signature it trusts.</em></p>
              <small>The idea behind layer two</small>
            </figure>
          </div>
        </section>

        {/* ------------------------------- how it works ------------------------------- */}
        <section className="pk-wrap pk-sec" id="how">
          <div className="pk-head">
            <p className="pk-kick"><span className="dot" /> How it works</p>
            <h2>Evidence, authority, <em>liquidity.</em></h2>
          </div>
          <ol className="pk-cards">
            <li>
              <p className="pk-kick"><span className="n">1</span> Evidence</p>
              <h3>Prove the work</h3>
              <p>Measurements go into the e-MB with geo-tagged photos. Software checks quantities against the bill of quantities and flags gaps for a person to look at.</p>
              <span className="eg">1,240 m² logged · +0.4% against BOQ</span>
            </li>
            <li>
              <p className="pk-kick"><span className="n">2</span> Authority</p>
              <h3>Sign within limits</h3>
              <p>AI organises the evidence. A named engineer signs, and only inside a mandate: a value cap, a list of work categories, one state circle. Anything bigger needs a co-signer.</p>
              <span className="eg">Over the cap · sent to the SE to co-sign</span>
            </li>
            <li>
              <p className="pk-kick"><span className="n">3</span> Liquidity</p>
              <h3>Fund the bill</h3>
              <p>The signed bill becomes a claim a partner bank can discount. 60% goes out the next day. The 40% held back covers fees and deductions when the treasury settles.</p>
              <span className="eg">₹11,18,340 on day one of ₹18,63,900</span>
            </li>
          </ol>
        </section>

        {/* -------------------------------- demo 1 -------------------------------- */}
        <section className="pk-wrap pk-sec" id="money">
          <div className="pk-head">
            <p className="pk-kick"><span className="dot" /> Try it · the money</p>
            <h2>Follow <em>₹18.6 lakh.</em></h2>
            <p className="pk-lede">A road-works bill of ₹18,63,900 that the treasury settles in 148 days. Change the bill, the wait, the contractor's track record or the deductions, and compare what the contractor keeps.</p>
          </div>
          <div className="pk-stage">
            <span className="pk-stage-tag">Live in your browser</span>
            <LiquidityCalculator />
          </div>
        </section>

        {/* -------------------------------- demo 2 -------------------------------- */}
        <section className="pk-wrap pk-sec" id="mandate">
          <div className="pk-head">
            <p className="pk-kick"><span className="dot" /> Try it · the signature</p>
            <h2>Change the rules. <em>Watch who can sign.</em></h2>
            <p className="pk-lede">An executive engineer's mandate has a value cap, a list of work categories and a state circle. Tighten or loosen it and see which certifications go through, which need a co-signer and which are refused.</p>
          </div>
          <div className="pk-stage">
            <span className="pk-stage-tag">Live in your browser</span>
            <SuretyPlayground />
          </div>
        </section>

        {/* -------------------------------- the pilot -------------------------------- */}
        <section className="pk-wrap pk-sec" id="pilot">
          <div className="pk-head">
            <p className="pk-kick"><span className="dot" /> What comes next</p>
            <h2>How I would <em>pilot it.</em></h2>
          </div>
          <ol className="pk-cards">
            <li>
              <p className="pk-kick"><span className="n">Now</span> Prototype</p>
              <h3>Engines built</h3>
              <p>Certificate signing, the 60/40 payout waterfall and the mandate rules exist as tested code in the companion GroundTruth and Surety repositories.</p>
              <span className="eg">github.com/Bahniman/groundtruth</span>
            </li>
            <li>
              <p className="pk-kick"><span className="n">6 mo</span> Pilot</p>
              <h3>One division</h3>
              <p>One state PWD division, works from ₹15 lakh to ₹5 crore, and one bank discounting the signed bills. The target: measurement to payment in 15 days instead of 90.</p>
              <span className="eg">Start where budgets are already allocated</span>
            </li>
            <li>
              <p className="pk-kick"><span className="n">12 mo+</span> Scale</p>
              <h3>Same signature, more uses</h3>
              <p>More states behind a published attestation standard, then a second use for the same signed certificate, such as insurance claims.</p>
              <span className="eg">Payment record shared with consortium banks</span>
            </li>
          </ol>
        </section>

        {/* ------------------------------- weak spots ------------------------------- */}
        <section className="pk-wrap pk-sec" id="limits">
          <div className="pk-head">
            <p className="pk-kick"><span className="dot" /> Where this is weakest</p>
            <h2>What a banker <em>would ask.</em></h2>
          </div>
          <ul className="pk-weak">
            <li>
              <p className="q">Faster paperwork doesn't empty the treasury queue.</p>
              <p className="ans">True. If the state is rationing cash, verification alone won't fix it. Realium doesn't make the state pay faster. It makes the wait financeable, and shows exactly where each bill is stuck.</p>
            </li>
            <li>
              <p className="q">Who carries the risk if the state pays late?</p>
              <p className="ans">The bank does, so it should price the paying division, not the contractor. Each division's history of how long it takes to pay becomes the rate. Divisions with funds already allocated are the safest place to start.</p>
            </li>
            <li>
              <p className="q">What about disputed bills?</p>
              <p className="ans">The 40% holdback absorbs ordinary deductions. Larger disputes are the real open question, along with who legally owns the claim once it's sold. A pilot has to settle both before any money moves.</p>
            </li>
          </ul>
        </section>

        {/* -------------------------------- sources -------------------------------- */}
        <section className="pk-wrap pk-sec" id="sources">
          <div className="pk-head">
            <p className="pk-kick"><span className="dot" /> Checkable</p>
            <h2><em>Sources.</em></h2>
          </div>
          <ol className="pk-src" style={{ maxWidth: 760 }}>
            <li>
              Maharashtra contractors flag ₹96,000 crore in dues, April 2026.{" "}
              <a href="https://www.hindustantimes.com/cities/mumbai-news/contractors-flag-96k-cr-dues-give-state-govt-apr-7-deadline-101775243698708.html" target="_blank" rel="noreferrer">Hindustan Times</a>
            </li>
            <li>
              CPWD e-Measurement Book launch, 13 April 2018.{" "}
              <a href="https://www.pib.gov.in/newsite/PrintRelease.aspx?lang=2&reg=48&relid=178664" target="_blank" rel="noreferrer">PIB</a>
            </li>
            <li>
              The engines behind the prototype.{" "}
              <a href="https://github.com/Bahniman/groundtruth" target="_blank" rel="noreferrer">GroundTruth</a>{" · "}
              <a href="https://github.com/Bahniman/surety" target="_blank" rel="noreferrer">Surety</a>
            </li>
          </ol>
        </section>

        <SuiteNext current="Realium" />
      </main>
    </div>
  );
}
