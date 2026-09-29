// Ported from the Claude Design mockup. Presentational only: all data and
// actions come in through `v` (built in src/App.jsx).
import { Fragment } from 'react';

// `inputRef` is passed separately: a ref inside `v` would make React treat all of `v` as a ref.
export default function ProfilePage({ v, inputRef }) {
  return (
    <>
      {' '}
      <form data-screen-label="06 Profile" onSubmit={v.saveProfile} style={{ maxWidth: "860px", margin: "0 auto", padding: "40px 32px 112px", display: "flex", flexDirection: "column", gap: "24px" }}>
        {' '}
        <div data-rise="0" aria-hidden="true" style={{ position: "relative", height: "200px", borderRadius: "14px", border: "1.5px solid #18181B", overflow: "hidden", background: "#F1E6D2" }}>
          {' '}
          <div data-parallax="0.15" style={{ position: "absolute", inset: "-20% 0", background: "url(\"/assets/profile-banner.jpg\") 80% 60%/cover no-repeat", willChange: "transform" }}/>
          {' '}
        </div>
        {' '}
        <div data-rise="0" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "24px", flexWrap: "wrap" }}>
          {' '}
          <div style={{ flex: "1 1 380px", minWidth: "0", display: "flex", alignItems: "flex-start", gap: "20px" }}>
            {' '}
            <div style={{ position: "relative", width: "88px", height: "88px", flexShrink: "0" }}>
              {' '}
              <div style={{ position: "absolute", inset: "0", borderRadius: "50%", background: "#5B4FF5", transform: "translate(4px,4px)" }}/>
              {' '}
              <div style={{ position: "absolute", inset: "0", borderRadius: "50%", background: "#D2F53B", border: "1.5px solid #18181B", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "34px", fontWeight: "600" }}>
                {v.userInitial}
              </div>
              {' '}
            </div>
            {' '}
            <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "6px" }}>
              {' '}
              <h1 style={{ margin: "0", fontSize: "36px", lineHeight: "1.1", letterSpacing: "-0.035em", fontWeight: "600", overflowWrap: "anywhere" }}>
                {v.pfName}
              </h1>
              {' '}
              {v.pf.headline ? (
                <>
                  <span style={{ fontSize: "16px", color: "#3F3D38", lineHeight: "1.4" }}>
                    {v.pf.headline}
                  </span>
                </>
              ) : null}
              {' '}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", fontSize: "14px", color: "#5C5A55" }}>
                {' '}
                {v.pf.location ? (
                  <>
                    <span>
                      {v.pf.location}
                    </span>
                    <span style={{ color: "#A09D94" }}>
                      ·
                    </span>
                  </>
                ) : null}
                {' '}
                <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "13px", overflowWrap: "anywhere" }}>
                  {v.userEmail}
                </span>
                {' '}
              </div>
              {' '}
            </div>
            {' '}
          </div>
          {' '}
          <div style={{ flex: "0 1 240px", minWidth: "200px", display: "flex", flexDirection: "column", gap: "8px", paddingTop: "6px" }}>
            {' '}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
              <span style={{ color: "#5C5A55" }}>
                Profile strength
              </span>
              <span style={{ fontFamily: "'Geist Mono',monospace", color: "#5B4FF5" }}>
                {v.completeLabel}
              </span>
            </div>
            {' '}
            <div style={{ height: "8px", borderRadius: "99px", background: "#E8E4DA", overflow: "hidden" }}>
              <div style={{ height: "100%", width: v.completeLabel, borderRadius: "99px", background: "linear-gradient(90deg,#5B4FF5,#8B80FF)", transition: "width .6s cubic-bezier(.22,1,.36,1)" }}/>
            </div>
            {' '}
            <span style={{ fontSize: "12px", color: "#75726A" }}>
              {v.nextStep}
            </span>
            {' '}
          </div>
          {' '}
        </div>
        {' '}
        <section data-rise="1" style={{ background: "#FFFEFB", border: "1px solid #E8E4DA", borderRadius: "14px", padding: "32px", display: "flex", flexDirection: "column", gap: "18px" }}>
          {' '}
          <h2 style={{ margin: "0", fontSize: "18px", fontWeight: "600" }}>
            About you
          </h2>
          {' '}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,240px),1fr))", gap: "16px" }}>
            {' '}
            <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px", fontWeight: "500", color: "#3F3D38" }}>
              Full name{' '}
              <input name="name" value={v.pf.name} onChange={v.onPf} style={{ padding: "13px 14px", borderRadius: "10px", border: "1px solid #D5D0C4", background: "#FAF8F3", fontSize: "15px", color: "#18181B", outline: "none", transition: "all .2s" }} className="dh33"/>
              {' '}
            </label>
            {' '}
            <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px", fontWeight: "500", color: "#3F3D38" }}>
              Location{' '}
              <input name="location" value={v.pf.location} onChange={v.onPf} placeholder="Noida, Delhi NCR" style={{ padding: "13px 14px", borderRadius: "10px", border: "1px solid #D5D0C4", background: "#FAF8F3", fontSize: "15px", color: "#18181B", outline: "none", transition: "all .2s" }} className="dh34"/>
              {' '}
            </label>
            {' '}
          </div>
          {' '}
          <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px", fontWeight: "500", color: "#3F3D38" }}>
            Headline{' '}
            <input name="headline" value={v.pf.headline} onChange={v.onPf} placeholder="MERN developer · React, Node.js, MongoDB" style={{ padding: "13px 14px", borderRadius: "10px", border: "1px solid #D5D0C4", background: "#FAF8F3", fontSize: "15px", color: "#18181B", outline: "none", transition: "all .2s" }} className="dh35"/>
            {' '}
          </label>
          {' '}
          <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px", fontWeight: "500", color: "#3F3D38" }}>
            Skills{' '}
            <input name="skills" value={v.pf.skills} onChange={v.onPf} placeholder="React, Node.js, Express, MongoDB" style={{ padding: "13px 14px", borderRadius: "10px", border: "1px solid #D5D0C4", background: "#FAF8F3", fontSize: "15px", color: "#18181B", outline: "none", fontFamily: "'Geist Mono',monospace", transition: "all .2s" }} className="dh36"/>
            {' '}
            <span style={{ fontSize: "12px", fontWeight: "400", color: "#75726A" }}>
              Comma separated.
            </span>
            {' '}
          </label>
          {' '}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {' '}
            {(v.skillChips || []).map((s, i0) => (
              <Fragment key={s?.id ?? i0}>
                {' '}
                <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px", padding: "5px 10px", borderRadius: "6px", background: "#EEEBFF", color: "#4438D9" }}>
                  {s}
                </span>
                {' '}
              </Fragment>
            ))}
            {' '}
          </div>
          {' '}
        </section>
        {' '}
        <section data-rise="2" style={{ background: "#FFFEFB", border: "1px solid #E8E4DA", borderRadius: "14px", padding: "32px", display: "flex", flexDirection: "column", gap: "18px" }}>
          {' '}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {' '}
            <h2 style={{ margin: "0", fontSize: "18px", fontWeight: "600" }}>
              Resume
            </h2>
            {' '}
            <span style={{ fontSize: "14px", color: "#5C5A55" }}>
              The AI assistant reads this for match scores and cover letters.
            </span>
            {' '}
          </div>
          {' '}
          <input ref={inputRef} type="file" accept=".pdf,.txt,application/pdf,text/plain" onChange={v.onUpload} style={{ display: "none" }}/>
          {' '}
          <div onClick={v.pickFile} style={{ cursor: "pointer", position: "relative", borderRadius: "14px", border: `1.5px dashed ${v.dropBorder}`, background: v.dropBg, padding: "28px", display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap", transition: "all .2s" }} className="dh37">
            {' '}
            <img src="/assets/resume-upload.jpg" alt="" style={{ width: "96px", height: "96px", flexShrink: "0", objectFit: "cover", borderRadius: "12px", display: "block" }}/>
            {' '}
            <div style={{ flex: "1", minWidth: "200px", display: "flex", flexDirection: "column", gap: "4px" }}>
              {' '}
              <span style={{ fontSize: "15px", fontWeight: "500" }}>
                {v.fileTitle}
              </span>
              {' '}
              <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px", color: "#75726A" }}>
                {v.fileSub}
              </span>
              {' '}
            </div>
            {' '}
            {v.uploadBusy ? (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {v.spinner}
                  <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px", color: "#5C5A55" }}>
                    Reading PDF…
                  </span>
                </div>
              </>
            ) : null}
            {' '}
            {v.uploadIdle ? (
              <>
                <span style={{ padding: "10px 16px", borderRadius: "10px", border: "1px solid #5B4FF5", color: "#5B4FF5", fontFamily: "'Geist Mono',monospace", fontSize: "13px", fontWeight: "500" }}>
                  {v.uploadBtn}
                </span>
              </>
            ) : null}
            {' '}
          </div>
          {' '}
          <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px", fontWeight: "500", color: "#3F3D38" }}>
            Resume text{' '}
            <textarea name="resumeText" value={v.pf.resumeText} onChange={v.onPf} rows="7" placeholder="…or paste your resume here" style={{ padding: "13px 14px", borderRadius: "10px", border: "1px solid #D5D0C4", background: "#FAF8F3", fontSize: "14px", lineHeight: "1.6", color: "#18181B", outline: "none", resize: "vertical", transition: "all .2s" }} className="dh38"/>
            {' '}
            <span style={{ fontSize: "12px", fontWeight: "400", color: "#75726A" }}>
              PDF uploads fill this in. Edit it before saving.
            </span>
            {' '}
          </label>
          {' '}
        </section>
        {' '}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          {' '}
          <button type="submit" style={{ padding: "14px 26px", borderRadius: "12px", border: "1.5px solid #18181B", background: "#5B4FF5", color: "#FFFEFB", fontSize: "15px", fontWeight: "600", cursor: "pointer", boxShadow: "4px 4px 0 0 #18181B", transition: "all .15s" }} className="dh39 dh40">
            {v.saveProfileLabel}
          </button>
          {' '}
          {v.pfMsg ? (
            <>
              <span role="status" style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px", color: v.pfMsgColor }}>
                {v.pfMsg}
              </span>
            </>
          ) : null}
          {' '}
        </div>
        {' '}
      </form>
      {' '}
    </>
  );
}
