// Ported from the Claude Design mockup. Presentational only: all data and
// actions come in through `v` (built in src/App.jsx).
import { Fragment } from 'react';

export default function DashboardPage({ v }) {
  return (
    <>
      {' '}
      <div data-screen-label="09 Employer dashboard" style={{ maxWidth: "1200px", margin: "0 auto", padding: "56px 32px 112px", display: "flex", flexDirection: "column", gap: "32px" }}>
        {' '}
        <div data-rise="0" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "24px", flexWrap: "wrap" }}>
          {' '}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {' '}
            <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px", color: "var(--c-accent-text)", letterSpacing: "0.08em" }}>
              / EMPLOYER DASHBOARD
            </span>
            {' '}
            <h1 style={{ margin: "0", fontSize: "48px", letterSpacing: "-0.035em", fontWeight: "600" }}>
              Your listings
            </h1>
            {' '}
          </div>
          {' '}
          <div style={{ position: "relative" }}>
            {' '}
            <div aria-hidden="true" style={{ position: "absolute", inset: "0", borderRadius: "12px", background: "var(--c-ink)", transform: "translate(4px,4px)" }}/>
            {' '}
            <button onClick={v.goPost} style={{ position: "relative", padding: "13px 22px", borderRadius: "12px", border: "1.5px solid var(--c-ink)", background: "#5B4FF5", color: "#FFFEFB", fontSize: "15px", fontWeight: "600", cursor: "pointer", transition: "transform .15s" }} className="dh51 dh52">
              + Post a role
            </button>
            {' '}
          </div>
          {' '}
        </div>
        {' '}
        {v.dashMsg ? (
          <>
            {' '}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", fontSize: "14px", color: "var(--c-green)", background: "rgba(15,110,86,0.08)", border: "1px solid rgba(15,110,86,0.3)", borderRadius: "10px", padding: "12px 16px" }}>
              {' '}
              <span>
                {v.dashMsg}
              </span>
              {' '}
              <button onClick={v.dismissDashMsg} aria-label="Dismiss" style={{ background: "none", border: "none", padding: "0", fontSize: "16px", color: "var(--c-green)", cursor: "pointer" }}>
                ×
              </button>
              {' '}
            </div>
            {' '}
          </>
        ) : null}
        {' '}
        <div data-rise="1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,180px),1fr))", gap: "16px" }}>
          {' '}
          {(v.dashStats || []).map((st, i0) => (
            <Fragment key={st?.id ?? i0}>
              {' '}
              <div style={{ padding: "20px 24px", borderRadius: "14px", background: st.bg, color: st.fg, border: st.border, boxShadow: st.shadow, display: "flex", flexDirection: "column", gap: "4px" }}>
                {' '}
                <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "32px", fontWeight: "500", letterSpacing: "-0.02em" }}>
                  {st.n}
                </span>
                {' '}
                <span style={{ fontSize: "14px", color: st.sub }}>
                  {st.label}
                </span>
                {' '}
              </div>
              {' '}
            </Fragment>
          ))}
          {' '}
        </div>
        {' '}
        {v.dashEmpty ? (
          <>
            {' '}
            <div style={{ borderRadius: "14px", border: "1.5px dashed var(--c-line2)", padding: "40px 24px 64px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              {' '}
              <img data-float="0.04" src="/assets/dash-empty.jpg" alt="" style={{ width: "180px", height: "180px", objectFit: "cover", borderRadius: "14px", marginBottom: "12px" }}/>
              {' '}
              <span style={{ fontSize: "17px", fontWeight: "500" }}>
                You haven’t posted any roles yet.
              </span>
              {' '}
              <span style={{ fontSize: "14px", color: "var(--c-text3)" }}>
                Post one and applicants will show up here.
              </span>
              {' '}
              <button onClick={v.goPost} style={{ marginTop: "12px", padding: "11px 20px", borderRadius: "10px", border: "none", background: "#5B4FF5", color: "#FFFEFB", fontFamily: "'Geist Mono',monospace", fontSize: "12px", cursor: "pointer" }}>
                Post a role →
              </button>
              {' '}
            </div>
            {' '}
          </>
        ) : null}
        {' '}
        {v.dashHas ? (
          <>
            {' '}
            <div style={{ display: "flex", gap: "32px", alignItems: "flex-start", flexWrap: "wrap" }}>
              {' '}
              <div data-list="1" style={{ flex: "0 1 380px", minWidth: "280px", display: "flex", flexDirection: "column", gap: "14px" }}>
                {' '}
                {(v.myListings || []).map((j, i0) => (
                  <Fragment key={j?.id ?? i0}>
                    {' '}
                    <article onClick={j.onSelect} style={{ cursor: "pointer", background: "var(--c-paper)", border: `1.5px solid ${j.selBorder}`, borderRadius: "14px", padding: "22px", display: "flex", flexDirection: "column", gap: "14px", boxShadow: j.selShadow, transform: j.selShift, transition: "all .25s cubic-bezier(.34,1.56,.64,1)" }} className="dh53">
                      {' '}
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        {' '}
                        <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px", color: "var(--c-muted)" }}>
                          {j.type} · {j.posted}
                        </span>
                        {' '}
                        <h3 style={{ margin: "0", fontSize: "18px", fontWeight: "600", letterSpacing: "-0.015em", lineHeight: "1.3" }}>
                          {j.title}
                        </h3>
                        {' '}
                      </div>
                      {' '}
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        {' '}
                        <span style={{ fontSize: "14px", color: "var(--c-text2)" }}>
                          <span style={{ fontFamily: "'Geist Mono',monospace" }}>
                            {j.appCount}
                          </span>
                        </span>
                        {' '}
                        {j.hasNew ? (
                          <>
                            <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "11px", padding: "2px 7px", borderRadius: "5px", background: "#D2F53B", color: "#18181B" }}>
                              {j.newCount} NEW
                            </span>
                          </>
                        ) : null}
                        {' '}
                      </div>
                      {' '}
                      <div style={{ display: "flex", gap: "6px", paddingTop: "14px", borderTop: "1px solid var(--c-sunk2)" }}>
                        {' '}
                        <button onClick={j.onView} style={{ padding: "7px 12px", borderRadius: "8px", border: "1px solid var(--c-line)", background: "transparent", color: "var(--c-text2)", fontSize: "13px", cursor: "pointer" }} className="dh54">
                          View
                        </button>
                        {' '}
                        <button onClick={j.onEdit} style={{ padding: "7px 12px", borderRadius: "8px", border: "1px solid var(--c-line)", background: "transparent", color: "var(--c-text2)", fontSize: "13px", cursor: "pointer" }} className="dh55">
                          Edit
                        </button>
                        {' '}
                        <button onClick={j.onDelete} style={{ marginLeft: "auto", padding: "7px 12px", borderRadius: "8px", border: "1px solid transparent", background: "transparent", color: "var(--c-red)", fontSize: "13px", cursor: "pointer" }} className="dh56">
                          Delete
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
              <section data-rise="2" style={{ flex: "1 1 520px", minWidth: "0", background: "var(--c-paper)", border: "1px solid var(--c-line)", borderRadius: "14px", padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>
                {' '}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
                  {' '}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {' '}
                    <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "11px", color: "var(--c-muted)", letterSpacing: "0.08em" }}>
                      APPLICANTS · {v.selCount}
                    </span>
                    {' '}
                    <h2 style={{ margin: "0", fontSize: "22px", fontWeight: "600", letterSpacing: "-0.02em" }}>
                      {v.selTitle}
                    </h2>
                    {' '}
                    <span style={{ fontSize: "14px", color: "var(--c-text3)" }}>
                      {v.selMeta}
                    </span>
                    {' '}
                  </div>
                  {' '}
                </div>
                {' '}
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {' '}
                  {(v.appFilters || []).map((o, i0) => (
                    <Fragment key={o?.id ?? i0}>
                      {' '}
                      <button onClick={o.onClick} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 13px", borderRadius: "999px", border: `1px solid ${o.border}`, background: o.bg, color: o.fg, fontSize: "13px", fontWeight: "500", cursor: "pointer", transition: "all .15s" }}>
                        {o.label}{' '}
                        <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "11px", opacity: ".75" }}>
                          {o.n}
                        </span>
                      </button>
                      {' '}
                    </Fragment>
                  ))}
                  {' '}
                </div>
                {' '}
                <div data-apps="1" style={{ display: "flex", flexDirection: "column" }}>
                  {' '}
                  {(v.apps || []).map((a, i0) => (
                    <Fragment key={a?.id ?? i0}>
                      {' '}
                      <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap", padding: "18px 0", borderTop: "1px solid var(--c-sunk2)", opacity: a.rowOpacity, transition: "opacity .2s" }}>
                        {' '}
                        <div style={{ width: "44px", height: "44px", flexShrink: "0", borderRadius: "50%", background: "var(--c-sunk)", color: "var(--c-text2)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "600", fontSize: "14px" }}>
                          {a.initials}
                        </div>
                        {' '}
                        <div style={{ flex: "1 1 220px", minWidth: "0", display: "flex", flexDirection: "column", gap: "6px" }}>
                          {' '}
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                            {' '}
                            <span style={{ fontSize: "15px", fontWeight: "600" }}>
                              {a.name}
                            </span>
                            {' '}
                            <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "11px", padding: "2px 7px", borderRadius: "5px", background: a.stBg, color: a.stFg }}>
                              {a.status}
                            </span>
                            {' '}
                          </div>
                          {' '}
                          <span style={{ fontSize: "14px", color: "var(--c-text3)" }}>
                            {a.headline}
                          </span>
                          {' '}
                          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                            {' '}
                            {(a.skills || []).map((t, i1) => (
                              <Fragment key={t?.id ?? i1}>
                                {' '}
                                <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "11px", padding: "3px 8px", borderRadius: "5px", background: "var(--c-sunk)", color: "var(--c-text2)" }}>
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
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px", minWidth: "72px" }}>
                          {' '}
                          <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "18px", fontWeight: "500", color: a.matchColor }}>
                            {a.matchLabel}
                          </span>
                          {' '}
                          <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "11px", color: "var(--c-muted)" }}>
                            match · {a.when}
                          </span>
                          {' '}
                        </div>
                        {' '}
                        <div style={{ display: "flex", gap: "6px" }}>
                          {' '}
                          <button onClick={a.onShort} style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #5B4FF5", background: a.shortBg, color: a.shortFg, fontSize: "13px", fontWeight: "500", cursor: "pointer", transition: "all .15s" }}>
                            {a.shortLabel}
                          </button>
                          {' '}
                          <button onClick={a.onRej} style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--c-line)", background: "transparent", color: "var(--c-text3)", fontSize: "13px", cursor: "pointer" }} className="dh57">
                            {a.rejLabel}
                          </button>
                          {' '}
                        </div>
                        {' '}
                      </div>
                      {' '}
                    </Fragment>
                  ))}
                  {' '}
                </div>
                {' '}
                {v.appsEmpty ? (
                  <>
                    {' '}
                    <div style={{ padding: "40px 16px", textAlign: "center", fontSize: "14px", color: "var(--c-text3)", borderTop: "1px solid var(--c-sunk2)" }}>
                      {v.appsEmptyText}
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
        ) : null}
        {' '}
      </div>
      {' '}
    </>
  );
}
