// Ported from the Claude Design mockup. Presentational only: all data and
// actions come in through `v` (built in src/App.jsx).
import { Fragment } from 'react';

export default function LandingPage({ v }) {
  return (
    <>
      {' '}
      <div data-screen-label="01 Landing">
        {' '}
        <div style={{ position: "relative", overflow: "hidden" }}>
          {' '}
          <div aria-hidden="true" style={{ position: "absolute", inset: "0", zIndex: "0", pointerEvents: "none", background: "#F1E6D2 url(\"/assets/hero.jpg\") center/cover no-repeat" }}>
            {v.heroVideo}
          </div>
          {' '}
          <div aria-hidden="true" style={{ position: "absolute", inset: "0", zIndex: "0", pointerEvents: "none", background: "linear-gradient(90deg,rgba(250,248,243,0.88) 0%,rgba(250,248,243,0.72) 42%,rgba(250,248,243,0.5) 70%,rgba(250,248,243,0.45) 100%)" }}/>
          {' '}
          <header style={{ position: "relative", zIndex: "1", maxWidth: "1200px", margin: "0 auto", padding: "88px 32px 120px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,440px),1fr))", gap: "72px", alignItems: "center" }}>
            {' '}
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              {' '}
              <div data-rise="0" style={{ display: "inline-flex", alignSelf: "flex-start", alignItems: "center", gap: "10px", padding: "7px 14px 7px 12px", borderRadius: "999px", background: "#FFFEFB", border: "1px solid #E8E4DA" }}>
                {' '}{v.liveDot}{' '}
                <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "13px", color: "#3F3D38" }}>
                  {v.liveCount}+ new roles today
                </span>
                {' '}
              </div>
              {' '}
              <h1 data-rise="1" style={{ margin: "0", fontSize: "clamp(40px,5.4vw,64px)", lineHeight: "1.04", letterSpacing: "-0.035em", fontWeight: "600", textWrap: "balance" }}>
                Land your next tech role with instant,{' '}
                <span style={{ position: "relative", display: "inline-block" }}>
                  <span style={{ position: "absolute", inset: "6% -6px 2% -6px", background: "#D2F53B", borderRadius: "10px", transform: "rotate(-1.5deg)" }}/>
                  <span style={{ position: "relative" }}>
                    AI-tailored
                  </span>
                </span>
                {' '}applications
              </h1>
              {' '}
              <p data-rise="2" style={{ margin: "0", fontSize: "19px", lineHeight: "1.6", color: "#5C5A55", maxWidth: "500px", textWrap: "pretty" }}>
                Developer roles at India’s best startups. See how well you match, then send a cover letter written for that exact job.
              </p>
              {' '}
              <div data-rise="3" style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
                {' '}
                <div style={{ position: "relative" }}>
                  {' '}
                  <div style={{ position: "absolute", inset: "0", borderRadius: "12px", background: "#18181B", transform: "translate(5px,5px)" }}/>
                  {' '}
                  <button onClick={v.goHome} style={{ position: "relative", overflow: "hidden", padding: "16px 28px", borderRadius: "12px", border: "1.5px solid #18181B", background: "#5B4FF5", color: "#FFFEFB", fontSize: "16px", fontWeight: "600", cursor: "pointer", transition: "transform .18s cubic-bezier(.34,1.56,.64,1)" }} className="dh0 dh1">
                    {v.shimmer}
                    <span style={{ position: "relative" }}>
                      Browse open roles
                    </span>
                  </button>
                  {' '}
                </div>
                {' '}
                <button onClick={v.goPost} style={{ background: "none", border: "none", padding: "0", fontSize: "15px", color: "#3F3D38", fontWeight: "500", cursor: "pointer" }} className="dh2">
                  Hiring? Post a role →
                </button>
                {' '}
              </div>
              {' '}
            </div>
            {' '}
            <div data-rise="2" style={{ position: "relative", padding: "12px 16px 16px 0" }}>
              {' '}
              <div aria-hidden="true" style={{ position: "absolute", inset: "12px 16px 16px 0", borderRadius: "14px", border: "1.5px dashed #C9C2FB", transform: "rotate(4deg) translate(14px,4px)" }}/>
              {' '}
              <div aria-hidden="true" style={{ position: "absolute", inset: "12px 16px 16px 0", borderRadius: "14px", background: "#5B4FF5", transform: "translate(10px,10px)" }}/>
              {' '}
              {v.signedOut ? (
                <>
                  {' '}
                  <div style={{ position: "relative", background: "#FFFEFB", border: "1.5px solid #18181B", borderRadius: "14px", padding: "36px", display: "flex", flexDirection: "column", gap: "20px" }}>
                    {' '}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {' '}
                      <h2 style={{ margin: "0", fontSize: "26px", letterSpacing: "-0.02em", fontWeight: "600" }}>
                        {v.authTitle}
                      </h2>
                      {' '}
                      <span style={{ fontSize: "15px", color: "#5C5A55", lineHeight: "1.5" }}>
                        {v.authSub}
                      </span>
                      {' '}
                    </div>
                    {' '}
                    <form onSubmit={v.submitAuth} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      {' '}
                      {v.authError ? (
                        <>
                          {' '}
                          <div role="alert" style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px", lineHeight: "1.5", color: "#B42318", background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.3)", borderRadius: "10px", padding: "10px 14px" }}>
                            {v.authError}
                          </div>
                          {' '}
                        </>
                      ) : null}
                      {' '}
                      {v.isRegister ? (
                        <>
                          {' '}
                          <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px", fontWeight: "500", color: "#3F3D38" }}>
                            Name{' '}
                            <input name="name" value={v.authForm.name} onChange={v.onAuthField} placeholder="Your full name" style={{ padding: "13px 14px", borderRadius: "10px", border: "1px solid #D5D0C4", background: "#FAF8F3", fontSize: "15px", color: "#18181B", outline: "none", transition: "all .2s" }} className="dh3"/>
                            {' '}
                          </label>
                          {' '}
                        </>
                      ) : null}
                      {' '}
                      <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px", fontWeight: "500", color: "#3F3D38" }}>
                        Email{' '}
                        <input name="email" type="email" value={v.authForm.email} onChange={v.onAuthField} placeholder="you@example.com" style={{ padding: "13px 14px", borderRadius: "10px", border: "1px solid #D5D0C4", background: "#FAF8F3", fontSize: "15px", color: "#18181B", outline: "none", transition: "all .2s" }} className="dh4"/>
                        {' '}
                      </label>
                      {' '}
                      <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px", fontWeight: "500", color: "#3F3D38" }}>
                        Password{' '}
                        <input name="password" type="password" value={v.authForm.password} onChange={v.onAuthField} placeholder="••••••••" style={{ padding: "13px 14px", borderRadius: "10px", border: "1px solid #D5D0C4", background: "#FAF8F3", fontSize: "15px", color: "#18181B", outline: "none", transition: "all .2s" }} className="dh5"/>
                        {' '}
                      </label>
                      {' '}
                      <button type="submit" style={{ marginTop: "4px", padding: "14px", borderRadius: "12px", border: "none", background: "#5B4FF5", color: "#FFFEFB", fontSize: "15px", fontWeight: "600", cursor: "pointer", transition: "all .2s" }} className="dh6">
                        {v.authCta}
                      </button>
                      {' '}
                      <button type="button" onClick={v.toggleAuthMode} style={{ background: "none", border: "none", padding: "0", fontFamily: "'Geist Mono',monospace", fontSize: "12px", color: "#75726A", cursor: "pointer" }}>
                        {v.authSwitchPre}
                        <span style={{ color: "#5B4FF5" }}>
                          {v.authSwitchLink}
                        </span>
                      </button>
                      {' '}
                    </form>
                    {' '}
                  </div>
                  {' '}
                </>
              ) : null}
              {' '}
              {v.signedIn ? (
                <>
                  {' '}
                  <div style={{ position: "relative", background: "#FFFEFB", border: "1.5px solid #18181B", borderRadius: "14px", padding: "36px", display: "flex", flexDirection: "column", gap: "20px" }}>
                    {' '}
                    <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px", color: "#5B4FF5", letterSpacing: "0.08em" }}>
                      / WELCOME BACK
                    </span>
                    {' '}
                    <h2 style={{ margin: "0", fontSize: "26px", letterSpacing: "-0.02em", fontWeight: "600" }}>
                      Hi {v.userName} — {v.savedCount} saved, {v.appliedCount} applied.
                    </h2>
                    {' '}
                    <button onClick={v.goHome} style={{ alignSelf: "flex-start", padding: "14px 22px", borderRadius: "12px", border: "none", background: "#5B4FF5", color: "#FFFEFB", fontSize: "15px", fontWeight: "600", cursor: "pointer" }} className="dh7">
                      Go to the job board →
                    </button>
                    {' '}
                  </div>
                  {' '}
                </>
              ) : null}
              {' '}
            </div>
            {' '}
          </header>
          {' '}
        </div>
        {' '}
        <div style={{ borderTop: "1px solid #E8E4DA", borderBottom: "1px solid #E8E4DA", padding: "16px 0", overflow: "hidden", background: "#FFFEFB", WebkitMaskImage: "linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent)", maskImage: "linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent)" }}>
          {v.marquee}
        </div>
        {' '}
        <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "96px 32px 0", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gridAutoRows: "minmax(0,auto)", gap: "24px" }}>
          {' '}
          <article data-rise="0" style={{ gridRow: "span 3", position: "relative", overflow: "hidden", borderRadius: "14px", border: "1.5px solid #18181B", background: "#F1E6D2", minHeight: "560px", display: "flex", flexDirection: "column", boxShadow: "8px 8px 0 0 #5B4FF5" }}>
            {' '}
            <div style={{ position: "relative", zIndex: "1", padding: "36px 36px 8px", display: "flex", flexDirection: "column", gap: "14px" }}>
              {' '}
              <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px", color: "#4438D9", letterSpacing: "0.08em" }}>
                / HOW IT WORKS
              </span>
              {' '}
              <h2 style={{ margin: "0", fontSize: "clamp(28px,3vw,36px)", letterSpacing: "-0.03em", fontWeight: "600", lineHeight: "1.1", textWrap: "balance" }}>
                One resume. Every application tailored.
              </h2>
              {' '}
              <p style={{ margin: "0", fontSize: "16px", lineHeight: "1.6", color: "#3F3D38", textWrap: "pretty" }}>
                Upload once. DevHire reads it against every job you open.
              </p>
              {' '}
            </div>
            {' '}
            <div style={{ position: "relative", flex: "1", minHeight: "300px", overflow: "hidden" }}>
              {' '}
              <img data-parallax="0.12" src="/assets/hero.jpg" alt="" style={{ position: "absolute", left: "0", top: "-12%", width: "100%", height: "124%", objectFit: "cover", objectPosition: "80% 50%", display: "block", willChange: "transform" }}/>
              {' '}
            </div>
            {' '}
          </article>
          {' '}
          <article data-rise="1" style={{ display: "flex", flexWrap: "wrap", gap: "16px 20px", alignItems: "center", background: "#FFFEFB", border: "1.5px solid #E8E4DA", borderRadius: "14px", padding: "16px 24px 16px 16px", overflow: "hidden", transition: "transform .25s cubic-bezier(.34,1.56,.64,1),box-shadow .25s,border-color .25s" }} className="dh8">
            {' '}
            <img src="/assets/feature-feed.jpg" alt="" style={{ width: "136px", height: "136px", flexShrink: "0", objectFit: "cover", borderRadius: "10px", display: "block" }}/>
            {' '}
            <div style={{ flex: "1 1 180px", display: "flex", flexDirection: "column", gap: "8px", minWidth: "0" }}>
              {' '}
              <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "11px", color: "#5B4FF5", letterSpacing: "0.08em" }}>
                LIVE FEED
              </span>
              {' '}
              <h3 style={{ margin: "0", fontSize: "19px", fontWeight: "600", letterSpacing: "-0.015em" }}>
                Fresh roles every 30 minutes
              </h3>
              {' '}
              <p style={{ margin: "0", fontSize: "14px", lineHeight: "1.55", color: "#5C5A55" }}>
                Imported from public job APIs and startup career pages, deduplicated.
              </p>
              {' '}
            </div>
            {' '}
          </article>
          {' '}
          <article data-rise="2" style={{ display: "flex", flexWrap: "wrap", gap: "16px 20px", alignItems: "center", background: "#FFFEFB", border: "1.5px solid #E8E4DA", borderRadius: "14px", padding: "16px 24px 16px 16px", overflow: "hidden", transition: "transform .25s cubic-bezier(.34,1.56,.64,1),box-shadow .25s,border-color .25s" }} className="dh9">
            {' '}
            <img src="/assets/feature-match.jpg" alt="" style={{ width: "136px", height: "136px", flexShrink: "0", objectFit: "cover", borderRadius: "10px", display: "block" }}/>
            {' '}
            <div style={{ flex: "1 1 180px", display: "flex", flexDirection: "column", gap: "8px", minWidth: "0" }}>
              {' '}
              <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "11px", color: "#5B4FF5", letterSpacing: "0.08em" }}>
                AI MATCH
              </span>
              {' '}
              <h3 style={{ margin: "0", fontSize: "19px", fontWeight: "600", letterSpacing: "-0.015em" }}>
                Know your fit before you apply
              </h3>
              {' '}
              <p style={{ margin: "0", fontSize: "14px", lineHeight: "1.55", color: "#5C5A55" }}>
                A 0–100 score with the strengths and gaps in your resume.
              </p>
              {' '}
            </div>
            {' '}
          </article>
          {' '}
          <article data-rise="3" style={{ display: "flex", flexWrap: "wrap", gap: "16px 20px", alignItems: "center", background: "#FFFEFB", border: "1.5px solid #E8E4DA", borderRadius: "14px", padding: "16px 24px 16px 16px", overflow: "hidden", transition: "transform .25s cubic-bezier(.34,1.56,.64,1),box-shadow .25s,border-color .25s" }} className="dh10">
            {' '}
            <img src="/assets/feature-letter.jpg" alt="" style={{ width: "136px", height: "136px", flexShrink: "0", objectFit: "cover", borderRadius: "10px", display: "block" }}/>
            {' '}
            <div style={{ flex: "1 1 180px", display: "flex", flexDirection: "column", gap: "8px", minWidth: "0" }}>
              {' '}
              <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "11px", color: "#5B4FF5", letterSpacing: "0.08em" }}>
                COVER LETTERS
              </span>
              {' '}
              <h3 style={{ margin: "0", fontSize: "19px", fontWeight: "600", letterSpacing: "-0.015em" }}>
                Written for that exact job
              </h3>
              {' '}
              <p style={{ margin: "0", fontSize: "14px", lineHeight: "1.55", color: "#5C5A55" }}>
                Drafted from your resume and the job description. Edit, then send.
              </p>
              {' '}
            </div>
            {' '}
          </article>
          {' '}
        </section>
        {' '}
        <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "96px 32px 112px", display: "flex", flexDirection: "column", gap: "32px" }}>
          {' '}
          <div data-rise="0" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "16px", flexWrap: "wrap" }}>
            {' '}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {' '}
              <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px", color: "#5B4FF5", letterSpacing: "0.08em" }}>
                / JUST POSTED
              </span>
              {' '}
              <h2 style={{ margin: "0", fontSize: "36px", letterSpacing: "-0.03em", fontWeight: "600" }}>
                Fresh this week
              </h2>
              {' '}
            </div>
            {' '}
            <button onClick={v.goHome} style={{ background: "none", border: "none", padding: "0", fontSize: "15px", fontWeight: "500", color: "#5B4FF5", cursor: "pointer" }}>
              See all {v.totalJobs} roles →
            </button>
            {' '}
          </div>
          {' '}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,300px),1fr))", gap: "24px" }}>
            {' '}
            {(v.latest || []).map((j, i0) => (
              <Fragment key={j?.id ?? i0}>
                {' '}
                <article data-rise={i0} onClick={j.onOpen} style={{ cursor: "pointer", background: "#FFFEFB", border: "1.5px solid #E8E4DA", borderRadius: "14px", padding: "28px", display: "flex", flexDirection: "column", gap: "18px", transition: "transform .25s cubic-bezier(.34,1.56,.64,1),box-shadow .25s,border-color .25s" }} className="dh11">
                  {' '}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {' '}
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: j.avBg, color: j.avFg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "600", fontSize: "14px" }}>
                      {j.initials}
                    </div>
                    {' '}
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      {' '}
                      <span style={{ fontSize: "14px", color: "#5C5A55" }}>
                        {j.company}
                      </span>
                      {' '}
                      <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px", color: "#75726A" }}>
                        {j.posted}
                      </span>
                      {' '}
                    </div>
                    {' '}
                  </div>
                  {' '}
                  <h3 style={{ margin: "0", fontSize: "19px", lineHeight: "1.3", letterSpacing: "-0.015em", fontWeight: "600" }}>
                    {j.title}
                  </h3>
                  {' '}
                  <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", paddingTop: "16px", borderTop: "1px solid #F0EBE1" }}>
                    {' '}
                    <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "14px", fontWeight: "500" }}>
                      {j.salary}
                    </span>
                    {' '}
                    <span style={{ fontSize: "13px", color: "#75726A" }}>
                      {j.location}
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
        </section>
        {' '}
      </div>
      {' '}
    </>
  );
}
