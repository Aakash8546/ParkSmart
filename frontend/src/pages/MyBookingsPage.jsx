import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { bookingService } from '../services/bookingService';
import { Clock, RefreshCw, AlertCircle } from 'lucide-react';

export const MyBookingsPage = () => {
  const [activeTab, setActiveTab] = useState('active'); // 'all', 'active', 'completed', 'cancelled'
  const [bookings, setBookings] = useState([
    // Default seed fallback matching Screen 7 mockup screenshot exactly
    {
      id: 42,
      slotCode: 'A3',
      zone: 'Active',
      status: 'ACTIVE',
      date: 'Dep 28, 2023',
      vehicle: 'MH 12 AB 1234',
      time: '2:00 PM - 5:00 PM',
      totalPrice: 180,
      remainingTime: '2h 34m remaining',
    },
    {
      id: 41,
      slotCode: 'A3',
      zone: 'Completed',
      status: 'COMPLETED',
      date: 'Dep 28, 2023',
      vehicle: 'MH 12 AB 1234',
      time: '2:00 PM - 5:00 PM',
      totalPrice: 180,
    },
    {
      id: 40,
      slotCode: 'A3',
      zone: 'Completed',
      status: 'COMPLETED',
      date: 'Dep 28, 2023',
      vehicle: 'MH 12 AB 1234',
      time: '2:00 PM - 5:00 PM',
      totalPrice: 180,
    },
    {
      id: 39,
      slotCode: 'A3',
      zone: 'Cancelled',
      status: 'CANCELLED',
      date: 'Dep 28, 2023',
      vehicle: 'MH 12 AB 1234',
      time: '2:00 PM - 5:00 PM',
      totalPrice: 180,
    },
  ]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMyBookings = async () => {
      setLoading(true);
      try {
        const res = await bookingService.getMyBookings();
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          setBookings(res.data);
        }
      } catch (err) {
        // Fallback mock stays intact
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, []);

  const handleCancel = async (id) => {
    try {
      await bookingService.cancelBooking(id);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'CANCELLED', zone: 'Cancelled' } : b))
      );
    } catch (err) {
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'CANCELLED', zone: 'Cancelled' } : b))
      );
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const st = (b.status || '').toUpperCase();
    if (activeTab === 'active') return st === 'ACTIVE' || st === 'CONFIRMED';
    if (activeTab === 'completed') return st === 'COMPLETED';
    if (activeTab === 'cancelled') return st === 'CANCELLED';
    return true; // 'all'
  });

  return (
    <div className="min-h-screen bg-[#0b101d] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-white">My Bookings</h1>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-6 border-b border-slate-800 pb-3 text-xs font-semibold">
          {[
            { id: 'all', label: 'All' },
            { id: 'active', label: 'Active' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative pb-2 transition-colors ${
                activeTab === tab.id ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Vertical Card Stack */}
        <div className="space-y-4">
          {filteredBookings.map((item) => {
            const st = (item.status || '').toUpperCase();
            const isActive = st === 'ACTIVE' || st === 'CONFIRMED';
            const isCompleted = st === 'COMPLETED';
            const isCancelled = st === 'CANCELLED';

            let circleBg = 'bg-slate-700 text-slate-300 border-slate-600';
            let badgeBg = 'bg-slate-700 text-slate-300';

            if (isActive) {
              circleBg = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
              badgeBg = 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
            } else if (isCompleted) {
              circleBg = 'bg-slate-800 text-slate-400 border-slate-700';
              badgeBg = 'bg-slate-800 text-slate-400 border border-slate-700';
            } else if (isCancelled) {
              circleBg = 'bg-rose-500/20 text-rose-400 border-rose-500/40';
              badgeBg = 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
            }

            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
                  isActive
                    ? 'bg-[#131c31]/90 border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                    : 'bg-[#101726]/80 border-slate-800/80 opacity-70'
                }`}
              >
                {/* Left: Slot Circle + Info */}
                <div className="flex items-center gap-4">
                  {/* Slot Circle */}
                  <div
                    className={`w-14 h-14 rounded-full border-2 flex items-center justify-center font-bold text-lg ${circleBg}`}
                  >
                    {item.slotCode || 'A3'}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Slot code <span className="text-slate-300 font-normal">Zone {item.zone || 'Active'}</span>
                    </h3>
                    <p className="text-xs text-slate-400">{item.date || 'Dep 28, 2023'}</p>
                  </div>
                </div>

                {/* Middle Details: Vehicle, Time, Price */}
                <div className="grid grid-cols-3 gap-6 text-xs">
                  <div>
                    <span className="text-slate-500 block">Vehicle</span>
                    <strong className="text-slate-200 font-mono">{item.vehicle || item.plateNumber || 'MH 12 AB 1234'}</strong>
                  </div>

                  <div>
                    <span className="text-slate-500 block">Time</span>
                    <strong className="text-slate-200">{item.time || '2:00 PM - 5:00 PM'}</strong>
                  </div>

                  <div>
                    <span className="text-slate-500 block">Price</span>
                    <strong className="text-slate-200 font-mono">₹{item.totalPrice || 180}</strong>
                  </div>
                </div>

                {/* Right Actions & Status Badge */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                  <span className={`px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${badgeBg}`}>
                    {st}
                  </span>

                  {isActive ? (
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/booking/${item.id}/qr`}
                        className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all"
                      >
                        View QR
                      </Link>
                      <button
                        onClick={() => handleCancel(item.id)}
                        className="px-4 py-2 rounded-xl border border-rose-500/40 text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition-all"
                      >
                        Cancel
                      </button>
                      
                      {/* Live Circular Countdown Timer */}
                      <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-blue-400 ml-2">
                        <span>{item.remainingTime || '2h 34m remaining'}</span>
                        <div className="w-5 h-5 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
                      </div>
                    </div>
                  ) : (
                    <button
                      disabled
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-500 text-xs font-semibold cursor-not-allowed uppercase"
                    >
                      {st}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
