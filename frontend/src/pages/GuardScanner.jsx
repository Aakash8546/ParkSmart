import { useState } from "react";

import {
  Camera,
  CheckCircle2,
  ScanLine,
  ShieldCheck,
  XCircle,
  RotateCcw,
} from "lucide-react";

import Panel from "../components/Panel";
import StatusBadge from "../components/StatCard";

function FakeQR() {

  return (
    <div className="grid aspect-square w-48 grid-cols-10 gap-1 rounded-lg bg-white p-3">

      {Array.from(
        { length: 100 },
        (_, index) => (

          <span
            key={index}
            className={
              (index * 7) % 11 < 5
                ? "bg-black"
                : "bg-white"
            }
          />

        )
      )}

    </div>
  );
}

function GuardScanner() {

  const [status, setStatus] =
    useState("Valid Booking");

  const [decision, setDecision] =
    useState("");

  function allowEntry() {

    setStatus("Entry Allowed");

    setDecision(
      "Slot status updated to OCCUPIED. Entry allowed."
    );
  }

  function denyEntry() {

    setStatus("Entry Denied");

    setDecision(
      "Entry denied. Booking remains unchanged."
    );
  }

  function scanAgain() {

    setStatus("Valid Booking");

    setDecision("");
  }

  const valid =
    status !== "Entry Denied";

  return (
    <div className="mx-auto max-w-6xl">

      <Panel className="overflow-hidden">

        {/* NAVBAR */}

        <div className="border-b border-white/10 px-5 py-4 text-lg font-semibold">

          ParkSmart AI

          <span className="font-normal text-slate-400">
            {" "}— Guard View
          </span>

        </div>

        <div className="grid gap-8 p-5 lg:grid-cols-[1.2fr_.9fr]">

          {/* CAMERA */}

          <div>

            <div className="relative grid min-h-[320px] place-items-center overflow-hidden rounded-3xl border border-slate-500/40 bg-gradient-to-br from-slate-600 via-slate-700 to-slate-900">

              {/* QR */}

              <div className="relative">

                <div className="absolute -inset-5 rounded-2xl border-2 border-white/80" />

                <FakeQR />

                {/* LASER */}

                <div className="absolute left-[-50px] right-[-50px] top-1/2 h-1 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_20px_5px_rgba(34,211,238,.8)]" />

              </div>

              <div className="absolute bottom-4 left-4 rounded-full bg-black/40 px-3 py-2 text-xs">

                Scanner preview · Demo mode

              </div>

            </div>

            <div className="mt-5 text-center">

              <h2 className="flex items-center justify-center gap-2 text-2xl font-bold">

                <ScanLine
                  className="text-cyan-300"
                  size={25}
                />

                Scan QR Code

                <Camera
                  className="text-slate-400"
                  size={24}
                />

              </h2>

              <p className="mt-2 text-slate-400">
                Position QR code within the frame
              </p>

            </div>

          </div>

          {/* RESULT CARD */}

          <div className="rounded-3xl border border-slate-500/50 bg-slate-700/20 p-6">

            <div className="text-center">

              <div
                className={`
                  mx-auto grid h-16 w-16 place-items-center rounded-full
                  ${
                    valid
                      ? "bg-emerald-500"
                      : "bg-red-500/20"
                  }
                `}
              >

                {valid ? (
                  <CheckCircle2
                    size={38}
                  />
                ) : (
                  <XCircle
                    size={38}
                    className="text-red-300"
                  />
                )}

              </div>

              <h2 className="mt-4 text-2xl font-bold">
                {status}
              </h2>

              <p className="text-sm text-slate-400">
                Booking #42
              </p>

            </div>

            {/* DETAILS */}

            <div className="my-6 space-y-3">

              <p>
                <span className="text-slate-400">
                  User:
                </span>{" "}
                Aakash Srivastava
              </p>

              <p>
                <span className="text-slate-400">
                  Slot:
                </span>{" "}
                A3 - Zone A
              </p>

              <p>
                <span className="text-slate-400">
                  Vehicle:
                </span>{" "}
                MH 12 AB 1234 (SUV)
              </p>

              <p>
                <span className="text-slate-400">
                  Time:
                </span>{" "}
                2:00 PM - 5:00 PM
              </p>

              <StatusBadge
                status={
                  valid
                    ? "Active"
                    : "Cancelled"
                }
              />

            </div>

            {/* MESSAGE */}

            {decision && (

              <p
                className={`
                  mb-4 rounded-xl p-3 text-sm
                  ${
                    valid
                      ? "bg-emerald-500/10 text-emerald-300"
                      : "bg-red-500/10 text-red-300"
                  }
                `}
              >
                {decision}
              </p>

            )}

            {/* BUTTONS */}

            {status === "Valid Booking" ? (

              <div className="grid gap-3 sm:grid-cols-2">

                <button
                  onClick={allowEntry}
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-black hover:bg-emerald-400"
                >

                  <ShieldCheck size={18} />

                  Allow Entry

                </button>

                <button
                  onClick={denyEntry}
                  className="flex items-center justify-center gap-2 rounded-xl border border-red-400 px-4 py-3 font-semibold text-red-300 hover:bg-red-400/10"
                >

                  <XCircle size={18} />

                  Deny Entry

                </button>

              </div>

            ) : (

              <button
                onClick={scanAgain}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-500 px-4 py-3 font-semibold hover:bg-white/5"
              >

                <RotateCcw size={17} />

                Scan Next Booking

              </button>

            )}

          </div>

        </div>

      </Panel>

    </div>
  );
}

export default GuardScanner;