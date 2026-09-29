// Site footer: brand + tagline, quick links, and the maker's profiles.

const ICONS = {
  github: 'M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.39-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z',
  linkedin: 'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z',
  mail: 'M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm1 2.3V17h16V7.3l-8 5.2-8-5.2ZM5.6 7l6.4 4.2L18.4 7H5.6Z',
  code: 'M8.7 16.3 4.4 12l4.3-4.3 1.4 1.4L7.2 12l2.9 2.9-1.4 1.4Zm6.6 0-1.4-1.4 2.9-2.9-2.9-2.9 1.4-1.4 4.3 4.3-4.3 4.3Z',
};

const Icon = ({ name }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d={ICONS[name]}/></svg>
);

const SOCIAL = [
  ['github', 'GitHub', 'https://github.com/dhruvJolly-3'],
  ['linkedin', 'LinkedIn', 'https://www.linkedin.com/in/Dhruvjolly12'],
  ['mail', 'Email', 'mailto:dhruvjolly2001@gmail.com'],
  ['code', 'Source code', 'https://github.com/dhruvJolly-3/devhire'],
];

export default function Footer({ v }) {
  const links = [['Browse jobs', v.goHome], ['Post a role', v.goPost], ...(v.signedIn ? [['My jobs', v.goMe], ['Your profile', v.goProfile]] : [['Sign in', v.goAuth]])];
  return (
    <footer style={{ position: 'relative', overflow: 'hidden', borderTop: '1px solid var(--c-line)', background: 'linear-gradient(180deg, var(--c-bg), var(--c-sunk))' }}>
      <div aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, bottom: -18, fontSize: 'clamp(80px,17vw,230px)', fontWeight: 700, letterSpacing: '-0.06em', lineHeight: 0.8, color: 'transparent', WebkitTextStroke: '1.5px var(--c-stroke)', textAlign: 'center', pointerEvents: 'none', userSelect: 'none' }}>
        devhire
      </div>
      <div className="dh-foot" style={{ position: 'relative', maxWidth: 1200, margin: '0 auto', padding: '56px 32px 150px' }}>
        <div style={{ maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <span style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--c-ink)' }}>DevHire</span>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: 'var(--c-text3)' }}>
            Hand-picked developer roles at India’s fastest-growing startups — with an AI match score and a cover letter for every one.
          </p>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--c-muted)' }}>
            {v.liveDot} {v.totalJobs ? `${v.totalJobs.toLocaleString('en-IN')} open roles, updated every 30 minutes` : 'Fresh roles every 30 minutes'}
          </span>
        </div>
        <nav aria-label="Footer" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span className="dh-foot-h">Explore</span>
          {links.map(([label, on]) => (
            <button key={label} onClick={on} className="dh-foot-link">{label}</button>
          ))}
        </nav>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span className="dh-foot-h">Connect with the maker</span>
          {SOCIAL.map(([icon, label, href]) => (
            <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="dh-foot-link dh-foot-social">
              <span className="dh-foot-ico"><Icon name={icon}/></span>{label}
            </a>
          ))}
        </div>
      </div>
      <div style={{ position: 'relative', borderTop: '1px solid var(--c-line)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '18px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', fontSize: 13, color: 'var(--c-muted)' }}>
          <span>© {new Date().getFullYear()} DevHire · Designed and built by <a href="https://www.linkedin.com/in/Dhruvjolly12" target="_blank" rel="noopener noreferrer" className="dh-foot-name">Dhruv Jolly</a></span>
          <span>Made in India 🇮🇳</span>
        </div>
      </div>
    </footer>
  );
}
