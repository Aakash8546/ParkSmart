import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { BookingModal } from '../components/BookingModal';
import { Car, Bike } from 'lucide-react';
import { slotService } from '../services/slotService';

const fallbackSlots = [
  // Zone A
  { id: 1, slotCode: 'A1', zone: 'A', status: 'AVAILABLE', basePrice: 100, vehicleType: 'car' },
  { id: 2, slotCode: 'A2', zone: 'A', status: 'AVAILABLE', basePrice: 160, vehicleType: 'bike' },
  { id: 3, slotCode: 'A3', zone: 'A', status: 'RESERVED', basePrice: 200, vehicleType: 'car' },
  { id: 4, slotCode: 'A4', zone: 'A', status: 'AVAILABLE', basePrice: 100, vehicleType: 'bike' },
  { id: 5, slotCode: 'A5', zone: 'A', status: 'OCCUPIED', basePrice: 100, vehicleType: 'car' },
  { id: 6, slotCode: 'A6', zone: 'A', status: 'AVAILABLE', basePrice: 100, vehicleType: 'bike' },

  // Zone B
  { id: 7, slotCode: 'B1', zone: 'B', status: 'RESERVED', basePrice: 100, vehicleType: 'car' },
  { id: 8, slotCode: 'B2', zone: 'B', status: 'OCCUPIED', basePrice: 100, vehicleType: 'bike' },
  { id: 9, slotCode: 'B3', zone: 'B', status: 'USER_BOOKING', basePrice: 100, vehicleType: 'car' },
  { id: 10, slotCode: 'B4', zone: 'B', status: 'AVAILABLE', basePrice: 100, vehicleType: 'bike' },
  { id: 11, slotCode: 'B5', zone: 'B', status: 'RESERVED', basePrice: 100, vehicleType: 'car' },
  { id: 12, slotCode: 'B6', zone: 'B', status: 'AVAILABLE', basePrice: 100, vehicleType: 'bike' },

  // Zone C
  { id: 13, slotCode: 'C1', zone: 'C', status: 'AVAILABLE', basePrice: 100, vehicleType: 'car' },
  { id: 14, slotCode: 'C2', zone: 'C', status: 'OCCUPIED', basePrice: 100, vehicleType: 'car' },
  { id: 15, slotCode: 'C3', zone: 'C', status: 'AVAILABLE', basePrice: 150, vehicleType: 'bike' },
  { id: 16, slotCode: 'C4', zone: 'C', status: 'AVAILABLE', basePrice: 200, vehicleType: 'bike' },
  { id: 17, slotCode: 'C5', zone: 'C', status: 'RESERVED', basePrice: 150, vehicleType: 'car' },
  { id: 18, slotCode: 'C6', zone: 'C', status: 'AVAILABLE', basePrice: 200, vehicleType: 'bike' },

  // Zone D
  { id: 19, slotCode: 'D1', zone: 'D', status: 'AVAILABLE', basePrice: 100, vehicleType: 'car' },
  { id: 20, slotCode: 'D2', zone: 'D', status: 'OCCUPIED', basePrice: 150, vehicleType: 'bike' },
  { id: 21, slotCode: 'D3', zone: 'D', status: 'AVAILABLE', basePrice: 200, vehicleType: 'bike' },
  { id: 22, slotCode: 'D4', zone: 'D', status: 'AVAILABLE', basePrice: 200, vehicleType: 'bike' },
  { id: 23, slotCode: 'D5', zone: 'D', status: 'RESERVED', basePrice: 150, vehicleType: 'car' },
  { id: 24, slotCode: 'D6', zone: 'D', status: 'AVAILABLE', basePrice: 200, vehicleType: 'bike' },
];

