import React from 'react';
import { Sparkles, Calendar, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AiDemandPrediction = ({ onSelectBestTime }) => {
  const hourlyPrediction = [
    { time: '6 AM', demand: 'low', color: '#10b981', height: '35%' },
    { time: '7 AM', demand: 'low', color: '#10b981', height: '45%' },
    { time: '8 AM', demand: 'medium', color: '#f59e0b', height: '60%' },
    { time: '9 AM', demand: 'high', color: '#f43f5e', height: '85%' },
    { time: '10 AM', demand: 'high', color: '#f43f5e', height: '95%' },
    { time: '12 PM', demand: 'medium', color: '#f59e0b', height: '70%' },
    { time: '1 PM', demand: 'high', color: '#f43f5e', height: '55%' },
    { time: '2 PM', demand: 'low', color: '#10b981', height: '80%' },
    { time: '3 PM', demand: 'medium', color: '#f59e0b', height: '80%' },
    { time: '5 PM', demand: 'high', color: '#f43f5e', height: '50%' },
    { time: '6 PM', demand: 'high', color: '#f43f5e', height: '45%' },
    { time: '7 PM', demand: 'medium', color: '#f59e0b', height: '65%' },
    { time: '9 PM', demand: 'low', color: '#10b981', height: '50%' },
    { time: '10 PM', demand: 'low', color: '#10b981', height: '40%' },
  ];

  return (
    <div className="bg-[#131c31]/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
          <h2 className="text-xl font-bold text-white tracking-tight">
            AI-Powered Best Time to Book
          </h2>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500" />
            <span className="text-slate-300 font-medium">= Low</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500" />
            <span className="text-slate-300 font-medium">= Medium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-rose-500" />
            <span className="text-slate-300 font-medium">= High</span>
          </div>
        </div>
      </div>

      {/* 24-Hour Color-Coded Bar Chart */}
      <div className="h-48 w-full flex items-end justify-between gap-2 pt-6 pb-2 px-2">
        {hourlyPrediction.map((item, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
            <div
              className="w-full rounded-t-lg transition-all group-hover:brightness-125"
              style={{ height: item.height, backgroundColor: item.color }}
            />
            <span className="text-[10px] text-slate-400 font-mono mt-2">{item.time}</span>
          </div>
        ))}
      </div>

      {/* Recommendation Callout Banner */}
      <div className="p-4 rounded-2xl bg-[#0e1626] border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs sm:text-sm text-slate-200">
          <span className="text-emerald-400 font-bold mr-1">Recommended:</span>
          Book between <strong className="text-white">1PM-3PM</strong> for lowest prices and <strong className="text-white">guaranteed availability</strong>
        </div>

        <button
          onClick={() => onSelectBestTime && onSelectBestTime('1:00 PM')}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all shrink-0 text-center"
        >
          Book Now for 1PM
        </button>
      </div>

      {/* Attribution */}
      <div className="text-center">
        <span className="text-[11px] font-mono text-slate-500">
          Predicted by Random Forest ML Model
        </span>
      </div>

    </div>
  );
};
