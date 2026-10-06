import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Truck, ArrowRight } from 'lucide-react';
import api from '../api/axiosConfig';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/forgot-password');
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await api.post('/auth/reset-password', {
        token,
        newPassword
      });

      setSuccess('Password successfully reset! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid or expired reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans text-white w-full">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,10,10,0.8)_100%)] pointer-events-none z-0" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8 hover:opacity-80 transition-opacity">
          <Truck className="w-8 h-8 text-brand-accent" />
          <span className="font-display font-bold text-3xl tracking-tight">TransitOps</span>
        </Link>
        <h2 className="mt-6 text-center text-2xl font-display font-medium tracking-tight">
          Reset Your Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Enter your new password below
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#141416] py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-white/5">
          {error && <div className="bg-red-500/10 text-red-400 border border-red-500/20 p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}
          {success && <div className="bg-green-500/10 text-green-400 border border-green-500/20 p-3 rounded-lg mb-6 text-sm text-center">{success}</div>}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                required
                minLength="6"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full rounded-lg border-0 bg-white/5 py-2.5 px-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-brand-accent sm:text-sm sm:leading-6 transition-all outline-none"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                minLength="6"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full rounded-lg border-0 bg-white/5 py-2.5 px-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-brand-accent sm:text-sm sm:leading-6 transition-all outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || success}
                className="flex w-full justify-center items-center gap-2 rounded-lg bg-brand-accent px-3 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent transition-colors shadow-[0_0_15px_rgba(245,124,0,0.3)] disabled:opacity-50"
              >
                {loading ? 'Resetting...' : 'Update Password'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Remember your password?{' '}
            <Link to="/login" className="font-medium text-brand-accent hover:text-orange-400 transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
