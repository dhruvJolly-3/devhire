// "Continue with Google" for candidates, via Google Identity Services.
// Renders only when VITE_GOOGLE_CLIENT_ID is set at build time (it must match
// the server's GOOGLE_CLIENT_ID). Calls onCredential(idToken) on success.
import { useEffect, useRef, useState } from 'react';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

// Load Google's script once and share the promise between mounts.
let scriptPromise;
const loadScript = () => {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = SCRIPT_SRC;
      s.async = true;
      s.onload = resolve;
      s.onerror = () => { scriptPromise = null; reject(new Error('Could not load Google sign-in')); };
      document.head.appendChild(s);
    });
  }
  return scriptPromise;
};

export default function GoogleButton({ onCredential, onError, dark, text = 'continue_with' }) {
  const slot = useRef(null);
  const [failed, setFailed] = useState(false);
  // Keep the latest callbacks without re-initialising Google on every render.
  const handlers = useRef({ onCredential, onError });
  useEffect(() => { handlers.current = { onCredential, onError }; });

  useEffect(() => {
    if (!CLIENT_ID) return;
    let cancelled = false;
    loadScript().then(() => {
      if (cancelled || !slot.current) return;
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: (resp) => handlers.current.onCredential(resp.credential),
      });
      slot.current.innerHTML = '';   // clear the previous button before re-rendering
      window.google.accounts.id.renderButton(slot.current, {
        theme: dark ? 'filled_black' : 'outline', size: 'large', shape: 'pill', text,
        width: Math.min(slot.current.offsetWidth || 400, 400),
      });
    }).catch(err => { if (!cancelled) { setFailed(true); handlers.current.onError?.(err.message); } });
    return () => { cancelled = true; };
  }, [text, dark]);

  if (!CLIENT_ID || failed) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: 'var(--c-muted)', fontFamily: "'Geist Mono',monospace" }}>
        <span style={{ flex: 1, height: 1, background: 'var(--c-line)' }}/>or<span style={{ flex: 1, height: 1, background: 'var(--c-line)' }}/>
      </div>
      <div ref={slot} style={{ display: 'flex', justifyContent: 'center', minHeight: 44 }}/>
    </div>
  );
}
