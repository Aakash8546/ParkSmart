import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  Sparkles,
  ChevronDown,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { vehicleService } from "../services/vehicleService";

const VEHICLE_TYPES = ["CAR", "BIKE", "SUV", "TRUCK"];

// Service ka response { success, data, message } ho ya seedha data, dono chalega
const unwrap = (res) => {
  if (res && res.success === false) {
    throw new Error(res.message || "Request failed");
  }
  return res && res.data !== undefined ? res.data : res;
};

/**
 * ML se bbox do format mein aa sakta hai:
 *  - [x1, y1, x2, y2] ya { x1, y1, x2, y2 }
 *  - pixels (original image) ya normalized (0 se 1)
 * Ye function use image ke %-box mein badal deta hai.
 */
function toPercentBox(bbox, imgW, imgH) {
  if (!bbox || !imgW || !imgH) return null;

  const [x1, y1, x2, y2] = Array.isArray(bbox)
    ? bbox
    : [bbox.x1, bbox.y1, bbox.x2, bbox.y2];

  if ([x1, y1, x2, y2].some((v) => typeof v !== "number")) return null;

  const normalized = Math.max(x1, y1, x2, y2) <= 1;
  const w = normalized ? 1 : imgW;
  const h = normalized ? 1 : imgH;

  return {
    left: (x1 / w) * 100,
    top: (y1 / h) * 100,
    width: ((x2 - x1) / w) * 100,
    height: ((y2 - y1) / h) * 100,
  };
}

