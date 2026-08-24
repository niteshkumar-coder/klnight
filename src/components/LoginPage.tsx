import { ExternalLink, Eye, EyeOff, Linkedin, Lock, ShieldCheck, User } from 'lucide-react';
import React, { useState } from 'react';
import { StudentProfile } from '../types';

interface LoginPageProps {
  onLoginSuccess: (student: StudentProfile) => void;
  onLogin: (credentials: {
    universityId: string;
    password?: string;
    semester?: string;
    academicYear?: string;
    rememberMe?: boolean;
  }) => Promise<{ student: StudentProfile }>;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onLoginSuccess }) => {
  const [universityId, setUniversityId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [semester, setSemester] = useState<'Odd' | 'Even'>('Odd');
  const [academicYear, setAcademicYear] = useState('2026-27');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanId = universityId.trim();
    if (!cleanId) {
      setErrorMessage('Please enter your University ID.');
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      const res = await onLogin({
        universityId: cleanId,
        password: password.trim(),
        semester,
        academicYear,
        rememberMe,
      });
      onLoginSuccess(res.student);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col justify-between items-center p-4 sm:p-6 lg:p-10">
      {/* Top Header */}
      <header className="w-full max-w-md text-center pt-4 flex flex-col items-center">
        <img
          src="https://i.ibb.co/XrWyDBV0/image.png"
          alt="Logo"
          className="h-12 sm:h-14 w-auto object-contain"
          referrerPolicy="no-referrer"
        />
        <div className="mt-2.5 flex items-center justify-center">
          <a
            href="https://www.linkedin.com/in/nitesh-kumar-27428a397?utm_source=share_via&utm_content=profile&utm_medium=member_android"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#0A66C2] text-xs font-mono-code font-bold transition-all border border-[#0A66C2]/25 shadow-2xs hover:scale-102"
            title="Connect on LinkedIn (Nitesh Kumar)"
          >
            <Linkedin className="w-3.5 h-3.5" />
            <span>Connect on LinkedIn</span>
            <ExternalLink className="w-3 h-3 opacity-75" />
          </a>
        </div>
        <p className="text-xs sm:text-sm text-[#666666] font-medium tracking-wide mt-2">
          Student Academic Schedule & Real-Time Timetable
        </p>
      </header>

      {/* Main Login Card */}
      <main className="w-full max-w-md my-6">
        <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-2xl p-6 sm:p-8 shadow-sm">
          {/* Heading */}
          <div className="mb-6 pb-4 border-b border-[#E5E5E5]">
            <span className="text-[11px] font-bold tracking-wider text-[#111111] uppercase font-mono-code bg-[#F3F4F6] px-2.5 py-1 rounded border border-[#E5E5E5]">
              STUDENT SIGN IN
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111111] mt-3 font-display">
              Access Your Timetable
            </h2>
            <p className="text-xs text-[#666666] mt-1">
              Enter your University ID and password to view your real-time schedule.
            </p>
          </div>

          {/* Error message */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5] text-[#DC2626] text-xs flex items-start gap-2">
              <span className="font-bold shrink-0">!</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* University ID */}
            <div>
              <label
                htmlFor="universityId"
                className="block text-xs font-bold uppercase tracking-wider text-[#666666] mb-1.5 font-mono-code"
              >
                UNIVERSITY ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#666666]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="universityId"
                  type="text"
                  value={universityId}
                  onChange={(e) => setUniversityId(e.target.value)}
                  placeholder="Enter University ID"
                  className="w-full bg-[#FFFFFF] border border-[#E5E5E5] focus:border-[#111111] rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#111111] placeholder-[#9CA3AF] transition-all outline-none"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-[#666666] mb-1.5 font-mono-code"
              >
                PASSWORD
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#666666]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-[#FFFFFF] border border-[#E5E5E5] focus:border-[#111111] rounded-xl pl-9 pr-16 py-2.5 text-sm text-[#111111] placeholder-[#9CA3AF] transition-all outline-none"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-[#666666] hover:text-[#111111] font-mono-code transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <span className="flex items-center gap-1">
                      <EyeOff className="w-3.5 h-3.5" /> HIDE
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> SHOW
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Grid: Semester & Academic Year */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="semester"
                  className="block text-xs font-bold uppercase tracking-wider text-[#666666] mb-1.5 font-mono-code"
                >
                  SEMESTER
                </label>
                <select
                  id="semester"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value as 'Odd' | 'Even')}
                  className="w-full bg-[#FFFFFF] border border-[#E5E5E5] focus:border-[#111111] rounded-xl px-3 py-2 text-xs text-[#111111] transition-all outline-none cursor-pointer"
                >
                  <option value="Odd">Odd Semester</option>
                  <option value="Even">Even Semester</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="academicYear"
                  className="block text-xs font-bold uppercase tracking-wider text-[#666666] mb-1.5 font-mono-code"
                >
                  ACADEMIC YEAR
                </label>
                <select
                  id="academicYear"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#E5E5E5] focus:border-[#111111] rounded-xl px-3 py-2 text-xs text-[#111111] transition-all outline-none cursor-pointer"
                >
                  <option value="2026-27">2026-27</option>
                  <option value="2027-28">2027-28</option>
                </select>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-[#666666] cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded bg-[#FFFFFF] border-[#CCCCCC] text-[#111111] focus:ring-0 focus:ring-offset-0 accent-[#111111] cursor-pointer"
                />
                <span>Remember this device</span>
              </label>
            </div>

            {/* Sign In Button */}
            <button
              id="btn-sign-in"
              type="submit"
              disabled={loading}
              className="w-full bg-[#111111] hover:bg-[#2A2A2A] active:scale-[0.99] text-[#FFFFFF] font-bold text-sm py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50 mt-2 font-display"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#FFFFFF] border-t-transparent rounded-full animate-spin" />
                  <span>SIGNING IN...</span>
                </div>
              ) : (
                <>
                  <span>SIGN IN</span>
                  <span className="text-base font-bold">→</span>
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-4 border-t border-[#E5E5E5] flex flex-col gap-1.5 text-[11px] text-[#666666]">
            <div className="flex items-center gap-1.5 text-[#111111]">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span className="font-semibold font-mono-code">AUTHENTICATED STUDENT SESSION</span>
            </div>
            <p className="text-[10px] text-[#888888] leading-relaxed">
              Your credentials are securely handled and session details are loaded directly for your profile.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-md text-center pb-3">
        <p className="text-[10px] text-[#888888]">
          Academic schedule organizer & attendance tracker
        </p>
      </footer>
    </div>
  );
};
