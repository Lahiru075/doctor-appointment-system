import React, { useState } from 'react';
import { useAuth } from '../context/authContext';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  UserSquare2, 
  Users2, 
  CalendarRange, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  Activity, 
  ShieldAlert, 
  RefreshCw, 
  Cpu, 
  Compass, 
  Search 
} from 'lucide-react';

interface ActivityItem {
  id: string;
  event: string;
  actor: string;
  relativeTime: string;
  type: 'SECURITY' | 'DATABASE' | 'BOOKING' | 'REGISTER' | 'PROFILE';
}

const AdminDashboard = () => {
  const { user, setDemoRole } = useAuth();
  
  // Quick overview state values
  const totalDoctors = 12;
  const totalPatients = 1420;
  const totalAppointments = 340;
  const totalRevenue = 14250;

  // Database Connection Indicator
  const [dbStatus, setDbStatus] = useState<'connected' | 'refreshing'>('connected');

  // Interactive recent activities state
  const [activities, setActivities] = useState<ActivityItem[]>([
    { id: 'act-1', event: 'New Patient registered', actor: 'Dave Henderson', relativeTime: '2 mins ago', type: 'REGISTER' },
    { id: 'act-2', event: 'Dr. Kamal Perera profile updated', actor: 'Admin Console', relativeTime: '15 mins ago', type: 'PROFILE' },
    { id: 'act-3', event: 'Cardiology specialization created', actor: 'System Root', relativeTime: '1 hour ago', type: 'DATABASE' },
    { id: 'act-4', event: 'Appointment set to Confirmed', actor: 'Dr. Sarah Johnson', relativeTime: '2 hours ago', type: 'BOOKING' },
    { id: 'act-5', event: 'Patient account credentials restricted', actor: 'Theresa May', relativeTime: '4 hours ago', type: 'SECURITY' }
  ]);

  const handleRefresh = () => {
    setDbStatus('refreshing');
    
    // Simulate telemetry reload
    setTimeout(() => {
      setDbStatus('connected');
      // Shuffle list a bit to feel interactive
      setActivities(prev => [
        {
          id: `act-${Date.now()}`,
          event: 'System network socket scanned',
          actor: 'AWS-LB Gateway',
          relativeTime: 'Just now',
          type: 'SECURITY'
        },
        ...prev.slice(0, 4)
      ]);
    }, 900);
  };

  const getActivityTheme = (type: ActivityItem['type']) => {
    switch (type) {
      case 'SECURITY':
        return { bg: 'bg-red-50 text-red-700 border-red-100', text: 'SECURITY' };
      case 'DATABASE':
        return { bg: 'bg-indigo-50 text-indigo-700 border-indigo-100', text: 'DBMS' };
      case 'BOOKING':
        return { bg: 'bg-amber-50 text-amber-700 border-amber-100', text: 'BOOKING' };
      case 'REGISTER':
        return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-100', text: 'REGISTER' };
      case 'PROFILE':
        return { bg: 'bg-sky-50 text-sky-700 border-sky-100', text: 'PROFILE' };
      default:
        return { bg: 'bg-slate-50 text-slate-700 border-slate-100', text: 'EVENT' };
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 max-w-7xl mx-auto"
    >
      
      {/* 1. Welcome Banner */}
      <div className="bg-gradient-to-br from-[#8eb5ca] via-[#709eb7] to-[#082e3e] rounded-[2.5rem] border border-white p-8 md:p-10 relative overflow-hidden text-white shadow-lg">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-1 bg-white/15 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-[#e3edf2]" />
              <span>Administrative Superuser Mode</span>
            </div>
            <h2 className="text-2xl md:text-3.5xl font-extrabold tracking-tight">
              CliniQ Administrative Command Center
            </h2>
            <p className="text-slate-100 text-sm leading-relaxed max-w-2xl font-medium">
              Monitor system telemetry, appointments queue volume, and verify credentials safely. Maintain regulatory compliance profiles and audit system telemetry events instantly.
            </p>
          </div>
          
          <div className="flex items-center space-x-3 bg-white/15 p-4.5 rounded-3xl border border-white/10 backdrop-blur-md shadow-3xs text-xs shrink-0 select-none">
            <span className="text-slate-100 font-bold">Network Connection:</span>
            <span className={`inline-flex items-center gap-1.5 font-bold ${
              dbStatus === 'connected' ? 'text-emerald-300' : 'text-slate-200 animate-pulse'
            }`}>
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>{dbStatus === 'connected' ? 'SECURE' : 'RE-INDEXING...'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Developer Role Swap Sandbox Tray */}
      <div className="bg-white/80 border border-[#e3edf2] rounded-[2rem] p-5.5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs shadow-3xs">
        <div className="flex items-center space-x-3 text-slate-600">
          <ShieldAlert className="w-5 h-5 text-[#0a4053] shrink-0" />
          <span className="font-semibold text-slate-500">
            <strong className="text-[#082e3e] font-extrabold">Superuser Role Simulator:</strong> Swapping credentials role context updates current menu access rules dynamically.
          </span>
        </div>
        <div className="flex gap-2.5 shrink-0 select-none">
          <button
            onClick={() => setDemoRole('PATIENT')}
            className="px-4 py-2 bg-[#e3edf2] hover:bg-[#d0e0eb] text-[#082e3e] rounded-full border border-white font-extrabold transition cursor-pointer shadow-3xs text-[11px]"
          >
            Simulate Patient
          </button>
          <button
            onClick={() => setDemoRole('DOCTOR')}
            className="px-4 py-2 bg-[#e3edf2] hover:bg-[#d0e0eb] text-[#082e3e] rounded-full border border-white font-extrabold transition cursor-pointer shadow-3xs text-[11px]"
          >
            Simulate Doctor
          </button>
        </div>
      </div>

      {/* 3. Symmetrical Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 select-none">
        
        {/* Card 1: Total Doctors */}
        <div className="bg-white rounded-[2.25rem] border border-[#e3edf2] p-6 shadow-2xs hover:shadow-xs transition duration-300 relative group overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 w-16 h-16 bg-[#082e3e]/2 rounded-full blur-lg pointer-events-none group-hover:scale-150 transition-transform duration-500" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-black tracking-widest text-[#85abc0]">Doctors Registry</span>
            <div className="p-3 bg-indigo-50 text-indigo-700 rounded-2xl border border-white shrink-0 shadow-3xs">
              <UserSquare2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-5">
            <h3 className="text-3xl font-black text-[#082e3e] leading-tight">{totalDoctors}</h3>
            <p className="text-[11px] text-slate-400 font-bold mt-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Credential Verified MDs</span>
            </p>
          </div>
        </div>

        {/* Card 2: Total Patients */}
        <div className="bg-white rounded-[2.25rem] border border-[#e3edf2] p-6 shadow-2xs hover:shadow-xs transition duration-300 relative group overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 w-16 h-16 bg-[#082e3e]/2 rounded-full blur-lg pointer-events-none group-hover:scale-150 transition-transform duration-500" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-black tracking-widest text-[#85abc0]">Patients Directory</span>
            <div className="p-3 bg-sky-50 text-sky-700 rounded-2xl border border-white shrink-0 shadow-3xs">
              <Users2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-5">
            <h3 className="text-3xl font-black text-[#082e3e] leading-tight">{totalPatients.toLocaleString()}</h3>
            <p className="text-[11px] text-slate-400 font-bold mt-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Full Access Accounts</span>
            </p>
          </div>
        </div>

        {/* Card 3: Total Appointments */}
        <div className="bg-white rounded-[2.25rem] border border-[#e3edf2] p-6 shadow-2xs hover:shadow-xs transition duration-300 relative group overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 w-16 h-16 bg-[#082e3e]/2 rounded-full blur-lg pointer-events-none group-hover:scale-150 transition-transform duration-500" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-black tracking-widest text-[#85abc0]">Appointments Queue</span>
            <div className="p-3 bg-amber-50 text-amber-700 rounded-2xl border border-white shrink-0 shadow-3xs">
              <CalendarRange className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-5">
            <h3 className="text-3xl font-black text-[#082e3e] leading-tight">{totalAppointments}</h3>
            <p className="text-[11px] text-slate-400 font-bold mt-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>Platform Volume Volume</span>
            </p>
          </div>
        </div>

        {/* Card 4: Total Revenue */}
        <div className="bg-white rounded-[2.25rem] border border-[#e3edf2] p-6 shadow-2xs hover:shadow-xs transition duration-300 relative group overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 w-16 h-16 bg-[#082e3e]/2 rounded-full blur-lg pointer-events-none group-hover:scale-150 transition-transform duration-500" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-black tracking-widest text-[#85abc0]">System Fees Revenue</span>
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl border border-white shrink-0 shadow-3xs">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-5">
            <h3 className="text-3xl font-black text-[#082e3e] leading-tight">${totalRevenue.toLocaleString()}</h3>
            <p className="text-[11px] text-slate-400 font-bold mt-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Settled Invoices Volume</span>
            </p>
          </div>
        </div>

      </div>

      {/* 4. Recent System Activities Table */}
      <div className="bg-white rounded-[2.25rem] border border-[#e3edf2] p-7 shadow-sm">
        
        {/* Header Block Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="font-extrabold text-base text-[#082e3e] tracking-tight">Recent System Activities</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Gateway transaction audit ledger</p>
          </div>
          
          <button
            onClick={handleRefresh}
            className="flex items-center space-x-1.5 text-xs text-[#0a4053] hover:text-[#082e3e] font-bold bg-[#f0f5f8] hover:bg-[#e3edf2] border border-transparent transition rounded-full px-4 py-2 cursor-pointer shadow-3xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 shrink-0 ${dbStatus === 'refreshing' ? 'animate-spin' : ''}`} />
            <span>Poll Active Core Logs</span>
          </button>
        </div>

        {/* Database Table layout */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs align-middle">
            <thead>
              <tr className="border-b border-[#f0f5f8] text-slate-400 uppercase tracking-widest text-[9px] font-black">
                <th className="pb-3.5 font-bold pl-1">Timestamp / Delta</th>
                <th className="pb-3.5 font-bold">Audit Event Log Description</th>
                <th className="pb-3.5 font-bold">Active System Subject</th>
                <th className="pb-3.5 font-bold text-center">Security Status</th>
                <th className="pb-3.5 font-bold text-right pr-1">Platform Event Class</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f5f8]">
              {activities.map((item, index) => {
                const tag = getActivityTheme(item.type);
                return (
                  <tr key={index} className="hover:bg-slate-50/50 transition">
                    
                    {/* Timestamp */}
                    <td className="py-4 pl-1">
                      <div className="flex items-center space-x-2 text-slate-500 font-semibold text-xs">
                        <Clock className="w-3.5 h-3.5 text-slate-300" />
                        <span>{item.relativeTime}</span>
                      </div>
                    </td>

                    {/* Event info */}
                    <td className="py-4 font-bold text-[#082e3e]">
                      {item.event}
                    </td>

                    {/* Subject actor */}
                    <td className="py-4 text-xs font-semibold text-slate-600">
                      {item.actor}
                    </td>

                    {/* Security check */}
                    <td className="py-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-800 bg-emerald-50 border border-emerald-100/50 px-2.5 py-0.5 rounded-md shadow-3xs select-none">
                        <Cpu className="w-3 h-3 text-emerald-500" />
                        <span>SHA-256 PASS</span>
                      </span>
                    </td>

                    {/* Event Tag */}
                    <td className="py-4 text-right pr-1">
                      <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black border tracking-wider shadow-3xs select-none uppercase ${tag.bg}`}>
                        {tag.text}
                      </span>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-5 text-[10px] text-slate-400 font-bold text-left select-none">
          Showing platform audit transactions buffered from the system syslog daemon pipeline.
        </div>
      </div>

    </motion.div>
  );
}

export default AdminDashboard;
