import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function AuthForm({ title, fields, submitLabel, onSubmit, footer }) {
  const [values, setValues] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSubmit(values);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
        {error && <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg">{error}</div>}
        {fields.map((f) => (
          <div key={f.name}>
            <label className="block text-sm font-medium text-slate-700 mb-1">{f.label}</label>
            <input
              type={f.type}
              required
              value={values[f.name] || ''}
              onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        ))}
        <button disabled={loading} className="w-full bg-indigo-600 text-white rounded-lg py-2 font-medium hover:bg-indigo-700 disabled:opacity-60">
          {loading ? 'Please wait...' : submitLabel}
        </button>
        <p className="text-sm text-slate-600 text-center">
          {footer.text} <Link to={footer.to} className="text-indigo-600 font-medium">{footer.link}</Link>
        </p>
      </form>
    </div>
  );
}
