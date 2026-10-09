import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/templates';

  if (user) return <Navigate to="/templates" replace />;

  return (
    <AuthForm
      title="Welcome back"
      submitLabel="Login"
      fields={[
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'password', label: 'Password', type: 'password' },
      ]}
      onSubmit={async (v) => { await login(v); navigate(from, { replace: true }); }}
      footer={{ text: "Don't have an account?", link: 'Register', to: '/register' }}
    />
  );
}
