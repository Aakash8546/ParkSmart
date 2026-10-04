import { useEffect, useState } from "react";
import {
  Clock3,
  QrCode,
  X,
  Timer,
} from "lucide-react";

import Panel from "../components/Panel";
import StatusBadge from "../components/StatCard";

const initialBookings = [
  {
    id: 1,
    slot: "A3",
    zone: "Zone Active",
    date: "Sep 28, 2026",
    vehicle: "MH 12 AB 1234",
    time: "2:00 PM - 5:00 PM",
    price: 180,
    status: "Active",
    seconds: 2 * 3600 + 34 * 60,
  },

  {
    id: 2,
    slot: "A3",
    zone: "Zone Completed",
    date: "Sep 25, 2026",
    vehicle: "MH 12 AB 1234",
    time: "2:00 PM - 5:00 PM",
    price: 180,
    status: "Completed",
  },

  {
    id: 3,
    slot: "B2",
    zone: "Zone Completed",
    date: "Sep 21, 2026",
    vehicle: "DL 8C AB 7777",
    time: "10:00 AM - 12:00 PM",
    price: 120,
    status: "Completed",
  },

  {
    id: 4,
    slot: "C1",
    zone: "Zone : Cancelled",
    date: "Sep 18, 2026",
    vehicle: "MH 12 AB 1234",
    time: "2:00 PM - 5:00 PM",
    price: 180,
    status: "Cancelled",
  },
];

function formatTime(seconds = 0) {
  const hours = Math.floor(seconds / 3600);

  const minutes = Math.floor(
    (seconds % 3600) / 60
  );

  const secs = seconds % 60;

  return `${hours}h ${String(minutes).padStart(
    2,
    "0"
  )}m ${String(secs).padStart(2, "0")}s`;
}

function MyBookings() {
  const [bookings, setBookings] =
    useState(initialBookings);

  const [tab, setTab] = useState("Active");

  const [qrBooking, setQrBooking] =
    useState(null);

  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((value) => value + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const filteredBookings = bookings.filter(
    (booking) =>
      tab === "All" ||
      booking.status === tab
  );

  function cancelBooking(id) {
    setBookings((oldBookings) =>
      oldBookings.map((booking) =>
        booking.id === id
          ? {
              ...booking,
              status: "Cancelled",
            }
          : booking
      )
    );
  }

  return (
    <div className="mx-auto max-w-6xl">

      <Panel className="overflow-hidden p-5 sm:p-7">

        {/* HEADER */}

        <div className="mb-6">

          <h1 className="text-2xl font-bold">
            My Bookings
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            View and manage your parking reservations.
          </p>

        </div>

        {/* TABS */}

        <div className="mb-5 flex gap-7 overflow-x-auto border-b border-white/10">

          {[
            "All",
            "Active",
            "Completed",
            "Cancelled",
          ].map((item) => (

            <button
              key={item}
              onClick={() => setTab(item)}
              className={`
                relative shrink-0 pb-3 text-sm
                ${
                  tab === item
                    ? "font-semibold text-blue-300"
                    : "text-slate-400"
                }
              `}
            >

              {item}

              {tab === item && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />
              )}

            </button>

          ))}

        </div>

        {/* BOOKINGS */}

        <div className="space-y-3">

          {filteredBookings.map((booking) => {

            const active =
              booking.status === "Active";

            return (
              <article
                key={booking.id}
                className={`
                  rounded-2xl
                  border
                  p-4
                  ${
                    active
                      ? "border-slate-500/70 bg-white/[0.05]"
                      : "border-slate-700/60 bg-white/[0.025] opacity-75"
                  }
                `}
              >

                <div className="grid gap-4 md:grid-cols-[1.3fr_1fr_1fr_auto] md:items-center">

                  {/* SLOT */}

                  <div className="flex items-center gap-4">

                    <div
                      className={`
                        grid
                        h-14
                        w-14
                        shrink-0
                        place-items-center
                        rounded-full
                        text-xl
                        font-bold
                        ${
                          booking.status === "Active"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : booking.status === "Cancelled"
                            ? "bg-red-500/20 text-red-300"
                            : "bg-slate-500/20 text-slate-300"
                        }
                      `}
                    >
                      {booking.slot}
                    </div>

                    <div>

                      <p className="text-xs text-slate-400">
                        Slot code
                      </p>

                      <p className="font-semibold">
                        {booking.zone}
                      </p>

                      <p className="text-xs text-slate-400">
                        {booking.date}
                      </p>

                    </div>

                  </div>

                  {/* VEHICLE */}

                  <div>

                    <p className="text-xs text-slate-400">
                      Vehicle
                    </p>

                    <p className="text-sm">
                      {booking.vehicle}
                    </p>

                  </div>

                  {/* TIME */}

                  <div>

                    <p className="text-xs text-slate-400">
                      Time
                    </p>

                    <p className="text-sm">
                      {booking.time}
                    </p>

                    {active && (
                      <p className="mt-2 text-xs text-slate-400">

                        <Clock3
                          size={13}
                          className="mr-1 inline"
                        />

                        {formatTime(
                          Math.max(
                            0,
                            booking.seconds - tick
                          )
                        )}

                        {" "}remaining

                      </p>
                    )}

                  </div>

                  {/* ACTIONS */}

                  <div className="flex flex-wrap items-center gap-2">

                    {active ? (
                      <>
                        <StatusBadge status="Active" />

                        <button
                          onClick={() =>
                            setQrBooking(booking)
                          }
                          className="flex items-center gap-1.5 rounded-lg bg-blue-500 px-3 py-2 text-xs font-semibold hover:bg-blue-400"
                        >
                          <QrCode size={15} />
                          View QR
                        </button>

                        <button
                          onClick={() =>
                            cancelBooking(booking.id)
                          }
                          className="rounded-lg border border-red-400/50 px-3 py-2 text-xs text-red-300 hover:bg-red-400/10"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <StatusBadge
                        status={booking.status}
                      />
                    )}

                  </div>

                </div>

              </article>
            );
          })}

        </div>

      </Panel>

      {/* QR MODAL */}

      {qrBooking && (

        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setQrBooking(null)}
        >

          <div
            className="w-full max-w-sm rounded-2xl border border-slate-600 bg-[#152238] p-6 text-center"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="mb-5 flex items-center justify-between">

              <h2 className="text-lg font-bold">
                Booking QR Code
              </h2>

              <button
                onClick={() =>
                  setQrBooking(null)
                }
                className="rounded-lg p-2 hover:bg-white/10"
              >
                <X size={18} />
              </button>

            </div>

            <div className="mx-auto grid aspect-square w-48 grid-cols-11 gap-1 rounded-xl bg-white p-3">

              {Array.from(
                { length: 121 },
                (_, i) => (
                  <span
                    key={i}
                    className={
                      (i * 7) % 11 < 5
                        ? "bg-black"
                        : "bg-white"
                    }
                  />
                )
              )}

            </div>

            <h3 className="mt-4 text-xl font-bold">
              {qrBooking.slot}
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              {qrBooking.vehicle}
            </p>

          </div>

        </div>

      )}

    </div>
  );
}

export default MyBookings;