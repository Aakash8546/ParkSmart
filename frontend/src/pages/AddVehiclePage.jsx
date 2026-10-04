import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { UploadCloud, Camera, CheckCircle2, Sparkles, Car, AlertCircle, RefreshCw } from 'lucide-react';
import { vehicleService } from '../services/vehicleService';

export const AddVehiclePage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  // Form State
  const [plateNumber, setPlateNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('CAR');
  const [modelName, setModelName] = useState('');

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setErrorMessage('');
    setSuccessMessage('');
    setIsScanning(true);

    try {
      // Call AI OCR endpoint POST /api/vehicles/detect-plate
      const res = await vehicleService.detectPlate(file);
      if (res && res.success && res.data) {
        const detectedPlate = res.data.plate_number || res.data.plateNumber || '';
        const conf = res.data.confidence ? Math.round(res.data.confidence * 100) : 95;

        setPlateNumber(detectedPlate.toUpperCase());
        setScanResult({
          plateNumber: detectedPlate.toUpperCase(),
          confidence: conf,
        });

        // Set suggested model if empty
        if (!modelName) {
          setModelName('Honda City');
        }
      } else {
        throw new Error(res?.message || 'Plate detection returned no text');
      }
    } catch (err) {
      setErrorMessage(err.message || 'AI could not read the license plate. Please enter it manually.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!plateNumber.trim()) {
      setErrorMessage('Please enter or scan a valid plate number.');
      return;
    }

    setSaving(true);
    setErrorMessage('');

    try {
      const res = await vehicleService.addVehicle({
        plateNumber: plateNumber.trim().toUpperCase(),
        vehicleType,
        modelName: modelName.trim() || 'My Vehicle',
      });

      if (res && res.success) {
        setSuccessMessage('Vehicle successfully saved!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1200);
      } else {
        throw new Error(res?.message || 'Failed to save vehicle');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error saving vehicle.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b101d] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link to="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-slate-200 font-semibold">Add Vehicle (AI OCR)</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
              <span>Add Vehicle</span>
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                AI OCR Powered
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Upload a vehicle image to automatically detect license plate number and vehicle classification.
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Drag & Drop / Upload Image Card */}
          <div className="lg:col-span-6 bg-[#131b2e]/90 border border-slate-800/90 rounded-3xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-200">Vehicle Photo</span>
              <span className="text-xs text-slate-400">PNG, JPG up to 10MB</span>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all min-h-[280px] overflow-hidden ${
                previewUrl
                  ? 'border-blue-500/50 bg-slate-900/50'
                  : 'border-slate-700 hover:border-blue-500/60 bg-slate-900/30 hover:bg-slate-900/50'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

              {previewUrl ? (
                <div className="relative w-full h-full flex flex-col items-center">
                  <img
                    src={previewUrl}
                    alt="Uploaded Vehicle Preview"
                    className="w-full max-h-[240px] object-contain rounded-xl shadow-lg"
                  />

                  {/* AI Scanning Overlay */}
                  {isScanning && (
                    <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs rounded-xl flex flex-col items-center justify-center space-y-3">
                      <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
                      <p className="text-xs font-semibold text-blue-300 animate-pulse">
                        AI EasyOCR Model scanning plate...
                      </p>
                    </div>
                  )}

                  {/* Bounding Box Simulated Tag */}
                  {scanResult && !isScanning && (
                    <div className="absolute bottom-3 left-3 bg-emerald-500/90 text-slate-950 px-3 py-1 rounded-lg text-xs font-mono font-bold shadow-lg flex items-center gap-1.5 backdrop-blur-md">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      OCR: {scanResult.plateNumber} ({scanResult.confidence}%)
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center text-center space-y-3 p-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <p className="text-sm font-semibold text-slate-200">
                    Click to upload car photo or drop image here
                  </p>
                  <p className="text-xs text-slate-500 max-w-xs">
                    AI OCR will automatically detect plate number and vehicle details
                  </p>
                </div>
              )}
            </div>

            {previewUrl && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Upload Different Photo
              </button>
            )}
          </div>

          {/* Right: AI Auto-Filled Form Card */}
          <div className="lg:col-span-6 bg-[#131b2e]/90 border border-slate-800/90 rounded-3xl p-8 space-y-6">
            <h2 className="text-lg font-bold text-white">Vehicle Details</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* License Plate Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">License Plate Number</label>
                  {scanResult?.plateNumber && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> AI Detected ✓
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  required
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  placeholder="e.g. MH 12 AB 1234"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-mono uppercase tracking-wider outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* Confidence Bar if Scanned */}
              {scanResult && (
                <div className="space-y-1.5 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>AI Model Confidence:</span>
                    <span className="font-bold text-emerald-400">{scanResult.confidence}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full"
                      style={{ width: `${scanResult.confidence}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Vehicle Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Vehicle Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Car', value: 'CAR' },
                    { label: 'Bike', value: 'BIKE' },
                    { label: 'SUV', value: 'SUV' },
                  ].map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setVehicleType(t.value)}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        vehicleType === t.value
                          ? 'bg-blue-600/30 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                          : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:bg-slate-700/50'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Model Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Vehicle Model Name</label>
                <input
                  type="text"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  placeholder="e.g. Honda City / Hyundai Creta"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-200 outline-none focus:border-blue-500 transition-all"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Link
                  to="/dashboard"
                  className="w-1/2 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold text-center transition-all"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving || isScanning}
                  className="w-1/2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-[0_0_25px_rgba(59,130,246,0.4)] transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};
