
import React from "react";
import {
  ArrowUp,
  CalendarCheck,
  UserRound,
} from "lucide-react";

const recentBookings = [
  {
    user: "Joan Ernut",
    slot: "Slot1",
    time: "23-06-23, 10:05:40",
    status: "Active",
    amount: "₹45,200",
  },
  {
    user: "Yamahansen",
    slot: "Slot2",
    time: "23-06-23, 10:05:46",
    status: "Completed",
    amount: "₹20,000",
  },
  {
    user: "Kuma Kare",
    slot: "Slot3",
    time: "23-06-23, 10:05:30",
    status: "Completed",
    amount: "₹35,000",
  },
  {
    user: "Joan Smith",
    slot: "Slot4",
    time: "23-06-23, 12:35:40",
    status: "Active",
    amount: "₹45,200",
  },
  {
    user: "Marty Rath",
    slot: "Slot5",
    time: "23-06-23, 10:03:11",
    status: "Cancelled",
    amount: "₹75,000",
  },
];

const peakHours = [
  { time: "9AM", value: 150 },
  { time: "10AM", value: 200 },
  { time: "11AM", value: 130 },
  { time: "12AM", value: 80 },
  { time: "1PM", value: 65 },
  { time: "2PM", value: 70 },
  { time: "3PM", value: 80 },
  { time: "4PM", value: 115 },
  { time: "5PM", value: 170 },
  { time: "6PM", value: 125 },
  { time: "7PM", value: 90 },
  { time: "8PM", value: 70 },
  { time: "9PM", value: 50 },
];

const revenueData = [
  { day: "Sun", value: 2100 },
  { day: "Mon", value: 6000 },
  { day: "Tue", value: 5000 },
  { day: "Wed", value: 3500 },
  { day: "Thu", value: 10000 },
  { day: "Fri", value: 15000 },
  { day: "Sat", value: 13500 },
];

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#202d42] p-5 sm:p-8 md:p-10">

      {/* Main Dashboard */}
      <div className="mx-auto max-w-[1150px] rounded-[20px] bg-[#061326] p-7 sm:p-9 md:p-10">

        {/* Heading */}
        <h1 className="mb-6 text-[27px] font-bold text-white">
          Admin Analytics Dashboard
        </h1>

        {/* ================= STAT CARDS ================= */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* Revenue */}
          <div className="flex h-[82px] items-center justify-between rounded-xl border border-[#56647a] bg-[#293548] px-4">

            <div>
              <p className="text-[14px] text-[#b7bfcc]">
                Total Revenue
              </p>

              <p className="text-[27px] font-bold leading-8 text-white">
                ₹45,200
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#087a70]/50">
              <ArrowUp className="h-7 w-7 text-[#00c99b]" />
            </div>

          </div>


          {/* Today's Bookings */}
          <div className="flex h-[82px] items-center justify-between rounded-xl border border-[#56647a] bg-[#293548] px-4">

            <div>
              <p className="text-[14px] text-[#b7bfcc]">
                Today's Bookings:
              </p>

              <p className="text-[27px] font-bold leading-8 text-white">
                34
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#075c99]/50">
              <CalendarCheck className="h-6 w-6 text-[#1999ff]" />
            </div>

          </div>


          {/* Occupancy */}
          <div className="flex h-[82px] items-center gap-4 rounded-xl border border-[#56647a] bg-[#293548] px-4">

            <div className="relative h-[51px] w-[51px]">

              <svg
                className="-rotate-90"
                viewBox="0 0 52 52"
              >
                <circle
                  cx="26"
                  cy="26"
                  r="22"
                  fill="none"
                  stroke="#35465d"
                  strokeWidth="5"
                />

                <circle
                  cx="26"
                  cy="26"
                  r="22"
                  fill="none"
                  stroke="#22a9ff"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray="138"
                  strokeDashoffset="30"
                />
              </svg>

            </div>

            <div>
              <p className="text-[14px] text-[#b7bfcc]">
                Occupancy Rate:
              </p>

              <p className="text-[27px] font-bold leading-8 text-white">
                78%
              </p>
            </div>

          </div>


          {/* Active Users */}
          <div className="flex h-[82px] items-center justify-between rounded-xl border border-[#56647a] bg-[#293548] px-4">

            <div>
              <p className="text-[14px] text-[#b7bfcc]">
                Active Users:
              </p>

              <p className="text-[27px] font-bold leading-8 text-white">
                156
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#632f87]/50">
              <UserRound className="h-6 w-6 text-[#a75bff]" />
            </div>

          </div>

        </div>


        {/* ================= CHART ROW 1 ================= */}
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">

          {/* Revenue Chart */}
          <RevenueChart />

          {/* Peak Hours */}
          <PeakHours />

        </div>


        {/* ================= CHART ROW 2 ================= */}
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">

          {/* Donut */}
          <ZoneUtilization />

          {/* Recent Bookings */}
          <RecentBookings />

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   REVENUE CHART
========================================================= */

