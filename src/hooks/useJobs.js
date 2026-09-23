import { useCallback, useEffect, useState } from 'react';
import api from '../api/axios';
import { normalizeJobs } from '../utils/job';

export default function useJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/jobs');
      setJobs(normalizeJobs(res.data));
    } catch {
      setError('Could not reach the API. Is the backend running on port 5001?');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetching from the API is external-system synchronisation; the setState
  // happens in the awaited callback, not synchronously in the effect body.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  return { jobs, loading, error, reload: load };
}
