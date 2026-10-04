import React from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Check, QrCode } from 'lucide-react';

export const BookingPassPage = () => {
  const { state } = useLocation();
  const { id } = useParams();

  const booking = state?.booking || {
    bookingId: id || 'BK-893012',
    slotCode: 'A3',
    zone: 'A',
    vehicleNumber: 'MH 12 AB 1234',
    date: 'Oct 4, 2026',
    startTime: '2:00 PM',
    endTime: '5:00 PM',
    totalPrice: 180,
  };

  const handleDownloadQR = () => {
    alert(`QR Entry Pass for Booking ${booking.bookingId} downloaded!`);
  };

  return (
    <div className="min-h-screen bg-[#0b101d] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 flex flex-col items-center justify-center relative">
        {/* Subtle radial glow in background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Screen 5 Card matching exact mockup */}
        <div className="relative z-10 w-full max-w-md bg-[#131c31]/80 backdrop-blur-2xl border border-blue-500/30 rounded-3xl p-8 flex flex-col items-center text-center shadow-[0_0_50px_rgba(59,130,246,0.15)]">
          
          {/* Green Checkmark Badge */}
          <div className="w-12 h-12 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(16,185,129,0.5)]">
            <Check className="w-6 h-6 stroke-[3]" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-6">Booking Confirmed!</h2>

          {/* Large Centered QR Code */}
          <div className="p-4 bg-white rounded-2xl shadow-xl mb-6">
            <QrCode className="w-44 h-44 text-slate-900" />
          </div>

          {/* Details Row */}
          <div className="w-full grid grid-cols-2 gap-y-3 text-left text-xs mb-6 px-2">
            <div>
              <span className="text-slate-400 block">Slot: <strong className="text-white">{booking.slotCode}</strong></span>
              <span className="text-slate-400 block mt-1">Date: <strong className="text-white">{booking.date}</strong></span>
              <span className="text-slate-400 block mt-1">Zone: <strong className="text-white">{booking.zone}</strong></span>
            </div>

            <div>
              <span className="text-slate-400 block">Vehicle: <strong className="text-white">{booking.vehicleNumber}</strong></span>
              <span className="text-slate-400 block mt-1">Time: <strong className="text-white">{booking.startTime} - {booking.endTime}</strong></span>
              <div className="mt-2 flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  ACTIVE
                </span>
                <span className="text-slate-400 text-xs">Total: <strong className="text-white font-mono">₹{booking.totalPrice}</strong></span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 w-full">
            <button
              onClick={handleDownloadQR}
              className="w-1/2 py-2.5 px-4 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all"
            >
              Download QR
            </button>
            <Link
              to="/dashboard"
              className="w-1/2 py-2.5 px-4 rounded-full border border-blue-500/40 text-blue-400 hover:bg-blue-500/10 text-xs font-semibold transition-all text-center"
            >
              View Bookings
            </Link>
          </div>

          {/* Subtitle Footer */}
          <p className="text-[11px] text-slate-400 mt-6">
            Show this QR code at the parking entry gate
          </p>
        </div>
      </main>
    </div>
  );
};
