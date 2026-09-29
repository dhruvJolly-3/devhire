// Ported from the Claude Design mockup. Presentational only: all data and
// actions come in through `v` (built in src/App.jsx).
import { Fragment } from 'react';

export default function CompanyPage({ v }) {
  return (
    <>
      {' '}
      <div data-screen-label="10 Company page">
        {' '}
        <div style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid var(--c-line)" }}>
          {' '}
          <div aria-hidden="true" data-parallax="0.2" style={{ position: "absolute", inset: "-18% 0", background: "var(--c-sand2) url(\"/assets/company-banner.jpg\") right center/cover no-repeat", pointerEvents: "none", willChange: "transform" }}/>
          {' '}
          <div aria-hidden="true" style={{ position: "absolute", inset: "0", background: "linear-gradient(90deg,rgba(var(--c-bg-rgb),0.96) 0%,rgba(var(--c-bg-rgb),0.9) 55%,rgba(var(--c-bg-rgb),0) 85%)", pointerEvents: "none" }}/>
          {' '}
          <div style={{ position: "relative", maxWidth: "1200px", margin: "0 auto", padding: "40px 32px 64px", display: "flex", flexDirection: "column", gap: "32px" }}>
            {' '}
            <button onClick={v.goHome} style={{ alignSelf: "flex-start", background: "none", border: "none", padding: "0", fontFamily: "'Geist Mono',monospace", fontSize: "13px", color: "var(--c-muted)", cursor: "pointer" }} className="dh58">
              ← all jobs
            </button>
            {' '}
            <div data-rise="0" style={{ display: "flex", gap: "28px", alignItems: "flex-start", flexWrap: "wrap" }}>
              {' '}
              <div style={{ position: "relative", width: "104px", height: "104px", flexShrink: "0" }}>
                {' '}
                <div aria-hidden="true" style={{ position: "absolute", inset: "0", borderRadius: "24px", border: "1.5px dashed #5B4FF5", transform: "rotate(8deg) translate(6px,2px)" }}/>
                {' '}
                <div aria-hidden="true" style={{ position: "absolute", inset: "0", borderRadius: "24px", background: "var(--c-ink)", transform: "translate(6px,6px)" }}/>
                {' '}
                <div style={{ position: "absolute", inset: "0", borderRadius: "24px", background: v.co.avBg, color: v.co.avFg, border: "1.5px solid var(--c-ink)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px", fontWeight: "600", letterSpacing: "-0.02em" }}>
                  {v.co.initials}
                </div>
                {' '}
              </div>
              {' '}
              <div style={{ flex: "1 1 420px", minWidth: "0", display: "flex", flexDirection: "column", gap: "14px" }}>
                {' '}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {' '}
                  <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px", padding: "5px 10px", borderRadius: "6px", background: "#D2F53B", color: "#18181B" }}>
                    {v.co.industry}
                  </span>
                  {' '}
                  <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px", padding: "5px 10px", borderRadius: "6px", background: "var(--c-sunk)", color: "var(--c-text2)" }}>
                    {v.co.hq}
                  </span>
                  {' '}
                  {v.hasDomain ? (
                    <>
                      <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px", padding: "5px 10px", borderRadius: "6px", background: "var(--c-sunk)", color: "var(--c-text2)" }}>
                        {v.co.domain}
                      </span>
                    </>
                  ) : null}
                  {' '}
                </div>
                {' '}
                <h1 style={{ margin: "0", fontSize: "clamp(40px,5vw,56px)", letterSpacing: "-0.04em", fontWeight: "600", lineHeight: "1" }}>
                  {v.co.name}
                </h1>
                {' '}
                <p style={{ margin: "0", fontSize: "18px", lineHeight: "1.6", color: "var(--c-text2)", maxWidth: "620px", textWrap: "pretty" }}>
                  {v.co.about}
                </p>
                {' '}
              </div>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
        </div>
        {' '}
        <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "56px 32px 112px", display: "flex", flexDirection: "column", gap: "24px" }}>
          {' '}
          <div data-rise="1" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {' '}
            <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px", color: "var(--c-accent-text)", letterSpacing: "0.08em" }}>
              / HIRING NOW
            </span>
            {' '}
            <h2 style={{ margin: "0", fontSize: "32px", letterSpacing: "-0.03em", fontWeight: "600" }}>
              <span style={{ fontFamily: "'Geist Mono',monospace", fontWeight: "500" }}>
                {v.co.roleCount}
              </span>
            </h2>
            {' '}
          </div>
          {' '}
          <div data-list="1" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {' '}
            {(v.coJobs || []).map((j, i0) => (
              <Fragment key={j?.id ?? i0}>
                {' '}
                <article onClick={j.onOpen} style={{ cursor: "pointer", background: "var(--c-paper)", border: "1.5px solid var(--c-line)", borderRadius: "14px", padding: "24px", display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap", transition: "transform .25s cubic-bezier(.34,1.56,.64,1),box-shadow .25s,border-color .25s" }} className="dh59">
                  {' '}
                  <div style={{ flex: "1 1 280px", minWidth: "0", display: "flex", flexDirection: "column", gap: "10px" }}>
                    {' '}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      {' '}
                      <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px", color: "var(--c-muted)" }}>
                        {j.posted}
                      </span>
                      {' '}
                      {j.isNew ? (
                        <>
                          <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "11px", padding: "2px 7px", borderRadius: "5px", background: "#D2F53B", color: "#18181B" }}>
                            NEW
                          </span>
                        </>
                      ) : null}
                      {' '}
                    </div>
                    {' '}
                    <h3 style={{ margin: "0", fontSize: "19px", fontWeight: "600", letterSpacing: "-0.015em" }}>
                      {j.title}
                    </h3>
                    {' '}
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {' '}
                      <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px", padding: "4px 9px", borderRadius: "6px", background: "var(--c-tint)", color: "var(--c-accent-ink)" }}>
                        {j.type}
                      </span>
                      {' '}
                      {(j.tags || []).map((t, i1) => (
                        <Fragment key={t?.id ?? i1}>
                          {' '}
                          <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px", padding: "4px 9px", borderRadius: "6px", background: "var(--c-sunk)", color: "var(--c-text2)" }}>
                            {t}
                          </span>
                          {' '}
                        </Fragment>
                      ))}
                      {' '}
                    </div>
                    {' '}
                  </div>
                  {' '}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px", marginLeft: "auto" }}>
                    {' '}
                    <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "15px", fontWeight: "500" }}>
                      {j.salary}
                    </span>
                    {' '}
                    <span style={{ fontSize: "13px", color: "var(--c-muted)" }}>
                      {j.location} ·{' '}
                      <span style={{ fontFamily: "'Geist Mono',monospace" }}>
                        {j.exp}
                      </span>
                    </span>
                    {' '}
                  </div>
                  {' '}
                  <button onClick={j.onSave} aria-label="Save job" style={{ width: "36px", height: "36px", borderRadius: "10px", border: `1px solid ${j.saveBorder}`, background: j.saveBg, color: j.saveFg, cursor: "pointer", fontSize: "16px" }}>
                    {j.saveIcon}
                  </button>
                  {' '}
                </article>
                {' '}
              </Fragment>
            ))}
            {' '}
          </div>
          {' '}
          {v.coEmpty ? (
            <>
              {' '}
              <div style={{ borderRadius: "14px", border: "1.5px dashed var(--c-line2)", padding: "56px 24px", textAlign: "center", fontSize: "15px", color: "var(--c-text3)" }}>
                No open roles right now.
              </div>
              {' '}
            </>
          ) : null}
          {' '}
        </section>
        {' '}
      </div>
      {' '}
    </>
  );
}
