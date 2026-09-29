// Ported from the Claude Design mockup. Presentational only: all data and
// actions come in through `v` (built in src/App.jsx).
import { Fragment } from 'react';

export default function MyJobsPage({ v }) {
  return (
    <>
      {' '}
      <div data-screen-label="05 My jobs" style={{ maxWidth: "960px", margin: "0 auto", padding: "56px 32px 112px", display: "flex", flexDirection: "column", gap: "28px" }}>
        {' '}
        <div data-rise="0" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "24px", flexWrap: "wrap" }}>
          {' '}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {' '}
            <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px", color: "var(--c-accent-text)", letterSpacing: "0.08em" }}>
              / MY JOBS
            </span>
            {' '}
            <h1 style={{ margin: "0", fontSize: "48px", letterSpacing: "-0.035em", fontWeight: "600" }}>
              Your shortlist
            </h1>
            {' '}
          </div>
          {' '}
          <div style={{ display: "flex", gap: "12px" }}>
            {' '}
            <div style={{ padding: "14px 18px", borderRadius: "12px", background: "var(--c-paper)", border: "1px solid var(--c-line)", display: "flex", flexDirection: "column", gap: "2px", minWidth: "96px" }}>
              <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "24px", fontWeight: "500" }}>
                {v.savedCount}
              </span>
              <span style={{ fontSize: "13px", color: "var(--c-muted)" }}>
                Saved
              </span>
            </div>
            {' '}
            <div style={{ padding: "14px 18px", borderRadius: "12px", background: "#D2F53B", border: "1.5px solid var(--c-ink)", boxShadow: "3px 3px 0 0 var(--c-ink)", display: "flex", flexDirection: "column", gap: "2px", minWidth: "96px" }}>
              <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "24px", fontWeight: "500" }}>
                {v.appliedCount}
              </span>
              <span style={{ fontSize: "13px", color: "var(--c-ink)" }}>
                Applied
              </span>
            </div>
            {' '}
          </div>
          {' '}
        </div>
        {' '}
        <div role="tablist" data-rise="1" style={{ display: "flex", gap: "4px", borderBottom: "1px solid var(--c-line)" }}>
          {' '}
          {(v.meTabs || []).map((tb, i0) => (
            <Fragment key={tb?.id ?? i0}>
              {' '}
              <button role="tab" onClick={tb.onClick} style={{ position: "relative", padding: "12px 16px", border: "none", background: "none", cursor: "pointer", fontSize: "15px", fontWeight: tb.weight, color: tb.color }}>
                {tb.label}{' '}
                <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px", padding: "2px 7px", borderRadius: "99px", background: "var(--c-sunk)", color: "var(--c-text2)" }}>
                  {tb.count}
                </span>
                <span style={{ position: "absolute", left: "0", right: "0", bottom: "-1px", height: "2px", background: "#5B4FF5", opacity: tb.bar, transition: "opacity .2s" }}/>
              </button>
              {' '}
            </Fragment>
          ))}
          {' '}
        </div>
        {' '}
        <div data-list="1" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {' '}
          {(v.myList || []).map((j, i0) => (
            <Fragment key={j?.id ?? i0}>
              {' '}
              <article onClick={j.onOpen} style={{ cursor: "pointer", background: "var(--c-paper)", border: "1.5px solid var(--c-line)", borderRadius: "14px", padding: "24px", display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap", transition: "transform .25s cubic-bezier(.34,1.56,.64,1),box-shadow .25s,border-color .25s" }} className="dh32">
                {' '}
                <div style={{ width: "48px", height: "48px", flexShrink: "0", borderRadius: "12px", background: j.avBg, color: j.avFg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "600", fontSize: "15px" }}>
                  {j.initials}
                </div>
                {' '}
                <div style={{ flex: "1 1 240px", minWidth: "0", display: "flex", flexDirection: "column", gap: "6px" }}>
                  {' '}
                  <span style={{ fontSize: "14px", color: "var(--c-text3)" }}>
                    {j.company} · {j.location}
                  </span>
                  {' '}
                  <h3 style={{ margin: "0", fontSize: "18px", fontWeight: "600", letterSpacing: "-0.015em" }}>
                    {j.title}
                  </h3>
                  {' '}
                  <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "14px" }}>
                    {j.salary}
                  </span>
                  {' '}
                </div>
                {' '}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "auto" }}>
                  {' '}
                  {j.applied ? (
                    <>
                      {' '}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                        {' '}
                        <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px", padding: "4px 9px", borderRadius: "6px", background: "rgba(15,110,86,0.1)", color: "var(--c-green)" }}>
                          ✓ Applied
                        </span>
                        {' '}
                        <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px", color: "var(--c-muted)" }}>
                          {j.appliedWhen}
                        </span>
                        {' '}
                      </div>
                      {' '}
                    </>
                  ) : null}
                  {' '}
                  <button onClick={j.onSave} aria-label="Save job" style={{ width: "36px", height: "36px", borderRadius: "10px", border: `1px solid ${j.saveBorder}`, background: j.saveBg, color: j.saveFg, cursor: "pointer", fontSize: "16px" }}>
                    {j.saveIcon}
                  </button>
                  {' '}
                </div>
                {' '}
              </article>
              {' '}
            </Fragment>
          ))}
          {' '}
        </div>
        {' '}
        {v.myEmpty ? (
          <>
            {' '}
            <div style={{ position: "relative", borderRadius: "14px", border: "1.5px dashed var(--c-line2)", padding: "64px 24px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", overflow: "hidden" }}>
              {' '}
              {v.isSavedTab ? (
                <>
                  <img data-float="0.04" src="/assets/empty-saved.jpg" alt="" style={{ width: "180px", height: "180px", objectFit: "cover", borderRadius: "14px", marginBottom: "12px" }}/>
                </>
              ) : null}
              {' '}
              {v.isAppliedTab ? (
                <>
                  <img data-float="0.04" src="/assets/empty-applied.jpg" alt="" style={{ width: "180px", height: "180px", objectFit: "cover", borderRadius: "14px", marginBottom: "12px" }}/>
                </>
              ) : null}
              {' '}
              <span style={{ fontSize: "17px", fontWeight: "500" }}>
                {v.myEmptyTitle}
              </span>
              {' '}
              <span style={{ fontSize: "14px", color: "var(--c-text3)" }}>
                {v.myEmptySub}
              </span>
              {' '}
              <button onClick={v.goHome} style={{ marginTop: "12px", padding: "11px 20px", borderRadius: "10px", border: "none", background: "#5B4FF5", color: "#FFFEFB", fontFamily: "'Geist Mono',monospace", fontSize: "12px", cursor: "pointer" }}>
                Browse jobs →
              </button>
              {' '}
            </div>
            {' '}
          </>
        ) : null}
        {' '}
      </div>
      {' '}
    </>
  );
}
