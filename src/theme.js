// Theme tokens — verbatim from design/DevHire_design_source.jsx `tk(dark)`.
export const tk = (dark) => ({
  bg:      dark ? '#0D0D10' : '#FAF8F3',
  surface: dark ? '#141417' : '#FFFEFB',
  surf2:   dark ? '#1A1A1E' : '#F7F5F0',   // secondary surface, hover bg
  t1:      dark ? '#F2F1ED' : '#18181B',
  t2:      dark ? '#96948E' : '#6B6965',
  t3:      dark ? '#5E5C56' : '#A09D94',
  border:  dark ? '#27272B' : '#E8E4DA',
  accent:  dark ? '#7C6CFF' : '#5B4FF5',
  lime:    '#CDEB4A',
  tagBg:   dark ? '#1E1E22' : '#F1EEE5',
  tagHover:dark ? '#28282D' : '#E6E2D8',
  success: dark ? '#16A878' : '#0F6E56',
});

export const MONO = "'Geist Mono',monospace";
export const SANS = "'Geist',Inter,sans-serif";
export const SERIF = "'Instrument Serif',Georgia,serif";
