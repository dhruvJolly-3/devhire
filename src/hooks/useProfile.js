import { useCallback, useEffect, useState } from 'react';
import api from '../api/axios';

// The signed-in user's profile (server: routes/me.js → /profile, /resume).
export default function useProfile(user) {
  const [profile, setProfile] = useState(null);

  const load = useCallback(async () => {
    try { setProfile((await api.get('/me/profile')).data); } catch { setProfile(null); }
  }, []);

  useEffect(() => {
    if (!user) return;
    // Loading from the API is external-system sync; setState runs after await.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [user, load]);

  const save = async (fields) => {
    const res = await api.put('/me/profile', fields);
    setProfile(res.data);
    return res.data;
  };

  const uploadResume = async (file) => {
    const form = new FormData();
    form.append('resume', file);
    const res = await api.post('/me/resume', form);
    setProfile(res.data);
    return res.data;
  };

  return { profile: user ? profile : null, save, uploadResume };
}
