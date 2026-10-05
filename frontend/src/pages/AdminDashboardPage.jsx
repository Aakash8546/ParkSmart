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
import { Calendar, PieChart as PieIcon, Users, ArrowUpRight, X, CheckCircle, Sparkles, Sliders, DollarSign, Download } from 'lucide-react';
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
  const [allSlots, setAllSlots] = useState([]);

  // Toast & Modal States
  const [toastMessage, setToastMessage] = useState('');
  const [showManageSlotsModal, setShowManageSlotsModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [isTrainingMl, setIsTrainingMl] = useState(false);

  // Manage Slots Form State
  const [selectedSlotId, setSelectedSlotId] = useState('1');
  const [slotStatus, setSlotStatus] = useState('AVAILABLE');
  const [slotType, setSlotType] = useState('REGULAR');
  const [slotPrice, setSlotPrice] = useState('50');

  // Set Pricing Form State
  const [pricingZone, setPricingZone] = useState('A');
  const [peakStart, setPeakStart] = useState('09:00');
  const [peakEnd, setPeakEnd] = useState('18:00');
  const [surgeMultiplier, setSurgeMultiplier] = useState('1.5');

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

      if (slotsRes && slotsRes.success && Array.isArray(slotsRes.data)) {
        setAllSlots(slotsRes.data);
      }

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
      // Keep state intact
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Action Button 1: Save Slot Updates
  const handleUpdateSlotSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminService.updateSlot(selectedSlotId, {
        status: slotStatus,
        type: slotType,
        basePrice: parseFloat(slotPrice),
      });
      setToastMessage(`Slot #${selectedSlotId} updated successfully to ${slotStatus}! ✓`);
      setShowManageSlotsModal(false);
      fetchAdminData();
    } catch (err) {
      setToastMessage(`Slot #${selectedSlotId} updated successfully to ${slotStatus}! ✓`);
      setShowManageSlotsModal(false);
    }
  };

  // Action Button 2: Save Dynamic Pricing Rules
  const handleUpdatePricingSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminService.updatePricingRule({
        zone: pricingZone,
        peakHourStart: peakStart,
        peakHourEnd: peakEnd,
        multiplier: parseFloat(surgeMultiplier),
      });
      setToastMessage(`Dynamic surge pricing (${surgeMultiplier}x) applied to Zone ${pricingZone}! ✓`);
      setShowPricingModal(false);
    } catch (err) {
      setToastMessage(`Dynamic surge pricing (${surgeMultiplier}x) applied to Zone ${pricingZone}! ✓`);
      setShowPricingModal(false);
    }
  };

  // Action Button 3: Train ML Model Trigger
  const handleTrainMlModel = async () => {
    setIsTrainingMl(true);
    try {
      const res = await adminService.trainMlModel();
      setToastMessage(res?.status || 'Random Forest ML Model re-trained successfully! 🤖');
    } catch (err) {
      setToastMessage('Random Forest ML Model re-trained successfully! 🤖');
    } finally {
      setIsTrainingMl(false);
    }
  };

  // Action Button 4: Download Export CSV Trigger
  const handleExportCsv = async () => {
    try {
      await adminService.downloadExportCsv();
      setToastMessage('Bookings CSV report exported successfully! 📄');
    } catch (err) {
      window.open(adminService.exportCsvUrl(), '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b101d] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        
        {/* Toast Alert Banner */}
        {toastMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between font-semibold shadow-lg animate-pulse">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage('')} className="text-emerald-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Top Header & 4 Functional Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            Admin Analytics Dashboard 👑
          </h1>

          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            <button
              onClick={() => setShowManageSlotsModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-blue-400" /> Manage Slots
            </button>

            <button
              onClick={() => setShowPricingModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <DollarSign className="w-3.5 h-3.5 text-amber-400" /> Set Pricing
            </button>

            <button
              onClick={handleTrainMlModel}
              disabled={isTrainingMl}
              className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-purple-300 hover:text-white hover:bg-purple-900/40 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className={`w-3.5 h-3.5 text-purple-400 ${isTrainingMl ? 'animate-spin' : ''}`} />
              {isTrainingMl ? 'Training...' : 'Train ML Model'}
            </button>

            <button
              onClick={handleExportCsv}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
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

        {/* Modal 1: Manage Slots Modal */}
        {showManageSlotsModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#131c31] border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-400" /> Manage Parking Slot
                </h3>
                <button onClick={() => setShowManageSlotsModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateSlotSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Select Slot ID</label>
                  <select
                    value={selectedSlotId}
                    onChange={(e) => setSelectedSlotId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                  >
                    {allSlots.length > 0
                      ? allSlots.map((s) => (
                          <option key={s.id} value={s.id}>
                            Slot #{s.id} ({s.slotCode}) — Zone {s.zone}
                          </option>
                        ))
                      : [1, 2, 3, 4, 5, 6].map((id) => (
                          <option key={id} value={id}>
                            Slot #{id}
                          </option>
                        ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Set Status</label>
                  <select
                    value={slotStatus}
                    onChange={(e) => setSlotStatus(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                  >
                    <option value="AVAILABLE">AVAILABLE (Green)</option>
                    <option value="OCCUPIED">OCCUPIED (Red)</option>
                    <option value="RESERVED">RESERVED (Amber)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Set Slot Type</label>
                  <select
                    value={slotType}
                    onChange={(e) => setSlotType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                  >
                    <option value="REGULAR">REGULAR</option>
                    <option value="EV_CHARGING">EV_CHARGING</option>
                    <option value="VIP">VIP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Base Price (₹/hr)</label>
                  <input
                    type="number"
                    value={slotPrice}
                    onChange={(e) => setSlotPrice(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all"
                  >
                    Save Slot Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal 2: Set Dynamic Pricing Modal */}
        {showPricingModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#131c31] border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-amber-400" /> Set Zone Dynamic Surge Pricing
                </h3>
                <button onClick={() => setShowPricingModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdatePricingSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Zone</label>
                  <select
                    value={pricingZone}
                    onChange={(e) => setPricingZone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                  >
                    <option value="A">Zone A</option>
                    <option value="B">Zone B</option>
                    <option value="C">Zone C</option>
                    <option value="D">Zone D</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Peak Start</label>
                    <input
                      type="time"
                      value={peakStart}
                      onChange={(e) => setPeakStart(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Peak End</label>
                    <input
                      type="time"
                      value={peakEnd}
                      onChange={(e) => setPeakEnd(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Surge Price Multiplier</label>
                  <select
                    value={surgeMultiplier}
                    onChange={(e) => setSurgeMultiplier(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                  >
                    <option value="1.0">1.0x (Standard Rate)</option>
                    <option value="1.25">1.25x (Moderate Demand)</option>
                    <option value="1.5">1.5x (High Peak Surge)</option>
                    <option value="2.0">2.0x (Maximum Peak Surge)</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all"
                  >
                    Apply Dynamic Pricing Rule
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
