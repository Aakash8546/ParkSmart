import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Cpu, DollarSign } from 'lucide-react';
import heroParkingImg from '../assets/hero_parking.png';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#0b101d] text-white font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Main Container Card matching Mockup Frame */}
      <div className="w-full max-w-5xl bg-[#101726]/90 border border-slate-800/80 rounded-3xl p-8 md:p-12 shadow-[0_0_60px_rgba(0,0,0,0.6)] relative z-10 space-y-12">
        
        {/* Navbar */}
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white tracking-tight">ParkSmart AI</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-slate-400 font-medium">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all"
            >
              Dashboard
            </Link>
            <Link
              to="/login"
              className="px-5 py-2 rounded-xl text-sm font-medium border border-slate-700/80 bg-slate-800/40 text-slate-200 hover:bg-slate-800 transition-all"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-5 py-2 rounded-xl text-sm font-medium border border-slate-700/80 bg-slate-800/40 text-slate-200 hover:bg-slate-800 transition-all"
            >
              Register
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Book Your Parking <br /> Spot in Seconds
            </h1>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-lg">
              AI-powered smart parking with real-time availability, license plate recognition, and dynamic pricing
            </p>

            <div className="flex items-center gap-4 pt-2">
              <Link
                to="/dashboard"
                className="px-7 py-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all"
              >
                Get Started
              </Link>
              <Link
                to="/dashboard"
                className="px-7 py-3 rounded-full border border-blue-500/50 text-blue-400 hover:bg-blue-500/10 text-sm font-semibold transition-all"
              >
                View Demo
              </Link>
            </div>
          </div>

          {/* Hero Right: High-Res 3D Isometric Parking Lot Image */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md group">
              <div className="absolute inset-0 bg-blue-500/20 rounded-3xl blur-2xl group-hover:bg-blue-500/30 transition-all" />
              <img
                src={heroParkingImg}
                alt="3D Isometric Parking Lot Illustration"
                className="relative z-10 w-full h-auto object-contain drop-shadow-2xl rounded-2xl transform group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>

        {/* 3 Feature Cards matching mockup with Top-Left Glass Reflection & Bright Glow Shade */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          
          {/* Card 1 */}
          <div className="relative overflow-hidden bg-[#141d30]/90 border border-slate-700/60 rounded-2xl p-6 space-y-3 backdrop-blur-xl group hover:border-blue-500/50 transition-all">
            {/* Top Left Bright Glow Reflection Effect */}
            <div className="absolute -top-10 -left-10 w-36 h-36 bg-gradient-to-br from-blue-300/30 via-slate-100/15 to-transparent rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />
            
            <div className="relative z-10 w-10 h-10 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center text-blue-400 shadow-md">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="relative z-10 text-base font-bold text-white">Real-time Availability</h3>
            <p className="relative z-10 text-xs text-slate-400 leading-relaxed">
              AI-powered smart parking with real-time availability, license plate recognition.
            </p>
          </div>

          {/* Card 2 */}
          <div className="relative overflow-hidden bg-[#141d30]/90 border border-slate-700/60 rounded-2xl p-6 space-y-3 backdrop-blur-xl group hover:border-blue-500/50 transition-all">
            {/* Top Left Bright Glow Reflection Effect */}
            <div className="absolute -top-10 -left-10 w-36 h-36 bg-gradient-to-br from-blue-300/30 via-slate-100/15 to-transparent rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />

            <div className="relative z-10 w-10 h-10 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center text-blue-400 shadow-md">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="relative z-10 text-base font-bold text-white">AI Plate Recognition</h3>
            <p className="relative z-10 text-xs text-slate-400 leading-relaxed">
              AI-powered smart parking with real-time availability, license plate.
            </p>
          </div>

          {/* Card 3 */}
          <div className="relative overflow-hidden bg-[#141d30]/90 border border-slate-700/60 rounded-2xl p-6 space-y-3 backdrop-blur-xl group hover:border-blue-500/50 transition-all">
            {/* Top Left Bright Glow Reflection Effect */}
            <div className="absolute -top-10 -left-10 w-36 h-36 bg-gradient-to-br from-blue-300/30 via-slate-100/15 to-transparent rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />

            <div className="relative z-10 w-10 h-10 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center text-blue-400 shadow-md">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="relative z-10 text-base font-bold text-white">Smart Pricing</h3>
            <p className="relative z-10 text-xs text-slate-400 leading-relaxed">
              Smart pricing features automatic pricing for peak mobility, premium spots.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
