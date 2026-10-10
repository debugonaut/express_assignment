import React, { useState, useEffect } from 'react';
import {
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Loader2,
  ArrowRight,
  Copy,
  CheckCheck,
  Code,
  ListFilter,
  ShieldAlert
} from 'lucide-react';

export default function App() {
  const [tab, setTab] = useState('register'); // 'register' | 'login'
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking');
  const [showPassword, setShowPassword] = useState(false);
  const [showInspector, setShowInspector] = useState(true);
  const [logTab, setLogTab] = useState('diagnostics');
  const [copied, setCopied] = useState(false);

  // Inspector State
  const [lastResponse, setLastResponse] = useState(null);

  // Register Form State
  const [regForm, setRegForm] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dob: '',
    role: 'Fullstack Developer',
    terms: false
  });
  const [regErrors, setRegErrors] = useState({});
  const [regSuccess, setRegSuccess] = useState(null);

  // Login Form State
  const [loginForm, setLoginForm] = useState({
    identifier: '',
    password: '',
    rememberMe: false
  });
  const [loginErrors, setLoginErrors] = useState({});
  const [loginSuccess, setLoginSuccess] = useState(null);

  // Check backend server health
  useEffect(() => {
    fetch('/api/health')
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(() => setServerStatus('online'))
      .catch(() => setServerStatus('offline'));

    // Support demo query params for automated testing/screenshots
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    const demo = params.get('demo');

    if (tabParam === 'login') {
      setTab('login');
    }

    if (demo === 'invalid') {
      setTimeout(() => submitRegister(), 300);
    } else if (demo === 'valid') {
      const validData = loadPreset('valid');
      setTimeout(() => submitRegister(null, validData), 400);
    }
  }, []);

  const submitRegister = async (e, payloadOverride = null) => {
    if (e) e.preventDefault();
    const payload = payloadOverride || regForm;
    setLoading(true);
    setRegErrors({});
    setRegSuccess(null);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      setLastResponse({
        endpoint: 'POST /api/register',
        status: res.status,
        statusText: res.status === 201 ? 'Created' : 'Unprocessable Entity',
        data
      });

      if (res.status === 201) {
        setRegSuccess(data);
      } else if (res.status === 422) {
        const errorMap = {};
        data.errors?.forEach((err) => {
          errorMap[err.field] = err.message;
        });
        setRegErrors(errorMap);
      }
    } catch (err) {
      setLastResponse({
        endpoint: 'POST /api/register',
        status: 500,
        statusText: 'Network Error',
        data: { error: 'Failed to communicate with Express server.' }
      });
    } finally {
      setLoading(false);
    }
  };


  const submitLogin = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setLoginErrors({});
    setLoginSuccess(null);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const data = await res.json();

      setLastResponse({
        endpoint: 'POST /api/login',
        status: res.status,
        statusText: res.status === 200 ? 'OK' : 'Unprocessable Entity',
        data
      });

      if (res.status === 200) {
        setLoginSuccess(data);
      } else if (res.status === 422) {
        const errorMap = {};
        data.errors?.forEach((err) => {
          errorMap[err.field] = err.message;
        });
        setLoginErrors(errorMap);
      }
    } catch (err) {
      setLastResponse({
        endpoint: 'POST /api/login',
        status: 500,
        statusText: 'Network Error',
        data: { error: 'Failed to communicate with Express server.' }
      });
    } finally {
      setLoading(false);
    }
  };

  const loadPreset = (type) => {
    setRegErrors({});
    setRegSuccess(null);
    let target = null;

    if (type === 'valid') {
      const id = Math.floor(100 + Math.random() * 900);
      target = {
        fullName: 'Nupoor Deshpande',
        email: `nupoor.${id}@college.edu`,
        username: `nupoor_${id}`,
        password: 'ValidPassword123!',
        confirmPassword: 'ValidPassword123!',
        phone: '9822334455',
        dob: '2004-06-18',
        role: 'Fullstack Developer',
        terms: true
      };
      setRegForm(target);
    } else if (type === 'underage') {
      target = {
        fullName: 'Aarav Sharma',
        email: 'aarav.kid@example.com',
        username: 'aarav_young',
        password: 'ValidPassword123!',
        confirmPassword: 'ValidPassword123!',
        phone: '9822334455',
        dob: '2021-01-01', // ~5 years old
        role: 'Frontend Engineer',
        terms: true
      };
      setRegForm(target);
    } else if (type === 'weak-password') {
      target = {
        fullName: 'John Smith',
        email: 'john@example.com',
        username: 'johnsmith',
        password: 'weak',
        confirmPassword: 'mismatch',
        phone: '9822334455',
        dob: '2000-01-01',
        role: 'Backend Specialist',
        terms: true
      };
      setRegForm(target);
    } else if (type === 'empty') {
      target = {
        fullName: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        phone: '',
        dob: '',
        role: 'Fullstack Developer',
        terms: false
      };
      setRegForm(target);
    }
    return target;
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col justify-between selection:bg-zinc-800">
      {/* Minimal Top Header */}
      <header className="border-b border-zinc-800/60 px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-sm tracking-tight text-zinc-100">Portal</span>
          <span className="text-zinc-600">/</span>
          <span className="text-xs text-zinc-400">Server Validation</span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2 text-zinc-400">
            <span
              className={`size-1.5 rounded-full ${
                serverStatus === 'online' ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            <span className="text-[11px] font-mono tracking-tight text-zinc-400">
              {serverStatus === 'online' ? 'Express 4.21' : 'Connecting...'}
            </span>
          </div>
          <span className="text-zinc-500 hidden sm:inline">•</span>
          <span className="text-zinc-500 text-[11px] hidden sm:inline">
            Nupoor Deshpande · 202401100026
          </span>
        </div>
      </header>

      {/* Main Content: Single Centered Clean Card */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-[480px]">
          {/* Segmented Control / Tab Switcher */}
          <div className="flex p-1 mb-6 bg-zinc-900 border border-zinc-800/80 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setTab('register');
                setRegErrors({});
                setRegSuccess(null);
              }}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                tab === 'register'
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Create account
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('login');
                setLoginErrors({});
                setLoginSuccess(null);
              }}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                tab === 'login'
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Sign in
            </button>
          </div>

          {/* REGISTER TAB */}
          {tab === 'register' && (
            <div className="bg-[#121215] border border-zinc-800/90 rounded-xl p-6 shadow-2xl">
              {regSuccess ? (
                <div className="py-8 text-center flex flex-col items-center gap-3">
                  <div className="size-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Check className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-zinc-100">Account verified & created</h2>
                    <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
                      All server-side validation rules passed. Created user{' '}
                      <strong className="text-zinc-200">{regSuccess.user.username}</strong>.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      loadPreset('empty');
                      setRegSuccess(null);
                    }}
                    className="mt-4 text-xs font-medium text-zinc-300 hover:text-white underline underline-offset-4"
                  >
                    Register another user
                  </button>
                </div>
              ) : (
                <form onSubmit={submitRegister} className="flex flex-col gap-4">
                  <div>
                    <h1 className="text-lg font-semibold tracking-tight text-zinc-100">Create an account</h1>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Input is validated strictly on the Express backend before acceptance.
                    </p>
                  </div>

                  {/* Full Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-zinc-300">Full name</label>
                    <input
                      type="text"
                      placeholder="Nupoor Deshpande"
                      value={regForm.fullName}
                      onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                      className={`h-9 px-3 rounded-md bg-zinc-900/90 border text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-colors ${
                        regErrors.fullName ? 'border-red-500/60' : 'border-zinc-800'
                      }`}
                    />
                    {regErrors.fullName && (
                      <span className="text-[11px] text-red-400">{regErrors.fullName}</span>
                    )}
                  </div>

                  {/* Email & Username */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-zinc-300">Email address</label>
                      <input
                        type="text"
                        placeholder="nupoor@domain.com"
                        value={regForm.email}
                        onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                        className={`h-9 px-3 rounded-md bg-zinc-900/90 border text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-colors ${
                          regErrors.email ? 'border-red-500/60' : 'border-zinc-800'
                        }`}
                      />
                      {regErrors.email && (
                        <span className="text-[11px] text-red-400">{regErrors.email}</span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-zinc-300">Username</label>
                      <input
                        type="text"
                        placeholder="nupoor_26"
                        value={regForm.username}
                        onChange={(e) => setRegForm({ ...regForm, username: e.target.value })}
                        className={`h-9 px-3 rounded-md bg-zinc-900/90 border text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-colors ${
                          regErrors.username ? 'border-red-500/60' : 'border-zinc-800'
                        }`}
                      />
                      {regErrors.username && (
                        <span className="text-[11px] text-red-400">{regErrors.username}</span>
                      )}
                    </div>
                  </div>

                  {/* Password & Confirm */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-zinc-300">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••••••"
                          value={regForm.password}
                          onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                          className={`w-full h-9 px-3 pr-8 rounded-md bg-zinc-900/90 border text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-colors ${
                            regErrors.password ? 'border-red-500/60' : 'border-zinc-800'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-2.5 text-zinc-500 hover:text-zinc-300"
                        >
                          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                      {regErrors.password && (
                        <span className="text-[11px] text-red-400 leading-tight">{regErrors.password}</span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-zinc-300">Confirm password</label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••••••"
                        value={regForm.confirmPassword}
                        onChange={(e) =>
                          setRegForm({ ...regForm, confirmPassword: e.target.value })
                        }
                        className={`h-9 px-3 rounded-md bg-zinc-900/90 border text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-colors ${
                          regErrors.confirmPassword ? 'border-red-500/60' : 'border-zinc-800'
                        }`}
                      />
                      {regErrors.confirmPassword && (
                        <span className="text-[11px] text-red-400">{regErrors.confirmPassword}</span>
                      )}
                    </div>
                  </div>

                  {/* Phone & Date of Birth */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-zinc-300">Phone number</label>
                      <input
                        type="tel"
                        placeholder="9822334455"
                        value={regForm.phone}
                        onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                        className={`h-9 px-3 rounded-md bg-zinc-900/90 border text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-colors ${
                          regErrors.phone ? 'border-red-500/60' : 'border-zinc-800'
                        }`}
                      />
                      {regErrors.phone && (
                        <span className="text-[11px] text-red-400">{regErrors.phone}</span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-zinc-300">Date of birth (≥18)</label>
                      <input
                        type="date"
                        value={regForm.dob}
                        onChange={(e) => setRegForm({ ...regForm, dob: e.target.value })}
                        className={`h-9 px-3 rounded-md bg-zinc-900/90 border text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-colors ${
                          regErrors.dob ? 'border-red-500/60' : 'border-zinc-800'
                        }`}
                      />
                      {regErrors.dob && (
                        <span className="text-[11px] text-red-400">{regErrors.dob}</span>
                      )}
                    </div>
                  </div>

                  {/* Role */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-zinc-300">Technical role</label>
                    <select
                      value={regForm.role}
                      onChange={(e) => setRegForm({ ...regForm, role: e.target.value })}
                      className="h-9 px-3 rounded-md bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                    >
                      <option value="Fullstack Developer">Fullstack Developer</option>
                      <option value="Frontend Engineer">Frontend Engineer</option>
                      <option value="Backend Specialist">Backend Specialist</option>
                      <option value="DevOps Engineer">DevOps Engineer</option>
                      <option value="UI/UX Designer">UI/UX Designer</option>
                    </select>
                  </div>

                  {/* Terms */}
                  <div className="flex flex-col gap-1 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={regForm.terms}
                        onChange={(e) => setRegForm({ ...regForm, terms: e.target.checked })}
                        className="size-3.5 rounded border-zinc-700 bg-zinc-900 text-zinc-100 focus:ring-0 cursor-pointer"
                      />
                      <span className="text-xs text-zinc-400">
                        I agree to terms and server verification
                      </span>
                    </label>
                    {regErrors.terms && (
                      <span className="text-[11px] text-red-400">{regErrors.terms}</span>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 h-9 w-full rounded-md bg-zinc-100 text-zinc-900 font-medium text-xs hover:bg-white active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <>
                        <span>Submit registration</span>
                        <ArrowRight className="size-3.5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* SIGN IN TAB */}
          {tab === 'login' && (
            <div className="bg-[#121215] border border-zinc-800/90 rounded-xl p-6 shadow-2xl">
              {loginSuccess ? (
                <div className="py-8 text-center flex flex-col items-center gap-3">
                  <div className="size-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Check className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-zinc-100">Authenticated</h2>
                    <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto font-mono text-[11px]">
                      Token: {loginSuccess.auth.token.slice(0, 24)}...
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLoginSuccess(null)}
                    className="mt-4 text-xs font-medium text-zinc-300 hover:text-white underline underline-offset-4"
                  >
                    Sign in again
                  </button>
                </div>
              ) : (
                <form onSubmit={submitLogin} className="flex flex-col gap-4">
                  <div>
                    <h1 className="text-lg font-semibold tracking-tight text-zinc-100">Sign in</h1>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Enter credentials for backend verification.
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-zinc-300">Username or email</label>
                    <input
                      type="text"
                      placeholder="admin@portal.dev"
                      value={loginForm.identifier}
                      onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
                      className={`h-9 px-3 rounded-md bg-zinc-900/90 border text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-400 ${
                        loginErrors.identifier ? 'border-red-500/60' : 'border-zinc-800'
                      }`}
                    />
                    {loginErrors.identifier && (
                      <span className="text-[11px] text-red-400">{loginErrors.identifier}</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-zinc-300">Password</label>
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      className={`h-9 px-3 rounded-md bg-zinc-900/90 border text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-400 ${
                        loginErrors.password ? 'border-red-500/60' : 'border-zinc-800'
                      }`}
                    />
                    {loginErrors.password && (
                      <span className="text-[11px] text-red-400">{loginErrors.password}</span>
                    )}
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={loginForm.rememberMe}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, rememberMe: e.target.checked })
                      }
                      className="size-3.5 rounded border-zinc-700 bg-zinc-900 text-zinc-100 focus:ring-0 cursor-pointer"
                    />
                    <span className="text-xs text-zinc-400">Remember session (30 days)</span>
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 h-9 w-full rounded-md bg-zinc-100 text-zinc-900 font-medium text-xs hover:bg-white active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <>
                        <span>Sign in</span>
                        <ArrowRight className="size-3.5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Quick Test Presets (For Assignment Evaluation) */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-2 px-1">
            <span className="text-xs text-zinc-400 font-medium">Test scenarios:</span>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => loadPreset('valid')}
                className="bg-white text-zinc-950 font-semibold text-xs px-3 py-1 rounded-full shadow-sm hover:bg-zinc-200 active:scale-95 transition-all cursor-pointer"
              >
                Valid
              </button>
              <button
                type="button"
                onClick={() => loadPreset('underage')}
                className="bg-white text-zinc-950 font-semibold text-xs px-3 py-1 rounded-full shadow-sm hover:bg-zinc-200 active:scale-95 transition-all cursor-pointer"
              >
                Underage (&lt;18)
              </button>
              <button
                type="button"
                onClick={() => loadPreset('weak-password')}
                className="bg-white text-zinc-950 font-semibold text-xs px-3 py-1 rounded-full shadow-sm hover:bg-zinc-200 active:scale-95 transition-all cursor-pointer"
              >
                Weak pass
              </button>
              <button
                type="button"
                onClick={() => loadPreset('empty')}
                className="text-xs text-zinc-400 hover:text-zinc-200 px-2 py-1 transition-colors cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>

          {/* UX-Friendly Server Response & Error Log */}
          {lastResponse && (
            <div className="mt-6 border border-zinc-800 rounded-xl overflow-hidden bg-[#121215] shadow-xl">
              {/* Header */}
              <div className="px-4 py-3 bg-zinc-900/80 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`size-2 rounded-full ${
                      lastResponse.status < 300 ? 'bg-emerald-400' : 'bg-red-400'
                    }`}
                  />
                  <span className="text-xs font-semibold text-zinc-200">
                    {lastResponse.status < 300
                      ? 'Server Verified'
                      : `Server Validation Error (HTTP ${lastResponse.status})`}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-700/60">
                    {lastResponse.endpoint}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowInspector(!showInspector)}
                    className="text-zinc-400 hover:text-zinc-200 p-1 cursor-pointer"
                    title={showInspector ? 'Collapse' : 'Expand'}
                  >
                    {showInspector ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                  </button>
                </div>
              </div>

              {showInspector && (
                <div className="p-4 flex flex-col gap-3">
                  {/* Mode Tabs & Copy Action */}
                  <div className="flex items-center justify-between border-b border-zinc-800/70 pb-2.5">
                    <div className="flex items-center gap-1.5 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
                      <button
                        type="button"
                        onClick={() => setLogTab('diagnostics')}
                        className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                          logTab === 'diagnostics'
                            ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <ListFilter className="size-3" />
                        <span>Diagnostics</span>
                        {lastResponse.data?.errors && (
                          <span className="bg-red-500/20 text-red-400 px-1.5 py-0.2 rounded-full text-[10px]">
                            {lastResponse.data.errors.length}
                          </span>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setLogTab('json')}
                        className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                          logTab === 'json'
                            ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <Code className="size-3" />
                        <span>Raw JSON</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(lastResponse.data, null, 2));
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 px-2 py-1 rounded border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <CheckCheck className="size-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* TAB 1: User-friendly Diagnostics */}
                  {logTab === 'diagnostics' && (
                    <div className="flex flex-col gap-2">
                      {lastResponse.status >= 400 && lastResponse.data?.errors ? (
                        <>
                          <div className="flex items-center gap-2 text-xs text-red-300 bg-red-950/20 border border-red-500/20 rounded-md p-2.5">
                            <ShieldAlert className="size-4 shrink-0 text-red-400" />
                            <span>
                              Express rejected <strong>{lastResponse.data.errors.length}</strong> input field(s) via <code>express-validator</code>:
                            </span>
                          </div>

                          <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto pr-1">
                            {lastResponse.data.errors.map((err, i) => (
                              <div
                                key={i}
                                className="bg-zinc-900/90 border border-zinc-800/80 rounded-md p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded font-semibold shrink-0">
                                    {err.field}
                                  </span>
                                  <span className="text-zinc-300 font-medium">{err.message}</span>
                                </div>
                                {err.value && (
                                  <span className="text-[10px] font-mono text-zinc-500 truncate max-w-[120px]">
                                    sent: "{String(err.value)}"
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </>
                      ) : lastResponse.status < 300 ? (
                        <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-md p-3 text-xs text-emerald-300 flex items-start gap-2.5">
                          <Check className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold">{lastResponse.data?.message || 'Payload verified successfully.'}</p>
                            <p className="text-zinc-400 text-[11px] mt-1">
                              Server processed all constraints and returned HTTP status <strong>{lastResponse.status}</strong>.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-zinc-400">{lastResponse.data?.message || 'Request finished.'}</p>
                      )}
                    </div>
                  )}

                  {/* TAB 2: Clean Syntax JSON */}
                  {logTab === 'json' && (
                    <pre className="text-[11px] font-mono text-zinc-300 bg-black/90 p-3 rounded-md border border-zinc-800 overflow-x-auto leading-relaxed max-h-56">
                      {JSON.stringify(lastResponse.data, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-zinc-800/50 py-4 px-6 text-center text-xs text-zinc-600">
        <p>Web Technology · Server-side validation using ExpressJS & express-validator</p>
      </footer>
    </div>
  );
}