function RevenueChart() {
  const points = [
    "0,132",
    "75,95",
    "150,107",
    "225,117",
    "300,43",
    "375,27",
    "450,48",
  ];

  return (
    <div className="rounded-xl border border-[#536177] bg-[#293548] p-3">

      <h2 className="mb-2 text-[15px] font-semibold text-white">
        Revenue Last 7 Days
      </h2>

      <div className="relative h-[165px]">

        {/* Horizontal lines */}
        <div className="absolute inset-x-10 top-2 border-t border-[#3b4a5e]" />
        <div className="absolute inset-x-10 top-[43px] border-t border-[#3b4a5e]" />
        <div className="absolute inset-x-10 top-[84px] border-t border-[#3b4a5e]" />
        <div className="absolute inset-x-10 top-[125px] border-t border-[#3b4a5e]" />

        {/* Labels */}
        <div className="absolute left-0 top-0 text-[10px] text-[#b7bfcc]">
          ₹60,000
        </div>

        <div className="absolute left-0 top-[40px] text-[10px] text-[#b7bfcc]">
          ₹75,000
        </div>

        <div className="absolute left-0 top-[81px] text-[10px] text-[#b7bfcc]">
          ₹40,000
        </div>

        <div className="absolute left-0 top-[122px] text-[10px] text-[#b7bfcc]">
          ₹25,000
        </div>

        <div className="absolute left-8 bottom-[18px] text-[10px] text-[#b7bfcc]">
          0
        </div>

        <svg
          viewBox="0 0 450 150"
          preserveAspectRatio="none"
          className="absolute left-10 top-2 h-[140px] w-[calc(100%-50px)]"
        >

          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3cbcff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0789ee" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          <path
            d="M0 132 C25 110 45 100 75 95 C100 90 125 101 150 107 C175 112 200 120 225 117 C250 112 270 58 300 43 C330 28 350 30 375 27 C400 25 425 37 450 48 L450 150 L0 150 Z"
            fill="url(#revenueGradient)"
          />

          <path
            d="M0 132 C25 110 45 100 75 95 C100 90 125 101 150 107 C175 112 200 120 225 117 C250 112 270 58 300 43 C330 28 350 30 375 27 C400 25 425 37 450 48"
            fill="none"
            stroke="#2fb8ff"
            strokeWidth="2"
          />

          {[0, 75, 150, 225, 300, 375, 450].map((x, index) => {
            const y = [132, 95, 107, 117, 43, 27, 48][index];

            return (
              <circle
                key={x}
                cx={x}
                cy={y}
                r="3"
                fill="#2dafff"
                stroke="#d7f4ff"
                strokeWidth="1"
              />
            );
          })}

        </svg>

        {/* Values */}
        <div className="absolute left-[8%] top-[72px] text-[10px] text-[#d7dce3]">
          6,000
        </div>

        <div className="absolute left-[31%] top-[83px] text-[10px] text-[#d7dce3]">
          5,000
        </div>

        <div className="absolute left-[45%] top-[95px] text-[10px] text-[#d7dce3]">
          3,500
        </div>

        <div className="absolute left-[63%] top-[24px] text-[10px] text-[#d7dce3]">
          10,000
        </div>

        <div className="absolute left-[77%] top-[10px] text-[10px] text-[#d7dce3]">
          15,000
        </div>

        <div className="absolute right-[3%] top-[27px] text-[10px] text-[#d7dce3]">
          13,500
        </div>

        {/* Days */}
        <div className="absolute bottom-0 left-[7%] text-[10px] text-[#c0c7d1]">
          Mon
        </div>
        <div className="absolute bottom-0 left-[25%] text-[10px] text-[#c0c7d1]">
          Tue
        </div>
        <div className="absolute bottom-0 left-[43%] text-[10px] text-[#c0c7d1]">
          Wed
        </div>
        <div className="absolute bottom-0 left-[61%] text-[10px] text-[#c0c7d1]">
          Thu
        </div>
        <div className="absolute bottom-0 left-[78%] text-[10px] text-[#c0c7d1]">
          Fri
        </div>
        <div className="absolute bottom-0 right-[1%] text-[10px] text-[#c0c7d1]">
          Sat
        </div>
        <div className="absolute bottom-0 left-0 text-[10px] text-[#c0c7d1]">
          Sun
        </div>

      </div>
    </div>
  );
}


/* =========================================================
   PEAK HOURS
========================================================= */

