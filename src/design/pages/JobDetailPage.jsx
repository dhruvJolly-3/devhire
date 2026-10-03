// Ported from the Claude Design mockup. Presentational only: all data and
// actions come in through `v` (built in src/App.jsx).
import { Fragment } from 'react';

export default function JobDetailPage({ v }) {
  return (
    <>
      {' '}
      <div data-screen-label="04 Job detail" style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 32px 112px" }}>
        {' '}
        <button onClick={v.goHome} style={{ background: "none", border: "none", padding: "0", marginBottom: "32px", fontFamily: "'Geist Mono',monospace", fontSize: "13px", color: "var(--c-muted)", cursor: "pointer" }} className="dh20">
          ← all jobs
        </button>
        {' '}
        <div style={{ display: "flex", gap: "48px", alignItems: "flex-start", flexWrap: "wrap" }}>
          {' '}
          <div style={{ flex: "1 1 560px", minWidth: "0", display: "flex", flexDirection: "column", gap: "40px" }}>
            {' '}
            <div data-rise="0" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {' '}
              <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
                {' '}
                <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: v.dj.avBg, color: v.dj.avFg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "600", fontSize: "18px", border: "1.5px solid var(--c-ink)", boxShadow: "3px 3px 0 0 var(--c-ink)" }}>
                  {v.dj.initials}
                </div>
                {' '}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", fontSize: "15px", color: "var(--c-text3)" }}>
                  {' '}
                  <button onClick={v.dj.onCompany} style={{ background: "none", border: "none", padding: "0", fontSize: "15px", fontWeight: "500", color: "var(--c-ink)", cursor: "pointer", textDecoration: "underline", textDecorationColor: "var(--c-line2)", textUnderlineOffset: "3px" }} className="dh21">
                    {v.dj.company}
                  </button>
                  {' '}
                  {v.dj.via ? (
                    <>
                      <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px", color: "var(--c-accent-text)" }}>
                        via {v.dj.via}
                      </span>
                    </>
                  ) : null}
                  {' '}
                  <span style={{ color: "var(--c-faint)" }}>
                    ·
                  </span>
                  <span>
                    {v.dj.location}
                  </span>
                  {' '}
                  <span style={{ color: "var(--c-faint)" }}>
                    ·
                  </span>
                  <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "14px" }}>
                    {v.dj.salary}
                  </span>
                  {' '}
                </div>
                {' '}
              </div>
              {' '}
              <h1 style={{ margin: "0", fontSize: "clamp(32px,4vw,44px)", letterSpacing: "-0.035em", fontWeight: "600", lineHeight: "1.1", textWrap: "balance" }}>
                {v.dj.title}
              </h1>
              {' '}
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {' '}
                <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px", padding: "5px 10px", borderRadius: "6px", background: "#D2F53B", color: "#18181B" }}>
                  {v.dj.type}
                </span>
                {' '}
                <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px", padding: "5px 10px", borderRadius: "6px", background: "var(--c-sunk)", color: "var(--c-text2)" }}>
                  {v.dj.exp}
                </span>
                {' '}
                <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px", padding: "5px 10px", borderRadius: "6px", background: "var(--c-sunk)", color: "var(--c-text2)" }}>
                  Posted {v.dj.posted}
                </span>
                {' '}
              </div>
              {' '}
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", paddingTop: "4px" }}>
                {' '}
                <div style={{ position: "relative" }}>
                  {' '}
                  <div aria-hidden="true" style={{ position: "absolute", inset: "0", borderRadius: "12px", background: "var(--c-ink)", transform: "translate(4px,4px)" }}/>
                  {' '}
                  <button onClick={v.applyJob} style={{ position: "relative", height: "48px", padding: "0 24px", borderRadius: "12px", border: "1.5px solid var(--c-ink)", background: v.applyBg, color: "#FFFEFB", fontSize: "15px", fontWeight: "600", cursor: "pointer", transition: "transform .15s" }} className="dh22 dh23">
                    {v.applyLabel}
                  </button>
                  {' '}
                </div>
                {' '}
                <button onClick={v.dj.onSave} style={{ height: "48px", padding: "0 20px", borderRadius: "12px", border: `1px solid ${v.dj.saveBorder}`, background: v.dj.saveBg, color: v.dj.saveFg, fontSize: "15px", fontWeight: "500", cursor: "pointer", transition: "all .15s" }}>
                  {v.dj.saveLong}
                </button>
                {' '}
              </div>
              {' '}
            </div>
            {' '}
            <div style={{ height: "1px", background: "var(--c-line)" }}/>
            {' '}
            <div data-rise="1" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {' '}
              <h2 style={{ margin: "0", fontSize: "22px", fontWeight: "600", letterSpacing: "-0.02em" }}>
                About the role
              </h2>
              {' '}
              {(v.dj.about || []).map((para, i0) => (
                <Fragment key={para?.id ?? i0}>
                  {' '}
                  <p style={{ margin: "0", fontSize: "16px", lineHeight: "1.75", color: "var(--c-text2)", maxWidth: "680px", textWrap: "pretty" }}>
                    {para}
                  </p>
                  {' '}
                </Fragment>
              ))}
              {' '}
            </div>
            {' '}
            {v.dj.hasDuties ? (
            <>
            <div data-rise="2" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {' '}
              <h2 style={{ margin: "0", fontSize: "22px", fontWeight: "600", letterSpacing: "-0.02em" }}>
                What you’ll do
              </h2>
              {' '}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {' '}
                {(v.dj.duties || []).map((d, i0) => (
                  <Fragment key={d?.id ?? i0}>
                    {' '}
                    <div style={{ display: "flex", gap: "12px", fontSize: "16px", lineHeight: "1.6", color: "var(--c-text2)" }}>
                      <span style={{ flexShrink: "0", marginTop: "9px", width: "8px", height: "8px", borderRadius: "2px", background: "#5B4FF5", transform: "rotate(45deg)" }}/>
                      <span>
                        {d}
                      </span>
                    </div>
                    {' '}
                  </Fragment>
                ))}
                {' '}
              </div>
              {' '}
            </div>
            {' '}
            </>
            ) : null}
            <div data-rise="3" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {' '}
              <h2 style={{ margin: "0", fontSize: "22px", fontWeight: "600", letterSpacing: "-0.02em" }}>
                Skills
              </h2>
              {' '}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {' '}
                {(v.dj.tags || []).map((t, i0) => (
                  <Fragment key={t?.id ?? i0}>
                    {' '}
                    <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "13px", padding: "7px 14px", borderRadius: "8px", background: "var(--c-sunk)", color: "var(--c-text2)" }}>
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
            {v.showAi ? (
            <div data-rise="4" style={{ position: "relative" }}>
              {' '}
              <div aria-hidden="true" style={{ position: "absolute", inset: "0", borderRadius: "14px", background: "#D2F53B", transform: "translate(8px,8px)", border: "1.5px solid var(--c-ink)" }}/>
              {' '}
              <div style={{ position: "relative", background: "var(--c-paper)", border: "1.5px solid var(--c-ink)", borderRadius: "14px", padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
                {' '}
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  {' '}
                  <img src="/assets/ai-panel.jpg" alt="" style={{ width: "84px", height: "84px", flexShrink: "0", objectFit: "cover", borderRadius: "14px", border: "1.5px solid var(--c-ink)" }}/>
                  {' '}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {' '}
                    <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px", color: "var(--c-accent-text)", letterSpacing: "0.08em" }}>
                      ✦ AI ASSISTANT
                    </span>
                    {' '}
                    <h2 style={{ margin: "0", fontSize: "24px", fontWeight: "600", letterSpacing: "-0.02em" }}>
                      How well do you fit — and what to say
                    </h2>
                    {' '}
                  </div>
                  {' '}
                </div>
                {' '}
                {v.aiNeedsAuth ? (
                  <>
                    {' '}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap", padding: "20px", borderRadius: "12px", background: "var(--c-bg)", border: "1px dashed var(--c-line2)" }}>
                      {' '}
                      <span style={{ fontSize: "15px", color: "var(--c-text2)" }}>
                        Sign in to get a match score and a tailored cover letter.
                      </span>
                      {' '}
                      <button onClick={v.signInForJob} style={{ padding: "11px 18px", borderRadius: "10px", border: "none", background: "#5B4FF5", color: "#FFFEFB", fontSize: "14px", fontWeight: "500", cursor: "pointer" }}>
                        Sign in →
                      </button>
                      {' '}
                    </div>
                    {' '}
                  </>
                ) : null}
                {' '}
                {v.aiNeedsResume ? (
                  <>
                    {' '}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap", padding: "20px", borderRadius: "12px", background: "var(--c-bg)", border: "1px dashed var(--c-line2)" }}>
                      {' '}
                      <span style={{ fontSize: "15px", color: "var(--c-text2)" }}>
                        Add your resume first — the assistant reads it for every job.
                      </span>
                      {' '}
                      <button onClick={v.goProfile} style={{ padding: "11px 18px", borderRadius: "10px", border: "1px solid #5B4FF5", background: "transparent", color: "var(--c-accent-text)", fontSize: "14px", fontWeight: "500", cursor: "pointer" }}>
                        Add resume →
                      </button>
                      {' '}
                    </div>
                    {' '}
                  </>
                ) : null}
                {' '}
                {v.aiReady ? (
                  <>
                    {' '}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,260px),1fr))", gap: "20px" }}>
                      {' '}
                      <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "24px", borderRadius: "12px", background: "var(--c-bg)", border: "1px solid var(--c-line)" }}>
                        {' '}
                        <span style={{ fontSize: "15px", fontWeight: "600" }}>
                          Match score
                        </span>
                        {' '}
                        {v.noMatch ? (
                          <>
                            {' '}
                            <span style={{ fontSize: "14px", color: "var(--c-text3)", lineHeight: "1.55" }}>
                              Compare your resume with this job description.
                            </span>
                            {' '}
                            <button onClick={v.runMatch} style={{ alignSelf: "flex-start", padding: "11px 18px", borderRadius: "10px", border: "none", background: "var(--c-ink)", color: "var(--c-paper)", fontSize: "14px", fontWeight: "500", cursor: "pointer" }} className="dh24">
                              {v.matchBtn}
                            </button>
                            {' '}
                          </>
                        ) : null}
                        {' '}
                        {v.hasMatch ? (
                          <>
                            {' '}
                            <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
                              {' '}{v.ring}{' '}
                              <span style={{ fontSize: "14px", color: "var(--c-text2)", lineHeight: "1.5" }}>
                                {v.matchVerdict}
                              </span>
                              {' '}
                            </div>
                            {' '}
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                              {' '}
                              <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "11px", color: "var(--c-green)", letterSpacing: "0.08em" }}>
                                STRENGTHS
                              </span>
                              {' '}
                              {(v.strengths || []).map((s, i0) => (
                                <Fragment key={s?.id ?? i0}>
                                  <span style={{ fontSize: "14px", color: "var(--c-text2)" }}>
                                    + {s}
                                  </span>
                                </Fragment>
                              ))}
                              {' '}
                            </div>
                            {' '}
                            {v.hasGaps ? (
                              <>
                                {' '}
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                  {' '}
                                  <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "11px", color: "var(--c-amber)", letterSpacing: "0.08em" }}>
                                    GAPS
                                  </span>
                                  {' '}
                                  {(v.gaps || []).map((g, i0) => (
                                    <Fragment key={g?.id ?? i0}>
                                      <span style={{ fontSize: "14px", color: "var(--c-text2)" }}>
                                        – {g}
                                      </span>
                                    </Fragment>
                                  ))}
                                  {' '}
                                </div>
                                {' '}
                              </>
                            ) : null}
                            {' '}
                          </>
                        ) : null}
                        {' '}
                      </div>
                      {' '}
                      <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "24px", borderRadius: "12px", background: "var(--c-bg)", border: "1px solid var(--c-line)" }}>
                        {' '}
                        <span style={{ fontSize: "15px", fontWeight: "600" }}>
                          Cover letter
                        </span>
                        {' '}
                        {v.noLetter ? (
                          <>
                            {' '}
                            <span style={{ fontSize: "14px", color: "var(--c-text3)", lineHeight: "1.55" }}>
                              Written from your resume for {v.dj.company}. Edit it before you send.
                            </span>
                            {' '}
                          </>
                        ) : null}
                        {' '}
                        {v.letterBusy ? (
                          <>
                            {' '}
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              {v.spinner}
                              <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px", color: "var(--c-text3)" }}>
                                Reading the role…
                              </span>
                            </div>
                            {' '}
                          </>
                        ) : null}
                        {' '}
                        {v.hasLetter ? (
                          <>
                            {' '}{v.letterBox}{' '}
                          </>
                        ) : null}
                        {' '}
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          {' '}
                          <button onClick={v.genLetter} disabled={v.letterBusy} style={{ padding: "11px 18px", borderRadius: "10px", border: "none", background: "#5B4FF5", color: "#FFFEFB", fontSize: "14px", fontWeight: "500", cursor: "pointer" }} className="dh25">
                            {v.letterBtn}
                          </button>
                          {' '}
                          {v.hasLetter ? (
                            <>
                              {' '}
                              <button onClick={v.copyLetter} style={{ padding: "11px 16px", borderRadius: "10px", border: "1px solid var(--c-line2)", background: "transparent", color: "var(--c-ink)", fontSize: "14px", cursor: "pointer" }}>
                                {v.copyLabel}
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
                  </>
                ) : null}
                {' '}
              </div>
              {' '}
            </div>
            ) : null}
            {' '}
          </div>
          {' '}
          <aside data-rise="1" style={{ flex: "0 1 300px", minWidth: "260px", position: "sticky", top: "96px" }}>
            {' '}
            <div style={{ background: "var(--c-paper)", border: "1px solid var(--c-line)", borderRadius: "14px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
              {' '}
              <img data-float="0.04" src="/assets/detail-apply.jpg" alt="" style={{ width: "100%", aspectRatio: "16/10", objectFit: "cover", objectPosition: "50% 55%", borderRadius: "10px", display: "block" }}/>
              {' '}
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                {' '}
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: v.dj.avBg, color: v.dj.avFg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "600", fontSize: "14px" }}>
                  {v.dj.initials}
                </div>
                {' '}
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  {' '}
                  <button onClick={v.dj.onCompany} style={{ background: "none", border: "none", padding: "0", textAlign: "left", fontSize: "15px", fontWeight: "600", color: "var(--c-ink)", cursor: "pointer" }} className="dh26">
                    {v.dj.company} →
                  </button>
                  {' '}
                  <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px", color: "var(--c-muted)" }}>
                    {v.dj.city} · {v.dj.posted}
                  </span>
                  {' '}
                </div>
                {' '}
              </div>
              {' '}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "16px 0", borderTop: "1px solid var(--c-sunk2)", borderBottom: "1px solid var(--c-sunk2)", fontSize: "14px" }}>
                {' '}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--c-muted)" }}>
                    Salary
                  </span>
                  <span style={{ fontFamily: "'Geist Mono',monospace" }}>
                    {v.dj.salary}
                  </span>
                </div>
                {' '}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--c-muted)" }}>
                    Experience
                  </span>
                  <span style={{ fontFamily: "'Geist Mono',monospace" }}>
                    {v.dj.exp}
                  </span>
                </div>
                {' '}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--c-muted)" }}>
                    Work type
                  </span>
                  <span>
                    {v.dj.type}
                  </span>
                </div>
                {' '}
              </div>
              {' '}
              <button onClick={v.applyJob} style={{ height: "46px", borderRadius: "12px", border: "none", background: v.applyBg, color: "#FFFEFB", fontSize: "14px", fontWeight: "600", cursor: "pointer" }} className="dh27">
                {v.applyLabel}
              </button>
              {' '}
              <div style={{ display: "flex", gap: "8px" }}>
                {' '}
                <button onClick={v.dj.onSave} style={{ flex: "1", height: "38px", borderRadius: "10px", border: `1px solid ${v.dj.saveBorder}`, background: v.dj.saveBg, color: v.dj.saveFg, fontFamily: "'Geist Mono',monospace", fontSize: "12px", cursor: "pointer" }}>
                  {v.dj.saveShort}
                </button>
                {' '}
                <button onClick={v.share} style={{ flex: "1", height: "38px", borderRadius: "10px", border: "1px solid var(--c-line)", background: "transparent", color: "var(--c-text3)", fontFamily: "'Geist Mono',monospace", fontSize: "12px", cursor: "pointer" }} className="dh28">
                  {v.shareLabel}
                </button>
                {' '}
              </div>
              {' '}
            </div>
            {' '}
          </aside>
          {' '}
        </div>
        {' '}
      </div>
      {' '}
    </>
  );
}
