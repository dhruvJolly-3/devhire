// Ported from the Claude Design mockup. Presentational only: all data and
// actions come in through `v` (built in src/App.jsx).
import { Fragment } from 'react';

export default function JobsPage({ v }) {
  return (
    <>
      {' '}
      <div data-screen-label="03 Job board">
        {' '}
        <div style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid var(--c-line)" }}>
          {' '}
          <div aria-hidden="true" data-parallax="0.2" style={{ position: "absolute", inset: "-18% 0", background: "var(--c-sand2) url(\"/assets/board-banner.jpg\") 78% 56%/cover no-repeat", pointerEvents: "none", willChange: "transform" }}/>
          {' '}
          <div aria-hidden="true" style={{ position: "absolute", inset: "0", background: "linear-gradient(90deg,rgba(var(--c-bg-rgb),0.92) 0%,rgba(var(--c-bg-rgb),0.6) 45%,rgba(var(--c-bg-rgb),0) 70%)", pointerEvents: "none" }}/>
          {' '}
          <div style={{ position: "relative", maxWidth: "1200px", margin: "0 auto", padding: "56px 32px 40px", display: "flex", flexDirection: "column", gap: "24px" }}>
            {' '}
            <div data-rise="0" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {' '}
              <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px", color: "var(--c-accent-text)", letterSpacing: "0.08em" }}>
                / JOB BOARD
              </span>
              {' '}
              <h1 style={{ margin: "0", fontSize: "48px", letterSpacing: "-0.035em", fontWeight: "600" }}>
                Open roles
              </h1>
              {' '}
            </div>
            {' '}
            <div data-rise="1" style={{ position: "relative", maxWidth: "760px" }}>
              {' '}
              <div aria-hidden="true" style={{ position: "absolute", inset: "0", borderRadius: "14px", background: "var(--c-ink)", transform: "translate(5px,5px)" }}/>
              {' '}
              <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "12px", background: "var(--c-paper)", border: "1.5px solid var(--c-ink)", borderRadius: "14px", padding: "0 8px 0 20px", height: "60px" }}>
                {' '}
                <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "14px", color: "var(--c-muted)" }}>
                  ⌕
                </span>
                {' '}
                <input value={v.query} onChange={v.onQuery} aria-label="Search jobs" placeholder="Search by role, company, skill or city…" style={{ flex: "1", minWidth: "0", height: "100%", border: "none", background: "transparent", outline: "none", fontFamily: "'Geist Mono',monospace", fontSize: "14px", color: "var(--c-ink)" }}/>
                {' '}
                {v.query ? (
                  <>
                    {' '}
                    <button onClick={v.clearQuery} style={{ height: "42px", padding: "0 16px", borderRadius: "10px", border: "none", background: "#5B4FF5", color: "#FFFEFB", fontFamily: "'Geist Mono',monospace", fontSize: "12px", fontWeight: "500", cursor: "pointer" }}>
                      Clear ×
                    </button>
                    {' '}
                  </>
                ) : null}
                {' '}
              </div>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
        </div>
        {' '}
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 32px 112px", display: "flex", gap: "48px", alignItems: "flex-start", flexWrap: "wrap" }}>
          {' '}
          <aside data-rise="1" style={{ flex: "0 1 240px", minWidth: "220px", position: "sticky", top: "96px", display: "flex", flexDirection: "column", gap: "28px" }}>
            {' '}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              {' '}
              <span style={{ fontSize: "16px", fontWeight: "600" }}>
                Filters
              </span>
              {' '}
              {v.nActive ? (
                <>
                  {' '}
                  <button onClick={v.clearFilters} style={{ background: "none", border: "none", padding: "0", fontFamily: "'Geist Mono',monospace", fontSize: "12px", color: "var(--c-accent-text)", cursor: "pointer" }}>
                    Clear ({v.nActive})
                  </button>
                  {' '}
                </>
              ) : null}
              {' '}
            </div>
            {' '}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {' '}
              <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "11px", color: "var(--c-muted)", letterSpacing: "0.08em" }}>
                WORK TYPE
              </span>
              {' '}
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {' '}
                {(v.typeOpts || []).map((o, i0) => (
                  <Fragment key={o?.id ?? i0}>
                    {' '}
                    <button onClick={o.onClick} style={{ padding: "7px 13px", borderRadius: "999px", border: `1px solid ${o.border}`, background: o.bg, color: o.fg, fontSize: "13px", fontWeight: "500", cursor: "pointer", transition: "all .15s" }}>
                      {o.label}
                    </button>
                    {' '}
                  </Fragment>
                ))}
                {' '}
              </div>
              {' '}
            </div>
            {' '}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {' '}
              <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "11px", color: "var(--c-muted)", letterSpacing: "0.08em" }}>
                CITY
              </span>
              {' '}
              {(v.cityOpts || []).map((o, i0) => (
                <Fragment key={o?.id ?? i0}>
                  {' '}
                  <button onClick={o.onClick} style={{ display: "flex", alignItems: "center", gap: "10px", background: "none", border: "none", padding: "4px 0", cursor: "pointer", fontSize: "14px", color: "var(--c-ink)", textAlign: "left" }} className="dh17">
                    {' '}
                    <span style={{ width: "18px", height: "18px", borderRadius: "5px", border: `1.5px solid ${o.border}`, background: o.bg, color: "var(--c-paper)", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s" }}>
                      {o.check}
                    </span>
                    {' '}
                    <span style={{ flex: "1" }}>
                      {o.label}
                    </span>
                    {' '}
                    <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px", color: "var(--c-muted)" }}>
                      {o.count}
                    </span>
                    {' '}
                  </button>
                  {' '}
                </Fragment>
              ))}
              {' '}
            </div>
            {' '}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {' '}
              <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "11px", color: "var(--c-muted)", letterSpacing: "0.08em" }}>
                STACK
              </span>
              {' '}
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {' '}
                {(v.stackOpts || []).map((o, i0) => (
                  <Fragment key={o?.id ?? i0}>
                    {' '}
                    <button onClick={o.onClick} style={{ padding: "5px 10px", borderRadius: "6px", border: `1px solid ${o.border}`, background: o.bg, color: o.fg, fontFamily: "'Geist Mono',monospace", fontSize: "12px", cursor: "pointer", transition: "all .15s" }}>
                      {o.label}
                    </button>
                    {' '}
                  </Fragment>
                ))}
                {' '}
              </div>
              {' '}
            </div>
            {' '}
          </aside>
          {' '}
          <div style={{ flex: "1 1 560px", minWidth: "0", display: "flex", flexDirection: "column", gap: "16px" }}>
            {' '}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              {' '}
              <span aria-live="polite" style={{ fontFamily: "'Geist Mono',monospace", fontSize: "13px", color: "var(--c-text3)" }}>
                {v.resultsLabel}
              </span>
              {' '}
              <select value={v.sort} onChange={v.onSort} aria-label="Sort jobs" style={{ height: "40px", padding: "0 12px", borderRadius: "10px", border: "1px solid var(--c-line2)", background: "var(--c-paper)", fontSize: "14px", color: "var(--c-ink)", cursor: "pointer" }}>
                <option value="Newest">
                  Sort: Newest
                </option>
                <option value="Salary">
                  Sort: Highest salary
                </option>
                <option value="Company">
                  Sort: Company A–Z
                </option>
              </select>
              {' '}
            </div>
            {' '}
            {v.skeleton}
            <div data-list="1" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {' '}
              {(v.pageJobs || []).map((j, i0) => (
                <Fragment key={j?.id ?? i0}>
                  {' '}
                  <article onClick={j.onOpen} style={{ cursor: "pointer", position: "relative", background: "var(--c-paper)", border: "1.5px solid var(--c-line)", borderRadius: "14px", padding: "24px", display: "flex", gap: "20px", alignItems: "flex-start", flexWrap: "wrap", transition: "transform .25s cubic-bezier(.34,1.56,.64,1),box-shadow .25s,border-color .25s" }} className="dh18">
                    {' '}
                    <div style={{ width: "48px", height: "48px", flexShrink: "0", borderRadius: "12px", background: j.avBg, color: j.avFg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "600", fontSize: "15px" }}>
                      {j.initials}
                    </div>
                    {' '}
                    <div style={{ flex: "1 1 260px", minWidth: "0", display: "flex", flexDirection: "column", gap: "10px" }}>
                      {' '}
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", fontSize: "14px", color: "var(--c-text3)" }}>
                        {' '}
                        <button onClick={j.onCompany} style={{ background: "none", border: "none", padding: "0", fontSize: "14px", color: "var(--c-text3)", cursor: "pointer", textDecoration: "underline", textDecorationColor: "transparent", textUnderlineOffset: "3px", transition: "all .15s" }} className="dh19">
                          {j.company}
                        </button>
                        {' '}
                        {j.via ? (
                          <>
                            <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px", color: "var(--c-accent-text)" }}>
                              via {j.via}
                            </span>
                          </>
                        ) : null}
                        {' '}
                        <span style={{ color: "var(--c-faint)" }}>
                          ·
                        </span>
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
                      <h3 style={{ margin: "0", fontSize: "19px", lineHeight: "1.3", letterSpacing: "-0.015em", fontWeight: "600" }}>
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
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px", marginLeft: "auto" }}>
                      {' '}
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        {' '}
                        {j.applied ? (
                          <>
                            <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "11px", padding: "4px 8px", borderRadius: "6px", background: "rgba(15,110,86,0.1)", color: "var(--c-green)" }}>
                              ✓ Applied
                            </span>
                          </>
                        ) : null}
                        {' '}
                        <button onClick={j.onSave} aria-label="Save job" style={{ width: "36px", height: "36px", borderRadius: "10px", border: `1px solid ${j.saveBorder}`, background: j.saveBg, color: j.saveFg, cursor: "pointer", fontSize: "16px" }}>
                          {j.saveIcon}
                        </button>
                        {' '}
                      </div>
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
                  </article>
                  {' '}
                </Fragment>
              ))}
              {' '}
            </div>
            {' '}
            {v.noResults ? (
              <>
                {' '}
                <div style={{ borderRadius: "14px", border: "1.5px dashed var(--c-line2)", padding: "40px 24px 56px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                  {' '}
                  <img data-float="0.04" src="/assets/empty-search.jpg" alt="" style={{ width: "180px", height: "180px", objectFit: "cover", borderRadius: "14px", marginBottom: "12px" }}/>
                  {' '}
                  <span style={{ fontSize: "17px", fontWeight: "500" }}>
                    No jobs match your search.
                  </span>
                  {' '}
                  <span style={{ fontSize: "14px", color: "var(--c-text3)" }}>
                    Try fewer filters or a broader keyword.
                  </span>
                  {' '}
                  <button onClick={v.clearAll} style={{ marginTop: "12px", padding: "11px 20px", borderRadius: "10px", border: "none", background: "#5B4FF5", color: "#FFFEFB", fontFamily: "'Geist Mono',monospace", fontSize: "12px", cursor: "pointer" }}>
                    Clear search & filters
                  </button>
                  {' '}
                </div>
                {' '}
              </>
            ) : null}
            {' '}
            {v.showPager ? (
              <>
                {' '}
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "6px", paddingTop: "24px" }}>
                  {' '}
                  <button onClick={v.prevPage} disabled={v.atFirst} style={{ height: "40px", padding: "0 14px", borderRadius: "10px", border: "1px solid var(--c-line2)", background: "var(--c-paper)", color: "var(--c-ink)", fontSize: "14px", cursor: "pointer", opacity: v.prevOpacity }}>
                    ← Prev
                  </button>
                  {' '}
                  {(v.pages || []).map((p, i0) => (
                    <Fragment key={p?.id ?? i0}>
                      {' '}
                      <button onClick={p.onClick} style={{ width: "40px", height: "40px", borderRadius: "10px", border: `1px solid ${p.border}`, background: p.bg, color: p.fg, fontFamily: "'Geist Mono',monospace", fontSize: "13px", cursor: "pointer", boxShadow: p.shadow, transition: "all .15s" }}>
                        {p.n}
                      </button>
                      {' '}
                    </Fragment>
                  ))}
                  {' '}
                  <button onClick={v.nextPage} disabled={v.atLast} style={{ height: "40px", padding: "0 14px", borderRadius: "10px", border: "1px solid var(--c-line2)", background: "var(--c-paper)", color: "var(--c-ink)", fontSize: "14px", cursor: "pointer", opacity: v.nextOpacity }}>
                    Next →
                  </button>
                  {' '}
                </div>
                {' '}
              </>
            ) : null}
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
