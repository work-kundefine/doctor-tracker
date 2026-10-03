import React, { useState, useEffect } from 'react';
import { api, setStoredToken, setStoredUser } from '../lib/api';

interface AuthGatewayProps {
  onLoginSuccess: (user: any, token?: string) => void;
  expirationNotice?: string | null;
}

export const AuthGateway: React.FC<AuthGatewayProps> = ({ onLoginSuccess, expirationNotice }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitLabel, setSubmitLabel] = useState('Sign In to Portal');
  const [errorMessage, setErrorMessage] = useState('');
  const [notice, setNotice] = useState<string | null>(expirationNotice || null);

  useEffect(() => {
    if (expirationNotice) {
      setNotice(expirationNotice);
    } else if (typeof window !== 'undefined' && window.location.search.includes('expired=true')) {
      setNotice('Your session has expired. Please sign in again to continue.');
    }
  }, [expirationNotice]);

  const fillCredential = (presetEmail: string) => {
    setEmail(presetEmail);
    setPassword('••••••••••••');
    setErrorMessage('');
    setNotice(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setErrorMessage('');
    setNotice(null);
    setSubmitLabel('Verifying Credentials...');

    try {
      const res = await api.auth.login({
        email,
        password: password === '••••••••••••' ? 'password123' : password,
        rememberMe,
      });

      if (res.success && res.data) {
        setSubmitLabel('Access Granted');
        setStoredToken(res.data.token);
        setStoredUser(res.data.user);
        setTimeout(() => {
          onLoginSuccess(res.data.user, res.data.token);
        }, 400);
      } else {
        setIsLoading(false);
        setSubmitLabel('Sign In to Portal');
        setErrorMessage(res.message || 'Invalid email or password. Please verify your clinical credentials and try again.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setSubmitLabel('Sign In to Portal');
      setErrorMessage(err.message || 'Authentication error. Please try again.');
    }
  };

  return (
    <main className="w-full min-h-screen bg-[#f8f9ff] flex flex-col justify-center items-center p-4">
      <div className="flex flex-col w-full items-center justify-center py-8 px-4">
        <div className="relative w-full max-w-lg">
          {/* Main Authentication Card Surface */}
          <div className="relative bg-white shadow-xl rounded-2xl p-8 flex flex-col gap-6 border border-[#c6c6cd]/25">
            {/* Brand & Heading Area */}
            <div className="flex flex-col items-center text-center">
              {/* Brand Monogram */}
              <div className="w-14 h-14 rounded-2xl bg-[#006a61] flex items-center justify-center text-white shadow-md mb-4">
                <span className="material-symbols-outlined text-[30px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  local_hospital
                </span>
              </div>
              <h1 className="font-['Plus_Jakarta_Sans'] text-[26px] font-bold text-[#0b1c30] tracking-tight">
                Doctor Tracker
              </h1>
              <p className="font-['Inter'] text-[14px] text-[#45464d] mt-1 max-w-sm">
                Clinical Practitioner & Patient Management System
              </p>
            </div>

            {/* Session Expiration Warning Notice */}
            {notice && (
              <div className="bg-[#fff8e1] border border-[#fbc02d]/50 rounded-xl p-3.5 text-[13px] text-[#7c4a00] flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[20px] text-[#f57f17] shrink-0">timer_off</span>
                <div className="flex-1 font-['Inter']">
                  <span className="font-semibold block">Session Timeout</span>
                  <span>{notice}</span>
                </div>
              </div>
            )}

            {/* Quick Fill Demo Roles */}
            <div className="bg-[#eff4ff] rounded-xl p-3 flex flex-col gap-2 border border-[#c6c6cd]/20">
              <span className="font-['Inter'] text-[11px] text-[#45464d] font-semibold uppercase tracking-wider">
                Demo Accounts (MongoDB Seeded)
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fillCredential('admin@doctortracker.med')}
                  className="flex items-center gap-1.5 bg-white hover:bg-[#dce9ff]/60 px-3 py-1.5 rounded-full text-[#0b1c30] transition-colors shadow-xs text-left cursor-pointer border border-[#c6c6cd]/30"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006a61]"></span>
                  <span className="font-['Inter'] text-[11px] font-semibold text-[#006a61]">Admin:</span>
                  <span className="font-['Inter'] text-[11px] text-[#45464d]">admin@doctortracker.med</span>
                </button>
                <button
                  type="button"
                  onClick={() => fillCredential('s.jenkins@stjude.org')}
                  className="flex items-center gap-1.5 bg-white hover:bg-[#dce9ff]/60 px-3 py-1.5 rounded-full text-[#0b1c30] transition-colors shadow-xs text-left cursor-pointer border border-[#c6c6cd]/30"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#188ace]"></span>
                  <span className="font-['Inter'] text-[11px] font-semibold text-[#188ace]">Director:</span>
                  <span className="font-['Inter'] text-[11px] text-[#45464d]">s.jenkins@stjude.org</span>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-[#ffdad6]/60 border border-[#ba1a1a]/30 rounded-xl p-3 text-[13px] text-[#93000a] flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Authentication Form */}
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              {/* Email Input */}
              <div className="flex flex-col gap-1.5">
                <label className="font-['Inter'] text-[12px] text-[#0b1c30] font-semibold">
                  Work Email Address
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-[#76777d] text-[20px] pointer-events-none">
                    mail
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setNotice(null);
                    }}
                    placeholder="e.g. admin@doctortracker.med"
                    required
                    className="w-full h-11 pl-10 pr-4 bg-white border border-[#c6c6cd] rounded-xl font-['Inter'] text-[14px] text-[#0b1c30] placeholder:text-[#76777d] focus:outline-none focus:border-[#006a61] focus:ring-1 focus:ring-[#006a61] transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-['Inter'] text-[12px] text-[#0b1c30] font-semibold">
                    Password
                  </label>
                </div>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-[#76777d] text-[20px] pointer-events-none">
                    password
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    className="w-full h-11 pl-10 pr-11 bg-white border border-[#c6c6cd] rounded-xl font-['Inter'] text-[14px] text-[#0b1c30] placeholder:text-[#76777d] focus:outline-none focus:border-[#006a61] focus:ring-1 focus:ring-[#006a61] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-[#76777d] hover:text-[#0b1c30] flex items-center justify-center p-1 rounded cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Session Options */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#006a61] accent-[#006a61] cursor-pointer"
                  />
                  <span className="font-['Inter'] text-[13px] text-[#0b1c30]">
                    Keep me signed in
                  </span>
                </label>
              </div>

              {/* Primary Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 w-full h-12 bg-[#006a61] hover:bg-[#00524b] text-white font-['Inter'] text-[14px] font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] cursor-pointer disabled:opacity-80"
              >
                {isLoading ? (
                  <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined text-[20px]">login</span>
                )}
                <span>{submitLabel}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};
