import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, Plus, Car, AlertCircle, Camera, Sparkles, CheckCircle2, RefreshCw, ChevronDown, Clock } from 'lucide-react';
import { vehicleService } from '../services/vehicleService';
import { bookingService } from '../services/bookingService';

export const BookingModal = ({ slot, onClose, onConfirm }) => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [isAddingNewVehicle, setIsAddingNewVehicle] = useState(false);
  const [newPlateNumber, setNewPlateNumber] = useState('');
  const [newModelName, setNewModelName] = useState('');

  // AI OCR Scanning State
  const [isScanningPlate, setIsScanningPlate] = useState(false);
  const [ocrSuccessMsg, setOcrSuccessMsg] = useState('');
  const fileInputRef = useRef(null);

  // Time & Date Form State
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const [date, setDate] = useState(dateStr);
  const [startTimeIndex, setStartTimeIndex] = useState(14); // 2:00 PM
  const [endTimeIndex, setEndTimeIndex] = useState(17); // 5:00 PM

  const [loading, setLoading] = useState(false);
  const [fetchingVehicles, setFetchingVehicles] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Generate 24 hours options
  const timeOptions = Array.from({ length: 24 }).map((_, i) => {
    const hour12 = i === 0 ? 12 : i > 12 ? i - 12 : i;
    const ampm = i < 12 ? 'AM' : 'PM';
    return { index: i, label: `${hour12}:00 ${ampm}` };
  });

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

  const handleOcrFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanningPlate(true);
    setOcrSuccessMsg('');
    setErrorMessage('');

    try {
      const res = await vehicleService.detectPlate(file);
      if (res && res.success && res.data) {
        const detectedPlate = res.data.plate_number || res.data.plateNumber || '';
        const conf = res.data.confidence ? Math.round(res.data.confidence * 100) : 95;
        setNewPlateNumber(detectedPlate.toUpperCase());
        setOcrSuccessMsg(`AI Detected: ${detectedPlate.toUpperCase()} (${conf}% confidence) ✓`);
        if (!newModelName) {
          setNewModelName('Honda City');
        }
      } else {
        throw new Error(res?.message || 'Could not detect plate text');
      }
    } catch (err) {
      setErrorMessage(err.message || 'AI OCR scan failed. Please enter license plate manually.');
    } finally {
      setIsScanningPlate(false);
    }
  };

  // Pricing calculations
  const durationHours = Math.max(1, endTimeIndex - startTimeIndex);
  const baseRate = slot.basePrice || slot.price || 50;
  const baseTotal = baseRate * durationHours;
  const isPeakHour = (startTimeIndex >= 9 && startTimeIndex <= 11) || (startTimeIndex >= 17 && startTimeIndex <= 20);
  const peakSurcharge = isPeakHour ? 30 : 0;
  const grandTotal = baseTotal + peakSurcharge;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      let vehicleIdToUse = selectedVehicleId;

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

      const startDateTime = new Date(`${date}T${String(startTimeIndex).padStart(2, '0')}:00:00`);
      const endDateTime = new Date(`${date}T${String(endTimeIndex).padStart(2, '0')}:00:00`);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      {/* Glow highlight surrounding card */}
      <div className="relative w-full max-w-[420px] rounded-3xl bg-[#121a2d]/90 border border-blue-500/50 shadow-[0_0_50px_rgba(59,130,246,0.35),0_25px_60px_rgba(0,0,0,0.85)] backdrop-blur-2xl p-6 sm:p-7 space-y-5 text-white font-sans">
        
        {/* Subtle Top-Left Glow within card */}
        <div className="absolute -top-12 -left-12 w-36 h-36 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* 1. Header Row */}
        <div className="flex items-start justify-between relative z-10">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white">
              Book Slot {slot.slotCode || slot.code}
            </h2>
            <div className="grid grid-cols-3 gap-4 text-xs text-slate-400 mt-2">
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Zone</span>
                <strong className="text-sm font-bold text-slate-100">{slot.zone || 'A'}</strong>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Type</span>
                <span className="text-xs font-semibold text-slate-200 capitalize">{slot.slotType?.toLowerCase() || 'Regular'}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Base Price</span>
                <strong className="text-xs font-bold text-slate-100">₹{baseRate}/hr</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-bold shadow-[0_0_12px_rgba(16,185,129,0.4)]">
              Available
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 2. Form Section */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          
          {/* Select Vehicle */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-300">Select Vehicle</label>
              <button
                type="button"
                onClick={() => {
                  setIsAddingNewVehicle(!isAddingNewVehicle);
                  setOcrSuccessMsg('');
                }}
                className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 font-medium"
              >
                {isAddingNewVehicle ? 'Choose Saved Vehicle' : '+ Add / Scan OCR'}
              </button>
            </div>

            {fetchingVehicles ? (
              <div className="text-xs text-slate-400 py-2">Loading vehicles...</div>
            ) : isAddingNewVehicle ? (
              <div className="space-y-2">
                {/* AI OCR Scanner upload trigger */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleOcrFileChange}
                  accept="image/*"
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 rounded-xl border border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20 cursor-pointer flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                      {isScanningPlate ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-white flex items-center gap-1">
                        {isScanningPlate ? 'Scanning...' : 'Scan Photo with AI OCR'}
                        <Sparkles className="w-3 h-3 text-amber-400" />
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] text-blue-400 font-bold group-hover:translate-x-0.5 transition-transform">
                    Upload
                  </span>
                </div>

                {ocrSuccessMsg && (
                  <div className="p-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                    <span>{ocrSuccessMsg}</span>
                  </div>
                )}

                <input
                  type="text"
                  required
                  value={newPlateNumber}
                  onChange={(e) => setNewPlateNumber(e.target.value)}
                  placeholder="e.g. MH 12 AB 1234"
                  className="w-full bg-[#1b253b]/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono uppercase tracking-wider outline-none focus:border-blue-500 transition-all"
                />
              </div>
            ) : (
              <div className="relative">
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className="w-full appearance-none bg-[#1b253b]/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 pr-10 text-xs text-slate-200 outline-none focus:border-blue-500 transition-all cursor-pointer"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.plateNumber} {v.modelName ? `— ${v.modelName}` : ''}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            )}
          </div>

          {/* Date Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Date</label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="date"
                required
                value={date}
                min={dateStr}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#1b253b]/90 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-200 outline-none focus:border-blue-500 transition-all cursor-pointer"
              />
            </div>
          </div>

          {/* Start Time & End Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Start Time</label>
              <div className="relative">
                <select
                  value={startTimeIndex}
                  onChange={(e) => {
                    const newStart = Number(e.target.value);
                    setStartTimeIndex(newStart);
                    if (endTimeIndex <= newStart) {
                      setEndTimeIndex(Math.min(23, newStart + 2));
                    }
                  }}
                  className="w-full appearance-none bg-[#1b253b]/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 pr-8 text-xs text-slate-200 outline-none focus:border-blue-500 transition-all cursor-pointer"
                >
                  {timeOptions.map((opt) => (
                    <option key={opt.index} value={opt.index}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">End Time</label>
              <div className="relative">
                <select
                  value={endTimeIndex}
                  onChange={(e) => setEndTimeIndex(Number(e.target.value))}
                  className="w-full appearance-none bg-[#1b253b]/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 pr-8 text-xs text-slate-200 outline-none focus:border-blue-500 transition-all cursor-pointer"
                >
                  {timeOptions
                    .filter((opt) => opt.index > startTimeIndex)
                    .map((opt) => (
                      <option key={opt.index} value={opt.index}>{opt.label}</option>
                    ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Pricing & Duration Breakdown matching Screenshot */}
          <div className="space-y-2 pt-2 text-xs border-t border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400">
              <span>Duration</span>
              <span className="font-semibold text-slate-200">{durationHours} hours</span>
            </div>

            <div className="flex items-center justify-between text-slate-400">
              <span>Base Price</span>
              <span>₹{baseRate} × {durationHours}hrs = ₹{baseTotal}</span>
            </div>

            <div className="flex items-center justify-between text-slate-400">
              <span>Peak Hour Surcharge</span>
              <span className={peakSurcharge > 0 ? 'text-amber-400 font-semibold' : 'text-slate-400'}>
                +{peakSurcharge > 0 ? `₹${peakSurcharge}` : '₹0'}
              </span>
            </div>

            {/* Large Vivid Blue Total Row */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
              <span className="text-xl font-bold text-blue-400">Total:</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#38bdf8] font-mono tracking-tight drop-shadow-[0_0_12px_rgba(56,189,248,0.4)]">
                ₹{grandTotal}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-1/2 py-2.5 rounded-full border border-slate-700/80 bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white text-xs font-semibold transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-1/2 py-2.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
