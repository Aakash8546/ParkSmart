import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Car, User, Search, LayoutDashboard, Shield, PlusCircle, Calendar, Sparkles } from 'lucide-react';
import { authService } from '../services/authService';

export const Navbar = ({ onSearchChange, showSearch = false }) => {
  const location = useLocation();
  const user = authService.getCurrentUser();
  const role = authService.getRole();
  const isAdmin = role === 'ADMIN';
  const isGuard = role === 'GUARD';

  return (
    <nav className="sticky top-0 z-40 bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-800/80 px-6 py-3.5 flex items-center justify-between text-xs">
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <Car className="w-5 h-5" />
          </div>
          <span className="text-base font-extrabold tracking-tight text-white">
            ParkSmart <span className="text-blue-400 font-normal">AI</span>
          </span>
        </Link>

        {/* Role-Based Nav Links */}
        <div className="hidden lg:flex items-center gap-4 text-slate-300 font-medium border-l border-slate-800 pl-6">
          <Link to="/dashboard" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
            <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
          </Link>

          {/* User & Admin Links */}
          {!isGuard && (
            <>
              <Link to="/bookings" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> My Bookings
              </Link>
              <Link to="/vehicles/add" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                <PlusCircle className="w-3.5 h-3.5" /> Add Vehicle (ML)
              </Link>
              <Link to="/demand-prediction" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 text-cyan-300">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> AI Forecast
              </Link>
            </>
          )}

          {/* Admin Exclusive Link */}
          {isAdmin && (
            <Link to="/admin" className="hover:text-purple-400 transition-colors flex items-center gap-1.5 text-purple-300 font-bold">
              <Shield className="w-3.5 h-3.5 text-purple-400" /> Admin
            </Link>
          )}

          {/* Guard & Admin Link */}
          {(isGuard || isAdmin) && (
            <Link to="/guard/scan" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-emerald-300 font-bold">
              <Shield className="w-3.5 h-3.5 text-emerald-400" /> Guard Scanner
            </Link>
          )}
        </div>
      </div>

      {showSearch && (
        <div className="relative max-w-sm w-full hidden md:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search slot (e.g. A3, B2)..."
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-100 placeholder-slate-400 outline-none focus:border-blue-500 transition-all"
          />
        </div>
      )}

      <div className="flex items-center gap-3">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="flex items-center justify-end gap-1.5">
                <p className="text-xs font-bold text-white">{user.name || 'User'}</p>
                <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${
                  isAdmin ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' :
                  isGuard ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                  'bg-blue-500/20 text-blue-300 border-blue-500/40'
                }`}>
                  {role}
                </span>
              </div>
              <p className="text-[10px] text-slate-400">{user.email || 'user@parksmart.com'}</p>
            </div>
            <button
              onClick={() => {
                authService.logout();
                window.location.href = '/login';
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-[11px]"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-3.5 py-1.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-all font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-[0_0_12px_rgba(59,130,246,0.3)] transition-all"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
