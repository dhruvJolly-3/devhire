// Ported from the Claude Design mockup. Presentational only: all data and
// actions come in through `v` (built in src/App.jsx).
export default function AuthPage({ v }) {
  return (
    <>
      {' '}
      <div data-screen-label="02 Sign in / Register" style={{ position: "relative", overflow: "hidden", minHeight: "calc(100vh - 67px)", display: "flex", alignItems: "center" }}>
        {' '}
        <div aria-hidden="true" style={{ position: "absolute", inset: "0", zIndex: "0", pointerEvents: "none", background: "#F6F1E7 url(\"/assets/auth-bg.jpg\") center/cover no-repeat" }}>
          {v.authVideo}
        </div>
        {' '}
        <div aria-hidden="true" style={{ position: "absolute", inset: "0", zIndex: "0", pointerEvents: "none", background: "rgba(250,248,243,0.25)" }}/>
        {' '}
        <div style={{ position: "relative", zIndex: "1", width: "100%", maxWidth: "1200px", margin: "0 auto", padding: "72px 32px 112px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: "64px", alignItems: "center" }}>
          {' '}
          <div data-rise="0" style={{ display: "flex", flexDirection: "column", gap: "28px", maxWidth: "480px", width: "100%", padding: "40px", borderRadius: "14px", background: "rgba(255,254,251,0.94)", backdropFilter: "blur(16px) saturate(1.2)", WebkitBackdropFilter: "blur(16px) saturate(1.2)", border: "1.5px solid #18181B", boxShadow: "8px 8px 0 0 #18181B" }}>
            {' '}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {' '}
              <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px", color: "#5B4FF5", letterSpacing: "0.08em" }}>
                {v.authEyebrow}
              </span>
              {' '}
              <h1 style={{ margin: "0", fontSize: "44px", letterSpacing: "-0.035em", fontWeight: "600", lineHeight: "1.08" }}>
                {v.authTitle}
              </h1>
              {' '}
              <p style={{ margin: "0", fontSize: "16px", color: "#5C5A55", lineHeight: "1.6" }}>
                {v.authSub}
              </p>
              {' '}
            </div>
            {' '}
            <div style={{ display: "flex", padding: "4px", borderRadius: "12px", background: "#F1EEE5", border: "1px solid #E8E4DA" }}>
              {' '}
              <button onClick={v.setLogin} style={{ flex: "1", padding: "10px", borderRadius: "9px", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: "500", background: v.loginTabBg, color: v.loginTabFg, boxShadow: v.loginTabShadow, transition: "all .2s" }}>
                Sign in
              </button>
              {' '}
              <button onClick={v.setRegister} style={{ flex: "1", padding: "10px", borderRadius: "9px", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: "500", background: v.regTabBg, color: v.regTabFg, boxShadow: v.regTabShadow, transition: "all .2s" }}>
                Create account
              </button>
              {' '}
            </div>
            {' '}
            <form onSubmit={v.submitAuth} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {' '}
              {v.authNotice ? (
                <>
                  {' '}
                  <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px", lineHeight: "1.5", color: "#18181B", background: "rgba(210,245,59,0.35)", border: "1px solid #D2F53B", borderRadius: "10px", padding: "10px 14px" }}>
                    {v.authNotice}
                  </div>
                  {' '}
                </>
              ) : null}
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
                    <input name="name" value={v.authForm.name} onChange={v.onAuthField} placeholder="Your full name" style={{ padding: "13px 14px", borderRadius: "10px", border: "1px solid #D5D0C4", background: "#FFFEFB", fontSize: "15px", color: "#18181B", outline: "none", transition: "all .2s" }} className="dh12"/>
                    {' '}
                  </label>
                  {' '}
                </>
              ) : null}
              {' '}
              <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px", fontWeight: "500", color: "#3F3D38" }}>
                Email{' '}
                <input name="email" type="email" value={v.authForm.email} onChange={v.onAuthField} placeholder="you@example.com" style={{ padding: "13px 14px", borderRadius: "10px", border: "1px solid #D5D0C4", background: "#FFFEFB", fontSize: "15px", color: "#18181B", outline: "none", transition: "all .2s" }} className="dh13"/>
                {' '}
              </label>
              {' '}
              <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px", fontWeight: "500", color: "#3F3D38" }}>
                Password{' '}
                <input name="password" type="password" value={v.authForm.password} onChange={v.onAuthField} placeholder="••••••••" style={{ padding: "13px 14px", borderRadius: "10px", border: "1px solid #D5D0C4", background: "#FFFEFB", fontSize: "15px", color: "#18181B", outline: "none", transition: "all .2s" }} className="dh14"/>
                {' '}
                {v.isRegister ? (
                  <>
                    <span style={{ fontSize: "12px", fontWeight: "400", color: "#75726A" }}>
                      At least 6 characters.
                    </span>
                  </>
                ) : null}
                {' '}
              </label>
              {' '}
              <button type="submit" style={{ marginTop: "6px", padding: "15px", borderRadius: "12px", border: "1.5px solid #18181B", background: "#5B4FF5", color: "#FFFEFB", fontSize: "15px", fontWeight: "600", cursor: "pointer", boxShadow: "4px 4px 0 0 #18181B", transition: "all .15s" }} className="dh15 dh16">
                {v.authCta}
              </button>
              {' '}
            </form>
            {' '}
          </div>
          {' '}
          <div data-rise="1" aria-hidden="true" style={{ position: "relative", minHeight: "420px", pointerEvents: "none" }}>
            {' '}
            <div style={{ position: "absolute", top: "18%", left: "14%", right: "22%", height: "120px", borderRadius: "14px", border: "1.5px dashed #5B4FF5", transform: "rotate(-5deg)" }}/>
            {' '}
            <div style={{ position: "absolute", top: "24%", left: "18%", right: "14%", borderRadius: "14px", background: "#FFFEFB", border: "1.5px solid #18181B", boxShadow: "8px 8px 0 0 #18181B", padding: "22px", display: "flex", flexDirection: "column", gap: "14px", transform: "rotate(2deg)" }}>
              {' '}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: "#EEEBFF", color: "#5B4FF5", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "600", fontSize: "13px" }}>
                  Ze
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "13px", color: "#5C5A55" }}>
                    Zepto
                  </span>
                  <span style={{ fontSize: "16px", fontWeight: "600", color: "#18181B" }}>
                    Senior Frontend Engineer
                  </span>
                </div>
              </div>
              {' '}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px", color: "#5C5A55" }}>
                  Match
                </span>
                <div style={{ flex: "1", height: "6px", borderRadius: "99px", background: "#E8E4DA" }}>
                  <div style={{ width: "88%", height: "100%", borderRadius: "99px", background: "#5B4FF5" }}/>
                </div>
                <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "13px", color: "#5B4FF5" }}>
                  88%
                </span>
              </div>
              {' '}
            </div>
            {' '}
            <div style={{ position: "absolute", bottom: "20%", right: "10%", padding: "10px 14px", borderRadius: "10px", background: "#D2F53B", border: "1.5px solid #18181B", boxShadow: "4px 4px 0 0 #18181B", fontFamily: "'Geist Mono',monospace", fontSize: "12px", color: "#18181B", transform: "rotate(-3deg)" }}>
              ✦ Cover letter ready
            </div>
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
