import React, { useState, useEffect } from 'react';
import { X, Calendar, Plus, Car, AlertCircle } from 'lucide-react';
import { vehicleService } from '../services/vehicleService';
import { bookingService } from '../services/bookingService';

export const BookingModal = ({ slot, onClose, onConfirm }) => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [isAddingNewVehicle, setIsAddingNewVehicle] = useState(false);
  const [newPlateNumber, setNewPlateNumber] = useState('');
  const [newModelName, setNewModelName] = useState('');

  // Form State
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const [date, setDate] = useState(dateStr);
  const [startHour, setStartHour] = useState(14); // 2:00 PM default
  const [durationHours, setDurationHours] = useState(2);

  const [loading, setLoading] = useState(false);
  const [fetchingVehicles, setFetchingVehicles] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch user vehicles from GET /api/vehicles/my
  useEffect(() => {
    const loadVehicles = async () => {
      setFetchingVehicles(true);
      try {
        const res = await vehicleService.getMyVehicles();
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          setVehicles(res.data);
          setSelectedVehicleId(res.data[0].id.toString());
        } else {
          setIsAddingNewVehicle(true);
        }
      } catch (err) {
        setIsAddingNewVehicle(true);
      } finally {
        setFetchingVehicles(false);
      }
    };

    loadVehicles();
  }, []);

  const basePricePerHour = slot.basePrice || slot.price || 50;
  const totalPrice = basePricePerHour * durationHours;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      let vehicleIdToUse = selectedVehicleId;

      // 1. If user is adding a new vehicle on the fly, register it first
      if (isAddingNewVehicle) {
        if (!newPlateNumber.trim()) {
          throw new Error('Please enter a valid license plate number');
        }
        const vehRes = await vehicleService.addVehicle({
          plateNumber: newPlateNumber.trim().toUpperCase(),
          vehicleType: slot.vehicleType || 'CAR',
          modelName: newModelName.trim() || 'My Vehicle',
        });
        if (vehRes && vehRes.success && vehRes.data) {
          vehicleIdToUse = vehRes.data.id;
        } else {
          throw new Error(vehRes?.message || 'Failed to register vehicle');
        }
      }

      if (!vehicleIdToUse) {
        throw new Error('Please select or add a vehicle to continue');
      }

      // 2. Compute ISO LocalDateTime strings
      const startDateTime = new Date(`${date}T${String(startHour).padStart(2, '0')}:00:00`);
      const endDateTime = new Date(startDateTime.getTime() + durationHours * 60 * 60 * 1000);

      // 3. Call POST /api/bookings
      const bookingRes = await bookingService.createBooking({
        slotId: slot.id,
        vehicleId: Number(vehicleIdToUse),
        startTime: startDateTime.toISOString().replace('Z', ''),
        endTime: endDateTime.toISOString().replace('Z', ''),
      });

      if (bookingRes && bookingRes.success && bookingRes.data) {
        onConfirm(bookingRes.data);
      } else {
        throw new Error(bookingRes?.message || 'Booking creation failed');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Something went wrong while booking the slot.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#131b2e]/95 border border-blue-500/40 rounded-2xl p-6 shadow-[0_0_50px_rgba(59,130,246,0.3)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-white">Book Slot {slot.slotCode || slot.code}</h3>
            <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
              <span>Zone <strong className="text-slate-200">{slot.zone}</strong></span>
              <span>{slot.slotType || 'REGULAR'}</span>
              <span>Rate <strong className="text-slate-200">₹{basePricePerHour}/hr</strong></span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Vehicle Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-400">Select Vehicle</label>
              <button
                type="button"
                onClick={() => setIsAddingNewVehicle(!isAddingNewVehicle)}
                className="text-[11px] text-blue-400 hover:underline flex items-center gap-1"
              >
                {isAddingNewVehicle ? 'Choose Saved Vehicle' : '+ Add New Vehicle'}
              </button>
            </div>

            {fetchingVehicles ? (
              <div className="text-xs text-slate-400 py-2">Loading your vehicles...</div>
            ) : isAddingNewVehicle ? (
              <div className="space-y-2">
                <input
                  type="text"
                  required
                  value={newPlateNumber}
                  onChange={(e) => setNewPlateNumber(e.target.value)}
                  placeholder="e.g. MH 12 AB 1234 (License Plate)"
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 uppercase outline-none focus:border-blue-500 transition-all"
                />
                <input
                  type="text"
                  value={newModelName}
                  onChange={(e) => setNewModelName(e.target.value)}
                  placeholder="e.g. Honda City (Model Name)"
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-blue-500 transition-all"
                />
              </div>
            ) : (
              <select
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-blue-500 transition-all"
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.plateNumber} {v.modelName ? `— ${v.modelName}` : ''} ({v.vehicleType})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Booking Date</label>
            <input
              type="date"
              required
              value={date}
              min={dateStr}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-blue-500 transition-all"
            />
          </div>

          {/* Time & Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Start Hour</label>
              <select
                value={startHour}
                onChange={(e) => setStartHour(Number(e.target.value))}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
              >
                {Array.from({ length: 24 }).map((_, i) => (
                  <option key={i} value={i}>
                    {i === 0 ? '12:00 AM' : i < 12 ? `${i}:00 AM` : i === 12 ? '12:00 PM' : `${i - 12}:00 PM`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Duration</label>
              <select
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
              >
                <option value={1}>1 Hour</option>
                <option value={2}>2 Hours</option>
                <option value={3}>3 Hours</option>
                <option value={4}>4 Hours</option>
                <option value={6}>6 Hours</option>
                <option value={8}>8 Hours</option>
              </select>
            </div>
          </div>

          {/* Pricing summary dynamically calculated */}
          <div className="space-y-1.5 pt-2 text-xs text-slate-300 bg-slate-900/40 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between text-slate-400">
              <span>Duration:</span>
              <span className="font-semibold text-slate-200">{durationHours} hours</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Rate per hour:</span>
              <span>₹{basePricePerHour}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold text-white pt-2 border-t border-slate-800">
              <span className="text-blue-400 text-base">Total Amount:</span>
              <span className="text-blue-400 text-xl font-mono">₹{totalPrice}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-1/2 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-1/2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all disabled:opacity-50"
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
