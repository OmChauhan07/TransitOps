import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Truck, ArrowRight } from 'lucide-react';
import api from '../api/axiosConfig';

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  const handleChange = (index, e) => {
    const val = e.target.value;
    if (isNaN(val)) return;

    const newOtpValues = [...otpValues];
    // allow only last character if multiple are entered in a single input
    newOtpValues[index] = val.substring(val.length - 1);
    setOtpValues(newOtpValues);

    // Focus next input if value is entered
    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const newOtpValues = [...otpValues];
    for (let i = 0; i < pastedData.length; i++) {
      newOtpValues[i] = pastedData[i];
    }
    setOtpValues(newOtpValues);
    
    // Focus the next empty input or the last one
    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = otpValues.join('');
    if (otp.length < 6) {
      setError('Please enter the full 6-digit code.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await api.post('/verify-otp', { email, otp });
      setSuccess('Email verified successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  if (!email) return null;

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans text-white w-full">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,10,10,0.8)_100%)] pointer-events-none z-0" />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8 hover:opacity-80 transition-opacity">
          <Truck className="w-8 h-8 text-brand-accent" />
          <span className="font-display font-bold text-3xl tracking-tight">TransitOps</span>
        </Link>
        <h2 className="mt-6 text-center text-2xl font-display font-medium tracking-tight">
          Verify your email
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          We sent a 6-digit code to <strong className="text-white">{email}</strong>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#141416] py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-white/5">
          {error && <div className="bg-red-500/10 text-red-400 border border-red-500/20 p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}
          {success && <div className="bg-green-500/10 text-green-400 border border-green-500/20 p-3 rounded-lg mb-6 text-sm text-center">{success}</div>}

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="flex justify-center gap-2 sm:gap-3">
              {otpValues.map((val, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={val}
                  onChange={(e) => handleChange(index, e)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-10 h-12 sm:w-12 sm:h-14 rounded-xl border-0 bg-white/5 text-center text-xl sm:text-2xl font-display font-semibold text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-brand-accent transition-all outline-none"
                />
              ))}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || success}
                className="flex w-full justify-center items-center gap-2 rounded-lg bg-brand-accent px-3 py-3 text-sm font-medium text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent transition-colors shadow-[0_0_15px_rgba(245,124,0,0.3)] disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify Email'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-center text-sm text-gray-500 mt-6">
              Didn't receive the code?{' '}
              <button type="button" className="text-brand-accent hover:text-orange-400 font-medium transition-colors">
                Resend
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
