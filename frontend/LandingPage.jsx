import React from 'react';
import { Clock, Scan, DollarSign } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080c14] text-white selection:bg-blue-500 selection:text-white relative overflow-hidden font-sans">
      {/* Background Radial Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Navigation Bar */}
        <nav className="py-7 flex items-center justify-between">
          <div className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            ParkSmart AI
          </div>

          <div className="hidden md:flex items-center gap-9 text-slate-400 text-sm font-medium">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
          </div>

          <div className="flex items-center gap-3">
            <button className="text-white hover:bg-white/10 px-5 py-2.5 rounded-full text-sm font-semibold transition-all">
              Login
            </button>
            <button className="bg-white/5 hover:bg-white/10 text-white border border-white/15 px-6 py-2 rounded-full text-sm font-semibold backdrop-blur-md transition-all shadow-sm">
              Register
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-12 pb-20 grid grid-cols-1 lg:grid-cols-12 items-center gap-12">
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.12] text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-300">
              Book Your Parking Spot in Seconds
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              AI-powered smart parking with real-time availability, license plate recognition, and dynamic pricing
            </p>
            <div className="flex items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#book"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold px-8 py-3.5 rounded-full shadow-[0_0_25px_rgba(59,130,246,0.6)] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Get Started
              </a>
              <a
                href="#demo"
                className="bg-slate-900/60 hover:bg-blue-600/10 text-blue-400 hover:text-blue-300 border border-blue-500/40 px-8 py-3.5 rounded-full font-semibold backdrop-blur-xl transition-all"
              >
                View Demo
              </a>
            </div>
          </div>

          {/* Right 3D Visual */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-3 backdrop-blur-xl shadow-2xl hover:border-blue-500/30 transition-all">
              <img
                src="/parking-hero.png"
                alt="ParkSmart 3D Parking"
                className="w-full h-auto rounded-2xl object-cover"
              />
            </div>
          </div>
        </section>

        {/* Feature Glass Cards */}
        <section className="pb-24 grid grid-cols-1 md:grid-cols-3 gap-6" id="features">
          {/* Card 1 */}
          <div className="group bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-blue-500/40 rounded-2xl p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-5">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Real-time Availability</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              AI-powered smart parking with real-time availability, license plate tracking, and live space sensors.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-blue-500/40 rounded-2xl p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-5">
              <Scan className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 tracking-tight">AI Plate Recognition</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Automated OCR plate scanning with CRAFT & CRNN models for fast frictionless check-in.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-blue-500/40 rounded-2xl p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-5">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Smart Pricing</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Smart pricing houses automatic dynamic surge pricing for high mobility, premium, and regular slots.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
