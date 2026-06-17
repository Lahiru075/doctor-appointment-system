import React, { useState } from 'react';
import { useAuth } from '../context/authContext';
import { motion } from 'motion/react';
import { Users, Activity, FileText, AlertTriangle, Sparkles, ShieldAlert } from 'lucide-react';

interface PatientRecord {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  complaint: string;
  vitals: { temp: string; bp: string; pulse: string };
  time: string;
  status: 'Waiting' | 'In-Progress' | 'Discharged';
}

const DoctorDashboard = () => {
  const { setDemoRole } = useAuth();

  const [patients, setPatients] = useState<PatientRecord[]>([
    {
      id: 'PT-3918',
      name: 'Eleanor Vance',
      age: 34,
      gender: 'Female',
      bloodGroup: 'B+',
      complaint: 'Chronic migraine and mild hypertensive episodes',
      vitals: { temp: '98.6 °F', bp: '135/85', pulse: '78 bpm' },
      time: '14:20 PM',
      status: 'Waiting',
    },
    {
      id: 'PT-2938',
      name: 'Marcus Brody',
      age: 48,
      gender: 'Male',
      bloodGroup: 'O-',
      complaint: 'Severe joint stiffness and lower back soreness',
      vitals: { temp: '99.1 °F', bp: '122/80', pulse: '68 bpm' },
      time: '15:00 PM',
      status: 'Waiting',
    },
  ]);

  const handleCancelAppointment = (id: string) => {
    setPatients(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, status: 'Discharged' }; 
      }
      return p;
    }));
  };

  const handleUpdateStatus = (id: string, nextStatus: 'In-Progress' | 'Discharged') => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, status: nextStatus } : p));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-[#8eb5ca] via-[#709eb7] to-[#082e3e] rounded-[2.5rem] border border-white p-8 md:p-10 relative overflow-hidden text-white shadow-lg">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-1 bg-white/15 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md mb-4 border border-white/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Duty Mode Active</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Clinical Overview</h2>
          <p className="text-slate-100 text-sm mt-3 leading-relaxed max-w-xl font-medium">
            Review your real-time outpatient waiting queue, update treatment diagnostics, and approve incoming clinic referrals. Secured under role validation checks.
          </p>
        </div>
      </div>

      {/* Developer Sandbox Tray */}
      <div className="bg-white/80 border border-slate-200/60 rounded-[2rem] p-5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs shadow-sm">
        <div className="flex items-center space-x-3 text-slate-600">
          <ShieldAlert className="w-5 h-5 text-[#0a4053] shrink-0" />
          <span className="font-medium">
            <strong className="text-[#082e3e]">Developer Role Swap Sandbox:</strong> Instantly hot-swap credentials context without re-authenticating.
          </span>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setDemoRole('PATIENT')}
            className="px-3.5 py-1.5 bg-[#e3edf2] hover:bg-[#d0e0eb] text-[#082e3e] rounded-full border border-white font-bold transition cursor-pointer text-[11px]"
          >
            Simulate Patient Page Access
          </button>
          <button
            onClick={() => setDemoRole('ADMIN')}
            className="px-3.5 py-1.5 bg-[#e3edf2] hover:bg-[#d0e0eb] text-[#082e3e] rounded-full border border-white font-bold transition cursor-pointer text-[11px]"
          >
            Simulate Admin Page Access
          </button>
        </div>
      </div>

      {/* Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Waiting Queue List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200/50 rounded-[2rem] p-6 shadow-xs">
            <h3 className="text-[13px] font-black text-[#082e3e] uppercase tracking-wider mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#0a4053]" /> Waiting Patients Queue ({patients.length})
            </h3>
            
            <div className="space-y-4">
              {patients.map((patient) => (
                <motion.div
                  layout
                  key={patient.id}
                  className="bg-[#f8fafc] border border-slate-200/40 rounded-[1.75rem] p-5 hover:border-slate-300 transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row justify-between gap-3 sm:items-center">
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-xs text-[#0a4053] bg-[#e3edf2] px-3 py-1 rounded-xl border border-white">
                        {patient.id}
                      </span>
                      <h4 className="font-extrabold text-[#082e3e] text-base">{patient.name}</h4>
                      <span className="text-xs text-slate-400 font-semibold">
                        (Age: {patient.age} / {patient.gender} / <strong className="text-[#8eb5ca]">{patient.bloodGroup}</strong>)
                      </span>
                    </div>
                    <span className={`self-start sm:self-auto text-xs px-3 py-1 rounded-full font-bold ${
                      patient.status === 'Waiting' ? 'bg-[#e3edf2] text-[#082e3e]' : 'bg-[#e7f7f0] text-[#10b981]'
                    }`}>
                      {patient.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-3.5 leading-relaxed bg-white p-3.5 rounded-2xl border border-slate-200/40 font-medium">
                    <strong className="text-[#082e3e]">Chief Complaint:</strong> {patient.complaint}
                  </p>

                  <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
                    <div className="bg-white px-3.5 py-1.5 rounded-xl border border-slate-200/40">
                      <span className="text-slate-400 font-bold">Temp:</span> <span className="font-bold text-[#082e3e]">{patient.vitals.temp}</span>
                    </div>
                    <div className="bg-white px-3.5 py-1.5 rounded-xl border border-slate-200/40">
                      <span className="text-slate-400 font-bold">BP:</span> <span className="font-bold text-[#082e3e]">{patient.vitals.bp}</span>
                    </div>
                    <div className="bg-white px-3.5 py-1.5 rounded-xl border border-slate-200/40">
                      <span className="text-slate-400 font-bold">Pulse:</span> <span className="font-bold text-[#082e3e]">{patient.vitals.pulse}</span>
                    </div>
                    <div className="bg-[#e3edf2] px-3 py-1.5 rounded-xl ml-auto text-[10px] font-bold text-[#082e3e]">
                      <span>Time Scheduled: {patient.time}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 justify-end mt-4 pt-3.5 border-t border-slate-100 text-xs">
                    {patient.status === 'Waiting' && (
                      <button
                        onClick={() => handleUpdateStatus(patient.id, 'In-Progress')}
                        className="px-4 py-2 bg-[#082e3e] hover:bg-[#0d3b4f] text-white font-bold rounded-xl transition cursor-pointer"
                      >
                        Begin Consultation
                      </button>
                    )}
                    {patient.status === 'In-Progress' && (
                      <button
                        onClick={() => handleUpdateStatus(patient.id, 'Discharged')}
                        className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-750 font-bold rounded-xl transition cursor-pointer border border-rose-100"
                      >
                        Discharge & Complete
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Columns (Metrics & Reminders) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200/50 rounded-[2rem] p-6 shadow-xs">
            <h3 className="text-[13px] font-black text-[#082e3e] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#0a4053]" /> Clinic Metrics (Today)
            </h3>
            <div className="space-y-3 text-xs font-medium">
              <div className="bg-[#f8fafc] px-4 py-3 rounded-xl border border-slate-200/30 flex justify-between items-center">
                <span className="text-slate-400">Completed cases:</span>
                <span className="font-bold text-[#082e3e] bg-[#e3edf2] px-2.5 py-0.5 rounded-lg border border-white">12 / 15</span>
              </div>
              <div className="bg-[#f8fafc] px-4 py-3 rounded-xl border border-slate-200/30 flex justify-between items-center">
                <span className="text-slate-400">Scheduled surgery:</span>
                <span className="font-bold text-[#082e3e] bg-[#e3edf2] px-2.5 py-0.5 rounded-lg border border-white">0</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200/50 rounded-[2rem] p-6 shadow-xs">
            <h3 className="text-[13px] font-black text-[#082e3e] uppercase tracking-wider mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#0a4053]" /> Physician Reminders
            </h3>
            <ul className="text-xs text-slate-500 leading-relaxed space-y-2.5 list-disc pl-4 font-semibold">
              <li>Check electronic prescription dispatch logs for clinical signature approvals.</li>
              <li>Conduct complete patient vitals review prior to bed discharge.</li>
              <li>Ensure JWT holds proper role authentication credentials.</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}

export default DoctorDashboard;