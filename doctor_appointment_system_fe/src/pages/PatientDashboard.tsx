import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { motion } from 'motion/react';
import { 
  Activity, 
  Calendar, 
  Clipboard, 
  AlertTriangle, 
  Sparkles, 
  ShieldAlert 
} from 'lucide-react';

const PatientDashboard = () => {
  const { user, setDemoRole } = useAuth();
  const navigate = useNavigate();

  // Core Vitals Overview (Mock)
  const vitals = [
    { label: 'Heart Rate', value: '72 bpm', status: 'Normal', color: 'text-rose-600 bg-rose-50' },
    { label: 'Blood Pressure', value: '120/80', status: 'Optimal', color: 'text-teal-600 bg-teal-50' },
    { label: 'Oxygen Level', value: '98%', status: 'Healthy', color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Sleep Score', value: '82/100', status: 'Good', color: 'text-[#082e3e] bg-[#e3edf2]' },
  ];

  // Upcoming Appointment Summary (Mock)
  const upcomingAppointment = { 
    doctor: 'Dr. Sarah Johnson', 
    specialty: 'General Specialist', 
    date: '2026-06-18', 
    time: '10:00 AM', 
    room: 'Consultation Room A9', 
    status: 'CONFIRMED' 
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-[#8eb5ca] via-[#709eb7] to-[#082e3e] rounded-[2.5rem] border border-white p-8 md:p-10 relative overflow-hidden text-white shadow-lg">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-1 bg-white/15 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md mb-4 border border-white/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Personalized Diagnosis</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Let's check your wellness guide</h2>
          <p className="text-slate-100 text-sm mt-3 leading-relaxed font-semibold max-w-xl">
            Welcome back to your CliniQ personal hub. Monitor heart rhythms, medicine dosing, doctor schedules, and clinical telemetry under state-safe JWT protection.
          </p>
        </div>
      </div>

      {/* Sandbox Tray */}
      <div className="bg-white/80 border border-slate-200/60 rounded-[2rem] p-5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs shadow-sm">
        <div className="flex items-center space-x-3 text-slate-600">
          <ShieldAlert className="w-5 h-5 text-[#0a4053] shrink-0" />
          <span className="font-medium">
            <strong className="text-[#082e3e]">Developer Sandbox Role swap:</strong> Evaluate custom views, treatment grids and restrictive permissions.
          </span>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setDemoRole('DOCTOR')}
            className="px-3.5 py-1.5 bg-[#e3edf2] hover:bg-[#d0e0eb] text-[#082e3e] rounded-full border border-white font-bold transition cursor-pointer text-[11px]"
          >
            Simulate Doctor View
          </button>
          <button
            onClick={() => setDemoRole('ADMIN')}
            className="px-3.5 py-1.5 bg-[#e3edf2] hover:bg-[#d0e0eb] text-[#082e3e] rounded-full border border-white font-bold transition cursor-pointer text-[11px]"
          >
            Simulate Admin View
          </button>
        </div>
      </div>

      {/* Grid Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (Vitals & Next Consultation) */}
        <div className="lg:col-span-8 space-y-6">
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#082e3e]/70 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#0a4053]" /> Recent Diagnostics Overview
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {vitals.map((vital, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -3 }}
                  className="bg-white rounded-[1.75rem] border border-slate-200/50 p-5 text-center flex flex-col justify-between shadow-xs"
                >
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">{vital.label}</span>
                  <span className="text-xl font-black text-[#082e3e] mt-2 block">{vital.value}</span>
                  <span className={`inline-flex items-center justify-center text-[10px] font-bold px-2.5 py-1 rounded-full mt-3.5 mx-auto ${vital.color} text-[#0a4053]`}>
                    {vital.status}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Next Consultation summary box */}
          <div className="bg-white border border-slate-200/50 rounded-[2rem] p-6 shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#082e3e]/70 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#0a4053]" /> Next Consultation Schedule
              </h3>
              <button
                onClick={() => navigate('/patient/appointments')}
                className="text-[#0a4053] hover:underline text-xs font-bold cursor-pointer"
              >
                View Queue
              </button>
            </div>
            <div className="bg-[#f8fafc] border border-slate-200/40 rounded-[1.5rem] p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#8eb5ca]" />
              <div className="space-y-1 pl-2">
                <h4 className="font-extrabold text-[#082e3e] text-sm">{upcomingAppointment.doctor}</h4>
                <p className="text-xs text-slate-500 font-bold">{upcomingAppointment.specialty} • {upcomingAppointment.room}</p>
                <p className="text-xs text-slate-450 font-semibold">Status: <span className="font-black text-emerald-600 block sm:inline">{upcomingAppointment.status}</span></p>
              </div>
              <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200/50 text-right shrink-0 w-full sm:w-auto">
                <span className="text-xs font-extrabold text-[#082e3e] block">{upcomingAppointment.date}</span>
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mt-0.5">{upcomingAppointment.time}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Triage Desk & Emergency Guidelines) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Action launcher */}
          <div className="bg-white border border-slate-200/50 rounded-[2rem] p-6 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-[13px] font-black text-[#082e3e] uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#0a4053]" /> Care Triage Desk
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Need medical counsel? Book with verified board-certified practitioners immediately.
              </p>
            </div>
            <button 
              onClick={() => navigate('/patient/book')}
              className="w-full bg-[#082e3e] hover:bg-[#0d3b4f] text-white text-xs font-bold py-3.5 rounded-2xl transition mt-6 cursor-pointer shadow-xs text-center block"
            >
              Book Appointment
            </button>
          </div>

          {/* SOS Guideline warnings */}
          <div className="bg-red-50 border border-red-100 rounded-[2rem] p-6 text-red-900">
            <h3 className="text-xs font-black uppercase tracking-widest mb-2.5 flex items-center gap-2 text-red-800">
              <AlertTriangle className="w-5 h-5" /> Emergency SOS Guidelines
            </h3>
            <p className="text-xs text-red-700/90 leading-relaxed font-bold">
              If you are experiencing severe breathing trouble, chest discomfort, acute trauma or need direct triage, contact the emergency desk.
            </p>
            <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] font-black text-red-800 bg-white/70 border border-red-100 p-2.5 rounded-xl gap-2">
              <span>E-Clinic Direct Hotlines:</span>
              <span className="bg-red-100 text-red-900 px-2.5 py-1 rounded-lg shrink-0">911-CLINIQ</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default PatientDashboard;