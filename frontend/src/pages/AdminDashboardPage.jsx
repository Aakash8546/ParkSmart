import React, { useState, useEffect } from 'react';
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
import { Calendar, PieChart as PieIcon, Users, ArrowUpRight } from 'lucide-react';
import { adminService } from '../services/adminService';
import { slotService } from '../services/slotService';

const defaultRevenueData = [
  { day: 'Sun', amount: 0 },
  { day: 'Mon', amount: 0 },
  { day: 'Tue', amount: 0 },
  { day: 'Wed', amount: 0 },
  { day: 'Thu', amount: 0 },
  { day: 'Fri', amount: 0 },
  { day: 'Sat', amount: 0 },
];

const defaultPeakHoursData = [
  { time: '9AM', count: 0, level: 'low' },
  { time: '10AM', count: 0, level: 'low' },
  { time: '11AM', count: 0, level: 'low' },
  { time: '12PM', count: 0, level: 'low' },
  { time: '1PM', count: 0, level: 'low' },
  { time: '2PM', count: 0, level: 'low' },
  { time: '3PM', count: 0, level: 'low' },
  { time: '4PM', count: 0, level: 'low' },
  { time: '5PM', count: 0, level: 'low' },
  { time: '6PM', count: 0, level: 'low' },
  { time: '7PM', count: 0, level: 'low' },
  { time: '8PM', count: 0, level: 'low' },
  { time: '9PM', count: 0, level: 'low' },
];

const defaultSlotUtilizationData = [
  { name: 'Zone A', value: 25, color: '#3b82f6' },
  { name: 'Zone B', value: 25, color: '#06b6d4' },
  { name: 'Zone C', value: 25, color: '#f59e0b' },
  { name: 'Zone D', value: 25, color: '#a855f7' },
];

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState(defaultRevenueData);
  const [peakHoursData, setPeakHoursData] = useState(defaultPeakHoursData);
  const [slotUtilizationData, setSlotUtilizationData] = useState(defaultSlotUtilizationData);
  const [tableBookings, setTableBookings] = useState([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, bookingsRes, slotsRes] = await Promise.all([
          adminService.getDashboardStats().catch(() => null),
          adminService.getAllBookings().catch(() => null),
          slotService.getAllSlots().catch(() => null),
        ]);

        if (statsRes && statsRes.success && statsRes.data) {
          setStats(statsRes.data);
        }

        // 1. Dynamic Recent Bookings Table & Revenue & Peak Hours calculation
        if (bookingsRes && bookingsRes.success && Array.isArray(bookingsRes.data)) {
          const bookings = bookingsRes.data;
          setTableBookings(
            bookings.map((b) => ({
              user: b.userName || b.userEmail || 'User',
              slot: b.slotCode || 'Slot',
              time: b.startTime ? new Date(b.startTime).toLocaleString() : 'Recent',
              status: b.status || 'ACTIVE',
              amount: `₹${b.totalPrice || 180}`,
            }))
          );

          if (bookings.length > 0) {
            // Calculate Day-wise Total Revenue for AreaChart
            const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const daySums = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
            bookings.forEach((b) => {
              if (b.startTime) {
                const dayName = daysOfWeek[new Date(b.startTime).getDay()];
                daySums[dayName] = (daySums[dayName] || 0) + (b.totalPrice || 50);
              }
            });
            const computedRevenue = daysOfWeek.map((day) => ({
              day,
              amount: daySums[day] || 0,
            }));
            setRevenueData(computedRevenue);

            // Calculate Peak Hours for BarChart
            const hourCounts = {};
            bookings.forEach((b) => {
              if (b.startTime) {
                const hr = new Date(b.startTime).getHours();
                const hourLabel = hr === 0 ? '12AM' : hr > 12 ? `${hr - 12}PM` : `${hr}AM`;
                hourCounts[hourLabel] = (hourCounts[hourLabel] || 0) + 1;
              }
            });
            const timeSlots = ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM'];
            const computedPeakHours = timeSlots.map((t) => {
              const count = hourCounts[t] || 0;
              const level = count >= 5 ? 'high' : count >= 2 ? 'medium' : 'low';
              return { time: t, count, level };
            });
            setPeakHoursData(computedPeakHours);
          }
        }

        // 2. Dynamic Zone Slot Utilization calculation
        if (slotsRes && slotsRes.success && Array.isArray(slotsRes.data) && slotsRes.data.length > 0) {
          const totalCount = slotsRes.data.length;
          const zoneCounts = {};
          const zoneColors = { 'Zone A': '#3b82f6', 'Zone B': '#06b6d4', 'Zone C': '#f59e0b', 'Zone D': '#a855f7' };
          slotsRes.data.forEach((s) => {
            const zName = `Zone ${s.zone || (s.slotCode ? s.slotCode.charAt(0) : 'A')}`;
            zoneCounts[zName] = (zoneCounts[zName] || 0) + 1;
          });

          const computedUtilization = Object.keys(zoneCounts).map((zName) => ({
            name: zName,
            value: Math.round((zoneCounts[zName] / totalCount) * 100),
            color: zoneColors[zName] || '#3b82f6',
          }));
          setSlotUtilizationData(computedUtilization);
        }
      } catch (err) {
        // Error handling
      }
    };

    fetchAdminData();
  }, []);

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
            <button
              onClick={() => window.open(adminService.exportCsvUrl(), '_blank')}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all cursor-pointer"
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#131b2e]/90 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400">Total Revenue</p>
              <h3 className="text-2xl font-extrabold text-white font-mono mt-1">
                {stats?.totalRevenue != null ? `₹${stats.totalRevenue.toLocaleString()}` : '₹0'}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#131b2e]/90 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400">Today's Bookings</p>
              <h3 className="text-2xl font-extrabold text-white font-mono mt-1">
                {stats?.todaysBookings != null ? stats.todaysBookings : 0}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#131b2e]/90 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400">Occupancy Rate</p>
              <h3 className="text-2xl font-extrabold text-white font-mono mt-1">
                {stats?.occupancyRate != null ? `${Math.round(stats.occupancyRate)}%` : '0%'}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              <PieIcon className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#131b2e]/90 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400">Active Users</p>
              <h3 className="text-2xl font-extrabold text-white font-mono mt-1">
                {stats?.activeUsers != null ? stats.activeUsers : 0}
              </h3>
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
              {tableBookings.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  No bookings found in database yet.
                </div>
              ) : (
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
                    {tableBookings.map((b, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 font-semibold text-white flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px]">
                            {(b.user || 'U').charAt(0)}
                          </div>
                          {b.user}
                        </td>
                        <td className="py-3 text-slate-300 font-mono">{b.slot}</td>
                        <td className="py-3 text-slate-400">{b.time}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              b.status === 'Active' || b.status === 'ACTIVE'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : b.status === 'Completed' || b.status === 'COMPLETED'
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
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
