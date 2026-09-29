// Ported from the Claude Design mockup. Presentational only: all data and
// actions come in through `v` (built in src/App.jsx).
import { Fragment } from 'react';

export default function PostJobPage({ v }) {
  return (
    <>
      {' '}
      <div data-screen-label="07 Post a job" style={{ maxWidth: "1200px", margin: "0 auto", padding: "56px 32px 112px" }}>
        {' '}
        {v.signedOut ? (
          <>
            {' '}
            <div style={{ display: "flex", gap: "56px", alignItems: "center", flexWrap: "wrap" }}>
              {' '}
              <div data-rise="0" style={{ flex: "1 1 400px", maxWidth: "520px", display: "flex", flexDirection: "column", gap: "16px" }}>
                {' '}
                <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px", color: "#5B4FF5", letterSpacing: "0.08em" }}>
                  / FOR HIRING TEAMS
                </span>
                {' '}
                <h1 style={{ margin: "0", fontSize: "48px", letterSpacing: "-0.035em", fontWeight: "600" }}>
                  Post a role
                </h1>
                {' '}
                <p style={{ margin: "0", fontSize: "16px", lineHeight: "1.6", color: "#5C5A55" }}>
                  You need an account before you can post. It takes about twenty seconds.
                </p>
                {' '}
                <button onClick={v.signInForPost} style={{ alignSelf: "flex-start", marginTop: "8px", padding: "14px 24px", borderRadius: "12px", border: "1.5px solid #18181B", background: "#5B4FF5", color: "#FFFEFB", fontSize: "15px", fontWeight: "600", cursor: "pointer", boxShadow: "4px 4px 0 0 #18181B" }}>
                  Sign in to continue →
                </button>
                {' '}
              </div>
              {' '}
              <img data-rise="1" src="/assets/post-hero.jpg" alt="" style={{ flex: "0 1 420px", minWidth: "260px", aspectRatio: "1/1", objectFit: "cover", borderRadius: "14px", border: "1.5px solid #18181B", boxShadow: "8px 8px 0 0 #5B4FF5" }}/>
              {' '}
            </div>
            {' '}
          </>
        ) : null}
        {' '}
        {v.signedIn ? (
          <>
            {' '}
            <div style={{ display: "flex", gap: "56px", alignItems: "flex-start", flexWrap: "wrap" }}>
              {' '}
              <form onSubmit={v.submitPost} style={{ flex: "1 1 520px", minWidth: "0", display: "flex", flexDirection: "column", gap: "20px" }}>
                {' '}
                <div data-rise="0" style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "8px" }}>
                  {' '}
                  <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px", color: "#5B4FF5", letterSpacing: "0.08em" }}>
                    / FOR HIRING TEAMS
                  </span>
                  {' '}
                  <h1 style={{ margin: "0", fontSize: "48px", letterSpacing: "-0.035em", fontWeight: "600" }}>
                    {v.postHeading}
                  </h1>
                  {' '}
                  <p style={{ margin: "0", fontSize: "16px", lineHeight: "1.6", color: "#5C5A55" }}>
                    {v.postSub}
                  </p>
                  {' '}
                </div>
                {' '}
                {v.postError ? (
                  <>
                    <div role="alert" style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px", color: "#B42318", background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.3)", borderRadius: "10px", padding: "10px 14px" }}>
                      {v.postError}
                    </div>
                  </>
                ) : null}
                {' '}
                {v.postDone ? (
                  <>
                    {' '}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap", fontSize: "14px", color: "#0F6E56", background: "rgba(15,110,86,0.08)", border: "1px solid rgba(15,110,86,0.3)", borderRadius: "10px", padding: "12px 16px" }}>
                      {' '}
                      <span>
                        Posted. It’s on the board now.
                      </span>
                      {' '}
                      <button type="button" onClick={v.viewPosted} style={{ background: "none", border: "none", padding: "0", fontFamily: "'Geist Mono',monospace", fontSize: "12px", color: "#0F6E56", textDecoration: "underline", cursor: "pointer" }}>
                        View listing →
                      </button>
                      {' '}
                    </div>
                    {' '}
                  </>
                ) : null}
                {' '}
                <div data-rise="1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,220px),1fr))", gap: "16px" }}>
                  {' '}
                  <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px", fontWeight: "500", color: "#3F3D38" }}>
                    Role title{' '}
                    <input name="title" value={v.post.title} onChange={v.onPost} placeholder="Senior React Engineer" style={{ padding: "13px 14px", borderRadius: "10px", border: "1px solid #D5D0C4", background: "#FFFEFB", fontSize: "15px", color: "#18181B", outline: "none", transition: "all .2s" }} className="dh41"/>
                    {' '}
                  </label>
                  {' '}
                  <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px", fontWeight: "500", color: "#3F3D38" }}>
                    Company{' '}
                    <input name="company" value={v.post.company} onChange={v.onPost} placeholder="Zepto" style={{ padding: "13px 14px", borderRadius: "10px", border: "1px solid #D5D0C4", background: "#FFFEFB", fontSize: "15px", color: "#18181B", outline: "none", transition: "all .2s" }} className="dh42"/>
                    {' '}
                  </label>
                  {' '}
                </div>
                {' '}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {' '}
                  <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "11px", color: "#75726A", letterSpacing: "0.08em" }}>
                    WORK TYPE
                  </span>
                  {' '}
                  <div style={{ display: "flex", gap: "6px" }}>
                    {' '}
                    {(v.postTypes || []).map((o, i0) => (
                      <Fragment key={o?.id ?? i0}>
                        {' '}
                        <button type="button" onClick={o.onClick} style={{ padding: "9px 16px", borderRadius: "999px", border: `1px solid ${o.border}`, background: o.bg, color: o.fg, fontSize: "14px", fontWeight: "500", cursor: "pointer", transition: "all .15s" }}>
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
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,160px),1fr))", gap: "16px" }}>
                  {' '}
                  <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px", fontWeight: "500", color: "#3F3D38" }}>
                    Location{' '}
                    <input name="location" value={v.post.location} onChange={v.onPost} placeholder="Bangalore" style={{ padding: "13px 14px", borderRadius: "10px", border: "1px solid #D5D0C4", background: "#FFFEFB", fontSize: "15px", color: "#18181B", outline: "none", transition: "all .2s" }} className="dh43"/>
                    {' '}
                  </label>
                  {' '}
                  <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px", fontWeight: "500", color: "#3F3D38" }}>
                    Experience{' '}
                    <input name="exp" value={v.post.exp} onChange={v.onPost} placeholder="3–5y" style={{ padding: "13px 14px", borderRadius: "10px", border: "1px solid #D5D0C4", background: "#FFFEFB", fontSize: "15px", color: "#18181B", outline: "none", fontFamily: "'Geist Mono',monospace", transition: "all .2s" }} className="dh44"/>
                    {' '}
                  </label>
                  {' '}
                  <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px", fontWeight: "500", color: "#3F3D38" }}>
                    Salary{' '}
                    <input name="salary" value={v.post.salary} onChange={v.onPost} placeholder="₹30–45L" style={{ padding: "13px 14px", borderRadius: "10px", border: "1px solid #D5D0C4", background: "#FFFEFB", fontSize: "15px", color: "#18181B", outline: "none", fontFamily: "'Geist Mono',monospace", transition: "all .2s" }} className="dh45"/>
                    {' '}
                  </label>
                  {' '}
                </div>
                {' '}
                <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px", fontWeight: "500", color: "#3F3D38" }}>
                  Stack{' '}
                  <input name="tags" value={v.post.tags} onChange={v.onPost} placeholder="React, TypeScript, Redux" style={{ padding: "13px 14px", borderRadius: "10px", border: "1px solid #D5D0C4", background: "#FFFEFB", fontSize: "15px", color: "#18181B", outline: "none", fontFamily: "'Geist Mono',monospace", transition: "all .2s" }} className="dh46"/>
                  {' '}
                  <span style={{ fontSize: "12px", fontWeight: "400", color: "#75726A" }}>
                    Comma separated — these power the stack filter.
                  </span>
                  {' '}
                </label>
                {' '}
                <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px", fontWeight: "500", color: "#3F3D38" }}>
                  Description{' '}
                  <textarea name="description" value={v.post.description} onChange={v.onPost} rows="6" placeholder="What the role involves, who you’re looking for…" style={{ padding: "13px 14px", borderRadius: "10px", border: "1px solid #D5D0C4", background: "#FFFEFB", fontSize: "15px", lineHeight: "1.6", color: "#18181B", outline: "none", resize: "vertical", transition: "all .2s" }} className="dh47"/>
                  {' '}
                </label>
                {' '}
                <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", marginTop: "4px" }}>
                  {' '}
                  <button type="submit" style={{ padding: "15px 28px", borderRadius: "12px", border: "1.5px solid #18181B", background: "#5B4FF5", color: "#FFFEFB", fontSize: "15px", fontWeight: "600", cursor: "pointer", boxShadow: "4px 4px 0 0 #18181B", transition: "all .15s" }} className="dh48 dh49">
                    {v.postCta}
                  </button>
                  {' '}
                  {v.isEditing ? (
                    <>
                      {' '}
                      <button type="button" onClick={v.cancelEdit} style={{ padding: "15px 22px", borderRadius: "12px", border: "1px solid #D5D0C4", background: "transparent", color: "#18181B", fontSize: "15px", fontWeight: "500", cursor: "pointer" }} className="dh50">
                        Cancel
                      </button>
                      {' '}
                    </>
                  ) : null}
                  {' '}
                </div>
                {' '}
              </form>
              {' '}
              <aside data-rise="2" style={{ flex: "0 1 380px", minWidth: "280px", position: "sticky", top: "96px", display: "flex", flexDirection: "column", gap: "16px" }}>
                {' '}
                <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "11px", color: "#75726A", letterSpacing: "0.08em" }}>
                  LIVE PREVIEW
                </span>
                {' '}
                <div style={{ position: "relative" }}>
                  {' '}
                  <div aria-hidden="true" style={{ position: "absolute", inset: "0", borderRadius: "14px", border: "1.5px dashed #C9C2FB", transform: "rotate(3deg) translate(8px,4px)" }}/>
                  {' '}
                  <div aria-hidden="true" style={{ position: "absolute", inset: "0", borderRadius: "14px", background: "#5B4FF5", transform: "translate(8px,8px)" }}/>
                  {' '}
                  <div style={{ position: "relative", background: "#FFFEFB", border: "1.5px solid #18181B", borderRadius: "14px", padding: "24px", display: "flex", flexDirection: "column", gap: "14px" }}>
                    {' '}
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      {' '}
                      <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: "#EEEBFF", color: "#5B4FF5", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "600", fontSize: "15px" }}>
                        {v.pv.initials}
                      </div>
                      {' '}
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        {' '}
                        <span style={{ fontSize: "14px", color: "#5C5A55" }}>
                          {v.pv.company} ·{' '}
                          <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px" }}>
                            just now
                          </span>
                        </span>
                        {' '}
                        <span style={{ fontSize: "18px", fontWeight: "600", letterSpacing: "-0.015em" }}>
                          {v.pv.title}
                        </span>
                        {' '}
                      </div>
                      {' '}
                    </div>
                    {' '}
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {' '}
                      <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px", padding: "4px 9px", borderRadius: "6px", background: "#EEEBFF", color: "#4438D9" }}>
                        {v.pv.type}
                      </span>
                      {' '}
                      {(v.pv.tags || []).map((t, i0) => (
                        <Fragment key={t?.id ?? i0}>
                          {' '}
                          <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "12px", padding: "4px 9px", borderRadius: "6px", background: "#F1EEE5", color: "#3F3D38" }}>
                            {t}
                          </span>
                          {' '}
                        </Fragment>
                      ))}
                      {' '}
                    </div>
                    {' '}
                    <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "14px", borderTop: "1px solid #F0EBE1", gap: "8px" }}>
                      {' '}
                      <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: "14px", fontWeight: "500" }}>
                        {v.pv.salary}
                      </span>
                      {' '}
                      <span style={{ fontSize: "13px", color: "#75726A" }}>
                        {v.pv.location} ·{' '}
                        <span style={{ fontFamily: "'Geist Mono',monospace" }}>
                          {v.pv.exp}
                        </span>
                      </span>
                      {' '}
                    </div>
                    {' '}
                  </div>
                  {' '}
                </div>
                {' '}
                <div style={{ marginTop: "12px", padding: "20px", borderRadius: "14px", background: "#F1EEE5", display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px", lineHeight: "1.55", color: "#3F3D38" }}>
                  {' '}
                  <img src="/assets/post-hero.jpg" alt="" style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", objectPosition: "50% 50%", borderRadius: "10px", display: "block", marginBottom: "6px" }}/>
                  {' '}
                  <span style={{ fontWeight: "600", color: "#18181B" }}>
                    Listings that get replies
                  </span>
                  {' '}
                  <span>
                    Show a salary range — roles with pay listed get more applicants.
                  </span>
                  {' '}
                  <span>
                    List 3–5 core skills. They drive the stack filter and the AI match score.
                  </span>
                  {' '}
                </div>
                {' '}
              </aside>
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
