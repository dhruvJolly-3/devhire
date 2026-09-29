// Small decorative pieces the design pages drop in: marquee, shimmer, live dot,
// spinner, the AI match ring, the typed cover letter and background videos.

const COMPANIES = ['Zepto', 'Razorpay', 'CRED', 'Postman', 'Swiggy', 'Meesho', 'Zomato', 'PhonePe', 'Flipkart', 'Groww', 'Nykaa', 'Freshworks'];

const reducedMotion = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export function Marquee({ companies }) {
  const list = companies?.length >= 6 ? companies.slice(0, 14) : COMPANIES;
  const row = [...list, ...list];
  return (
    <div style={{ display: 'flex', gap: 56, width: 'max-content', animation: 'dhMarquee 36s linear infinite' }}>
      {row.map((c, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 56, fontFamily: "'Geist Mono',monospace", fontSize: 13, color: 'var(--c-muted)', whiteSpace: 'nowrap' }}>
          {c}
          <span style={{ width: 5, height: 5, borderRadius: 2, background: i % 2 ? '#5B4FF5' : '#D2F53B' }}/>
        </span>
      ))}
    </div>
  );
}

export function Shimmer() {
  return (
  <span aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '40%', background: 'linear-gradient(90deg, transparent, rgba(255,254,251,0.45), transparent)', animation: 'dhShimmer 3.2s ease-in-out infinite', pointerEvents: 'none' }}/>
  );
}

export function LiveDot() {
  return (
  <span style={{ position: 'relative', width: 8, height: 8, display: 'inline-flex' }}>
    <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#22C55E', animation: 'dhPing 1.8s cubic-bezier(0,0,.2,1) infinite' }}/>
    <span style={{ position: 'relative', width: 8, height: 8, borderRadius: '50%', background: '#0F6E56' }}/>
  </span>
  );
}

export function Spinner() {
  return (
  <span style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid var(--c-line)', borderTopColor: '#5B4FF5', animation: 'dhSpin .8s linear infinite', display: 'inline-block', flexShrink: 0 }}/>
  );
}

export function MatchRing({ score }) {
  return (
    <div style={{ '--dhDeg': score * 3.6 + 'deg', width: 88, height: 88, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'conic-gradient(#5B4FF5 var(--dhDeg), var(--c-line) 0)', animation: 'dhRing 1s cubic-bezier(.22,1,.36,1)' }}>
      <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'var(--c-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Geist Mono',monospace", fontSize: 20, fontWeight: 500, animation: 'dhPop .5s .5s cubic-bezier(.34,1.56,.64,1) backwards' }}>
        {score}
      </div>
    </div>
  );
}

export function LetterBox({ text }) {
  return (
    <div style={{ maxHeight: 260, overflow: 'auto', padding: 16, borderRadius: 10, background: 'var(--c-paper)', border: '1px solid var(--c-line)', fontSize: 14, lineHeight: 1.7, color: 'var(--c-letter)', whiteSpace: 'pre-wrap', animation: `dhType ${Math.min(3.5, text.length / 250)}s steps(${Math.max(8, Math.round(text.length / 60))}) both` }}>
      {text}
    </div>
  );
}

// Looping muted background video. Wide screens with motion allowed only;
// elsewhere (and if the file is missing) the page's poster image shows.
export function BgVideo({ src, poster }) {
  if (typeof window === 'undefined' || window.innerWidth < 760 || reducedMotion()) return null;
  return (
    <video src={src} poster={poster} autoPlay muted loop playsInline preload="auto" aria-hidden="true" tabIndex={-1} disablePictureInPicture
      onError={(e) => { e.currentTarget.style.display = 'none'; }}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none', display: 'block' }}/>
  );
}
