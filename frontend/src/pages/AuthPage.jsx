import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react';
import authParkingImg from '../assets/auth_parking.png';
import { authService } from '../services/authService';

export const AuthPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      let res;
      if (isRegister) {
        // Call /api/auth/register API
        res = await authService.register(name, email, password, phone);
      } else {
        // Call /api/auth/login API (User & Admin)
        res = await authService.login(email, password);
      }

      if (res && res.success) {
        navigate('/dashboard');
      } else {
        setErrorMessage(res?.message || 'Authentication failed. Please check your credentials.');
      }
    } catch (err) {
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b101d] text-white font-sans flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Main Container Card matching Screen 2 mockup frame */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-[#0e1626] border border-slate-800 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.6)] relative z-10 min-h-[560px]">
        
        {/* Left Side: High-Res 3D Smart Parking Lot Illustration */}
        <div className="lg:col-span-6 bg-[#0a101f] p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-xs">
              P
            </div>
            <span className="text-base font-bold text-white tracking-tight">ParkSmart AI</span>
          </div>

          {/* Uploaded High-Res 3D Smart Parking Image */}
          <div className="my-auto py-6 flex items-center justify-center">
            <img
              src={authParkingImg}
              alt="Smart Parking AI Lot Illustration"
              className="w-full max-w-sm h-auto object-contain drop-shadow-2xl rounded-xl"
            />
          </div>

          <div className="text-xs text-slate-500 text-center">
            Automated ANPR Camera & Barrier Control
          </div>
        </div>

        {/* Right Side: Glassmorphism Form Card */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center items-center relative">
          
          <div className="w-full max-w-sm bg-[#131c31]/90 border border-blue-500/30 rounded-2xl p-7 shadow-[0_0_40px_rgba(59,130,246,0.15)] backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-white text-center mb-6">
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </h2>

            {errorMessage && (
              <div className="mb-4 p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs text-center">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter full name"
                      className="w-full bg-[#1b253b]/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                    className="w-full bg-[#1b253b]/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {isRegister && (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter phone number"
                      className="w-full bg-[#1b253b]/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full bg-[#1b253b]/80 border border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-blue-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {!isRegister && (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-0"
                  />
                  <label htmlFor="remember" className="text-xs text-slate-400">Remember me</label>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs shadow-[0_0_25px_rgba(59,130,246,0.4)] transition-all mt-2 disabled:opacity-70"
              >
                {loading ? 'Authenticating...' : isRegister ? 'Register' : 'Sign In'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setIsRegister(!isRegister);
                  setErrorMessage('');
                }}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                {isRegister ? (
                  <>Already have an account? <span className="text-white font-bold underline">Sign In</span></>
                ) : (
                  <>Don't have an account? <span className="text-white font-bold underline">Register</span></>
                )}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
