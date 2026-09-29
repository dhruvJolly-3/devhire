import { useCallback, useEffect, useState } from 'react';
import api from '../api/axios';
import { normalizeJob } from '../utils/job';

const EMPTY = { saved: [], applied: [] };

// The signed-in user's saved and applied jobs (server: routes/me.js).
// Save / apply update the screen immediately, then sync with the server.
export default function useMyJobs(user) {
  const [data, setData] = useState(EMPTY);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await api.get('/me/jobs');
      setData({
        saved: res.data.saved.map(normalizeJob),
        applied: res.data.applied.map(a => ({ job: normalizeJob(a.job), appliedAt: a.appliedAt })),
      });
    } catch {
      setData(EMPTY);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    // Loading from the API is external-system sync; setState runs after await.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [user, load]);

  const savedIds = new Set(data.saved.map(j => j.id));
  const appliedIds = new Set(data.applied.map(a => a.job.id));

  const toggleSave = async (job) => {
    const wasSaved = savedIds.has(job.id);
    setData(d => ({ ...d, saved: wasSaved ? d.saved.filter(j => j.id !== job.id) : [job, ...d.saved] }));
    try {
      if (wasSaved) await api.delete(`/me/saved/${job.id}`);
      else await api.post(`/me/saved/${job.id}`);
    } catch {
      load();   // put the server's truth back on failure
    }
  };

  const markApplied = async (job) => {
    if (appliedIds.has(job.id)) return;
    setData(d => ({ ...d, applied: [{ job, appliedAt: new Date().toISOString() }, ...d.applied] }));
    try { await api.post(`/me/applied/${job.id}`); } catch { load(); }
  };

  return {
    saved: user ? data.saved : [], applied: user ? data.applied : [],
    savedIds: user ? savedIds : new Set(), appliedIds: user ? appliedIds : new Set(),
    loaded, toggleSave, markApplied,
  };
}
