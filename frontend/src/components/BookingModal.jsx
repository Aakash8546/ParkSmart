import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';

export const BookingModal = ({ slot, onClose, onConfirm }) => {
  const [vehicleNumber, setVehicleNumber] = useState('MH 12 AB 1234 - Honda City');
  const [date, setDate] = useState('2026-10-04');
  const [startTime, setStartTime] = useState('2:00 PM');
  const [endTime, setEndTime] = useState('5:00 PM');

  const basePrice = (slot.price || 50) * 3;
  const peakSurcharge = 30;
  const totalPrice = basePrice + peakSurcharge;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({
      slotCode: slot.code,
      zone: slot.zone,
      vehicleNumber: vehicleNumber.split(' - ')[0],
      date,
      startTime,
      endTime,
      hours: 3,
      totalPrice,
      bookingId: `BK-${Math.floor(100000 + Math.random() * 900000)}`
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#131b2e]/90 border border-blue-500/40 rounded-2xl p-6 shadow-[0_0_50px_rgba(59,130,246,0.3)]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-white">Book Slot {slot.code}</h3>
            <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
              <span>Zone <strong className="text-slate-200">{slot.zone}</strong></span>
              <span>Regular</span>
              <span>Base Price <strong className="text-slate-200">₹{slot.price || 50}/hr</strong></span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/40">
            Available
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Select Vehicle</label>
            <select
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
            >
              <option value="MH 12 AB 1234 - Honda City">MH 12 AB 1234 - Honda City</option>
              <option value="MH 14 DE 5678 - Hyundai Creta">MH 14 DE 5678 - Hyundai Creta</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Date</label>
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Start Time</label>
              <select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
              >
                <option value="2:00 PM">2:00 PM</option>
                <option value="3:00 PM">3:00 PM</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">End Time</label>
              <select
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
              >
                <option value="5:00 PM">5:00 PM</option>
                <option value="6:00 PM">6:00 PM</option>
              </select>
            </div>
          </div>

          {/* Pricing summary matching mockup */}
          <div className="space-y-1.5 pt-2 text-xs text-slate-300">
            <div className="flex justify-between">
              <span>Duration</span>
              <span className="font-semibold">3 hours</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Base Price</span>
              <span>₹50 x 3hrs = ₹150</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Peak Hour Surcharge</span>
              <span>+₹30</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold text-white pt-2 border-t border-slate-800">
              <span className="text-blue-400 text-base">Total:</span>
              <span className="text-blue-400 text-xl font-mono">₹{totalPrice}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold shadow-[0_0_20px_rgba(59,130,246,0.4)]"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
