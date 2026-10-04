import { useState } from "react";
import {
  UploadCloud,
  Sparkles,
  ChevronDown,
  X,
} from "lucide-react";

const AddVehicle = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  // Image select hone par
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith("image/")) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  // Drag over
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Image drop hone par
  const handleDrop = (e) => {
    e.preventDefault();

    const file = e.dataTransfer.files[0];

    if (file && file.type.startsWith("image/")) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  // Image remove
  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-[#071226] px-5 py-8 text-white md:px-10 lg:px-16">

      {/* Breadcrumb */}
      <div className="mx-auto mb-8 flex max-w-6xl items-center gap-3 text-sm">
        <span className="text-slate-400">Dashboard</span>
        <span className="text-slate-500">›</span>
        <span className="text-slate-400">Vehicles</span>
        <span className="text-slate-500">›</span>
        <span className="text-white">Add New</span>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">

        {/* LEFT SIDE */}
        <div>

          {/* Upload Box */}
          <label
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="flex h-56 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-blue-500 bg-[#0b172c] text-center transition hover:bg-[#0e1d36]"
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            <UploadCloud
              size={48}
              strokeWidth={1.5}
              className="mb-4 text-slate-400"
            />

            <p className="text-base font-medium text-white">
              Drop your car image here
            </p>

            <p className="text-sm text-slate-400">
              or click to upload
            </p>
          </label>

          {/* Car Image */}
          <div className="relative mt-5 overflow-hidden rounded-xl border border-slate-600">

            <img
              src={selectedImage || "/assets/car.jpg"}
              alt="Vehicle"
              className="h-[275px] w-full object-cover"
            />

            {/* Remove Button */}
            {selectedImage && (
              <button
                onClick={handleRemoveImage}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-red-500"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="rounded-xl border border-slate-600 bg-gradient-to-br from-slate-700/70 to-slate-800/70 p-6 shadow-xl">

          <h1 className="mb-5 text-2xl font-bold">
            Add Vehicle
          </h1>

          {/* Plate Number */}
          <div className="mb-4">
            <label className="mb-2 flex items-center gap-2 text-sm text-slate-300">
              Plate Number
              <Sparkles size={15} className="text-blue-400" />
            </label>

            <div className="relative">
              <input
                value="MH 12 AB 1234"
                readOnly
                className="w-full rounded-lg border border-slate-500 bg-slate-700/70 px-3 py-2.5 pr-28 text-sm text-white outline-none"
              />

              <span className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-emerald-500/20 px-2 py-1 text-xs font-medium text-emerald-400">
                AI Detected ✓
              </span>
            </div>
          </div>

          {/* Vehicle Type */}
          <div className="mb-4">
            <label className="mb-2 flex items-center gap-2 text-sm text-slate-300">
              Vehicle Type
              <Sparkles size={15} className="text-blue-400" />
            </label>

            <div className="relative">
              <input
                value="SUV"
                readOnly
                className="w-full rounded-lg border border-slate-500 bg-slate-700/70 px-3 py-2.5 pr-28 text-sm text-white outline-none"
              />

              <span className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-emerald-500/20 px-2 py-1 text-xs font-medium text-emerald-400">
                AI Classified ✓
              </span>
            </div>
          </div>

          {/* Vehicle Model */}
          <div className="mb-4">
            <label className="mb-2 block text-sm text-slate-300">
              Vehicle Model
            </label>

            <input
              value="Honda CR-V"
              readOnly
              className="w-full rounded-lg border border-slate-500 bg-transparent px-3 py-2.5 text-sm text-white outline-none"
            />
          </div>

          {/* Color */}
          <div className="mb-4">
            <label className="mb-2 block text-sm text-slate-300">
              Color
            </label>

            <div className="flex h-11 items-center justify-end rounded-lg border border-slate-500 px-3">
              <ChevronDown size={18} className="text-slate-400" />
            </div>
          </div>

          {/* OCR */}
          <div className="mb-4">
            <div className="mb-2 text-sm text-slate-300">
              Plate OCR: 94%
            </div>

            <div className="h-1.5 rounded-full bg-slate-700">
              <div className="h-full w-[94%] rounded-full bg-blue-500" />
            </div>
          </div>

          {/* Vehicle Type */}
          <div className="mb-5">
            <div className="mb-2 text-sm text-slate-300">
              Vehicle Type: 87%
            </div>

            <div className="h-1.5 rounded-full bg-slate-700">
              <div className="h-full w-[87%] rounded-full bg-blue-500" />
            </div>
          </div>

          <button className="w-full rounded-lg bg-blue-500 py-3 text-sm font-semibold text-white transition hover:bg-blue-600">
            Save Vehicle
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVehicle;

