import { Sparkles } from "lucide-react";

const demandData = [
  { time: "6 AM", value: 35, type: "low" },
  { time: "7 AM", value: 48, type: "low" },
  { time: "8 AM", value: 65, type: "medium" },
  { time: "9 AM", value: 88, type: "high" },
  { time: "10 AM", value: 100, type: "high" },
  { time: "12 PM", value: 72, type: "medium" },
  { time: "1 PM", value: 60, type: "high" },
  { time: "2 PM", value: 82, type: "low" },
  { time: "3 PM", value: 82, type: "medium" },
  { time: "5 PM", value: 52, type: "high" },
  { time: "6 PM", value: 45, type: "high" },
  { time: "7 PM", value: 65, type: "medium" },
  { time: "9 PM", value: 48, type: "low" },
  { time: "10 PM", value: 35, type: "low" },
];

const getColor = (type) => {
  if (type === "low") return "bg-green-500";
  if (type === "medium") return "bg-yellow-400";
  return "bg-red-500";
};

const DemandPrediction = () => {
  return (
    <div className="min-h-screen bg-[#071226] px-5 py-10 text-white md:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">

        <h1 className="mb-6 text-3xl font-bold">
          Smart Booking Recommendations
        </h1>

        <div className="rounded-xl border border-slate-700 bg-[#08162c] p-6">

          {/* HEADER */}
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

            <h2 className="flex items-center gap-3 text-2xl font-bold md:text-3xl">
              <Sparkles className="text-slate-300" />
              AI-Powered Best Time to Book
            </h2>

            {/* LEGEND */}
            <div className="flex gap-4 rounded-lg border border-slate-700 px-4 py-3 text-sm">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-green-500" />
                = Low
              </span>

              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-yellow-400" />
                = Medium
              </span>

              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-red-500" />
                = High
              </span>
            </div>

          </div>

          {/* CHART */}
          <div className="mt-12 flex h-64 items-end justify-between gap-2 border-b border-slate-600 px-2">

            {demandData.map((item, index) => (
              <div
                key={index}
                className="flex h-full flex-1 flex-col items-center justify-end"
              >

                <div
                  className={`w-full max-w-12 rounded-t-md ${getColor(
                    item.type
                  )}`}
                  style={{
                    height: `${item.value}%`,
                  }}
                />

                <span className="mt-3 whitespace-nowrap text-xs text-slate-300">
                  {item.time}
                </span>

              </div>
            ))}

          </div>

          {/* RECOMMENDATION */}
          <div className="mt-8 flex flex-col gap-5 rounded-xl border border-slate-600 border-l-8 border-l-green-500 bg-[#0a182e] p-5 md:flex-row md:items-center md:justify-between">

            <p className="text-lg text-white md:text-xl">
              <span className="font-bold text-green-400">
                Recommended:
              </span>{" "}
              Book between 1PM-3PM for lowest prices and{" "}
              <span className="font-bold">
                guaranteed availability
              </span>
            </p>

            <button className="shrink-0 rounded-lg bg-green-500 px-6 py-3 font-semibold text-black transition hover:bg-green-400">
              Book Now for 1PM
            </button>

          </div>

          {/* FOOTER */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Predicted by Random Forest ML Model
          </p>

        </div>
      </div>
    </div>
  );
};

export default DemandPrediction;