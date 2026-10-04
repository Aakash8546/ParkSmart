import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Car, User, Bell, Search } from 'lucide-react';

export const Navbar = ({ onSearchChange, showSearch = false }) => {
  const location = useLocation();
  const isDashboard = location.pathname.includes('/dashboard');

  return (
    <nav className="sticky top-0 z-40 bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          <Car className="w-6 h-6" />
        </div>
        <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          ParkSmart
        </span>
      </Link>

      {showSearch && (
        <div className="relative max-w-md w-full hidden md:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search slot (e.g. A3, B2)..."
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
      )}

      <div className="flex items-center gap-4">
        {!isDashboard ? (
          <>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
              <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
              <a href="#pricing" className="hover:text-blue-400 transition-colors">Pricing</a>
              <a href="#about" className="hover:text-blue-400 transition-colors">About</a>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25 transition-all"
              >
                Dashboard Grid
              </Link>
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Login
              </Link>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            </button>
            <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-500 p-[2px]">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <User className="w-4 h-4 text-slate-200" />
                </div>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-slate-200">Alex Morgan</p>
                <p className="text-[11px] text-slate-400">Driver Pass #4902</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
