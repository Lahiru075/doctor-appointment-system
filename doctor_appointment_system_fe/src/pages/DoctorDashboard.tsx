import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { motion } from 'motion/react';
import { Users, Activity, Clock, Loader2, Sparkles, CheckCircle2, FileText, Calendar  } from 'lucide-react';
import { completeAppointment, getDoctorAppointments } from '../services/appointment'; 
import type { AppointmentResponseDTO } from '../types/types'; 

const DoctorDashboard = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<AppointmentResponseDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeAppointmentId, setActiveAppointmentId] = useState<number | null>(null); 

    const loadAppointments = async () => {
        setIsLoading(true);
        try {

            const data = await getDoctorAppointments(user.id); 
  
            setAppointments(data);
        } catch (err) {
            console.error("Failed to load doctor appointments", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadAppointments();
    }, [user.id]);

    const handleBeginConsultation = (id: number) => {
        setActiveAppointmentId(id);
    };

    const handleDischargeAndComplete = async (id: number) => {
        try {
            setIsLoading(true);
            await completeAppointment(id); 
            alert("Patient discharged and appointment completed successfully!");
            setActiveAppointmentId(null);
            loadAppointments(); 
        } catch (err: any) {
            alert("Failed to complete appointment: " + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const remainingPatients = appointments.length;

    return (
        <div className="space-y-6 animate-in fade-in duration-200">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-br from-[#8eb5ca] via-[#709eb7] to-[#082e3e] rounded-[2.5rem] border border-white p-8 relative overflow-hidden text-white shadow-lg">
                <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10">
                    <div className="inline-flex items-center space-x-1 bg-white/15 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md mb-4 border border-white/10">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Duty Mode Active</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Clinical Overview</h2>
                    <p className="text-slate-100 text-sm mt-3 leading-relaxed max-w-xl font-medium">
                        Review your real-time outpatient waiting queue, update treatment status, and manage active consultation sessions under JWT session policies.
                    </p>
                </div>
            </div>

            {/* Split Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left: Waiting Queue List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-slate-200/50 rounded-[2rem] p-6 shadow-xs">
                        <h3 className="text-[13px] font-black text-[#082e3e] uppercase tracking-wider mb-6 flex items-center gap-2">
                            <Users className="w-5 h-5 text-[#0a4053]" /> Waiting Patients Queue ({remainingPatients})
                        </h3>
                        
                        {isLoading ? (
                            <div className="h-48 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-[#082e3e] animate-spin" />
                            </div>
                        ) : appointments.length > 0 ? (
                            <div className="space-y-4">
                                {appointments.map((app) => {
                                    const isInProgress = activeAppointmentId === app.id;
                                    return (
                                        <motion.div
                                            layout
                                            key={app.id}
                                            className="bg-[#f8fafc] border border-slate-200/40 rounded-[1.75rem] p-5 hover:border-slate-300 transition-all duration-200"
                                        >
                                            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:items-center">
                                                <div className="flex items-center space-x-3">
                                                    <span className="font-bold text-xs text-[#0a4053] bg-[#e3edf2] px-3 py-1 rounded-xl border border-white">
                                                        APPT #{app.id}
                                                    </span>
                                                    <h4 className="font-extrabold text-[#082e3e] text-base">{app.patientName || "Patient"}</h4>
                                                </div>
                                                <span className={`self-start sm:self-auto text-xs px-3 py-1 rounded-full font-bold ${
                                                    isInProgress ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-[#e3edf2] text-[#082e3e]'
                                                }`}>
                                                    {isInProgress ? 'In-Progress' : 'Waiting'}
                                                </span>
                                            </div>

                                            {/* Chief Complaint / Details */}
                                            <p className="text-xs text-slate-500 mt-3.5 leading-relaxed bg-white p-3.5 rounded-2xl border border-slate-200/40 font-medium">
                                                <strong className="text-[#082e3e]">Scheduled Session:</strong> This patient is scheduled for clinical domain consultation.
                                            </p>

                                            <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
                                                <div className="bg-white px-3.5 py-1.5 rounded-xl border border-slate-200/40 flex items-center gap-1.5 font-bold">
                                                    <Clock className="w-3.5 h-3.5 text-[#85abc0]" />
                                                    <span>{app.time}</span>
                                                </div>
                                                <div className="bg-white px-3.5 py-1.5 rounded-xl border border-slate-200/40 flex items-center gap-1.5 font-bold">
                                                    <Calendar className="w-3.5 h-3.5 text-[#85abc0]" />
                                                    <span>{app.date}</span>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-2 justify-end mt-4 pt-3.5 border-t border-slate-100 text-xs">
                                                {!isInProgress ? (
                                                    <button
                                                        onClick={() => handleBeginConsultation(app.id)}
                                                        className="px-4 py-2 bg-[#082e3e] hover:bg-[#0a4053] text-white font-bold rounded-xl transition cursor-pointer"
                                                    >
                                                        Begin Consultation
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleDischargeAndComplete(app.id)}
                                                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
                                                    >
                                                        <CheckCircle2 className="w-4 h-4" />
                                                        <span>Discharge & Complete</span>
                                                    </button>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="h-48 flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-[2rem] p-4 text-center">
                                <Activity className="w-6 h-6 text-slate-350 mb-1" />
                                <p className="text-slate-400 text-xs italic font-bold">No patients waiting in queue today.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Metrics & Reminders */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white border border-slate-200/50 rounded-[2rem] p-6 shadow-xs">
                        <h3 className="text-[13px] font-black text-[#082e3e] uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-[#0a4053]" /> Clinic Metrics (Today)
                        </h3>
                        <div className="space-y-3 text-xs font-medium">
                            <div className="bg-[#f8fafc] px-4 py-3 rounded-xl border border-slate-200/30 flex justify-between items-center">
                                <span className="text-slate-400 font-bold">Waiting Queue:</span>
                                <span className="font-bold text-[#082e3e] bg-[#e3edf2] px-2.5 py-0.5 rounded-lg border border-white">{remainingPatients} Patients</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200/50 rounded-[2rem] p-6 shadow-xs">
                        <h3 className="text-[13px] font-black text-[#082e3e] uppercase tracking-wider mb-3 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-[#0a4053]" /> Physician Guidelines
                        </h3>
                        <ul className="text-xs text-slate-500 leading-relaxed space-y-2.5 list-disc pl-4 font-semibold">
                            <li>Check electronic session logs for clinical signatures.</li>
                            <li>Ensure to click "Discharge & Complete" only after treating the patient [1].</li>
                            <li>Unbooked timeslots are automatically wiped every Sunday at midnight [1].</li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DoctorDashboard;