import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { BookingModal } from '../components/BookingModal';
import { Car, Bike } from 'lucide-react';

const initialSlots = [
  // Zone A
  { id: '1', code: 'A1', zone: 'A', status: 'available', price: 100, vehicleType: 'car' },
  { id: '2', code: 'A2', zone: 'A', status: 'available', price: 160, vehicleType: 'bike' },
  { id: '3', code: 'A3', zone: 'A', status: 'reserved', price: 200, vehicleType: 'car' },
  { id: '4', code: 'A4', zone: 'A', status: 'available', price: 100, vehicleType: 'bike' },
  { id: '5', code: 'A5', zone: 'A', status: 'occupied', price: 100, vehicleType: 'car' },
  { id: '6', code: 'A6', zone: 'A', status: 'available', price: 100, vehicleType: 'bike' },

  // Zone B
  { id: '7', code: 'B1', zone: 'B', status: 'reserved', price: 100, vehicleType: 'car' },
  { id: '8', code: 'B2', zone: 'B', status: 'occupied', price: 100, vehicleType: 'bike' },
  { id: '9', code: 'B3', zone: 'B', status: 'user_booking', price: 100, vehicleType: 'car' },
  { id: '10', code: 'B4', zone: 'B', status: 'available', price: 100, vehicleType: 'bike' },
  { id: '11', code: 'B5', zone: 'B', status: 'reserved', price: 100, vehicleType: 'car' },
  { id: '12', code: 'B6', zone: 'B', status: 'available', price: 100, vehicleType: 'bike' },

  // Zone C
  { id: '13', code: 'C1', zone: 'C', status: 'available', price: 100, vehicleType: 'car' },
  { id: '14', code: 'C2', zone: 'C', status: 'occupied', price: 100, vehicleType: 'car' },
  { id: '15', code: 'C3', zone: 'C', status: 'available', price: 150, vehicleType: 'bike' },
  { id: '16', code: 'C4', zone: 'C', status: 'available', price: 200, vehicleType: 'bike' },
  { id: '17', code: 'C5', zone: 'C', status: 'reserved', price: 150, vehicleType: 'car' },
  { id: '18', code: 'C6', zone: 'C', status: 'available', price: 200, vehicleType: 'bike' },

  // Zone D
  { id: '19', code: 'D1', zone: 'D', status: 'available', price: 100, vehicleType: 'car' },
  { id: '20', code: 'D2', zone: 'D', status: 'occupied', price: 150, vehicleType: 'bike' },
  { id: '21', code: 'D3', zone: 'D', status: 'available', price: 200, vehicleType: 'bike' },
  { id: '22', code: 'D4', zone: 'D', status: 'available', price: 200, vehicleType: 'bike' },
  { id: '23', code: 'D5', zone: 'D', status: 'reserved', price: 150, vehicleType: 'car' },
  { id: '24', code: 'D6', zone: 'D', status: 'available', price: 200, vehicleType: 'bike' },
];

export const DashboardPage = () => {
  const [slots, setSlots] = useState(initialSlots);
  const [selectedZone, setSelectedZone] = useState('all');
  const [selectedVehicleType, setSelectedVehicleType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSlotForBooking, setSelectedSlotForBooking] = useState(null);

  const navigate = useNavigate();

  const handleSlotClick = (slot) => {
    if (slot.status === 'available') {
      setSelectedSlotForBooking(slot);
    }
  };

  const handleConfirmBooking = (details) => {
    setSlots((prev) =>
      prev.map((s) => (s.code === details.slotCode ? { ...s, status: 'user_booking' } : s))
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
          {/* Zone Filter */}
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

          {/* Vehicle type */}
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

          {/* Time range */}
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
          
          {/* Top Bar: Stats Bar */}
          <div className="flex items-center justify-end gap-6 text-sm font-semibold border-b border-slate-800/80 pb-4">
            <span className="text-emerald-400">12 Available</span>
            <span className="text-slate-600">|</span>
            <span className="text-rose-400">6 Occupied</span>
            <span className="text-slate-600">|</span>
            <span className="text-amber-400">2 Reserved</span>
          </div>

          {/* Render by Zones A, B, C, D */}
          <div className="space-y-6">
            {zones.map((zoneKey) => {
              if (selectedZone !== 'all' && selectedZone !== zoneKey) return null;

              const zoneSlots = slots.filter(
                (s) =>
                  s.zone === zoneKey &&
                  (searchQuery === '' || s.code.toLowerCase().includes(searchQuery.toLowerCase()))
              );

              return (
                <div key={zoneKey} className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-300 tracking-wide">Zone {zoneKey}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                    {zoneSlots.map((slot) => {
                      const isAvailable = slot.status === 'available';
                      const isOccupied = slot.status === 'occupied';
                      const isReserved = slot.status === 'reserved';
                      const isUserBooking = slot.status === 'user_booking';

                      // Exact Mockup Colors & Card Styles
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
                            <span className="font-bold text-base">{slot.code}</span>
                            {slot.vehicleType === 'car' ? (
                              <Car className="w-4 h-4 opacity-90" />
                            ) : (
                              <Bike className="w-4 h-4 opacity-90" />
                            )}
                          </div>

                          <div className="mt-auto">
                            {isUserBooking ? (
                              <span className="text-[11px] font-bold block text-cyan-200">Your Booking</span>
                            ) : (
                              <span className="text-xs font-mono font-bold block">${slot.price}</span>
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
          slot={selectedSlotForBooking}
          onClose={() => setSelectedSlotForBooking(null)}
          onConfirm={handleConfirmBooking}
        />
      )}
    </div>
  );
};
