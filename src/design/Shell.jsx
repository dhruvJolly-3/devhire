// Ported from the Claude Design mockup. Presentational only: all data and
// actions come in through `v` (built in src/App.jsx).
import { Fragment } from 'react';

import Footer from './Footer';

export default function Shell({ v, children }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--c-bg)", position: "relative", display: "flex", flexDirection: "column" }}>
      {' '}
      <div data-progress="1" style={{ position: "fixed", top: "0", left: "0", height: "3px", zIndex: "60", width: "100%", transform: "scaleX(0)", transformOrigin: "0 50%", willChange: "transform", background: "linear-gradient(90deg,#5B4FF5,#D2F53B)", transition: "none" }}/>
      {' '}
      <nav style={{ position: "sticky", top: "0", zIndex: "40", background: "rgba(var(--c-bg-rgb),0.8)", backdropFilter: "blur(14px) saturate(1.4)", borderBottom: "1px solid var(--c-line)" }}>
        {' '}
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px" }}>
          {' '}
          <button onClick={v.goLanding} style={{ display: "flex", alignItems: "center", gap: "10px", background: "none", border: "none", padding: "0", cursor: "pointer", color: "var(--c-ink)" }}>
            {' '}
            <div style={{ position: "relative", width: "30px", height: "30px" }}>
              {' '}
              <div style={{ position: "absolute", inset: "0", borderRadius: "9px", background: "#D2F53B", transform: "translate(3px,3px)" }}/>
              {' '}
              <div style={{ position: "absolute", inset: "0", borderRadius: "9px", background: "#5B4FF5", display: "flex", alignItems: "center", justifyContent: "center", color: "#D2F53B", fontFamily: "'Geist Mono',monospace", fontSize: "13px", fontWeight: "500" }}>
                dh
              </div>
              {' '}
            </div>
            {' '}
            <span style={{ fontSize: "18px", fontWeight: "600", letterSpacing: "-0.02em", paddingLeft: "4px" }}>
              DevHire
            </span>
            {' '}
          </button>
          {' '}
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            {' '}
            <div style={{ display: "flex", gap: "4px" }}>
              {' '}
              {(v.navItems || []).map((n, i0) => (
                <Fragment key={n?.id ?? i0}>
                  {' '}
                  <button onClick={n.onClick} style={{ position: "relative", padding: "8px 12px", border: "none", background: "none", cursor: "pointer", fontSize: "15px", fontWeight: "500", color: n.color, transition: "color .2s" }} className="dh60">
                    {n.label}
                    <span style={{ position: "absolute", left: "12px", right: "12px", bottom: "2px", height: "2px", borderRadius: "2px", background: "#5B4FF5", opacity: n.bar, transition: "opacity .2s" }}/>
                  </button>
                  {' '}
                </Fragment>
              ))}
              {' '}
            </div>
            {' '}
            {v.navTools}
            {v.signedOut ? (
              <>
                {' '}
                <button onClick={v.goAuth} style={{ padding: "9px 18px", borderRadius: "10px", border: "1px solid var(--c-line2)", background: "transparent", color: "var(--c-ink)", fontSize: "14px", fontWeight: "500", cursor: "pointer", transition: "all .2s" }} className="dh61">
                  Sign In
                </button>
                {' '}
              </>
            ) : null}
            {' '}
            {v.signedIn ? (
              <>
                {' '}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {' '}
                  <button onClick={v.goProfile} aria-label="Profile" style={{ width: "34px", height: "34px", borderRadius: "50%", border: "none", background: "#D2F53B", color: "#18181B", fontSize: "14px", fontWeight: "600", cursor: "pointer", boxShadow: v.avatarRing, transition: "box-shadow .2s" }}>
                    {v.userInitial}
                  </button>
                  {' '}
                  <button onClick={v.signOut} style={{ padding: "8px 12px", borderRadius: "10px", border: "1px solid transparent", background: "transparent", color: "var(--c-text3)", fontSize: "14px", cursor: "pointer" }} className="dh62">
                    Sign out
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
      </nav>
      {' '}
      <main data-page="1" style={{ flex: "1" }}>
        {children}
      </main>
      {' '}
      {v.confirmOpen ? (
        <>
          {' '}
          <div data-backdrop="1" onClick={v.cancelDel} style={{ position: "fixed", inset: "0", zIndex: "80", background: "rgba(24,24,27,0.34)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
            {' '}
            <div onClick={v.stop} style={{ position: "relative", width: "100%", maxWidth: "440px" }}>
              {' '}
              <div aria-hidden="true" style={{ position: "absolute", inset: "0", borderRadius: "14px", background: "#B42318", transform: "translate(8px,8px)" }}/>
              {' '}
              <div style={{ position: "relative", background: "var(--c-paper)", border: "1.5px solid var(--c-ink)", borderRadius: "14px", padding: "32px", display: "flex", flexDirection: "column", gap: "16px" }}>
                {' '}
                <h3 style={{ margin: "0", fontSize: "22px", fontWeight: "600", letterSpacing: "-0.02em" }}>
                  Delete this listing?
                </h3>
                {' '}
                <p style={{ margin: "0", fontSize: "15px", lineHeight: "1.6", color: "var(--c-text2)" }}>
                  <strong>
                    {v.delTitle}
                  </strong>
                  {' '}and its{' '}
                  <span style={{ fontFamily: "'Geist Mono',monospace" }}>
                    {v.delCount}
                  </span>
                  {' '}applications will be removed. Candidates who open the link will see “job unavailable”. This can’t be undone.
                </p>
                {' '}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", paddingTop: "8px" }}>
                  {' '}
                  <button onClick={v.cancelDel} style={{ padding: "12px 18px", borderRadius: "10px", border: "1px solid var(--c-line2)", background: "transparent", color: "var(--c-ink)", fontSize: "14px", fontWeight: "500", cursor: "pointer" }}>
                    Cancel
                  </button>
                  {' '}
                  <button onClick={v.confirmDelete} style={{ padding: "12px 18px", borderRadius: "10px", border: "none", background: "#B42318", color: "#FFFEFB", fontSize: "14px", fontWeight: "600", cursor: "pointer" }} className="dh63">
                    Delete listing
                  </button>
                  {' '}
                </div>
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
      <Footer v={v}/>
      {' '}
      {' '}
    </div>
  );
}
