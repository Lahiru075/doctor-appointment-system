import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  Users2, Stethoscope, Database, CalendarCheck,
  Activity, RefreshCw, ShieldCheck, TrendingUp, Loader2,
  Cpu, Globe, Zap, Clock
} from 'lucide-react';

import { getAdminDashboardStats } from '../services/dashboard';
import type { AdminDashboardDTO } from '../types/types';

const AdminDashboard = () => {
  const [data, setData] = useState<AdminDashboardDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSync, setLastSync] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const result = await getAdminDashboardStats();
      console.log(result);
      setData(result);
      setLastSync(new Date());
    } catch (error) { console.error(error); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchStats(); }, []);

  return (

    <div className="p-4 md:p-6 space-y-5 max-w-[1400px] mx-auto animate-in fade-in duration-500">

      {/* --- 1. COMPACT HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#06222f] border border-emerald-500/20 rounded-xl">
            <Cpu className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tighter uppercase leading-none">
              COMMAND <span className="text-emerald-400">CENTER</span>
            </h1>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1 italic">
              System Live • Node-Root
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#06222f] border border-[#0f3341] px-4 py-1.5 rounded-xl flex items-center gap-3 shadow-sm">
            <Clock className="w-3 h-3 text-emerald-500/60" />
            <span className="text-xs font-black text-white font-mono tracking-widest">
              {currentTime.toLocaleTimeString([], { hour12: false })}
            </span>
          </div>
          <button
            onClick={fetchStats}
            disabled={isLoading}
            className="p-2.5 bg-emerald-500 hover:bg-emerald-400 text-[#041521] rounded-xl transition-all active:scale-90 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin font-black" /> : <RefreshCw className="w-4 h-4 font-black" />}
          </button>
        </div>
      </div>

      {/* --- 2. COMPACT INTERACTIVE BANNER --- */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#082e3e] to-[#041521] border border-[#0f3341] rounded-[2rem] p-6 md:p-8 shadow-xl">

        <ShieldCheck className="absolute -right-6 -top-6 w-48 h-48 text-emerald-400 opacity-[0.03] rotate-12 pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full mb-3">
            <Zap className="w-3 h-3 text-emerald-400" />
            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Core Secured</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            CliniQ Intelligence <span className="text-emerald-400">Hub.</span>
          </h2>

          <p className="text-slate-400 text-xs md:text-sm mt-2 max-w-xl font-medium leading-relaxed">
            Currently monitoring <span className="text-white font-bold">{data?.totalDoctors || 0} Physicians</span> and <span className="text-white font-bold">{data?.totalPatients || 0} Patient Records</span> with real-time diagnostic telemetry.
          </p>
        </div>
      </div>

      {/* --- 3. SMALLER STATS GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Medical Staff" value={data?.totalDoctors} icon={<Stethoscope />} color="blue" loading={isLoading} />
        <StatCard title="Patients" value={data?.totalPatients} icon={<Users2 />} color="emerald" loading={isLoading} />
        <StatCard title="Expertise" value={data?.totalSpecializations} icon={<Database />} color="purple" loading={isLoading} />
        <StatCard title="Bookings" value={data?.totalAppointments} icon={<CalendarCheck />} color="amber" loading={isLoading} />
      </div>

      {/* --- 4. COMPACT ANALYTICS SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        <div className="lg:col-span-2 bg-[#06222f] border border-[#0f3341] rounded-[1.5rem] p-5 shadow-lg">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-xs font-black text-white uppercase tracking-widest">Volume Trends</h3>
            <div className="text-emerald-400 text-[10px] font-black bg-emerald-500/5 px-2 py-0.5 rounded-lg border border-emerald-500/10">
              <TrendingUp className="w-3 h-3 inline mr-1" /> +14%
            </div>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.appointmentTrends || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#0f3341" opacity={0.3} />

                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }}
                  dy={10}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }}
                  dx={-5}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: '#06222f',
                    border: '1px solid #0f3341',
                    borderRadius: '10px',
                    fontSize: '11px',
                    color: '#fff'
                  }}
                  itemStyle={{ color: '#10b981' }}
                  cursor={{ stroke: '#10b981', strokeWidth: 1 }}
                />

                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#10b981"
                  strokeWidth={3}
                  fill="url(#glow)"
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mini Activity Logs */}
        <div className="bg-[#06222f] border border-[#0f3341] rounded-[1.5rem] p-5 shadow-lg flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-black text-white uppercase tracking-widest">System Logs</h3>
          </div>
          <div className="space-y-2.5 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-3 bg-[#041521]/50 border border-[#0f3341]/40 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40 animate-pulse" />
                  <p className="text-[10px] font-bold text-slate-400 tracking-tighter uppercase">Sync_Stream_Node_0{i}</p>
                </div>
                <Globe className="w-3 h-3 text-slate-700" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- MINI STAT CARD --- */
const StatCard = ({ title, value, icon, color, loading }: any) => {
  const colors: any = {
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  };

  return (
    <div className="bg-[#06222f] border border-[#0f3341] p-4 rounded-[1.25rem] shadow-sm hover:border-emerald-500/30 transition-all">
      <div className="flex items-center gap-4">
        <div className={`p-2.5 rounded-xl border ${colors[color]}`}>
          {React.cloneElement(icon, { className: 'w-5 h-5' })}
        </div>
        <div>
          {loading ? (
            <div className="h-6 w-10 bg-slate-800 animate-pulse rounded-md" />
          ) : (
            <h3 className="text-xl font-black text-white tracking-tighter leading-none italic">{value || 0}</h3>
          )}
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">{title}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;