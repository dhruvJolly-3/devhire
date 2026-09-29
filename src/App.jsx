import { useCallback, useEffect, useState } from 'react';
import api from './api/axios';
import Shell from './design/Shell';
import LandingPage from './design/pages/LandingPage';
import AuthPage from './design/pages/AuthPage';
import JobsPage from './design/pages/JobsPage';
import JobDetailPage from './design/pages/JobDetailPage';
import NotFoundPage from './design/pages/NotFoundPage';
import MyJobsPage from './design/pages/MyJobsPage';
import ProfilePage from './design/pages/ProfilePage';
import PostJobPage from './design/pages/PostJobPage';
import DashboardPage from './design/pages/DashboardPage';
import CompanyPage from './design/pages/CompanyPage';
import { Marquee, Shimmer, LiveDot, Spinner, MatchRing, LetterBox, BgVideo } from './design/ambient';
import useJobs from './hooks/useJobs';
import useMyJobs from './hooks/useMyJobs';
import useProfile from './hooks/useProfile';
import useEmployer from './hooks/useEmployer';
import usePageMotion from './hooks/usePageMotion';
import { normalizeJob } from './utils/job';
import { parseHash, resolveRoute, go, replace, jobPath, loginPath } from './utils/routes';
import {
  TYPES, STACKS, STATUSES, ST_STYLE, PAGE_SIZE,
  palFor, ago, daysSince, payOf, pill, skillList, splitDescription,
} from './utils/designJob';

// The design pages in src/design are presentational: everything they show and
// every action they trigger comes from the `v` object built here.

const EMPTY_POST = { title: '', company: '', type: 'Remote', location: '', exp: '', salary: '', tags: '', description: '' };
const EMPTY_AUTH = { name: '', email: '', password: '' };

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem('user');
    return localStorage.getItem('token') && raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const errMsg = (err, fallback) => err?.response?.data?.message || fallback;
const copy = (text) => navigator.clipboard?.writeText(text).catch(() => {});
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
const here = () => window.location.hash.slice(1) || '/';

