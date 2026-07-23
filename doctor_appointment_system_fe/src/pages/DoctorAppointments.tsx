import React, { useState, useEffect } from 'react';
import { Calendar, Clock, DollarSign, Loader2, AlertCircle, Sparkles, User, FileText, CheckCircle2, Ban } from 'lucide-react';
import { useAuth } from '../context/authContext';
import { getDoctorAppointmentsHistory } from '../services/appointment'; 
import type { AppointmentResponseDTO } from '../types/types';

const DoctorAppointments = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<AppointmentResponseDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'UPCOMING' | 'PAST'>('UPCOMING');

    const fetchHistory = async () => {
        setIsLoading(true);
        try {
            const data = await getDoctorAppointmentsHistory(user.id);
            console.log(data)
            setAppointments(data);
        } catch (err) {
            console.error("Failed to load clinical history", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [user.id]);

    const upcomingAppointments = appointments.filter(
        app => app.status === 'CONFIRMED' || app.status === 'PENDING'
    );

    const pastAppointments = appointments.filter(
        app => app.status === 'COMPLETED' || app.status === 'CANCELLED'
    );

    const displayedAppointments = activeTab === 'UPCOMING' ? upcomingAppointments : pastAppointments;

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'CONFIRMED':
                return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'COMPLETED':
                return 'bg-slate-50 text-slate-700 border-slate-200/50';
            case 'CANCELLED':
                return 'bg-rose-50 text-rose-700 border-rose-100';
            default:
                return 'bg-slate-50 text-slate-600 border-slate-150';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Top Banner */}
            <div className="bg-gradient-to-br from-[#8eb5ca] via-[#709eb7] to-[#082e3e] rounded-[2.5rem] border border-white p-8 md:p-10 relative overflow-hidden text-white shadow-lg">
                <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="relative z-10 text-left">
                    <div className="inline-flex items-center space-x-1 bg-white/15 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md mb-4 border border-white/10">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Clinical Registry & Records</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Clinical History & Referrals</h2>
                    <p className="text-slate-100 text-sm mt-3 leading-relaxed max-w-xl font-medium">
                        Access your complete physician appointment ledger. Track completed consultation dispatches, monitor upcoming outpatient queues, and review cancelled bookings.
                    </p>
                </div>
            </div>

            {/* Custom Tab Switcher */}
            <div className="bg-white border border-slate-200/50 p-2 rounded-2xl shadow-xs max-w-md flex gap-2">
                <button
                    onClick={() => setActiveTab('UPCOMING')}
                    className={`flex-1 py-3 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        activeTab === 'UPCOMING'
                            ? 'bg-[#082e3e] text-white shadow-sm'
                            : 'text-slate-400 hover:bg-slate-50'
                    }`}
                >
                    <Calendar className="w-4 h-4" />
                    <span>Upcoming ({upcomingAppointments.length})</span>
                </button>
                <button
                    onClick={() => setActiveTab('PAST')}
                    className={`flex-1 py-3 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        activeTab === 'PAST'
                            ? 'bg-[#082e3e] text-white shadow-sm'
                            : 'text-slate-400 hover:bg-slate-50'
                    }`}
                >
                    <FileText className="w-4 h-4" />
                    <span>Past History ({pastAppointments.length})</span>
                </button>
            </div>

            {/* Appointments Grid */}
            {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-[#082e3e] animate-spin" />
                </div>
            ) : displayedAppointments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {displayedAppointments.map((app) => (
                        <div
                            key={app.id}
                            className="bg-white border border-slate-200/50 rounded-[2.25rem] p-6 hover:border-slate-300 transition-all flex flex-col justify-between shadow-xs relative overflow-hidden"
                        >
                            <div className="space-y-4">
                                {/* Header: Status and ID */}
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/20">
                                        APPT ID: #{app.id}
                                    </span>
                                    <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full border ${getStatusStyle(app.status)}`}>
                                        {app.status}
                                    </span>
                                </div>

                                {/* Patient Details */}
                                <div className="flex gap-4 items-start pt-2">
                                    <div className="p-3 bg-[#e3edf2] text-[#0a4053] rounded-2xl border border-white shadow-3xs shrink-0">
                                        <User className="w-5 h-5 text-[#0a4053]" />
                                    </div>
                                    <div className="text-left">
                                        <h4 className="text-base font-black text-[#082e3e]">{app.patientName || "Patient"}</h4>
                                        <span className="text-[10px] font-black uppercase text-[#85abc0] tracking-wider block mt-0.5">
                                            Outpatient Consultation
                                        </span>
                                    </div>
                                </div>

                                {/* Date & Time Grid */}
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <div className="bg-[#f8fafc] border border-slate-200/30 p-3 rounded-2xl flex items-center gap-2.5 text-xs font-semibold text-[#0a4053]">
                                        <Calendar className="w-4 h-4 text-[#85abc0]" />
                                        <span>{app.date || "Cancelled Slot"}</span>
                                    </div>
                                    <div className="bg-[#f8fafc] border border-slate-200/30 p-3 rounded-2xl flex items-center gap-2.5 text-xs font-semibold text-[#0a4053]">
                                        <Clock className="w-4 h-4 text-[#85abc0]" />
                                        <span>{app.time || "N/A"}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Footer: Earnings */}
                            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-left">
                                <div>
                                    <span className="text-[9px] text-slate-400 font-bold uppercase block">Consultation Earnings</span>
                                    <span className="text-sm font-black text-[#082e3e]">LKR {app.consultationFee.toLocaleString()}</span>
                                </div>
                                <div className="text-right">
                                    {app.status === 'COMPLETED' && (
                                        <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl uppercase">Discharged</span>
                                    )}
                                    {app.status === 'CANCELLED' && (
                                        <span className="text-[10px] font-extrabold text-rose-600 bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-xl uppercase">Cancelled</span>
                                    )}
                                    {app.status === 'CONFIRMED' && (
                                        <span className="text-[10px] font-extrabold text-[#0a4053] bg-[#e3edf2] px-3 py-1.5 rounded-xl uppercase">Confirmed</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* Empty Placeholder */
                <div className="bg-white/40 border border-slate-200/50 border-dashed rounded-[2.5rem] p-16 text-center">
                    <div className="p-4 bg-[#e3edf2] text-[#0a4053] rounded-full inline-block border border-white mb-4">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-black text-[#082e3e] uppercase tracking-wider">No Records Found</h4>
                    <p className="text-slate-400 text-xs font-bold leading-relaxed max-w-sm mx-auto mt-2">
                        {activeTab === 'UPCOMING'
                            ? "You do not have any upcoming clinical sessions scheduled at the moment."
                            : "Your past clinical consultation history is currently empty."}
                    </p>
                </div>
            )}
        </div>
    );
};

export default DoctorAppointments;