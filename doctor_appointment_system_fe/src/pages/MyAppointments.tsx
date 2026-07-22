import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, Loader2, AlertCircle, Sparkles, User, FileText, CheckCircle2, XCircle, Ban, MessageSquare, Star, X } from 'lucide-react';
import { useAuth } from '../context/authContext';
import { getPatientAppointments, cancelAppointment } from '../services/appointment';
import { addReview } from '../services/review';
import type { AppointmentResponseDTO } from '../types/types';

const MyAppointments = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<AppointmentResponseDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'UPCOMING' | 'PAST'>('UPCOMING');

    const [selectedApptForReview, setSelectedApptForReview] = useState<number | null>(null);
    const [rating, setRating] = useState<number>(5);
    const [comment, setComment] = useState('');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [reviewError, setReviewError] = useState<string | null>(null);

    const fetchAppointments = async () => {
        setIsLoading(true);
        try {
            const data = await getPatientAppointments(user.id);
            setAppointments(data);
        } catch (err) {
            console.error("Failed to load appointments", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [user.id]);

    const handleCancel = async (appointmentId: number) => {
        const confirmCancel = window.confirm("Are you sure you want to cancel this appointment?");
        if (!confirmCancel) return;

        try {
            await cancelAppointment(appointmentId);
            alert("Appointment cancelled successfully!");

            fetchAppointments();
        } catch (err: any) {
            alert("Failed to cancel: " + err.message);
        }
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedApptForReview) return;

        setIsSubmittingReview(true);
        setReviewError(null);

        try {
            await addReview({
                appointmentId: selectedApptForReview,
                rating,
                comment
            });
            alert("Review submitted successfully!");
            setSelectedApptForReview(null);
            setComment('');
            setRating(5);
            fetchAppointments();
        } catch (err: any) {
            setReviewError(err.response?.data?.message || "Failed to submit review. Please try again.");
        } finally {
            setIsSubmittingReview(false);
        }
    };

    // Filter Appointments
    const upcomingAppointments = appointments.filter(
        app => app.status === 'CONFIRMED' || app.status === 'PENDING'
    );

    const pastAppointments = appointments.filter(
        app => app.status === 'COMPLETED' || app.status === 'CANCELLED'
    );

    const displayedAppointments = activeTab === 'UPCOMING' ? upcomingAppointments : pastAppointments;

    // Helper: Dynamic status badge style
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

                <div className="relative z-10">
                    <div className="inline-flex items-center space-x-1 bg-white/15 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md mb-4 border border-white/10">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Real-Time Consultation Log</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">My Consultation Logs</h2>
                    <p className="text-slate-100 text-sm mt-3 leading-relaxed max-w-xl font-medium">
                        Track upcoming specialist meets, access prescription dispatches, or review clinical history secured under role-based encryption protocols.
                    </p>
                </div>
            </div>

            {/* Custom Tab Switcher */}
            <div className="bg-white border border-slate-200/50 p-2 rounded-2xl shadow-xs max-w-md flex gap-2">
                <button
                    onClick={() => setActiveTab('UPCOMING')}
                    className={`flex-1 py-3 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${activeTab === 'UPCOMING'
                        ? 'bg-[#082e3e] text-white shadow-sm'
                        : 'text-slate-400 hover:bg-slate-50'
                        }`}
                >
                    <Calendar className="w-4 h-4" />
                    <span>Upcoming ({upcomingAppointments.length})</span>
                </button>
                <button
                    onClick={() => setActiveTab('PAST')}
                    className={`flex-1 py-3 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${activeTab === 'PAST'
                        ? 'bg-[#082e3e] text-white shadow-sm'
                        : 'text-slate-400 hover:bg-slate-50'
                        }`}
                >
                    <FileText className="w-4 h-4" />
                    <span>Past History ({pastAppointments.length})</span>
                </button>
            </div>

            {/* Appointments Display Grid */}
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

                                {/* Doctor and Specialty Details */}
                                <div className="flex gap-4 items-start pt-2">
                                    <div className="p-3 bg-[#e3edf2] text-[#0a4053] rounded-2xl border border-white shadow-3xs shrink-0">
                                        <User className="w-5 h-5 text-[#0a4053]" />
                                    </div>
                                    <div>
                                        <h4 className="text-base font-black text-[#082e3e]">{app.doctorName}</h4>
                                        <span className="text-[10px] font-black uppercase text-[#85abc0] tracking-wider block mt-0.5">
                                            {app.specializationName}
                                        </span>
                                    </div>
                                </div>

                                {/* Date & Time Grid */}
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <div className="bg-[#f8fafc] border border-slate-200/30 p-3 rounded-2xl flex items-center gap-2.5 text-xs font-semibold text-[#0a4053]">
                                        <Calendar className="w-4 h-4 text-[#85abc0]" />
                                        <span>{app.date}</span>
                                    </div>
                                    <div className="bg-[#f8fafc] border border-slate-200/30 p-3 rounded-2xl flex items-center gap-2.5 text-xs font-semibold text-[#0a4053]">
                                        <Clock className="w-4 h-4 text-[#85abc0]" />
                                        <span>{app.time}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Footer: Fee and Actions */}
                            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                                <div>
                                    <span className="text-[9px] text-slate-400 font-bold uppercase block">Consultation Fee</span>
                                    <span className="text-sm font-black text-[#082e3e]">LKR {app.consultationFee.toLocaleString()}</span>
                                </div>

                                {/* Action Buttons Based on Status */}
                                <div className="flex gap-2">
                                    {(app.status === 'CONFIRMED' || app.status === 'PENDING') && (
                                        <button onClick={() => handleCancel(app.id)} className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-750 border border-rose-150 px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-3xs cursor-pointer">
                                            <Ban className="w-3.5 h-3.5" />
                                            <span>Cancel</span>
                                        </button>
                                    )}
                                    {app.status === 'COMPLETED' && (
                                        <button
                                            onClick={() => setSelectedApptForReview(app.id)}
                                            className="flex items-center gap-1.5 bg-[#e3edf2] hover:bg-[#d0e0eb] text-[#0a4053] border border-white px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-3xs cursor-pointer"
                                        >
                                            <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                                            <span>Add Review</span>
                                        </button>
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
                    <h4 className="text-base font-black text-[#082e3e] uppercase tracking-wider">No Appointments Found</h4>
                    <p className="text-slate-400 text-xs font-bold leading-relaxed max-w-sm mx-auto mt-2">
                        {activeTab === 'UPCOMING'
                            ? "You do not have any upcoming clinical sessions scheduled at the moment."
                            : "Your clinical visit history logs are empty."}
                    </p>
                </div>
            )}

            <AnimatePresence>
                {selectedApptForReview && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white border border-slate-200/50 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-[#f8fafc]">
                                <div>
                                    <h3 className="text-lg font-black text-[#082e3e]">Rate Your Consultation</h3>
                                    <p className="text-[11px] text-slate-400 font-bold uppercase mt-0.5">Appt ID: #{selectedApptForReview}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedApptForReview(null);
                                        setReviewError(null);
                                        setComment('');
                                    }}
                                    className="p-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition cursor-pointer"
                                >
                                    <X className="w-4 h-4 text-slate-500" />
                                </button>
                            </div>

                            {/* Modal Body / Form */}
                            <form onSubmit={handleSubmitReview} className="p-6 space-y-6">
                                {/* Validation Error Alert */}
                                {reviewError && (
                                    <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex gap-2.5 text-xs text-red-800 font-semibold leading-normal">
                                        <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0 mt-0.5" />
                                        <span>{reviewError}</span>
                                    </div>
                                )}

                                {/* Star Rating Selector */}
                                <div className="space-y-3 text-center">
                                    <span className="block text-[10px] font-black uppercase text-[#85abc0] tracking-wider">Tap to Rate (1-5 Stars) [1]</span>
                                    <div className="flex justify-center gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                className="transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                                            >
                                                <Star className={`w-8 h-8 ${star <= rating ? 'text-amber-400 fill-current' : 'text-slate-200'}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Comment Area */}
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black uppercase text-[#85abc0] tracking-wider">Write Your Review</label>
                                    <div className="relative">
                                        <MessageSquare className="absolute left-4 top-4.5 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
                                        <textarea
                                            placeholder="Tell us about your consultation experience..."
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            rows={3}
                                            className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 font-bold text-xs text-[#082e3e] focus:outline-none focus:ring-2 focus:ring-[#8eb5ca]/30 focus:border-[#8eb5ca] resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Modal Footer / Buttons */}
                                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedApptForReview(null);
                                            setReviewError(null);
                                            setComment('');
                                        }}
                                        className="px-5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-bold text-xs cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmittingReview}
                                        className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-black text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
                                    >
                                        {isSubmittingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                        <span>Submit Review</span>
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

export default MyAppointments;