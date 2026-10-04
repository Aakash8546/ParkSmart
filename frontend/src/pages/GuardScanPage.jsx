import React, { useState } from 'react';
import { Camera, Check, Shield, QrCode, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const GuardScanPage = () => {
  const [scannedBooking, setScannedBooking] = useState({
    id: 42,
    userName: 'Aakash Srivastava',
    slotCode: 'A3',
    zone: 'A',
    vehicle: 'MH 12 AB 1234 (SUV)',
    time: '2:00 PM - 5:00 PM',
    status: 'ACTIVE',
  });

  const [entryDecision, setEntryDecision] = useState(null); // 'allowed' or 'denied'

  const handleAllowEntry = () => {
    setEntryDecision('allowed');
  };

  const handleDenyEntry = () => {
    setEntryDecision('denied');
  };

  return (
    <div className="min-h-screen bg-[#0b101d] text-slate-100 flex flex-col font-sans">
      {/* Navbar for Guard View */}
      <header className="bg-[#101726] border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            ParkSmart AI — <span className="text-blue-400">Guard View</span>
          </span>
        </div>

        <Link
          to="/dashboard"
          className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white"
        >
          User Dashboard
        </Link>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 flex flex-col items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-center">
          
          {/* Left Column: Camera Viewfinder with Blue Scanning Laser Line */}
          <div className="lg:col-span-7 bg-[#101726] border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl min-h-[380px]">
            
            {/* Viewfinder Camera Box */}
            <div className="relative w-full max-w-md aspect-video rounded-2xl bg-slate-950 border-2 border-slate-700/80 p-4 flex flex-col items-center justify-center overflow-hidden group">
              
              {/* Animated Blue Laser Scanning Line */}
              <div className="absolute left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.8)] animate-pulse top-1/2 -translate-y-1/2 z-20" />

              {/* Viewfinder Corners */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-white" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-white" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-white" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-white" />

              {/* QR Code Graphic inside camera feed */}
              <QrCode className="w-32 h-32 text-slate-200 opacity-90 relative z-10" />
            </div>

            <div className="mt-4 text-center space-y-1">
              <h3 className="text-lg font-bold text-white flex items-center justify-center gap-2">
                Scan QR Code <Camera className="w-5 h-5 text-blue-400" />
              </h3>
              <p className="text-xs text-slate-400">Position QR code within the frame</p>
            </div>
          </div>

          {/* Right Column: Verified Result Card */}
          <div className="lg:col-span-5 bg-[#131c31]/90 border border-slate-800 rounded-3xl p-7 shadow-2xl flex flex-col items-center text-center relative space-y-6">
            
            {/* Green Valid Checkmark */}
            <div className="w-14 h-14 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.5)]">
              <Check className="w-7 h-7 stroke-[3]" />
            </div>

            <h2 className="text-2xl font-bold text-white">Valid Booking</h2>

            {/* Verified Booking Details */}
            <div className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-left space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Booking Pass</span>
                <span className="font-mono font-bold text-blue-400">#{scannedBooking.id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">User</span>
                <span className="font-semibold text-white">{scannedBooking.userName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Slot</span>
                <span className="font-semibold text-white">{scannedBooking.slotCode} - Zone {scannedBooking.zone}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Vehicle</span>
                <span className="font-semibold text-slate-200">{scannedBooking.vehicle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Time</span>
                <span className="font-semibold text-slate-200">{scannedBooking.time}</span>
              </div>
            </div>

            {/* Decision Status Banner */}
            {entryDecision && (
              <div
                className={`w-full p-2.5 rounded-xl text-xs font-bold text-center ${
                  entryDecision === 'allowed'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                }`}
              >
                {entryDecision === 'allowed' ? 'Entry Barrier Lifted (Occupied Broadcasted) ✓' : 'Entry Barrier Denied ✕'}
              </div>
            )}

            {/* Action Buttons: Allow Entry (green solid) + Deny Entry (red outline) */}
            <div className="flex items-center gap-3 w-full pt-2">
              <button
                onClick={handleAllowEntry}
                className="w-1/2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all"
              >
                Allow Entry
              </button>
              <button
                onClick={handleDenyEntry}
                className="w-1/2 py-3 rounded-xl border border-rose-500/60 text-rose-400 hover:bg-rose-500/10 font-bold text-xs transition-all"
              >
                Deny Entry
              </button>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};
