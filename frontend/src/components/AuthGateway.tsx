import React, { useState } from 'react';
import { api, setStoredToken, setStoredUser } from '../lib/api';

interface AuthGatewayProps {
  onLoginSuccess: (user: any) => void;
}

export const AuthGateway: React.FC<AuthGatewayProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitLabel, setSubmitLabel] = useState('Sign In to Portal');
  const [errorMessage, setErrorMessage] = useState('');

  const fillCredential = (presetEmail: string) => {
    setEmail(presetEmail);
    setPassword('••••••••••••');
    setErrorMessage('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setErrorMessage('');
    setSubmitLabel('Verifying Credentials...');

    setTimeout(async () => {
      setSubmitLabel('Establishing Secure Node...');

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
          onLoginSuccess(res.data.user);
        }, 600);
      } else {
        setIsLoading(false);
        setSubmitLabel('Sign In to Portal');
        setErrorMessage(res.message || 'Authentication clearance failed. Please re-check email or password.');
      }
    }, 500);
  };

  return (
    <main className="w-full min-h-screen bg-[#f8f9ff] flex flex-col justify-center items-center p-4">
      <div className="flex flex-col w-full items-center justify-center py-8 px-4">
        <div className="relative w-full max-w-lg">
          {/* Subtle Ambient Glow Behind Card */}
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-[#86f2e4]/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-[#dce9ff]/60 rounded-full blur-3xl pointer-events-none"></div>

          {/* Administrative Portal Header Badging */}
          <div className="flex items-center justify-between px-2 mb-4">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-[#006a61] animate-pulse"></span>
              <span className="font-['Inter'] text-[11px] text-[#006a61] uppercase tracking-widest font-semibold">
                Auth Gateway v4.9.2
              </span>
            </div>
            <div className="flex items-center gap-1 text-[#45464d] font-['Inter'] text-[11px]">
              <span className="material-symbols-outlined text-[14px]">vpn_lock</span>
              <span>Dedicated Enterprise Node</span>
            </div>
          </div>

          {/* Main Authentication Card Surface */}
          <div className="relative bg-white shadow-xl rounded-2xl p-8 flex flex-col gap-6 border border-[#c6c6cd]/25">
            {/* Brand & Heading Area */}
            <div className="flex flex-col items-center text-center">
              {/* Brand Monogram */}
              <div className="w-14 h-14 rounded-2xl bg-[#000000] flex items-center justify-center text-white shadow-md mb-4">
                <span className="material-symbols-outlined text-[30px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  local_hospital
                </span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-['Inter'] text-[12px] font-semibold uppercase tracking-wider text-[#006a61]">
                  Physician Operations
                </span>
                <span className="text-[#c6c6cd] font-['Inter'] text-[12px]">•</span>
                <span className="font-['Inter'] text-[12px] text-[#45464d]">SSO Integrated</span>
              </div>
              <h1 className="font-['Plus_Jakarta_Sans'] text-[28px] font-bold text-[#0b1c30] tracking-tight">
                Welcome to Doctor Tracker
              </h1>
              <p className="font-['Inter'] text-[14px] text-[#45464d] mt-1 max-w-sm">
                Administrative & Clinical Management Portal
              </p>
            </div>

            {/* Quick Fill Credential Presets */}
            <div className="bg-[#eff4ff] rounded-xl p-3 flex flex-col gap-2 border border-[#c6c6cd]/20">
              <div className="flex items-center justify-between">
                <span className="font-['Inter'] text-[11px] text-[#45464d] font-semibold uppercase tracking-wider">
                  Quick Fill Demo Roles
                </span>
                <span className="material-symbols-outlined text-[16px] text-[#45464d]">terminal</span>
              </div>
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
                <label className="font-['Inter'] text-[12px] text-[#0b1c30] font-semibold flex items-center justify-between">
                  <span>Work Email Address</span>
                  <span className="font-['Inter'] text-[11px] text-[#45464d]">Hospital ID or NPI Linked</span>
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-[#76777d] text-[20px] pointer-events-none">
                    mail
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. physician.name@stjude.org"
                    required
                    className="w-full h-11 pl-10 pr-4 bg-white border border-[#c6c6cd] rounded-xl font-['Inter'] text-[14px] text-[#0b1c30] placeholder:text-[#76777d] focus:outline-none focus:border-[#006a61] focus:ring-1 focus:ring-[#006a61] transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-['Inter'] text-[12px] text-[#0b1c30] font-semibold">
                    Security Clearance Password
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Recovery instructions dispatched to registered department head.')}
                    className="font-['Inter'] text-[12px] text-[#006a61] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-[#76777d] text-[20px] pointer-events-none">
                    password
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter cryptographic passphrase"
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
                    Remember this device for 12 hours
                  </span>
                </label>
                <span className="flex items-center gap-1 font-['Inter'] text-[11px] text-[#45464d] bg-[#eff4ff] px-2 py-0.5 rounded-full border border-[#c6c6cd]/30">
                  <span className="material-symbols-outlined text-[13px] text-[#006a61]">verified_user</span>
                  FIPS 140-3
                </span>
              </div>

              {/* Primary Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 w-full h-12 bg-[#000000] hover:bg-[#131b2e] text-white font-['Inter'] text-[14px] font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] cursor-pointer disabled:opacity-80"
              >
                {isLoading ? (
                  <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                )}
                <span>{submitLabel}</span>
              </button>
            </form>

            {/* Department Triage Indicators */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center">
              <div className="bg-[#eff4ff] py-2.5 px-1 rounded-xl flex flex-col items-center border border-[#c6c6cd]/20">
                <span className="font-['Inter'] text-[14px] font-bold text-[#0b1c30] tabular-nums">1,482</span>
                <span className="font-['Inter'] text-[11px] text-[#45464d]">Active Staff</span>
              </div>
              <div className="bg-[#eff4ff] py-2.5 px-1 rounded-xl flex flex-col items-center border border-[#c6c6cd]/20">
                <span className="font-['Inter'] text-[14px] font-bold text-[#006a61] tabular-nums">99.98%</span>
                <span className="font-['Inter'] text-[11px] text-[#45464d]">Roster Uptime</span>
              </div>
              <div className="bg-[#eff4ff] py-2.5 px-1 rounded-xl flex flex-col items-center border border-[#c6c6cd]/20">
                <span className="font-['Inter'] text-[14px] font-bold text-[#0b1c30]">Level 1</span>
                <span className="font-['Inter'] text-[11px] text-[#45464d]">Trauma Node</span>
              </div>
            </div>
          </div>

          {/* Security & Compliance Banner */}
          <div className="mt-4 p-4 bg-[#eff4ff] rounded-2xl flex flex-col items-center gap-1.5 shadow-xs text-center border border-[#c6c6cd]/20">
            <div className="flex items-center justify-center gap-1.5 text-[#006a61]">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span className="font-['Inter'] text-[12px] font-semibold tracking-wide">
                Healthcare Security & Compliance Protocol
              </span>
            </div>
            <p className="font-['Inter'] text-[11px] text-[#45464d] leading-relaxed">
              256-bit HIPAA-compliant encryption <span className="mx-1 text-[#c6c6cd]">•</span> Role-Based Access Control <span className="mx-1 text-[#c6c6cd]">•</span> Active Session Guard
            </p>
            <div className="text-[10px] text-[#76777d] tracking-wider uppercase font-['Inter'] mt-0.5">
              Authorized Clinical Personnel Only • Audited Session Logging Enabled
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