export const DashboardPage = () => {
  const [slots, setSlots] = useState(fallbackSlots);
  const [selectedZone, setSelectedZone] = useState('all');
  const [selectedVehicleType, setSelectedVehicleType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSlotForBooking, setSelectedSlotForBooking] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch Slots from GET /api/slots endpoint
  useEffect(() => {
    const fetchSlotsData = async () => {
      setLoading(true);
      const res = await slotService.getAllSlots();
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        setSlots(res.data);
      }
      setLoading(false);
    };

    fetchSlotsData();
  }, []);

  const handleSlotClick = async (slot) => {
    const statusUpper = (slot.status || '').toUpperCase();
    if (statusUpper === 'AVAILABLE') {
      // Optional: Fetch detailed slot info via GET /api/slots/{id}
      const detailRes = await slotService.getSlotById(slot.id);
      const slotData = detailRes?.success ? detailRes.data : slot;
      setSelectedSlotForBooking(slotData);
    }
  };

  const handleConfirmBooking = (details) => {
    setSlots((prev) =>
      prev.map((s) => (s.slotCode === details.slotCode ? { ...s, status: 'USER_BOOKING' } : s))
    );
    setSelectedSlotForBooking(null);
    navigate(`/booking/${details.bookingId}/qr`, { state: { booking: details } });
  };

  const zones = ['A', 'B', 'C', 'D'];

  return (
    <div className="min-h-screen bg-[#0b101d] text-slate-100 flex flex-col font-sans">
      <Navbar showSearch onSearchChange={setSearchQuery} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Sidebar Filter */}
        <aside className="lg:col-span-3 bg-[#131b2e]/90 border border-slate-800/80 rounded-2xl p-5 space-y-6">
          <div>
            <span className="block text-xs font-semibold text-slate-400 mb-3">Zone Filter</span>
            <div className="grid grid-cols-2 gap-2">
              {zones.map((zone) => (
                <button
                  key={zone}
                  onClick={() => setSelectedZone(selectedZone === zone ? 'all' : zone)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    selectedZone === zone
                      ? 'bg-blue-600/30 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                      : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-700/50'
                  }`}
                >
                  {zone}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="block text-xs font-semibold text-slate-400 mb-3">Vehicle type</span>
            <div className="grid grid-cols-2 gap-2">
              {['cars', 'bikes'].map((vType) => (
                <button
                  key={vType}
                  onClick={() => setSelectedVehicleType(selectedVehicleType === vType ? 'all' : vType)}
                  className={`py-2 rounded-xl text-xs font-medium border transition-all capitalize ${
                    selectedVehicleType === vType
                      ? 'bg-blue-600/30 border-blue-500 text-blue-400'
                      : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-700/50'
                  }`}
                >
                  {vType}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="block text-xs font-semibold text-slate-400 mb-2">Time range</span>
            <select className="w-full bg-slate-800/60 border border-slate-700/70 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none">
              <option>Time range</option>
              <option>1 Hour</option>
              <option>2 Hours</option>
              <option>4 Hours</option>
            </select>
          </div>
        </aside>

        {/* Main Parking Grid Container */}
        <section className="lg:col-span-9 bg-[#111726]/90 border border-slate-800/80 rounded-2xl p-6 space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <span className="text-xs text-slate-400 font-mono">
              {loading ? 'Fetching live slots...' : 'Real-time Slot Feed Connected'}
            </span>
            <div className="flex items-center gap-6 text-sm font-semibold">
              <span className="text-emerald-400">
                {slots.filter((s) => (s.status || '').toUpperCase() === 'AVAILABLE').length} Available
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-rose-400">
                {slots.filter((s) => (s.status || '').toUpperCase() === 'OCCUPIED').length} Occupied
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-amber-400">
                {slots.filter((s) => (s.status || '').toUpperCase() === 'RESERVED').length} Reserved
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {zones.map((zoneKey) => {
              if (selectedZone !== 'all' && selectedZone !== zoneKey) return null;

              const zoneSlots = slots.filter(
                (s) =>
                  s.zone === zoneKey &&
                  (searchQuery === '' || (s.slotCode || '').toLowerCase().includes(searchQuery.toLowerCase()))
              );

              return (
                <div key={zoneKey} className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-300 tracking-wide">Zone {zoneKey}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                    {zoneSlots.map((slot) => {
                      const statusUpper = (slot.status || '').toUpperCase();
                      const isAvailable = statusUpper === 'AVAILABLE';
                      const isOccupied = statusUpper === 'OCCUPIED';
                      const isReserved = statusUpper === 'RESERVED';
                      const isUserBooking = statusUpper === 'USER_BOOKING';

                      let cardStyle = 'bg-slate-900/60 border-slate-800 text-slate-400';
                      
                      if (isAvailable) {
                        cardStyle =
                          'bg-[#064e3b]/90 border-[#10b981] text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-105 cursor-pointer';
                      } else if (isOccupied) {
                        cardStyle = 'bg-[#881337]/90 border-[#f43f5e] text-rose-100 opacity-90 shadow-[0_0_15px_rgba(244,63,94,0.3)]';
                      } else if (isReserved) {
                        cardStyle = 'bg-[#78350f]/90 border-[#f59e0b] text-amber-100 opacity-90 shadow-[0_0_15px_rgba(245,158,11,0.3)]';
                      } else if (isUserBooking) {
                        cardStyle = 'bg-[#0891b2]/90 border-[#06b6d4] text-cyan-100 shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer';
                      }

                      return (
                        <div
                          key={slot.id}
                          onClick={() => handleSlotClick(slot)}
                          className={`p-3.5 rounded-2xl border flex flex-col justify-between h-28 transition-all ${cardStyle}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-base">{slot.slotCode}</span>
                            {slot.vehicleType === 'bike' ? (
                              <Bike className="w-4 h-4 opacity-90" />
                            ) : (
                              <Car className="w-4 h-4 opacity-90" />
                            )}
                          </div>

                          <div className="mt-auto">
                            {isUserBooking ? (
                              <span className="text-[11px] font-bold block text-cyan-200">Your Booking</span>
                            ) : (
                              <span className="text-xs font-mono font-bold block">
                                ${slot.basePrice || slot.price}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {selectedSlotForBooking && (
        <BookingModal
          slot={{
            code: selectedSlotForBooking.slotCode,
            zone: selectedSlotForBooking.zone,
            price: selectedSlotForBooking.basePrice || selectedSlotForBooking.price || 50,
          }}
          onClose={() => setSelectedSlotForBooking(null)}
          onConfirm={handleConfirmBooking}
        />
      )}
    </div>
  );
};
