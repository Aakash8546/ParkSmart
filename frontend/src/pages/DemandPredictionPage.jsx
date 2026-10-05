import React from 'react';
import { Navbar } from '../components/Navbar';
import { AiDemandPrediction } from '../components/AiDemandPrediction';
import { useNavigate } from 'react-router-dom';
import { Sparkles, TrendingUp, Clock, ShieldCheck, Zap } from 'lucide-react';

export const DemandPredictionPage = () => {
  const navigate = useNavigate();

  const handleSelectBestTime = (time) => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0b101d] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 space-y-6">
        {/* Breadcrumb */}
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span>Dashboard</span> &gt; <span>AI Insights</span> &gt;{' '}
          <span className="text-slate-200 font-semibold">Demand Prediction</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              AI Demand & Surge Forecasting <Sparkles className="w-6 h-6 text-blue-400 animate-pulse" />
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Real-time occupancy forecasting powered by Random Forest regression & historical footfall patterns.
            </p>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all shrink-0"
          >
            Go to Slot Grid
          </button>
        </div>

        {/* AI Insight Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#131b2e]/90 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Best Window</p>
              <h3 className="text-sm font-bold text-white">1:00 PM – 3:00 PM</h3>
            </div>
          </div>

          <div className="bg-[#131b2e]/90 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Peak Surge Expected</p>
              <h3 className="text-sm font-bold text-white">9:00 AM – 11:00 AM</h3>
            </div>
          </div>

          <div className="bg-[#131b2e]/90 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Dynamic Discount</p>
              <h3 className="text-sm font-bold text-emerald-400">Up to 25% Off</h3>
            </div>
          </div>
        </div>

        {/* Main AI Demand Prediction Component */}
        <AiDemandPrediction onSelectBestTime={handleSelectBestTime} />
      </main>
    </div>
  );
};
