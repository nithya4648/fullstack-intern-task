import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import TemplateCard from '../components/TemplateCard';

export default function Templates() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  const handleAuthError = useCallback((err) => {
    if (err.response?.status === 401) { logout(); navigate('/login'); return true; }
    return false;
  }, [logout, navigate]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/templates');
        setTemplates(data);
        if (user) {
          const fav = await api.get('/favorites');
          setFavoriteIds(new Set(fav.data.map((t) => t.id)));
        }
      } catch (err) {
        if (!handleAuthError(err)) setError('Could not load templates. Is the server running?');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const categories = useMemo(() => ['All', ...new Set(templates.map((t) => t.category))], [templates]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return templates.filter(
      (t) =>
        (category === 'All' || t.category === category) &&
        (!q || t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
    );
  }, [templates, search, category]);

  const toggleFavorite = async (template) => {
    if (!user) return navigate('/login', { state: { from: '/templates' } });
    setBusyId(template.id);
    try {
      if (favoriteIds.has(template.id)) await api.delete(`/favorites/${template.id}`);
      else await api.post(`/favorites/${template.id}`);
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        next.has(template.id) ? next.delete(template.id) : next.add(template.id);
        return next;
      });
    } catch (err) {
      if (!handleAuthError(err)) setError(err.response?.data?.message || 'Action failed');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-800">Templates</h1>
      <p className="text-slate-600 mt-1">Browse templates and favorite the ones you like.</p>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search templates..."
          className="flex-1 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {error && <div className="mt-4 bg-red-50 text-red-700 text-sm p-3 rounded-lg">{error}</div>}
      {loading && <p className="mt-8 text-slate-500">Loading...</p>}
      {!loading && !error && visible.length === 0 && <p className="mt-8 text-slate-500">No templates found.</p>}

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((t) => (
          <TemplateCard key={t.id} template={t} isFavorite={favoriteIds.has(t.id)} onToggle={toggleFavorite} busy={busyId === t.id} />
        ))}
      </div>
    </main>
  );
}
