import { Navigate, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();

  if (user) return <Navigate to="/templates" replace />;

  return (
    <AuthForm
      title="Create your account"
      submitLabel="Register"
      fields={[
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'password', label: 'Password (min 6 characters)', type: 'password' },
      ]}
      onSubmit={async (v) => { await register(v); navigate('/templates', { replace: true }); }}
      footer={{ text: 'Already have an account?', link: 'Login', to: '/login' }}
    />
  );
}
