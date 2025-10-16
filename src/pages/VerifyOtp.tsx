import React, { useState } from 'react';
import { useVerifyOtp } from '../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';

const VerifyOtp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const verify = useVerifyOtp();

  React.useEffect(() => {
    if (location.state && typeof location.state === 'object' && 'email' in location.state) {
      setEmail(location.state.email || '');
    }
  }, [location.state]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !otp.trim()) {
      setFormError('Both email and OTP are required.');
      return;
    }
    verify.mutate({ email, otp }, {
      onSuccess: () => {
        navigate('/dashboard'); 
      },
      onError: (err: unknown) => {
        setFormError((err && typeof err === 'object' && 'message' in err)
          ? (err as { message?: string }).message || 'OTP verification failed'
          : 'OTP verification failed');
      }
    });
  };

  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Verify Email OTP</h2>
        <p className="text-slate-600 mt-2">Enter the code sent to your email to complete registration.</p>
      </div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
          <input
            type="email"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={email}
            onChange={e => setEmail(e.target.value)}
            readOnly={!!(location.state && (location.state as any).email)}
            autoComplete="email"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">OTP Code</label>
          <input
            type="text"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="one-time-code"
          />
        </div>
        {formError && <div className="text-red-600 text-sm">{formError}</div>}
        <button
          type="submit"
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-medium shadow-lg shadow-blue-500/30"
          disabled={verify.isPending}
        >
          {verify.isPending ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>
    </>
  );
};

export default VerifyOtp;
