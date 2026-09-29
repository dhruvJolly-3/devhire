// Ported from the Claude Design mockup. Presentational only: all data and
// actions come in through `v` (built in src/App.jsx).
import { Fragment } from 'react';

export default function NotFoundPage({ v }) {
  return (
    <>
      {' '}
      <div data-screen-label="08 Not found" style={{ position: "relative", overflow: "hidden" }}>
        {' '}
        <div aria-hidden="true" style={{ position: "absolute", left: "50%", top: "40px", transform: "translateX(-50%)", fontSize: "clamp(200px,34vw,440px)", fontWeight: "700", letterSpacing: "-0.07em", lineHeight: ".85", color: "transparent", WebkitTextStroke: "2px var(--c-stroke)", pointerEvents: "none", userSelect: "none" }}>
          404
        </div>
        {' '}
        <div style={{ position: "relative", maxWidth: "720px", margin: "0 auto", padding: "180px 32px 112px", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", textAlign: "center" }}>
          {' '}
          <div data-rise="0" style={{ position: "relative", width: "240px", height: "240px", marginBottom: "12px" }}>
            {' '}
            <div aria-hidden="true" style={{ position: "absolute", inset: "0", borderRadius: "20px", border: "1.5px dashed #5B4FF5", transform: "rotate(-6deg) translate(-10px,6px)" }}/>
            {' '}
            <img src="/assets/not-found.jpg" alt="" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", borderRadius: "20px", border: "1.5px solid var(--c-ink)", boxShadow: "6px 6px 0 0 var(--c-ink)", transform: "rotate(2deg)" }}/>
            {' '}
          </div>
          {' '}
          <span data-rise="1" style={{ fontFamily: "'Geist Mono',monospace", fontSize: "13px", color: "var(--c-text3)", padding: "6px 12px", borderRadius: "8px", background: "var(--c-sunk)" }}>
            {v.missingPath}
          </span>
          {' '}
          <h1 data-rise="1" style={{ margin: "0", fontSize: "44px", letterSpacing: "-0.035em", fontWeight: "600", lineHeight: "1.1" }}>
            This job is no longer available
          </h1>
          {' '}
          <p data-rise="2" style={{ margin: "0", fontSize: "17px", lineHeight: "1.6", color: "var(--c-text3)", maxWidth: "480px" }}>
            It may have been filled or taken down by the employer. The link could also be mistyped.
          </p>
          {' '}
          <div data-rise="3" style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center", paddingTop: "8px" }}>
            {' '}
            <button onClick={v.goHome} style={{ padding: "14px 22px", borderRadius: "12px", border: "1.5px solid var(--c-ink)", background: "#5B4FF5", color: "#FFFEFB", fontSize: "15px", fontWeight: "600", cursor: "pointer", boxShadow: "4px 4px 0 0 var(--c-ink)", transition: "all .15s" }} className="dh29">
              ← Back to all jobs
            </button>
            {' '}
            <button onClick={v.goMe} style={{ padding: "14px 22px", borderRadius: "12px", border: "1px solid var(--c-line2)", background: "transparent", color: "var(--c-ink)", fontSize: "15px", fontWeight: "500", cursor: "pointer" }} className="dh30">
              My saved jobs
            </button>
            {' '}
          </div>
          {' '}
        </div>
        {' '}
        <div style={{ position: "relative", maxWidth: "1000px", margin: "0 auto", padding: "0 32px 112px", display: "flex", flexDirection: "column", gap: "20px" }}>
          {' '}
          <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px", color: "var(--c-accent-text)", letterSpacing: "0.08em", textAlign: "center" }}>
            / SIMILAR ROLES, STILL OPEN
          </span>
          {' '}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,280px),1fr))", gap: "20px" }}>
            {' '}
            {(v.similar || []).map((j, i0) => (
              <Fragment key={j?.id ?? i0}>
                {' '}
                <article data-rise={i0} onClick={j.onOpen} style={{ cursor: "pointer", background: "var(--c-paper)", border: "1.5px solid var(--c-line)", borderRadius: "14px", padding: "24px", display: "flex", flexDirection: "column", gap: "12px", transition: "transform .25s cubic-bezier(.34,1.56,.64,1),box-shadow .25s,border-color .25s" }} className="dh31">
                  {' '}
                  <span style={{ fontSize: "14px", color: "var(--c-text3)" }}>
                    {j.company}
                  </span>
                  {' '}
                  <h3 style={{ margin: "0", fontSize: "17px", fontWeight: "600", lineHeight: "1.3" }}>
                    {j.title}
                  </h3>
                  {' '}
                  <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "14px" }}>
                    {j.salary}
                  </span>
                  {' '}
                </article>
                {' '}
              </Fragment>
            ))}
            {' '}
          </div>
          {' '}
        </div>
        {' '}
      </div>
      {' '}
    </>
  );
}
