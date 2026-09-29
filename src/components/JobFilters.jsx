import { tk, MONO, SANS } from '../theme';
import { CITY_ORDER, MODES, EXPERIENCE, POSTED, SOURCES } from '../utils/filters';

export default function JobFilters({ dark, filters, setFilters, cityCounts }) {
  const t = tk(dark);
  const toggle = (key, value) => setFilters(f => ({
    ...f, [key]: f[key].includes(value) ? f[key].filter(v => v !== value) : [...f[key], value],
  }));
  const set = (key, value) => setFilters(f => ({ ...f, [key]: value }));

  const cities = CITY_ORDER.filter(c => cityCounts[c])
    .concat(Object.keys(cityCounts).filter(c => !CITY_ORDER.includes(c) && c !== 'Other').sort());

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:26 }}>
      <Group t={t} title="Location">
        {cities.length === 0 && <span style={{ fontFamily:SANS, fontSize:13, color:t.t3 }}>No locations yet</span>}
        {cities.map(c => (
          <Check key={c} t={t} label={c === 'Delhi' ? 'Delhi / NCR' : c} count={cityCounts[c]}
            checked={filters.cities.includes(c)} onChange={() => toggle('cities', c)}/>
        ))}
      </Group>
      <Group t={t} title="Work mode">
        {MODES.map(m => <Check key={m} t={t} label={m} checked={filters.modes.includes(m)} onChange={() => toggle('modes', m)}/>)}
      </Group>
      <Group t={t} title="Experience">
        {EXPERIENCE.map(([v, l]) => <Radio key={v} t={t} name="exp" label={l} checked={filters.exp === v} onChange={() => set('exp', v)}/>)}
      </Group>
      <Group t={t} title="Date posted">
        {POSTED.map(([v, l]) => <Radio key={v} t={t} name="posted" label={l} checked={filters.posted === v} onChange={() => set('posted', v)}/>)}
      </Group>
      <Group t={t} title="Source">
        {SOURCES.map(([v, l]) => <Radio key={v} t={t} name="source" label={l} checked={filters.source === v} onChange={() => set('source', v)}/>)}
      </Group>
    </div>
  );
}

function Group({ t, title, children }) {
  return (
    <fieldset style={{ border:'none', margin:0, padding:0 }}>
      <legend style={{ fontFamily:MONO, fontSize:11, color:t.t3, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:12, padding:0 }}>{title}</legend>
      <div style={{ display:'flex', flexDirection:'column', gap:9 }}>{children}</div>
    </fieldset>
  );
}

const rowStyle = (t) => ({ display:'flex', alignItems:'center', gap:10, fontFamily:SANS, fontSize:14, color:t.t1, cursor:'pointer' });

function Check({ t, label, count, checked, onChange }) {
  return (
    <label style={rowStyle(t)}>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ accentColor:t.accent, width:16, height:16, margin:0 }}/>
      <span style={{ flex:1 }}>{label}</span>
      {count !== undefined && <span style={{ fontFamily:MONO, fontSize:11, color:t.t3 }}>{count}</span>}
    </label>
  );
}

function Radio({ t, name, label, checked, onChange }) {
  return (
    <label style={rowStyle(t)}>
      <input type="radio" name={name} checked={checked} onChange={onChange} style={{ accentColor:t.accent, width:16, height:16, margin:0 }}/>
      <span>{label}</span>
    </label>
  );
}
