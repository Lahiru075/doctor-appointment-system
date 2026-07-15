import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Calendar, Star, Loader2, Sparkles, Filter, CheckCircle2, ChevronRight, X, Clock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { getDoctorSuggestions, searchDoctors } from "../services/doctor";
import { getSpecializations } from "../services/specialization";
import { getDoctorAvailableSlots } from "../services/timeSlot";
import { bookAppointment } from "../services/appointment";
import type { DoctorSuggestion, Specialization, DoctorResponseDTO, AvailableTimeSlotDTO, AppointmentRequestDTO, AppointmentResponseDTO } from "../types/types";
import { useAuth } from '../context/authContext';

const BookAppointment = () => {

    const { user } = useAuth();

    // Search and Filters States
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSpec, setSelectedSpec] = useState<number | ''>(0);
    const [suggestions, setSuggestions] = useState<DoctorSuggestion[]>([]);
    const [specializations, setSpecializations] = useState<Specialization[]>([]);
    const [doctors, setDoctors] = useState<DoctorResponseDTO[]>([]);

    const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const [selectedDoctor, setSelectedDoctor] = useState<DoctorResponseDTO | null>(null);
    const [availableSlots, setAvailableSlots] = useState<AvailableTimeSlotDTO[]>([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);
    const [bookingDate, setBookingDate] = useState<string>('');
    const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

    const [isSaving, setIsSaving] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState<AppointmentResponseDTO | null>(null);

    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchSpecializations = async () => {
            try {
                const data = await getSpecializations();
                setSpecializations(data);
            } catch (err) {
                console.error("Failed to load specializations", err);
            }
        };
        fetchSpecializations();
    }, []);

    // Call Suggestion API (300ms Delay)
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSuggestions([]);
            return;
        }

        setIsSuggestionsLoading(true);
        const delayDebounceFn = setTimeout(async () => {
            try {
                const data = await getDoctorSuggestions(searchQuery);
                setSuggestions(data);
            } catch (err) {
                console.error("Failed to fetch suggestions", err);
            } finally {
                setIsSuggestionsLoading(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    useEffect(() => {
        if (!selectedDoctor) {
            setAvailableSlots([]);
            return;
        }

        const fetchSlots = async () => {
            setIsLoadingSlots(true);
            try {

                const data = await getDoctorAvailableSlots(selectedDoctor.doctorId);
                setAvailableSlots(data);

                const uniqueDates = Array.from(new Set(data.map(s => s.date))).sort();
                if (uniqueDates.length > 0) {
                    setBookingDate(uniqueDates[0]);
                } else {
                    setBookingDate('');
                }
                setSelectedSlotId(null);
            } catch (err) {
                console.error("Failed to fetch available slots", err);
            } finally {
                setIsLoadingSlots(false);
            }
        };
        fetchSlots();
    }, [selectedDoctor]);

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setIsSearching(true);
        setShowSuggestions(false);

        try {
            const data = await searchDoctors(searchQuery, selectedSpec);
            setDoctors(data);
        } catch (err) {
            console.error("Failed to search doctors", err);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSuggestionClick = (name: string) => {
        setSearchQuery(name);
        setShowSuggestions(false);
    };

    const getAvailableDatesFromSlots = () => {
        const daysOrder = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

        const uniqueDates = Array.from(new Set(availableSlots.map(s => s.date))).sort();

        return uniqueDates.map(dateStr => {

            const [year, month, day] = dateStr.split('-').map(Number);
            const d = new Date(year, month - 1, day);
            return {
                formatted: dateStr,
                dayName: daysOrder[d.getDay()],
                dayNum: d.getDate()
            };
        });
    };

    const handleConfirmBooking = async () => {
        if (!selectedSlotId || !selectedDoctor) return;

        try {
            setIsSaving(true); 

            const bookingRequest: AppointmentRequestDTO = {
                patientId: user.id, 
                doctorId: selectedDoctor.doctorId,
                timeSlotId: selectedSlotId
            };

            const result = await bookAppointment(bookingRequest);
            setBookingSuccess(result); 
            setSelectedDoctor(null); 

            alert("Success: Appointment Booked!");

        } catch (err: any) {
            alert("Booking Failed: " + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const slotsForSelectedDate = availableSlots.filter(s => s.date === bookingDate);

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header Banner */}
            <div className="bg-gradient-to-br from-[#8eb5ca] via-[#709eb7] to-[#082e3e] rounded-[2.5rem] border border-white p-8 md:p-10 relative overflow-hidden text-white shadow-lg">
                <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10">
                    <div className="inline-flex items-center space-x-1 bg-white/15 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md mb-4 border border-white/10">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Instant Match Protocols</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Find & Book Board-Certified Doctors</h2>
                    <p className="text-slate-100 text-sm mt-3 leading-relaxed max-w-xl font-medium">
                        Search verified specialists by clinical domain or physician name. Access dynamic schedules secured under state-safe JWT session policies.
                    </p>
                </div>
            </div>

            {/* Search Controls Section */}
            <div className="bg-white border border-slate-200/50 rounded-[2.25rem] p-6 shadow-xs relative">
                <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4 items-center">

                    {/* Doctor Name Search with Suggestion Dropdown */}
                    <div className="relative flex-1 w-full" ref={dropdownRef}>
                        <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by physician name (e.g., Dr. Kamal)..."
                            value={searchQuery}
                            onFocus={() => setShowSuggestions(true)}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#f8fafc] border border-slate-200/60 rounded-2xl pl-12 pr-10 py-3.5 font-bold text-sm text-[#082e3e] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8eb5ca]/30 focus:border-[#8eb5ca] transition-all"
                        />
                        {isSuggestionsLoading && (
                            <Loader2 className="absolute right-4.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 animate-spin" />
                        )}

                        {/* Suggestion Dropdown Panel */}
                        <AnimatePresence>
                            {showSuggestions && suggestions.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute left-0 right-0 mt-2 bg-white border border-slate-200/60 rounded-2xl shadow-xl z-50 overflow-hidden max-h-60 overflow-y-auto"
                                >
                                    {suggestions.map((item) => (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => handleSuggestionClick(item.fullName)}
                                            className="w-full text-left px-5 py-3 hover:bg-[#f4f8fa] text-xs font-bold text-[#082e3e] transition-colors border-b border-slate-50 last:border-0 flex items-center justify-between"
                                        >
                                            <span>{item.fullName}</span>
                                            <span className="text-[10px] text-slate-400 font-extrabold uppercase">Doctor ID: {item.id}</span>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Specialization Filter Dropdown */}
                    <div className="relative w-full lg:w-72">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
                        <select
                            value={selectedSpec}
                            onChange={(e) => setSelectedSpec(e.target.value ? Number(e.target.value) : '')}
                            className="w-full bg-[#f8fafc] border border-slate-200/60 rounded-2xl pl-11 pr-4 py-3.5 font-bold text-sm text-[#082e3e] focus:outline-none focus:ring-2 focus:ring-[#8eb5ca]/30 focus:border-[#8eb5ca] appearance-none cursor-pointer"
                        >
                            <option value="">All Specialties</option>
                            {specializations.map((spec) => (
                                <option key={spec.id} value={spec.id}>{spec.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Trigger Full Search */}
                    <button
                        type="submit"
                        disabled={isSearching}
                        className="w-full lg:w-auto bg-[#082e3e] hover:bg-[#0a4053] text-white px-8 py-3.5 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 shrink-0 shadow-sm cursor-pointer"
                    >
                        {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                        <span>Search Directory</span>
                    </button>
                </form>
            </div>

            {/* Doctors Grid Results */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-[#082e3e] uppercase tracking-widest">Search Results ({doctors.length})</h3>
                    {doctors.length > 0 && <span className="text-[10px] font-bold text-slate-400 bg-slate-100 border border-slate-200/40 px-3 py-1 rounded-md">Live Directory</span>}
                </div>

                {doctors.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {doctors.map((doc) => (
                            <div key={doc.id} className="bg-white border border-slate-200/50 rounded-[2.25rem] p-6 hover:border-slate-300 transition-all flex flex-col justify-between shadow-xs">
                                <div>
                                    {/* Specialty Badge */}
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[10px] font-black uppercase text-[#0a4053] bg-[#e3edf2] px-3 py-1 rounded-full border border-white">
                                            {doc.specializationName}
                                        </span>
                                        <div className="flex items-center space-x-1 text-amber-500">
                                            <Star className="w-3.5 h-3.5 fill-current" />
                                            <span className="text-xs font-black">4.9</span>
                                        </div>
                                    </div>

                                    {/* Doctor Name & Exp */}
                                    <h4 className="text-lg font-black text-[#082e3e]">{doc.fullName}</h4>
                                    <p className="text-[11px] text-slate-400 font-bold uppercase mt-0.5">{doc.experienceYears} Years Clinical Experience</p>

                                    {/* Biography */}
                                    <p className="text-xs text-slate-500 mt-4 leading-relaxed font-semibold bg-[#f8fafc] p-4 rounded-2xl border border-slate-200/20 min-h-[80px]">
                                        {doc.biography}
                                    </p>
                                </div>

                                {/* Fee and CTA Booking Button */}
                                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <div>
                                        <span className="text-[9px] text-slate-400 font-bold uppercase block">Consultation Fee</span>
                                        <span className="text-base font-black text-[#082e3e]">LKR {doc.consultationFee.toLocaleString()}</span>
                                    </div>

                                    <button
                                        onClick={() => setSelectedDoctor(doc)}
                                        className="flex items-center gap-1.5 bg-[#082e3e] hover:bg-[#0a4053] text-white px-4.5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-xs cursor-pointer"
                                    >
                                        <span>View Slots</span>
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Empty State Placeholder */
                    <div className="bg-white/40 border border-slate-200/50 border-dashed rounded-[2.5rem] p-16 text-center">
                        <div className="p-4 bg-[#e3edf2] text-[#0a4053] rounded-full inline-block border border-white mb-4">
                            <Search className="w-6 h-6" />
                        </div>
                        <h4 className="text-base font-black text-[#082e3e] uppercase tracking-wider">No Physicians Found</h4>
                        <p className="text-slate-400 text-xs font-bold leading-relaxed max-w-sm mx-auto mt-2">
                            Adjust your specialty filter or try checking another clinical name. All searches run dynamically.
                        </p>
                    </div>
                )}
            </div>

            {/* --- TIME SLOT SELECTOR POPUP MODAL (DYNAMIC DATES) --- */}
            <AnimatePresence>
                {selectedDoctor && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white border border-slate-200/50 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col justify-between"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-[#f8fafc]">
                                <div>
                                    <span className="inline-block bg-[#e3edf2] text-[#0a4053] text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1">
                                        {selectedDoctor.specializationName}
                                    </span>
                                    <h3 className="text-lg font-black text-[#082e3e]">Select Appointment Slot</h3>
                                    <p className="text-[11px] text-slate-400 font-bold uppercase mt-0.5">Consultation with {selectedDoctor.fullName}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedDoctor(null)}
                                    className="p-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition cursor-pointer"
                                >
                                    <X className="w-4 h-4 text-slate-500" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 space-y-6">
                                {/* Date Selector Chips (Dynamic based on DB) */}
                                <div className="space-y-2">
                                    <span className="block text-[10px] font-black uppercase text-[#85abc0] tracking-wider">Select Date</span>

                                    {getAvailableDatesFromSlots().length > 0 ? (
                                        <div className="grid grid-cols-6 gap-2">
                                            {getAvailableDatesFromSlots().map((d) => (
                                                <button
                                                    key={d.formatted}
                                                    type="button"
                                                    onClick={() => setBookingDate(d.formatted)}
                                                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${bookingDate === d.formatted
                                                        ? 'bg-[#082e3e] text-white border-[#082e3e] shadow-md shadow-[#082e3e]/10'
                                                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                                                        }`}
                                                >
                                                    <span className="text-[9px] font-black tracking-widest">{d.dayName}</span>
                                                    <span className="text-sm font-black">{d.dayNum}</span>
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-4 border border-dashed border-slate-200 rounded-2xl text-center text-xs text-slate-400 italic">
                                            No active dates available for booking.
                                        </div>
                                    )}
                                </div>

                                {/* Available Slots List (Full-Width Rows) */}
                                <div className="space-y-2">
                                    <span className="block text-[10px] font-black uppercase text-[#85abc0] tracking-wider">Available Slots</span>

                                    {isLoadingSlots ? (
                                        <div className="h-48 flex items-center justify-center">
                                            <Loader2 className="w-6 h-6 text-[#082e3e] animate-spin" />
                                        </div>
                                    ) : slotsForSelectedDate.length > 0 ? (
                                        <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                                            {slotsForSelectedDate.map((slot) => {
                                                const isSelected = selectedSlotId === slot.id;

                                                return (
                                                    <button
                                                        key={slot.id}
                                                        type="button"
                                                        onClick={() => setSelectedSlotId(slot.id)}
                                                        className={`w-full p-4 rounded-2xl border font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${isSelected
                                                            ? 'bg-[#082e3e] text-white border-transparent shadow-lg shadow-[#082e3e]/15'
                                                            : 'bg-[#f8fafc] hover:bg-[#e3edf2] text-[#0a4053] border-slate-200/60'
                                                            }`}
                                                    >
                                                        {/* Left side: Icon and Slot Time */}
                                                        <div className="flex items-center gap-3.5">
                                                            <Clock className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-[#85abc0]'}`} />
                                                            <span className="text-sm font-black">
                                                                {slot.startTime} - {slot.endTime}
                                                            </span>
                                                        </div>

                                                        {/* Right side: Custom Circular Check Indicator */}
                                                        <div className={`w-5.5 h-5.5 rounded-full border flex items-center justify-center transition-all ${isSelected
                                                            ? 'bg-emerald-500 border-transparent text-white'
                                                            : 'border-slate-350 bg-white'
                                                            }`}>
                                                            {isSelected && <span className="text-[10px] font-black">✓</span>}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="h-48 flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-[2rem] p-4 text-center">
                                            <AlertCircle className="w-5 h-5 text-slate-350 mb-1" />
                                            <p className="text-slate-400 text-xs italic font-bold">Please select a date to view available shifts.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 border-t border-slate-100 bg-[#f8fafc] flex items-center justify-between">
                                <div>
                                    <span className="text-[9px] text-slate-400 font-bold uppercase block">Total Payable</span>
                                    <span className="text-base font-black text-[#082e3e]">LKR {selectedDoctor.consultationFee.toLocaleString()}</span>
                                </div>

                                <button
                                    disabled={!selectedSlotId}
                                    onClick={handleConfirmBooking}
                                    className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white px-8 py-3.5 rounded-2xl font-black text-xs transition-all shadow-md shadow-emerald-600/10 flex items-center gap-2 cursor-pointer"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Confirm Booking</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BookAppointment;