export default function App() {
  const [location, setLocation] = useState(parseHash);
  const [user, setUser] = useState(readStoredUser);
  const route = resolveRoute(location, user);
  const page = route.page;

  const { jobs, reload: reloadJobs } = useJobs();
  const my = useMyJobs(user);
  const { profile, save: saveProfileApi, uploadResume } = useProfile(user);
  const emp = useEmployer(user, !!user);

  // Job board filters
  const [query, setQuery] = useState(() => route.q || '');
  const [types, setTypes] = useState([]);
  const [cities, setCities] = useState([]);
  const [stacks, setStacks] = useState([]);
  const [sort, setSort] = useState('Newest');
  const [pageNum, setPageNum] = useState(1);
  const [myTab, setMyTab] = useState('saved');

  // Auth
  const [authForm, setAuthForm] = useState(EMPTY_AUTH);
  const [authError, setAuthError] = useState('');
  const [authBusy, setAuthBusy] = useState(false);

  // Job detail: the full job (the list only carries a summary) and AI results.
  const [detail, setDetail] = useState({ id: null, job: null, missing: false });
  const [ai, setAi] = useState({});
  const [shareCopied, setShareCopied] = useState(false);
  const [copied, setCopied] = useState(false);

  // Profile form: unsaved edits sit in `pfDraft`; null = show the saved profile.
  const [pfDraft, setPfDraft] = useState(null);
  const [pfMsg, setPfMsg] = useState('');
  const [pfErr, setPfErr] = useState(false);
  const [pfSaving, setPfSaving] = useState(false);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [fileInput, setFileInput] = useState(null);   // hidden <input type=file>

  // Post / edit a role. The draft is keyed so switching listings starts fresh.
  const [postDraft, setPostDraft] = useState({ key: null, form: EMPTY_POST });
  const [postError, setPostError] = useState('');
  const [postDone, setPostDone] = useState(null);

  // Employer dashboard
  const [dashSel, setDashSel] = useState(null);
  const [dashFilter, setDashFilter] = useState('All');
  const [confirmDel, setConfirmDel] = useState(null);
  const [dashMsg, setDashMsg] = useState('');

  // Company page
  const [company, setCompany] = useState({ name: null, data: null });

  const motion = usePageMotion(setLocation);

  // Redirect-only routes (e.g. #/ when signed in → #/jobs).
  useEffect(() => { if (route.redirect) replace(route.redirect); }, [route.redirect]);

  // Page change: play the entrance animation. List changes: stagger the rows in.
  const pageKey = `${page}|${route.jobId || ''}|${route.company || ''}|${route.editId || ''}`;
  useEffect(() => { motion.reveal(); }, [pageKey, motion]);
  useEffect(() => { motion.riseList('[data-list] > *'); }, [pageNum, types, cities, stacks, sort, myTab, motion]);
  useEffect(() => { motion.riseList('[data-apps] > *'); }, [dashSel, dashFilter, motion]);

  // Full job for the detail page.
  useEffect(() => {
    if (page !== 'detail' || !route.jobId) return;
    let live = true;
    api.get(`/jobs/${route.jobId}`)
      .then(res => live && setDetail({ id: route.jobId, job: normalizeJob(res.data), missing: false }))
      .catch(() => live && setDetail({ id: route.jobId, job: null, missing: true }));
    return () => { live = false; };
  }, [page, route.jobId]);

  // Company profile + roles.
  useEffect(() => {
    if (page !== 'company' || !route.company) return;
    let live = true;
    api.get(`/companies/${encodeURIComponent(route.company)}`)
      .then(res => live && setCompany({ name: route.company, data: res.data }))
      .catch(() => live && setCompany({ name: route.company, data: false }));
    return () => { live = false; };
  }, [page, route.company]);

  // Dashboard: applicants for the selected listing.
  const selId = emp.listings.some(j => j._id === dashSel) ? dashSel : emp.listings[0]?._id;
  const { applicants, loadApplicants } = emp;
  useEffect(() => {
    if (page === 'dash' && selId && !applicants[selId]) loadApplicants(selId);
  }, [page, selId, applicants, loadApplicants]);

  // ── Actions ──────────────────────────────────────────────────────────────
  // Actions that need an account send signed-out users to sign in first, then
  // straight back. Replace, not push, so Back doesn't land on the same page.
  const requireAuth = useCallback((next) => {
    if (user) return true;
    replace(loginPath(next));
    return false;
  }, [user]);

  const toggleSave = (job, e) => {
    e?.stopPropagation?.();
    if (!requireAuth(here())) return;
    e?.currentTarget?.animate?.([{ transform: 'scale(1)' }, { transform: 'scale(1.35) rotate(-8deg)' }, { transform: 'scale(1)' }], { duration: 360, easing: 'cubic-bezier(.34,1.56,.64,1)' });
    my.toggleSave(job);
  };

  // The landing page has its own sign-in card (#/?mode=register switches it).
  const isReg = page === 'auth' ? route.mode === 'register' : location.query.get('mode') === 'register';

  const submitAuth = async (e) => {
    e.preventDefault();
    const f = authForm;
    if (!f.email.trim() || !f.password) return setAuthError('Enter your email and password.');
    if (isReg && !f.name.trim()) return setAuthError('Add your name to create an account.');
    if (isReg && f.password.length < 6) return setAuthError('Password must be at least 6 characters.');
    setAuthBusy(true);
    try {
      const body = isReg ? { name: f.name.trim(), email: f.email.trim(), password: f.password } : { email: f.email.trim(), password: f.password };
      const res = await api.post(`/auth/${isReg ? 'register' : 'login'}`, body);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setAuthForm(EMPTY_AUTH);
      setAuthError('');
      setUser(res.data.user);
      replace(route.next || '/jobs');
    } catch (err) {
      setAuthError(errMsg(err, 'Could not reach the server. Is the backend running?'));
    } finally {
      setAuthBusy(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setAi({});
    setPfDraft(null);
    go('/login');
  };

  // ── Shared job decoration ────────────────────────────────────────────────
  const appliedAt = Object.fromEntries(my.applied.map(a => [a.job.id, a.appliedAt]));
  const decorate = (j) => {
    const saved = my.savedIds.has(j.id);
    const [avBg, avFg] = palFor(j.company);
    const days = (j.ageHours ?? Infinity) / 24;
    const isApplied = my.appliedIds.has(j.id);
    return {
      ...j,
      posted: ago(days), isNew: days < 1, initials: j.company.slice(0, 2), avBg, avFg, via: j.sourceLabel || '',
      applied: isApplied, appliedWhen: isApplied ? ago(daysSince(appliedAt[j.id])) : '',
      saveIcon: saved ? '★' : '☆', saveLong: saved ? '★ Saved' : '☆ Save for later', saveShort: saved ? '★ Saved' : '☆ Save',
      saveBg: saved ? '#EEEBFF' : '#FFFEFB', saveFg: saved ? '#5B4FF5' : '#5C5A55', saveBorder: saved ? '#5B4FF5' : '#E8E4DA',
      onOpen: () => go(jobPath(j)), onSave: (e) => toggleSave(j, e),
      onCompany: (e) => { e?.stopPropagation?.(); go(`/company/${encodeURIComponent(j.company)}`); },
    };
  };

  // ── Job board ────────────────────────────────────────────────────────────
  const q = query.trim().toLowerCase();
  const hasTag = (j, t) => j.tags.some(x => x.toLowerCase() === t.toLowerCase());
  const filtered = jobs.filter(j => (!types.length || types.includes(j.type)) && (!cities.length || cities.includes(j.city))
    && (!stacks.length || stacks.some(t => hasTag(j, t)))
    && (!q || [j.title, j.company, j.city, ...j.tags].join(' ').toLowerCase().includes(q)));
  if (sort === 'Newest') filtered.sort((a, b) => a.ageHours - b.ageHours);
  if (sort === 'Salary') filtered.sort((a, b) => payOf(b.salary) - payOf(a.salary));
  if (sort === 'Company') filtered.sort((a, b) => a.company.localeCompare(b.company));
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const cur = Math.min(pageNum, totalPages);
  const from = filtered.length ? (cur - 1) * PAGE_SIZE + 1 : 0;
  const to = Math.min(cur * PAGE_SIZE, filtered.length);
  const cityCount = jobs.reduce((a, j) => (a[j.city] = (a[j.city] || 0) + 1, a), {});
  const topCities = Object.keys(cityCount).filter(c => c !== 'Other').sort((a, b) => cityCount[b] - cityCount[a]).slice(0, 6);
  const toggleIn = (setter, val) => { setter(list => list.includes(val) ? list.filter(x => x !== val) : [...list, val]); setPageNum(1); };
  const newest = [...jobs].sort((a, b) => a.ageHours - b.ageHours).slice(0, 3);

  // ── Job detail ───────────────────────────────────────────────────────────
  const listJob = page === 'detail' ? jobs.find(j => j.id === route.jobId) : null;
  const fullJob = detail.id === route.jobId ? detail.job : null;
  const dj0 = fullJob || listJob || null;
  const isNotFound = page === 'detail' && !dj0 && detail.id === route.jobId && detail.missing;
  const dj = dj0 ? { ...decorate(dj0), ...splitDescription(dj0.description) } : { tags: [], about: [], duties: [] };
  dj.hasDuties = !!dj.duties.length;
  const detailApplied = !!dj0 && my.appliedIds.has(dj0.id);
  const hasResume = !!(profile?.resumeText || '').trim();

  const jobAi = ai[route.jobId] || {};
  const match = jobAi.match;
  const patchAi = (id, fields) => setAi(a => ({ ...a, [id]: { ...a[id], ...fields } }));
  const runMatch = async () => {
    const id = route.jobId;
    patchAi(id, { matchBusy: true, matchError: '' });
    try {
      const res = await api.post(`/ai/match/${id}`, {});
      patchAi(id, { matchBusy: false, match: res.data });
    } catch (err) {
      patchAi(id, { matchBusy: false, matchError: errMsg(err, 'Could not reach the AI.') });
    }
  };
  const genLetter = async () => {
    const id = route.jobId;
    setCopied(false);
    patchAi(id, { letterBusy: true, letter: '', letterError: '' });
    try {
      const res = await api.post(`/ai/cover-letter/${id}`, {});
      patchAi(id, { letterBusy: false, letter: res.data.letter });
    } catch (err) {
      patchAi(id, { letterBusy: false, letterError: errMsg(err, 'Could not write a letter right now.') });
    }
  };

  const applyJob = () => {
    if (!dj0 || !requireAuth(jobPath(dj0)) || detailApplied) return;
    // Open the tab first — browsers block popups opened after an await.
    if (dj0.applyUrl) window.open(dj0.applyUrl, '_blank', 'noopener,noreferrer');
    my.markApplied(dj0);
  };

  // ── Profile ──────────────────────────────────────────────────────────────
  const pf = pfDraft || {
    name: profile?.name || user?.name || '', location: profile?.location || '', headline: profile?.headline || '',
    skills: skillList(profile?.skills).join(', '), resumeText: profile?.resumeText || '', resumeFileName: profile?.resumeFileName || '',
  };
  const filled = ['name', 'location', 'headline', 'skills', 'resumeText'].filter(k => (pf[k] || '').trim()).length + (pf.resumeFileName ? 1 : 0);

  const saveProfile = async (e) => {
    e.preventDefault();
    if (!pf.name.trim()) { setPfErr(true); return setPfMsg('Name is required.'); }
    setPfSaving(true);
    setPfMsg('');
    try {
      await saveProfileApi({ name: pf.name, headline: pf.headline, location: pf.location, skills: skillList(pf.skills), resumeText: pf.resumeText });
      setPfDraft(null);
      setPfErr(false);
      setPfMsg('✓ Profile saved');
    } catch (err) {
      setPfErr(true);
      setPfMsg(errMsg(err, 'Could not save your profile.'));
    } finally {
      setPfSaving(false);
    }
  };

  const onUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setPfErr(true); return setPfMsg('Resume must be under 2 MB.'); }
    setUploadBusy(true);
    setPfMsg('');
    try {
      const p = await uploadResume(file);
      // Keep any other unsaved edits; take the new resume text from the server.
      setPfDraft(d => d && { ...d, resumeText: p.resumeText || '', resumeFileName: p.resumeFileName || '' });
      setPfErr(false);
      setPfMsg(`✓ ${file.name} uploaded — text extracted below`);
    } catch (err) {
      setPfErr(true);
      setPfMsg(errMsg(err, 'Upload failed.'));
    } finally {
      setUploadBusy(false);
    }
  };

  // ── Post / edit a role ───────────────────────────────────────────────────
  const editing = page === 'post' && route.editId ? emp.listings.find(j => j._id === route.editId) : null;
  const postKey = page === 'post' ? (route.editId || 'new') : postDraft.key;
  const post = postDraft.key === postKey ? postDraft.form : editing ? {
    title: editing.title || '', company: editing.company || '', type: editing.type || 'Remote',
    location: editing.type === 'Remote' ? '' : (editing.location || ''), exp: editing.expLevel || '', salary: editing.salary || '',
    tags: (editing.tags || []).join(', '), description: editing.description || '',
  } : EMPTY_POST;
  const setPost = (fields) => setPostDraft({ key: postKey, form: { ...post, ...fields } });
  const pvTags = post.tags.split(',').map(t => t.trim()).filter(Boolean);

  const submitPost = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!requireAuth(route.editId ? `/post/${route.editId}` : '/post')) return;
    if (!post.title.trim() || !post.company.trim() || !post.description.trim()) {
      form.animate?.([{ transform: 'translateX(0)' }, { transform: 'translateX(-8px)' }, { transform: 'translateX(8px)' }, { transform: 'translateX(0)' }], { duration: 320 });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setPostDone(null);
      return setPostError('Role title, company and description are required.');
    }
    const body = {
      title: post.title.trim(), company: post.company.trim(), description: post.description.trim(),
      salary: post.salary.trim(), type: post.type, expLevel: post.exp.trim(), tags: pvTags,
      location: post.type === 'Remote' ? 'Remote' : (post.location.trim() || 'Bangalore'),
    };
    try {
      if (route.editId) {
        await api.put(`/jobs/${route.editId}`, body);
        setPostDraft({ key: null, form: EMPTY_POST });
        setDashSel(route.editId);
        setDashMsg(`✓ Saved changes to ${body.title}`);
        go('/dashboard');
      } else {
        const res = await api.post('/jobs', body);
        setPostDraft({ key: postKey, form: EMPTY_POST });
        setPostDone(res.data._id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      setPostError('');
      reloadJobs();
      emp.reload();
    } catch (err) {
      setPostError(errMsg(err, 'Could not publish the role. Try again.'));
    }
  };

  // ── Employer dashboard ───────────────────────────────────────────────────
  const listings = emp.listings.map(l => ({ ...normalizeJob(l), counts: l.applicants }));
  const selJob = listings.find(j => j.id === selId);
  const selApps = emp.applicants[selId] || [];
  const shownApps = selApps.filter(a => dashFilter === 'All' || a.status === dashFilter);
  const delJob = listings.find(j => j.id === confirmDel);

  const deleteJob = async () => {
    const id = confirmDel, title = delJob?.title || 'Listing';
    setConfirmDel(null);
    try {
      await emp.remove(id);
      setDashMsg(`${title} deleted.`);
      reloadJobs();
    } catch (err) {
      setDashMsg(errMsg(err, 'Could not delete that listing.'));
    }
  };

  // ── Company ──────────────────────────────────────────────────────────────
  const coLoaded = company.name === route.company;
  const coData = coLoaded ? company.data : null;
  const coName = coData?.name || route.company || '';
  const coJobs = (coData?.jobs || []).map(normalizeJob).map(decorate);
  const [coBg, coFg] = palFor(coName);

  // ── Auth ─────────────────────────────────────────────────────────────────
  const nextJob = route.next?.startsWith('/jobs/') ? jobs.find(j => jobPath(j) === route.next) : null;
  const tab = (on) => ({ bg: on ? '#FFFEFB' : 'transparent', fg: on ? '#18181B' : '#5C5A55', sh: on ? '0 1px 3px rgba(24,24,27,0.12)' : 'none' });
  const lt = tab(!isReg), rt = tab(isReg);
  const authPath = (mode) => page === 'auth'
    ? `/${mode}${route.next ? `?next=${encodeURIComponent(route.next)}` : ''}`
    : (mode === 'register' ? '/?mode=register' : '/');
  const switchAuth = (mode) => { setAuthError(''); replace(authPath(mode)); };

  // ── Navigation ───────────────────────────────────────────────────────────
  const navPage = page === 'detail' || page === 'company' ? 'home' : page;
  const nav = user
    ? [['home', 'Jobs', '/jobs'], ['me', 'My jobs', '/me'], ['post', 'Post a role', '/post'], ['dash', 'Dashboard', '/dashboard']]
    : [['home', 'Jobs', '/jobs'], ['post', 'Post a role', '/post']];

  const v = {
    progress: '0%',
    navItems: nav.map(([k, label, path]) => ({ label, color: navPage === k ? '#18181B' : '#5C5A55', bar: navPage === k ? 1 : 0, onClick: () => go(path) })),
    signedIn: !!user, signedOut: !user,
    userInitial: user?.name?.charAt(0).toUpperCase() || '', userName: user?.name?.split(' ')[0] || '', userEmail: user?.email || profile?.email || '',
    avatarRing: page === 'profile' ? '0 0 0 3px #FAF8F3,0 0 0 5px #5B4FF5' : 'none',
    goLanding: () => go(user ? '/jobs' : '/'), goHome: () => go('/jobs'), goPost: () => go('/post'),
    goAuth: () => go('/login'), goProfile: () => go('/profile'), goMe: () => go('/me'),
    signOut,

    // Landing
    marquee: <Marquee companies={[...new Set(jobs.map(j => j.company))]}/>, shimmer: <Shimmer/>, liveDot: <LiveDot/>, spinner: <Spinner/>,
    heroVideo: <BgVideo src="/assets/hero-loop.mp4" poster="/assets/hero.jpg"/>,
    authVideo: <BgVideo src="/assets/auth-loop.mp4" poster="/assets/auth-bg.jpg"/>,
    liveCount: jobs.filter(j => j.ageHours < 24).length, totalJobs: jobs.length,
    savedCount: my.saved.length, appliedCount: my.applied.length,
    latest: newest.map(decorate),

    // Auth
    authTitle: isReg ? 'Create your account' : 'Welcome back',
    authSub: isReg ? 'Free for developers. Save jobs, track applications, get AI match scores.' : 'Sign in to apply, save jobs and see your match score.',
    authEyebrow: isReg ? '/ JOIN DEVHIRE' : '/ SIGN IN', authCta: authBusy ? 'Please wait…' : isReg ? 'Create account →' : 'Sign in →',
    isRegister: isReg, authForm, authError,
    authNotice: route.next ? (nextJob ? `Sign in to continue with ${nextJob.title} at ${nextJob.company}.` : 'Sign in to continue — we’ll take you straight back.') : '',
    authSwitchPre: isReg ? 'Already have an account? ' : 'New to DevHire? ', authSwitchLink: isReg ? 'Sign in' : 'Create an account',
    toggleAuthMode: () => switchAuth(isReg ? 'login' : 'register'),
    setLogin: () => switchAuth('login'), setRegister: () => switchAuth('register'),
    loginTabBg: lt.bg, loginTabFg: lt.fg, loginTabShadow: lt.sh, regTabBg: rt.bg, regTabFg: rt.fg, regTabShadow: rt.sh,
    onAuthField: (e) => { const { name, value } = e.target; setAuthForm(f => ({ ...f, [name]: value })); setAuthError(''); },
    submitAuth,

    // Job board
    query, onQuery: (e) => { setQuery(e.target.value); setPageNum(1); }, clearQuery: () => { setQuery(''); setPageNum(1); },
    nActive: types.length + cities.length + stacks.length,
    clearFilters: () => { setTypes([]); setCities([]); setStacks([]); setPageNum(1); },
    clearAll: () => { setTypes([]); setCities([]); setStacks([]); setQuery(''); setPageNum(1); },
    typeOpts: TYPES.map(t => ({ label: t, ...pill(types.includes(t)), onClick: () => toggleIn(setTypes, t) })),
    cityOpts: topCities.map(c => { const on = cities.includes(c); return { label: c, count: cityCount[c] || 0, check: on ? '✓' : '', border: on ? '#5B4FF5' : '#D5D0C4', bg: on ? '#5B4FF5' : '#FFFEFB', onClick: () => toggleIn(setCities, c) }; }),
    stackOpts: STACKS.map(t => { const on = stacks.includes(t); return { label: t, border: on ? '#5B4FF5' : '#E8E4DA', bg: on ? '#EEEBFF' : '#F1EEE5', fg: on ? '#4438D9' : '#3F3D38', onClick: () => toggleIn(setStacks, t) }; }),
    sort, onSort: (e) => { setSort(e.target.value); setPageNum(1); },
    resultsLabel: filtered.length ? `Showing ${from}–${to} of ${filtered.length} jobs` : 'No jobs found',
    pageJobs: filtered.slice((cur - 1) * PAGE_SIZE, cur * PAGE_SIZE).map(decorate), noResults: !filtered.length, showPager: totalPages > 1,
    // Long result sets show the first, last and nearby page numbers only.
    pages: Array.from({ length: totalPages }, (_, i) => i + 1)
      .filter(n => totalPages <= 7 || n === 1 || n === totalPages || Math.abs(n - cur) <= 2)
      .map(n => { const on = n === cur; return { n, border: on ? '#18181B' : '#D5D0C4', bg: on ? '#5B4FF5' : '#FFFEFB', fg: on ? '#FFFEFB' : '#18181B', shadow: on ? '3px 3px 0 0 #18181B' : 'none', onClick: () => setPageNum(n) }; }),
    atFirst: cur === 1, atLast: cur === totalPages, prevOpacity: cur === 1 ? 0.4 : 1, nextOpacity: cur === totalPages ? 0.4 : 1,
    prevPage: () => setPageNum(Math.max(1, cur - 1)), nextPage: () => setPageNum(Math.min(totalPages, cur + 1)),

    // Job detail
    dj, applyJob,
    applyLabel: detailApplied ? '✓ Applied' : !user ? 'Sign in to apply' : dj0?.applyUrl ? 'Apply on company site ↗' : 'Apply on DevHire →',
    applyBg: detailApplied ? '#0F6E56' : '#5B4FF5',
    share: () => { copy(window.location.href); setShareCopied(true); setTimeout(() => setShareCopied(false), 1800); },
    shareLabel: shareCopied ? '✓ Link copied' : 'Copy link',
    aiNeedsAuth: !user, aiNeedsResume: !!user && !hasResume, aiReady: !!user && hasResume,
    signInForJob: () => requireAuth(here()),
    noMatch: !match, hasMatch: !!match,
    matchBtn: jobAi.matchBusy ? 'Comparing…' : jobAi.matchError ? 'Try again' : 'Check my match', runMatch,
    ring: match ? <MatchRing key={route.jobId + match.score} score={match.score}/> : null,
    matchVerdict: !match ? '' : match.summary || (match.score >= 80 ? 'Strong fit — apply with confidence.' : match.score >= 65 ? 'Good fit, with a gap or two to address.' : 'Stretch role — lead with transferable work.'),
    strengths: match?.strengths || [], gaps: match?.gaps || [], hasGaps: !!match?.gaps?.length,
    noLetter: !jobAi.letter && !jobAi.letterBusy && !jobAi.letterError, letterBusy: !!jobAi.letterBusy, hasLetter: !!(jobAi.letter || jobAi.letterError),
    letterBox: jobAi.letter ? <LetterBox key={jobAi.letter.length} text={jobAi.letter}/>
      : jobAi.letterError ? <p style={{ margin: 0, color: '#B42318', fontSize: 14 }}>{jobAi.letterError}</p> : null,
    letterBtn: jobAi.letterBusy ? 'Writing…' : jobAi.letter || jobAi.letterError ? 'Regenerate' : '✦ Generate letter', genLetter,
    copyLabel: copied ? 'Copied ✓' : 'Copy', copyLetter: () => { copy(jobAi.letter || ''); setCopied(true); },

    // Not found
    missingPath: `${window.location.host}/#/jobs/${route.jobId || ''}`,
    similar: newest.map(decorate),

    // My jobs
    meTabs: [['saved', 'Saved', my.saved.length], ['applied', 'Applied', my.applied.length]].map(([k, label, count]) => ({ label, count, weight: myTab === k ? 600 : 400, color: myTab === k ? '#18181B' : '#5C5A55', bar: myTab === k ? 1 : 0, onClick: () => setMyTab(k) })),
    myList: (myTab === 'saved' ? my.saved : my.applied.map(a => a.job)).map(decorate),
    isSavedTab: myTab === 'saved', isAppliedTab: myTab !== 'saved',
    myEmptyTitle: myTab === 'saved' ? 'No saved jobs yet.' : 'You haven’t applied to anything yet.',
    myEmptySub: myTab === 'saved' ? 'Tap ☆ on any job to keep it here.' : 'Jobs you apply to show up here so you can track them.',

    // Profile
    pf, onPf: (e) => { const { name, value } = e.target; setPfDraft({ ...pf, [name]: value }); setPfMsg(''); },
    skillChips: skillList(pf.skills), completeLabel: Math.round(filled / 6 * 100) + '%',
    pfName: pf.name.trim() || 'Your name',
    nextStep: (() => {
      const steps = [['name', 'Add your full name'], ['headline', 'Add a headline'], ['location', 'Add your location'], ['skills', 'Add your skills'], ['resumeText', 'Paste or upload your resume']];
      const miss = steps.find(([k]) => !(pf[k] || '').trim());
      if (miss) return `Next: ${miss[1]} →`;
      return pf.resumeFileName ? '✓ Profile complete' : 'Next: Upload your resume PDF →';
    })(),
    pickFile: () => fileInput?.click(), onUpload,
    uploadBusy, uploadIdle: !uploadBusy, uploadBtn: pf.resumeFileName ? '↑ Replace PDF' : '↑ Upload PDF',
    fileTitle: pf.resumeFileName || 'Drop your resume or click to upload', fileSub: pf.resumeFileName ? 'Uploaded · text extracted below' : 'PDF or TXT · max 2 MB',
    dropBorder: pf.resumeFileName ? '#5B4FF5' : '#D5D0C4', dropBg: pf.resumeFileName ? '#F5F3FF' : '#FAF8F3',
    saveProfile, saveProfileLabel: pfSaving ? 'Saving…' : 'Save profile', pfMsg, pfMsgColor: pfErr ? '#B42318' : '#0F6E56',

    // Post
    signInForPost: () => requireAuth('/post'),
    post, onPost: (e) => { const { name, value } = e.target; setPost({ [name]: value }); setPostError(''); },
    postTypes: TYPES.map(t => ({ label: t, ...pill(post.type === t), onClick: () => setPost({ type: t }) })),
    submitPost, postError, postDone: !!postDone && !route.editId, viewPosted: () => go(`/jobs/${postDone}`),
    isEditing: !!route.editId, postHeading: route.editId ? 'Edit role' : 'Post a role', postCta: route.editId ? 'Save changes →' : 'Publish role →',
    postSub: route.editId ? 'Changes go live as soon as you save. Applicants keep their place.' : 'Goes live on the board immediately. No recruiters, no consultancy gigs.',
    cancelEdit: () => { setPostDraft({ key: null, form: EMPTY_POST }); go('/dashboard'); },
    pv: { title: post.title || 'Role title', company: post.company || 'Company', initials: (post.company || 'Co').slice(0, 2), type: post.type, tags: pvTags.length ? pvTags : ['Stack'], salary: post.salary || '₹—', location: post.type === 'Remote' ? 'Remote · India' : (post.location || 'City'), exp: post.exp || 'Exp' },

    // Dashboard
    dashStats: [['Open roles', listings.length], ['Applicants', listings.reduce((n, j) => n + (j.counts?.total || 0), 0)], ['New to review', listings.reduce((n, j) => n + (j.counts?.New || 0), 0)]]
      .map(([label, n], i) => ({ label, n, bg: i === 2 ? '#D2F53B' : '#FFFEFB', border: i === 2 ? '1.5px solid #18181B' : '1px solid #E8E4DA', shadow: i === 2 ? '3px 3px 0 0 #18181B' : 'none' })),
    dashEmpty: emp.loaded && !listings.length, dashHas: !!listings.length, dashMsg,
    dismissDashMsg: () => setDashMsg(''),
    myListings: listings.map(j => {
      const on = j.id === selId, total = j.counts?.total || 0, fresh = j.counts?.New || 0;
      return { ...decorate(j), appCount: plural(total, 'applicant'), newCount: fresh, hasNew: fresh > 0,
        selBorder: on ? '#18181B' : '#E8E4DA', selShadow: on ? '5px 5px 0 0 #5B4FF5' : 'none', selShift: on ? 'translate(-3px,-3px)' : 'none',
        onSelect: () => { setDashSel(j.id); setDashFilter('All'); },
        onEdit: (e) => { e.stopPropagation(); go(`/post/${j.id}`); },
        onDelete: (e) => { e.stopPropagation(); setConfirmDel(j.id); },
        onView: (e) => { e.stopPropagation(); go(jobPath(j)); } };
    }),
    selTitle: selJob?.title || '', selMeta: selJob ? `${selJob.type} · ${selJob.location} · posted ${ago(selJob.ageHours / 24)}` : '',
    selCount: plural(selApps.length, 'applicant'),
    appFilters: STATUSES.map(st => ({ label: st, n: st === 'All' ? selApps.length : selApps.filter(a => a.status === st).length, ...pill(dashFilter === st), onClick: () => setDashFilter(st) })),
    apps: shownApps.map(a => {
      const sty = ST_STYLE[a.status] || ST_STYLE.New;
      return { ...a, initials: a.name.split(' ').map(x => x[0]).join('').slice(0, 2).toUpperCase(), when: ago(daysSince(a.appliedAt)),
        matchLabel: a.match != null ? a.match + '%' : '—', matchColor: a.match >= 80 ? '#0F6E56' : a.match >= 65 ? '#5B4FF5' : '#75726A',
        stBg: sty[0], stFg: sty[1], shortLabel: a.status === 'Shortlisted' ? '✓ Shortlisted' : 'Shortlist', rejLabel: a.status === 'Rejected' ? 'Rejected' : 'Reject',
        shortBg: a.status === 'Shortlisted' ? '#5B4FF5' : 'transparent', shortFg: a.status === 'Shortlisted' ? '#FFFEFB' : '#5B4FF5',
        rowOpacity: a.status === 'Rejected' ? 0.6 : 1,
        onShort: () => emp.setStatus(selId, a, 'Shortlisted'), onRej: () => emp.setStatus(selId, a, 'Rejected') };
    }),
    appsEmpty: !shownApps.length,
    appsEmptyText: !emp.applicants[selId] ? 'Loading applicants…' : selApps.length ? `No ${dashFilter.toLowerCase()} applicants.` : 'No applicants yet — new listings usually get their first within a day.',
    confirmOpen: !!delJob, delTitle: delJob?.title || '', delCount: delJob?.counts?.total || 0,
    cancelDel: () => setConfirmDel(null), confirmDelete: deleteJob, stop: (e) => e.stopPropagation(),

    // Company
    co: { name: coName, initials: coName.slice(0, 2), industry: coData?.industry || '', hq: coData?.hq || '—', domain: coData?.domain || '',
      about: coData?.about || (coLoaded ? 'Could not load this company right now.' : 'Loading…'),
      roleCount: plural(coJobs.length, 'open role'), avBg: coBg, avFg: coFg },
    coJobs, coEmpty: coLoaded && !coJobs.length, hasDomain: !!coData?.domain,
  };

  let content = null;
  if (page === 'landing') content = <LandingPage v={v}/>;
  else if (page === 'auth') content = <AuthPage v={v}/>;
  else if (page === 'home') content = <JobsPage v={v}/>;
  else if (page === 'detail') content = isNotFound ? <NotFoundPage v={v}/> : dj0 ? <JobDetailPage v={v}/> : <Loading/>;
  else if (page === 'me') content = <MyJobsPage v={v}/>;
  else if (page === 'profile') content = <ProfilePage v={v} inputRef={setFileInput}/>;
  else if (page === 'post') content = <PostJobPage v={v}/>;
  else if (page === 'dash') content = <DashboardPage v={v}/>;
  else if (page === 'company') content = <CompanyPage v={v}/>;

  return <Shell v={v}>{content}</Shell>;
}

function Loading() {
  return (
    <div style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Spinner/>
    </div>
  );
}
