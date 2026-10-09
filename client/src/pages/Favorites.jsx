import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import TemplateCard from '../components/TemplateCard';

export default function Favorites() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    api.get('/favorites')
      .then(({ data }) => setItems(data))
      .catch((err) => {
        if (err.response?.status === 401) { logout(); navigate('/login'); }
        else setError('Could not load favorites.');
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const remove = async (template) => {
    setBusyId(template.id);
    try {
      await api.delete(`/favorites/${template.id}`);
      setItems((prev) => prev.filter((t) => t.id !== template.id));
    } catch {
      setError('Could not remove favorite.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-800">My Favorites</h1>
      {error && <div className="mt-4 bg-red-50 text-red-700 text-sm p-3 rounded-lg">{error}</div>}
      {loading && <p className="mt-8 text-slate-500">Loading...</p>}
      {!loading && !error && items.length === 0 && (
        <p className="mt-8 text-slate-600">
          You have no favorites yet. <Link to="/templates" className="text-indigo-600 font-medium">Browse templates</Link>
        </p>
      )}
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((t) => (
          <TemplateCard key={t.id} template={t} isFavorite onToggle={remove} busy={busyId === t.id} />
        ))}
      </div>
    </main>
  );
}