const AddVehicle = () => {
  const navigate = useNavigate();
  const requestId = useRef(0);

  // image
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });
  const [plateBox, setPlateBox] = useState(null);

  // form
  const [plateNumber, setPlateNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [modelName, setModelName] = useState("");

  // ML results
  const [plateConfidence, setPlateConfidence] = useState(0);
  const [vehicleConfidence, setVehicleConfidence] = useState(0);

  // status
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message }

  // Preview URL cleanup
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Toast 3 second mein auto-dismiss (document spec)
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  const resetResults = () => {
    setPlateNumber("");
    setVehicleType("");
    setPlateConfidence(0);
    setVehicleConfidence(0);
    setPlateBox(null);
    setFieldErrors({});
  };

  // Upload / drop dono yahi function call karte hain
  const handleImage = async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      setToast({ type: "error", message: "Please upload an image file." });
      return;
    }

    const currentRequest = ++requestId.current;

    resetResults();
    setPreviewUrl(URL.createObjectURL(file));
    setIsProcessing(true);

    // 2 ML models ek saath chalte hain, ek fail ho to dusre ka result rehta hai
    const [plateRes, vehicleRes] = await Promise.allSettled([
      vehicleService.detectPlate(file).then(unwrap),
      typeof vehicleService.classifyVehicle === "function"
        ? vehicleService.classifyVehicle(file).then(unwrap)
        : Promise.reject(new Error("classifyVehicle not found in vehicleService")),
    ]);

    // Agar beech mein naya image aa gaya to purana result ignore karo
    if (currentRequest !== requestId.current) return;

    const failed = [];

    if (plateRes.status === "fulfilled") {
      const r = plateRes.value || {};
      const plate = r.plate_number || r.plateNumber;
      if (plate) setPlateNumber(String(plate).toUpperCase());
      setPlateConfidence(Math.round((r.confidence || 0) * 100));
      setPlateBox(r.bbox || r.plate_bbox || null);
    } else {
      console.error("Plate detection error:", plateRes.reason);
      failed.push("plate detection");
    }

    if (vehicleRes.status === "fulfilled") {
      const r = vehicleRes.value || {};
      const type = String(r.vehicle_type || r.vehicleType || "").toUpperCase();
      if (VEHICLE_TYPES.includes(type)) setVehicleType(type);
      setVehicleConfidence(Math.round((r.confidence || 0) * 100));
    } else {
      console.error("Vehicle classification error:", vehicleRes.reason);
      failed.push("vehicle classification");
    }

    if (failed.length) {
      setToast({
        type: "error",
        message: `AI ${failed.join(" and ")} failed. Please fill the details manually.`,
      });
    }

    setIsProcessing(false);
  };

  const handleFileChange = (e) => {
    handleImage(e.target.files?.[0]);
    e.target.value = ""; // same image dobara select ho sake
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleImage(e.dataTransfer.files?.[0]);
  };

  const handleRemoveImage = () => {
    requestId.current++; // chal rahi request ka result ignore ho jayega
    setPreviewUrl(null);
    setImgSize({ w: 0, h: 0 });
    setIsProcessing(false);
    resetResults();
  };

  const validate = () => {
    const errors = {};
    if (!plateNumber.trim()) errors.plateNumber = "Plate number is required.";
    if (!vehicleType) errors.vehicleType = "Select a vehicle type.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setIsSaving(true);
    try {
      unwrap(
        await vehicleService.addVehicle({
          plateNumber: plateNumber.trim().toUpperCase(),
          vehicleType,
          modelName: modelName.trim(),
        })
      );
      setToast({ type: "success", message: "Vehicle saved successfully." });
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (error) {
      const message =
        error.status === 409 || /already|exist|duplicate/i.test(error.message)
          ? "This plate number is already registered."
          : error.message || "Could not save vehicle.";
      setToast({ type: "error", message });
    } finally {
      setIsSaving(false);
    }
  };

  const box = toPercentBox(plateBox, imgSize.w, imgSize.h);
  const showPlateBadge = !isProcessing && plateNumber && plateConfidence > 0;
  const showTypeBadge = !isProcessing && vehicleType && vehicleConfidence > 0;

  return (
    <div className="min-h-screen bg-[#0f172a] px-5 py-8 font-sans text-white md:px-10 lg:px-16">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`fixed left-1/2 top-4 z-50 flex -translate-x-1/2 items-center gap-2 rounded-lg border px-4 py-3 text-sm shadow-xl backdrop-blur-xl ${
              toast.type === "success"
                ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                : "border-rose-500/40 bg-rose-500/15 text-rose-300"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Breadcrumb: Dashboard > Vehicles > Add New */}
        <nav className="mx-auto mb-8 flex max-w-6xl items-center gap-3 text-sm">
          <Link to="/dashboard" className="text-slate-400 hover:text-white">
            Dashboard
          </Link>
          <span className="text-slate-500">›</span>
          <span className="text-slate-400">Vehicles</span>
          <span className="text-slate-500">›</span>
          <span className="text-white">Add New</span>
        </nav>

        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
          {/* ================= LEFT ================= */}
          <div>
            {/* Drag-and-drop upload zone */}
            <label
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`flex h-56 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed text-center transition ${
                isDragging
                  ? "border-blue-400 bg-blue-500/10"
                  : "border-blue-500 bg-[#1e293b]/60 hover:bg-[#1e293b]"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <UploadCloud
                size={48}
                strokeWidth={1.5}
                className={`mb-4 ${isDragging ? "text-blue-400" : "text-slate-400"}`}
              />
              <p className="text-base font-medium text-white">
                {isDragging ? "Drop your image here" : "Drop your car image here"}
              </p>
              <p className="text-sm text-slate-400">or click to upload</p>
            </label>

            {/* Car preview + green bounding box around plate */}
            <div className="relative mt-5 overflow-hidden rounded-xl border border-slate-400/10 bg-[#1e293b]">
              <img
                src={previewUrl || "/assets/car.jpg"}
                alt="Vehicle"
                onLoad={(e) =>
                  setImgSize({
                    w: e.target.naturalWidth,
                    h: e.target.naturalHeight,
                  })
                }
                className="block h-auto w-full"
              />

              {previewUrl && box && !isProcessing && (
                <motion.div
                  initial={{ opacity: 0, scale: 1.15 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="pointer-events-none absolute rounded-sm border-2 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.6)]"
                  style={{
                    left: `${box.left}%`,
                    top: `${box.top}%`,
                    width: `${box.width}%`,
                    height: `${box.height}%`,
                  }}
                >
                  {plateNumber && (
                    <span className="absolute -top-6 left-0 whitespace-nowrap rounded bg-emerald-500 px-1.5 py-0.5 font-mono text-xs font-bold text-white">
                      {plateNumber}
                    </span>
                  )}
                </motion.div>
              )}

              {isProcessing && (
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-[#0f172a]/60 text-sm text-blue-200 backdrop-blur-sm">
                  <Loader2 size={20} className="animate-spin" />
                  Scanning image...
                </div>
              )}

              {previewUrl && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  aria-label="Remove image"
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-rose-500"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          {/* ================= RIGHT ================= */}
          <div className="rounded-xl border border-slate-400/10 bg-[#1e293b]/70 p-6 shadow-xl backdrop-blur-xl">
            <h1 className="mb-6 text-2xl font-bold">Add Vehicle</h1>

            {/* Plate Number */}
            <div className="mb-4">
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
                Plate Number
                <Sparkles size={15} className="text-blue-400" />
              </label>

              <div className="relative">
                <input
                  value={plateNumber}
                  onChange={(e) => {
                    setPlateNumber(e.target.value.toUpperCase());
                    setFieldErrors((f) => ({ ...f, plateNumber: undefined }));
                  }}
                  placeholder="e.g. MH 12 AB 1234"
                  className={`w-full rounded-lg border bg-slate-700/60 px-3 py-2.5 pr-32 font-mono text-sm text-white outline-none focus:border-blue-500 ${
                    fieldErrors.plateNumber ? "border-rose-500" : "border-slate-500"
                  }`}
                />

                {isProcessing && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-blue-500/20 px-2 py-1 text-xs font-semibold text-blue-300">
                    Detecting...
                  </span>
                )}
                {showPlateBadge && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-emerald-500/20 px-2 py-1 text-xs font-semibold text-emerald-400">
                    AI Detected ✓
                  </span>
                )}
              </div>
              {fieldErrors.plateNumber && (
                <p className="mt-1 text-xs text-rose-400">
                  {fieldErrors.plateNumber}
                </p>
              )}
            </div>

            {/* Vehicle Type */}
            <div className="mb-4">
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
                Vehicle Type
                <Sparkles size={15} className="text-blue-400" />
              </label>

              <div className="relative">
                <select
                  value={vehicleType}
                  onChange={(e) => {
                    setVehicleType(e.target.value);
                    setFieldErrors((f) => ({ ...f, vehicleType: undefined }));
                  }}
                  className={`w-full appearance-none rounded-lg border bg-slate-700/60 px-3 py-2.5 pr-44 text-sm text-white outline-none focus:border-blue-500 ${
                    fieldErrors.vehicleType ? "border-rose-500" : "border-slate-500"
                  }`}
                >
                  <option value="" className="bg-slate-800">
                    Select vehicle type
                  </option>
                  {VEHICLE_TYPES.map((t) => (
                    <option key={t} value={t} className="bg-slate-800">
                      {t}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={18}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                {isProcessing && (
                  <span className="absolute right-9 top-1/2 -translate-y-1/2 rounded-md bg-blue-500/20 px-2 py-1 text-xs font-semibold text-blue-300">
                    Classifying...
                  </span>
                )}
                {showTypeBadge && (
                  <span className="absolute right-9 top-1/2 -translate-y-1/2 rounded-md bg-emerald-500/20 px-2 py-1 text-xs font-semibold text-emerald-400">
                    AI Classified ✓
                  </span>
                )}
              </div>
              {fieldErrors.vehicleType && (
                <p className="mt-1 text-xs text-rose-400">
                  {fieldErrors.vehicleType}
                </p>
              )}
            </div>

            {/* Vehicle Model (manual) */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Vehicle Model
              </label>
              <input
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                placeholder="e.g. Honda CR-V"
                className="w-full rounded-lg border border-slate-500 bg-transparent px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500"
              />
            </div>

            {/* Confidence bars */}
            <ConfidenceBar label="Plate OCR" value={plateConfidence} />
            <ConfidenceBar label="Vehicle Type" value={vehicleConfidence} />

            <button
              type="button"
              onClick={handleSave}
              disabled={isProcessing || isSaving}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving && <Loader2 size={16} className="animate-spin" />}
              {isSaving ? "Saving..." : "Save Vehicle"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

function ConfidenceBar({ label, value }) {
  return (
    <div className="mb-4">
      <div className="mb-2 text-sm text-slate-300">
        {label}: <span className="text-white">{value}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-700">
        <motion.div
          className="h-full rounded-full bg-blue-500"
          initial={false}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}

export default AddVehicle;
