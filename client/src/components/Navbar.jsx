import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const linkClass = ({ isActive }) =>
  `px-3 py-1.5 rounded-md text-sm font-medium ${isActive ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:text-indigo-600'}`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-2 flex-wrap">
        <Link to="/templates" className="text-lg font-bold text-indigo-600">TemplateStore</Link>
        <div className="flex items-center gap-1 flex-wrap">
          <NavLink to="/templates" className={linkClass}>Templates</NavLink>
          {user ? (
            <>
              <NavLink to="/favorites" className={linkClass}>My Favorites</NavLink>
              <span className="hidden sm:inline text-sm text-slate-500 px-2">Hi, {user.name}</span>
              <button onClick={handleLogout} className="px-3 py-1.5 rounded-md text-sm font-medium bg-slate-800 text-white hover:bg-slate-700">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>Login</NavLink>
              <NavLink to="/register" className={linkClass}>Register</NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
