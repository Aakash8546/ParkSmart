import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Car, User, Bell, Search, LogOut } from 'lucide-react';
import { authService } from '../services/authService';

export const Navbar = ({ onSearchChange, showSearch = false }) => {
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname.includes('/dashboard');

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
  }, [location.pathname]);

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          <Car className="w-6 h-6" />
        </div>
        <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          ParkSmart AI
        </span>
      </Link>

      {showSearch && (
        <div className="relative max-w-md w-full hidden md:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search slot code (e.g. A1, B3)..."
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
      )}

      <div className="flex items-center gap-4">
        {!currentUser ? (
          <>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
              <Link to="/dashboard" className="hover:text-blue-400 transition-colors">Live Grid</Link>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl text-xs font-medium border border-slate-700 bg-slate-800/60 text-slate-200 hover:bg-slate-700 transition-all"
              >
                Register
              </Link>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/vehicles/add"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-blue-500/40 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all flex items-center gap-1.5"
            >
              <span>+ Add Vehicle (AI OCR)</span>
            </Link>

            <Link
              to="/dashboard"
              className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                isDashboard
                  ? 'bg-blue-600/30 border-blue-500 text-blue-400'
                  : 'border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              Grid
            </Link>

            <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-500 p-[1.5px]">
                <div className="w-full h-full bg-slate-900 rounded-[7px] flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-400" />
                </div>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-slate-200">{currentUser.name || currentUser.email}</p>
                <p className="text-[10px] text-slate-400 font-mono uppercase">{currentUser.role || 'USER'}</p>
              </div>

              <button
                onClick={handleLogout}
                title="Logout"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 transition-all ml-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
