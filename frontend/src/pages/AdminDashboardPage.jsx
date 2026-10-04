import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DollarSign, Calendar, PieChart as PieIcon, Users, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';

const revenueData = [
  { day: 'Sun', amount: 2100 },
  { day: 'Mon', amount: 6000 },
  { day: 'Tue', amount: 5000 },
  { day: 'Wed', amount: 3500 },
  { day: 'Thu', amount: 10000 },
  { day: 'Fri', amount: 15000 },
  { day: 'Sat', amount: 13500 },
];

const peakHoursData = [
  { time: '9AM', count: 150, level: 'high' },
  { time: '10AM', count: 200, level: 'high' },
  { time: '11AM', count: 130, level: 'high' },
  { time: '12AM', count: 80, level: 'low' },
  { time: '1PM', count: 60, level: 'low' },
  { time: '2PM', count: 65, level: 'low' },
  { time: '3PM', count: 75, level: 'medium' },
  { time: '4PM', count: 115, level: 'medium' },
  { time: '5PM', count: 170, level: 'high' },
  { time: '6PM', count: 120, level: 'medium' },
  { time: '7PM', count: 85, level: 'low' },
  { time: '8PM', count: 65, level: 'low' },
  { time: '9PM', count: 50, level: 'low' },
];

const slotUtilizationData = [
  { name: 'Zone A', value: 35, color: '#3b82f6' },
  { name: 'Zone B', value: 25, color: '#06b6d4' },
  { name: 'Zone C', value: 22, color: '#f59e0b' },
  { name: 'Zone D', value: 18, color: '#a855f7' },
];

const recentBookings = [
  { user: 'Joan Emut', slot: 'Slot1', time: '23-06-23, 10:05:40', status: 'Active', amount: '₹45,200' },
  { user: 'Yamamahsen', slot: 'Slot2', time: '23-06-23, 10:05:46', status: 'Completed', amount: '₹20,000' },
  { user: 'Kuma Kare', slot: 'Slot3', time: '23-06-23, 10:05:30', status: 'Completed', amount: '₹35,000' },
  { user: 'Joan Smith', slot: 'Slot4', time: '23-06-23, 12:35:40', status: 'Active', amount: '₹45,200' },
  { user: 'Marty Rhath', slot: 'Slot5', time: '23-06-23, 10:03:11', status: 'Cancelled', amount: '₹75,000' },
];

export const AdminDashboardPage = () => {
  return (
    <div className="min-h-screen bg-[#0b101d] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            Admin Analytics Dashboard 👑
          </h1>

          <div className="flex items-center gap-3">
            <button className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all">
              Manage Slots
            </button>
            <button className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all">
              Set Pricing
            </button>
            <button className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all">
              Train ML Model
            </button>
            <button className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all">
              Export CSV
            </button>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-[#131b2e]/90 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400">Total Revenue</p>
              <h3 className="text-2xl font-extrabold text-white font-mono mt-1">₹45,200</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#131b2e]/90 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400">Today's Bookings</p>
              <h3 className="text-2xl font-extrabold text-white font-mono mt-1">34</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#131b2e]/90 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400">Occupancy Rate</p>
              <h3 className="text-2xl font-extrabold text-white font-mono mt-1">78%</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              <PieIcon className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#131b2e]/90 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400">Active Users</p>
              <h3 className="text-2xl font-extrabold text-white font-mono mt-1">156</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

        </div>

        {/* Charts Row 1: Revenue Area Chart + Peak Hours Bar Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Revenue Last 7 Days Area Chart */}
          <div className="lg:col-span-6 bg-[#131b2e]/90 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">Revenue Last 7 Days</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Peak Hours Bar Chart */}
          <div className="lg:col-span-6 bg-[#131b2e]/90 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">Peak Hours</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={peakHoursData}>
                  <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {peakHoursData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.level === 'high' ? '#f43f5e' : entry.level === 'medium' ? '#f59e0b' : '#10b981'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Charts Row 2: Slot Utilization Donut + Recent Bookings Table */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Slot Utilization Donut Chart */}
          <div className="lg:col-span-5 bg-[#131b2e]/90 border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
            <h3 className="text-sm font-bold text-white">Slot Utilization by Zone</h3>
            
            <div className="h-56 w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={slotUtilizationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {slotUtilizationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
              {slotUtilizationData.map((z) => (
                <div key={z.name} className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: z.color }} />
                  <span className="text-slate-400">{z.name}</span>
                  <span className="font-bold text-white ml-auto">{z.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Bookings Table */}
          <div className="lg:col-span-7 bg-[#131b2e]/90 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">Recent Bookings</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-semibold">User</th>
                    <th className="pb-3 font-semibold">Slot</th>
                    <th className="pb-3 font-semibold">Time</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {recentBookings.map((b, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 font-semibold text-white flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px]">
                          {b.user.charAt(0)}
                        </div>
                        {b.user}
                      </td>
                      <td className="py-3 text-slate-300 font-mono">{b.slot}</td>
                      <td className="py-3 text-slate-400">{b.time}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            b.status === 'Active'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : b.status === 'Completed'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3 font-mono font-bold text-right text-slate-200">{b.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};
