import { tk, MONO } from '../theme';

// Falls back to the design's company list until the API has enough companies
// of its own to fill the strip.
const FALLBACK = ['Zepto','Razorpay','CRED','Postman','Swiggy','Meesho','Zomato','PhonePe','Flipkart','Paytm','Ola','Nykaa','Dunzo','Groww','upGrad','Spinny'];

export default function CompaniesMarquee({ dark, companies = [] }) {
  const t = tk(dark);
  const base = companies.length >= 6 ? companies : FALLBACK;
  const all = [...base, ...base];
  return (
    <div style={{ overflow:'hidden', borderTop:`1px solid ${t.border}`, borderBottom:`1px solid ${t.border}`, padding:'13px 0', marginBottom:48 }}>
      <div className="marquee-track" style={{ display:'flex', gap:52, width:'max-content' }}>
        {all.map((c, i) => (
          <span key={i} style={{ fontFamily:MONO, fontSize:12, color:t.t3, whiteSpace:'nowrap', letterSpacing:'0.02em' }}>{c}</span>
        ))}
      </div>
    </div>
  );
}
