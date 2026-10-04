import React, { useState, useEffect } from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Check, QrCode, Download, RefreshCw, AlertCircle } from 'lucide-react';
import { bookingService } from '../services/bookingService';

export const BookingPassPage = () => {
  const { state } = useLocation();
  const { id } = useParams();

  const [booking, setBooking] = useState(state?.booking || null);
  const [loading, setLoading] = useState(!state?.booking);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!booking && id) {
      const fetchBookingData = async () => {
        setLoading(true);
        setError('');
        try {
          const res = await bookingService.getBookingById(id);
          if (res && res.success && res.data) {
            setBooking(res.data);
          } else {
            throw new Error(res?.message || 'Booking not found');
          }
        } catch (err) {
          setError(err.message || 'Could not load booking details.');
        } finally {
          setLoading(false);
        }
      };

      fetchBookingData();
    }
  }, [id, booking]);

  const handleDownloadQR = () => {
    if (!booking) return;
    const qrUrl = bookingService.getQrCodeUrl(booking.id);
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `ParkSmart_Pass_${booking.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDateTime = (dtStr) => {
    if (!dtStr) return 'N/A';
    try {
      const d = new Date(dtStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return dtStr;
    }
  };

  const formatDate = (dtStr) => {
    if (!dtStr) return 'N/A';
    try {
      const d = new Date(dtStr);
      return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dtStr;
    }
  };

  return (
    <div className="min-h-screen bg-[#0b101d] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 flex flex-col items-center justify-center relative">
        {/* Background Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

        {loading ? (
          <div className="relative z-10 p-12 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Loading booking pass from API...</p>
          </div>
        ) : error || !booking ? (
          <div className="relative z-10 p-8 max-w-md bg-[#131c31] border border-rose-500/30 rounded-3xl text-center space-y-4">
            <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">Booking Not Found</h3>
            <p className="text-xs text-slate-400">{error || 'Unable to retrieve booking information.'}</p>
            <Link
              to="/dashboard"
              className="inline-block px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white"
            >
              Back to Dashboard
            </Link>
          </div>
        ) : (
          <div className="relative z-10 w-full max-w-md bg-[#131c31]/90 backdrop-blur-2xl border border-blue-500/30 rounded-3xl p-8 flex flex-col items-center text-center shadow-[0_0_50px_rgba(59,130,246,0.2)]">
            {/* Green Verified Badge */}
            <div className="w-12 h-12 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(16,185,129,0.5)]">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-1">Booking Confirmed!</h2>
            <p className="text-xs text-slate-400 font-mono mb-6">Booking #{booking.id}</p>

            {/* Dynamic QR Code from Backend API */}
            <div className="p-4 bg-white rounded-2xl shadow-xl mb-6 flex items-center justify-center">
              <img
                src={bookingService.getQrCodeUrl(booking.id)}
                alt="Booking Entry QR Code"
                className="w-44 h-44 object-contain"
                onError={(e) => {
                  // Fallback icon if image fails to render
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div style={{ display: 'none' }}>
                <QrCode className="w-44 h-44 text-slate-900" />
              </div>
            </div>

            {/* Details Grid */}
            <div className="w-full grid grid-cols-2 gap-y-3 text-left text-xs mb-6 px-2 bg-slate-900/40 p-4 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-400 block">Slot: <strong className="text-white">{booking.slotCode}</strong></span>
                <span className="text-slate-400 block mt-1">Zone: <strong className="text-white">{booking.zone}</strong></span>
                <span className="text-slate-400 block mt-1">Date: <strong className="text-white">{formatDate(booking.startTime || booking.createdAt)}</strong></span>
              </div>

              <div>
                <span className="text-slate-400 block">Plate: <strong className="text-white">{booking.plateNumber || 'N/A'}</strong></span>
                <span className="text-slate-400 block mt-1">Time: <strong className="text-white">{formatDateTime(booking.startTime)} - {formatDateTime(booking.endTime)}</strong></span>
                <div className="mt-2 flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase">
                    {booking.status || 'ACTIVE'}
                  </span>
                  <span className="text-slate-400 text-xs">Total: <strong className="text-blue-400 font-mono">₹{booking.totalPrice}</strong></span>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 w-full">
              <button
                onClick={handleDownloadQR}
                className="w-1/2 py-2.5 px-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Download QR
              </button>
              <Link
                to="/dashboard"
                className="w-1/2 py-2.5 px-4 rounded-full border border-blue-500/40 text-blue-400 hover:bg-blue-500/10 text-xs font-semibold transition-all text-center"
              >
                View Grid
              </Link>
            </div>

            <p className="text-[11px] text-slate-400 mt-6">
              Show this QR code at the parking entry gate scanner
            </p>
          </div>
        )}
      </main>
    </div>
  );
};
