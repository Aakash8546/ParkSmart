import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { BookingModal } from '../components/BookingModal';
import { Car, Bike, AlertCircle, RefreshCw } from 'lucide-react';
import { slotService } from '../services/slotService';
import { authService } from '../services/authService';

export const DashboardPage = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedZone, setSelectedZone] = useState('all');
  const [selectedVehicleType, setSelectedVehicleType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSlotForBooking, setSelectedSlotForBooking] = useState(null);

  const navigate = useNavigate();

  const fetchSlots = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await slotService.getAllSlots();
      if (res && res.success && Array.isArray(res.data)) {
        setSlots(res.data);
      } else {
        throw new Error(res?.message || 'Failed to load parking slots');
      }
    } catch (err) {
      setError(err.message || 'Could not connect to backend server. Make sure the backend service is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleSlotClick = (slot) => {
    const statusUpper = (slot.status || '').toUpperCase();
    if (statusUpper !== 'AVAILABLE') return;

    if (!authService.isAuthenticated()) {
      alert('Please sign in first to book a parking slot.');
      navigate('/login');
      return;
    }

    setSelectedSlotForBooking(slot);
  };

  const handleConfirmBooking = (bookingData) => {
    setSelectedSlotForBooking(null);
    fetchSlots(); // Refresh live slots from API
    navigate(`/booking/${bookingData.id}/qr`, { state: { booking: bookingData } });
  };

  // Derive unique zones dynamically from API data
  const zones = Array.from(new Set(slots.map((s) => s.zone || (s.slotCode ? s.slotCode.charAt(0) : 'A')))).sort();

  // Dynamic status counters from API data
  const availableCount = slots.filter((s) => (s.status || '').toUpperCase() === 'AVAILABLE').length;
  const occupiedCount = slots.filter((s) => (s.status || '').toUpperCase() === 'OCCUPIED').length;
  const reservedCount = slots.filter((s) => (s.status || '').toUpperCase() === 'RESERVED').length;

  return (
    <div className="min-h-screen bg-[#0b101d] text-slate-100 flex flex-col font-sans">
      <Navbar showSearch onSearchChange={setSearchQuery} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Filter Sidebar */}
        <aside className="lg:col-span-3 bg-[#131b2e]/90 border border-slate-800/80 rounded-2xl p-5 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400">Zone Filter</span>
              {selectedZone !== 'all' && (
                <button
                  onClick={() => setSelectedZone('all')}
                  className="text-[10px] text-blue-400 hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {zones.length > 0 ? (
                zones.map((zone) => (
                  <button
                    key={zone}
                    onClick={() => setSelectedZone(selectedZone === zone ? 'all' : zone)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      selectedZone === zone
                        ? 'bg-blue-600/30 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                        : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-700/50'
                    }`}
                  >
                    Zone {zone}
                  </button>
                ))
              ) : (
                <span className="text-xs text-slate-500 col-span-2">No zones found</span>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400">Vehicle Type</span>
              {selectedVehicleType !== 'all' && (
                <button
                  onClick={() => setSelectedVehicleType('all')}
                  className="text-[10px] text-blue-400 hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Cars', value: 'CAR' },
                { label: 'Bikes', value: 'BIKE' },
              ].map((v) => (
                <button
                  key={v.value}
                  onClick={() => setSelectedVehicleType(selectedVehicleType === v.value ? 'all' : v.value)}
                  className={`py-2 rounded-xl text-xs font-medium border transition-all ${
                    selectedVehicleType === v.value
                      ? 'bg-blue-600/30 border-blue-500 text-blue-400'
                      : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-700/50'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={fetchSlots}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-700 bg-slate-800/40 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh Live Feed
            </button>
          </div>
        </aside>

        {/* Main Slots Section */}
        <section className="lg:col-span-9 bg-[#111726]/90 border border-slate-800/80 rounded-2xl p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-800/80 pb-4 gap-4">
            <span className="text-xs text-slate-400 font-mono flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
              {loading ? 'Fetching live slots from API...' : `Live Feed Connected (${slots.length} Slots)`}
            </span>
            <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-semibold">
              <span className="text-emerald-400">{availableCount} Available</span>
              <span className="text-slate-600">|</span>
              <span className="text-rose-400">{occupiedCount} Occupied</span>
              <span className="text-slate-600">|</span>
              <span className="text-amber-400">{reservedCount} Reserved</span>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
              <button
                onClick={fetchSlots}
                className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 font-semibold text-rose-200 ml-2 shrink-0"
              >
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-xs text-slate-400">Loading live parking slots from API...</p>
            </div>
          ) : slots.length === 0 && !error ? (
            <div className="py-20 text-center text-slate-500 text-sm">
              No parking slots found in database.
            </div>
          ) : (
            <div className="space-y-6">
              {(zones.length > 0 ? zones : ['A']).map((zoneKey) => {
                if (selectedZone !== 'all' && selectedZone !== zoneKey) return null;

                const zoneSlots = slots.filter((s) => {
                  const matchesZone = (s.zone || (s.slotCode ? s.slotCode.charAt(0) : 'A')) === zoneKey;
                  const matchesSearch =
                    searchQuery === '' || (s.slotCode || '').toLowerCase().includes(searchQuery.toLowerCase());
                  const matchesType =
                    selectedVehicleType === 'all' ||
                    (s.vehicleType && s.vehicleType.toUpperCase() === selectedVehicleType.toUpperCase());
                  return matchesZone && matchesSearch && matchesType;
                }).sort((a, b) => (a.slotCode || '').localeCompare(b.slotCode || '', undefined, { numeric: true }));

                if (zoneSlots.length === 0) return null;

                return (
                  <div key={zoneKey} className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-300 tracking-wide uppercase">Zone {zoneKey}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                      {zoneSlots.map((slot) => {
                        const statusUpper = (slot.status || '').toUpperCase();
                        const isAvailable = statusUpper === 'AVAILABLE';
                        const isOccupied = statusUpper === 'OCCUPIED';
                        const isReserved = statusUpper === 'RESERVED';

                        let cardStyle = 'bg-slate-900/60 border-slate-800 text-slate-400 opacity-60';

                        if (isAvailable) {
                          cardStyle =
                            'bg-[#064e3b]/90 border-[#10b981] text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.25)] hover:scale-105 cursor-pointer';
                        } else if (isOccupied) {
                          cardStyle = 'bg-[#881337]/90 border-[#f43f5e] text-rose-100 shadow-[0_0_15px_rgba(244,63,94,0.25)]';
                        } else if (isReserved) {
                          cardStyle = 'bg-[#78350f]/90 border-[#f59e0b] text-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.25)]';
                        }

                        return (
                          <div
                            key={slot.id}
                            onClick={() => handleSlotClick(slot)}
                            className={`p-3.5 rounded-2xl border flex flex-col justify-between h-28 transition-all ${cardStyle}`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-base">{slot.slotCode}</span>
                              {slot.vehicleType === 'BIKE' ? (
                                <Bike className="w-4 h-4 opacity-80" />
                              ) : (
                                <Car className="w-4 h-4 opacity-80" />
                              )}
                            </div>

                            <div className="mt-auto flex items-baseline justify-between">
                              <span className="text-xs font-mono font-bold block">
                                ₹{slot.basePrice || slot.price || 50}/hr
                              </span>
                              <span className="text-[9px] uppercase font-semibold opacity-75">
                                {slot.slotType || 'REGULAR'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {selectedSlotForBooking && (
        <BookingModal
          slot={selectedSlotForBooking}
          onClose={() => setSelectedSlotForBooking(null)}
          onConfirm={handleConfirmBooking}
        />
      )}
    </div>
  );
};