function PeakHours() {
  return (
    <div className="rounded-xl border border-[#536177] bg-[#293548] p-3">

      <h2 className="mb-2 text-[15px] font-semibold text-white">
        Peak Hours
      </h2>

      <div className="flex h-[165px] items-end gap-[4px] px-5 pb-5">

        <div className="mr-1 flex h-full flex-col justify-between text-[9px] text-[#b7bfcc]">
          <span>200</span>
          <span>150</span>
          <span>100</span>
          <span>50</span>
          <span>0</span>
        </div>

        <div className="flex h-full flex-1 items-end gap-[5px] border-b border-[#3c4a5d]">

          {peakHours.map((item, index) => (
            <div
              key={item.time}
              className="flex h-full flex-1 flex-col items-center justify-end"
            >

              <div
                className={`w-full max-w-[25px] rounded-t-[4px] ${
                  index < 7
                    ? "bg-[#df544e]"
                    : "bg-[#dca844]"
                }`}
                style={{
                  height: `${(item.value / 200) * 130}px`,
                }}
              />

              <span className="mt-1 text-[8px] text-[#c3cad4]">
                {item.time}
              </span>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
}


/* =========================================================
   DONUT CHART
========================================================= */

function ZoneUtilization() {
  return (
    <div className="rounded-xl border border-[#536177] bg-[#293548] p-3">

      <h2 className="text-[15px] font-semibold text-white">
        Slot Utilization by Zone
      </h2>

      <div className="relative flex h-[165px] items-center justify-center">

        {/* Donut */}
        <div
          className="relative h-[135px] w-[135px] rounded-full"
          style={{
            background:
              "conic-gradient(#1999e9 0deg 126deg, #20b8b0 126deg 216deg, #f2a72e 216deg 295.2deg, #a850dc 295.2deg 360deg)",
          }}
        >
          <div className="absolute inset-[34px] flex items-center justify-center rounded-full bg-[#293548]" />

          <span className="absolute left-[48px] top-[38px] text-[11px] font-bold text-white">
            35%
          </span>

          <span className="absolute bottom-[29px] right-[27px] text-[11px] font-bold text-white">
            25%
          </span>

          <span className="absolute bottom-[45px] left-[26px] text-[11px] font-bold text-white">
            22%
          </span>

          <span className="absolute left-[49px] top-[8px] text-[11px] font-bold text-white">
            18%
          </span>
        </div>

        {/* Labels */}
        <div className="absolute right-[9%] top-[38px] text-[11px] text-[#1999e9]">
          Zone A
          <br />
          35%
        </div>

        <div className="absolute bottom-[20px] right-[13%] text-[11px] text-[#20b8b0]">
          Zone B
          <br />
          25%
        </div>

        <div className="absolute bottom-[25px] left-[20%] text-[11px] text-[#f2a72e]">
          Zone C
          <br />
          22%
        </div>

        <div className="absolute left-[22%] top-[20px] text-[11px] text-[#a850dc]">
          Zone D
          <br />
          18%
        </div>

      </div>

    </div>
  );
}


/* =========================================================
   RECENT BOOKINGS
========================================================= */

function RecentBookings() {
  return (
    <div className="rounded-xl border border-[#536177] bg-[#293548] p-3">

      <h2 className="mb-2 text-[15px] font-semibold text-white">
        Recent Bookings
      </h2>

      <div className="overflow-x-auto">

        <table className="w-full min-w-[500px] text-left text-[10px]">

          <thead>
            <tr className="bg-[#36455a] text-[#d4d9e0]">
              <th className="px-2 py-2">User</th>
              <th className="px-2 py-2">Slot</th>
              <th className="px-2 py-2">Time</th>
              <th className="px-2 py-2">Status</th>
              <th className="px-2 py-2">Amount</th>
            </tr>
          </thead>

          <tbody>

            {recentBookings.map((booking, index) => (
              <tr
                key={index}
                className="border-b border-[#3d4a5d] text-[#e0e4ea]"
              >

                <td className="px-2 py-[7px]">
                  <div className="flex items-center gap-2">

                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#8b6f61] text-[8px]">
                      {booking.user.charAt(0)}
                    </div>

                    {booking.user}

                  </div>
                </td>

                <td className="px-2 py-[7px]">
                  {booking.slot}
                </td>

                <td className="whitespace-nowrap px-2 py-[7px]">
                  {booking.time}
                </td>

                <td className="px-2 py-[7px]">

                  <span
                    className={`rounded-md px-2 py-1 text-[9px] ${
                      booking.status === "Active"
                        ? "bg-[#087b68] text-[#aaffeb]"
                        : booking.status === "Completed"
                        ? "bg-[#1765b5] text-[#c5e2ff]"
                        : "bg-[#8b3541] text-[#ffc3ca]"
                    }`}
                  >
                    {booking.status}
                  </span>

                </td>

                <td className="px-2 py-[7px]">
                  {booking.amount}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default AdminDashboard;