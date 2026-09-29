import { useCallback, useEffect, useState } from 'react';
import api from '../api/axios';

// The signed-in user's own listings and their applicants (server: routes/employer.js).
export default function useEmployer(user, enabled) {
  const [listings, setListings] = useState([]);
  const [applicants, setApplicants] = useState({});   // jobId → [applicant]
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    try { setListings((await api.get('/employer/jobs')).data); } catch { setListings([]); } finally { setLoaded(true); }
  }, []);

  const loadApplicants = useCallback(async (jobId) => {
    try {
      const res = await api.get(`/employer/jobs/${jobId}/applicants`);
      setApplicants(a => ({ ...a, [jobId]: res.data }));
    } catch {
      setApplicants(a => ({ ...a, [jobId]: [] }));
    }
  }, []);

  useEffect(() => {
    if (!user || !enabled) return;
    // Loading from the API is external-system sync; setState runs after await.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [user, enabled, load]);

  // Shortlist / reject. Clicking the current status again resets it to New.
  const setStatus = async (jobId, app, status) => {
    const next = app.status === status ? 'New' : status;
    const patch = (st) => setApplicants(a => ({ ...a, [jobId]: (a[jobId] || []).map(x => x.id === app.id ? { ...x, status: st } : x) }));
    patch(next);
    try { await api.patch(`/employer/applications/${app.id}`, { status: next }); load(); } catch { patch(app.status); }
  };

  const remove = async (jobId) => {
    await api.delete(`/jobs/${jobId}`);
    setListings(l => l.filter(j => j._id !== jobId));
  };

  return { listings: user ? listings : [], applicants, loaded, reload: load, loadApplicants, setStatus, remove };
}
