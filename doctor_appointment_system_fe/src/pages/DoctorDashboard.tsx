import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Activity, Clock, Loader2, Sparkles, CheckCircle2, User, X, FileText, Clipboard, AlertCircle, Calendar } from 'lucide-react';
import { getDoctorAppointments } from '../services/appointment';
import { createPrescription } from '../services/prescription'; 
import type { AppointmentResponseDTO } from '../types/types';

const DoctorDashboard = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<AppointmentResponseDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeAppointmentId, setActiveAppointmentId] = useState<number | null>(null);

    const [prescriptionApptId, setPrescriptionApptId] = useState<number | null>(null);
    const [diagnosis, setDiagnosis] = useState('');
    const [medications, setMedications] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const loadAppointments = async () => {
        setIsLoading(true);
        try {
            const data = await getDoctorAppointments(user.id);
            setAppointments(data.filter(app => app.status === 'CONFIRMED'));
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


    const handlePrescriptionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        if (!diagnosis.trim() || !medications.trim()) {
            setFormError("Please fill out both diagnosis and medications.");
            return;
        }

        setIsSubmitting(true);
        try {

            await createPrescription({
                appointmentId: prescriptionApptId!,
                diagnosis,
                medications
            });

            alert("Success: Prescription issued and consultation completed!");
            setPrescriptionApptId(null);
            setDiagnosis('');
            setMedications('');
            setActiveAppointmentId(null);
            loadAppointments(); 
        } catch (err: any) {
            setFormError(err.response?.data?.message || "Failed to submit prescription.");
        } finally {
            setIsSubmitting(false);
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
                                            className="bg-[#f8fafc] border border-slate-200/40 rounded-[1.75rem] p-5 hover:border-slate-300 transition-all duration-200 text-left"
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
                                                        onClick={() => setPrescriptionApptId(app.id)} 
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

                {/* Right: Metrics */}
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
                </div>
            </div>

            {/* --- PRESCRIPTION CREATION MODAL --- */}
            <AnimatePresence>
                {prescriptionApptId && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white border border-slate-200/50 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden text-left"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-[#f8fafc]">
                                <div>
                                    <h3 className="text-lg font-black text-[#082e3e]">Issue Prescription</h3>
                                    <p className="text-[11px] text-slate-400 font-bold uppercase mt-0.5">Appt ID: #{prescriptionApptId}</p>
                                </div>
                                <button 
                                    onClick={() => {
                                        setPrescriptionApptId(null);
                                        setDiagnosis('');
                                        setMedications('');
                                    }}
                                    className="p-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition cursor-pointer"
                                >
                                    <X className="w-4 h-4 text-slate-500" />
                                </button>
                            </div>

                            {/* Modal Body / Form */}
                            <form onSubmit={handlePrescriptionSubmit} className="p-6 space-y-5">
                                {formError && (
                                    <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex gap-2.5 text-xs text-red-800 font-semibold leading-normal">
                                        <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0 mt-0.5" />
                                        <span>{formError}</span>
                                    </div>
                                )}

                                {/* Diagnosis Input */}
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-black uppercase text-[#85abc0] tracking-wider">Diagnosis / Condition [1]</label>
                                    <div className="relative">
                                        <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
                                        <input
                                            type="text"
                                            placeholder="e.g. Acute Migraine, Mild Hypertension"
                                            value={diagnosis}
                                            onChange={(e) => setDiagnosis(e.target.value)}
                                            className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 font-bold text-xs text-[#082e3e] focus:outline-none focus:ring-2 focus:ring-[#8eb5ca]/30 focus:border-[#8eb5ca]"
                                        />
                                    </div>
                                </div>

                                {/* Medications Textarea */}
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-black uppercase text-[#85abc0] tracking-wider">Medications & Dosage [1]</label>
                                    <div className="relative">
                                        <Clipboard className="absolute left-4 top-4 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
                                        <textarea
                                            placeholder="e.g. Paracetamol 500mg - 3 times daily (3 days)&#10;Amoxicillin 500mg - 2 times daily (5 days)"
                                            value={medications}
                                            onChange={(e) => setMedications(e.target.value)}
                                            rows={5}
                                            className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 font-bold text-xs text-[#082e3e] focus:outline-none focus:ring-2 focus:ring-[#8eb5ca]/30 focus:border-[#8eb5ca] resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Modal Footer / Buttons */}
                                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPrescriptionApptId(null);
                                            setDiagnosis('');
                                            setMedications('');
                                        }}
                                        className="px-5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-bold text-xs cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-black text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
                                    >
                                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                        <span>Issue & Complete</span>
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DoctorDashboard;