import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Clock,
    Plus,
    Trash2,
    Settings,
    CheckCircle2,
    Save,
    Calendar,
    Globe,
    Loader2,
    HelpCircle,
    RefreshCw,
    AlertCircle,
    Sparkles,
    ChevronRight,
    Sliders,
    CalendarDays
} from 'lucide-react';
import { useAuth } from '../context/authContext';
import { saveAvailability, getAvailability } from "../services/doctor";
import type { WeeklyScheduleDTO, DayOfWeek } from "../types/types";

// DTO Schema Definitions
export interface TimeSlotDTO {
    id: string; // for React list keys
    startTime: string; // e.g. "09:00"
    endTime: string;   // e.g. "12:00"
}

const DAYS_ORDER: DayOfWeek[] = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY'
];

const DoctorAvailability = () => {
    // Pre-seed mock data representing WeeklyScheduleDTO
    const [schedule, setSchedule] = useState<WeeklyScheduleDTO>({
        defaultSlotDuration: 30,
        days: [
            {
                dayOfWeek: 'MONDAY',
                slots: [
                    { id: 'mon-1', startTime: '09:00', endTime: '12:00', booked: false },
                    { id: 'mon-2', startTime: '14:00', endTime: '17:00', booked: false }
                ]
            },
            {
                dayOfWeek: 'TUESDAY',
                slots: [
                    { id: 'tue-1', startTime: '09:00', endTime: '13:00', booked: false }
                ]
            },
            {
                dayOfWeek: 'WEDNESDAY',
                slots: [
                    { id: 'wed-1', startTime: '09:00', endTime: '12:00', booked: false },
                    { id: 'wed-2', startTime: '14:00', endTime: '18:00', booked: false }
                ]
            },
            {
                dayOfWeek: 'THURSDAY',
                slots: [
                    { id: 'thu-1', startTime: '10:00', endTime: '15:00', booked: false }
                ]
            },
            {
                dayOfWeek: 'FRIDAY',
                slots: [
                    { id: 'fri-1', startTime: '09:00', endTime: '12:00', booked: false },
                    { id: 'fri-2', startTime: '15:00', endTime: '19:00', booked: false }
                ]
            },
            {
                dayOfWeek: 'SATURDAY',
                slots: []
            },
            {
                dayOfWeek: 'SUNDAY',
                slots: []
            }
        ]
    });

    // UI / Interactive States
    const { user } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);

    // 1. Page eka load weddi backend eken data gannawa
    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const data = await getAvailability(user.id);

                if (data.days[0].slots.length === 0) {
                    console.warn("No schedule data found for user, using default.");
                    return;
                }

                setSchedule(data); // Backend eken ena data UI ekata set karanawa

            } catch (err) {
                console.error("Failed to load schedule");
            }
        };
        fetchSchedule();
    }, [user]);

    // 2. Dawasak On/Off karana eka (Active/Unavailable)
    const handleToggleDay = (dayName: DayOfWeek) => {
        const day = schedule.days.find(d => d.dayOfWeek === dayName);

        const hasBooked = day?.slots.some(s => s.booked);

        if (hasBooked) {
            setValidationError(`Cannot disable ${formatDay(dayName)}: appointments are already booked.`);
            return;
        }

        setSchedule(prev => ({
            ...prev,
            days: prev.days.map(d => d.dayOfWeek === dayName
                ? { ...d, slots: d.slots.length > 0 ? [] : [{ id: `def-${Date.now()}`, startTime: '09:00', endTime: '17:00', booked: false }] }
                : d)
        }));
    };

    // 3. Slot ekaka start/end time wenas karana eka
    const handleUpdateSlotTime = (dayName: DayOfWeek, slotId: string, field: 'startTime' | 'endTime', value: string) => {
        setSchedule(prev => ({
            ...prev,
            days: prev.days.map(d => d.dayOfWeek === dayName
                ? { ...d, slots: d.slots.map(s => s.id === slotId ? { ...s, [field]: value } : s) }
                : d)
        }));
    };

    // 4. Aluth slot ekak add karana eka
    const handleAddSlot = (dayName: DayOfWeek) => {
        setSchedule(prev => ({
            ...prev,
            days: prev.days.map(d => d.dayOfWeek === dayName
                ? { ...d, available: true, slots: [...d.slots, { id: Date.now().toString(), startTime: '09:00', endTime: '10:00', booked: false }] }
                : d)
        }));
    };

    // 5. Slot ekak remove karana eka
    const handleRemoveSlot = (dayName: DayOfWeek, slotId: string) => {
        setSchedule(prev => ({
            ...prev,
            days: prev.days.map(d => {
                if (d.dayOfWeek === dayName) {
                    return { ...d, slots: d.slots.filter(s => s.id !== slotId || s.booked) };
                }
                return d;
            })
        }));
    };

    // Helper: Format day string to Title Case
    const formatDay = (day: DayOfWeek) => {
        return day.charAt(0) + day.slice(1).toLowerCase();
    };

    const validateSchedule = (): boolean => {
        for (const d of schedule.days) {
            // Slots list eka empty nam, e dawasa unavailable kiyala hithala validate karanna oni nehe
            if (!d.slots || d.slots.length === 0) continue;

            for (const slot of d.slots) {
                const [sh, sm] = slot.startTime.split(':').map(Number);
                const [eh, em] = slot.endTime.split(':').map(Number);
                const startMin = sh * 60 + sm;
                const endMin = eh * 60 + em;

                // Start time eka end time ekata wada wadi nam error ekak denawa
                if (startMin >= endMin) {
                    setValidationError(`End time must be after start time on ${formatDay(d.dayOfWeek)}.`);
                    return false;
                }
            }

            // Slot dekak hapenawada (overlap wenawada) kiyala check karanawa
            const sortedSlots = [...d.slots].sort((a, b) => {
                const [ah, am] = a.startTime.split(':').map(Number);
                const [bh, bm] = b.startTime.split(':').map(Number);
                return (ah * 60 + am) - (bh * 60 + bm);
            });

            for (let i = 0; i < sortedSlots.length - 1; i++) {
                const current = sortedSlots[i];
                const next = sortedSlots[i + 1];
                const [ch, cm] = current.endTime.split(':').map(Number);
                const [nh, nm] = next.startTime.split(':').map(Number);

                // Current slot eke end time eka, next slot eke start time ekata wada wadi nam overlap wenawa
                if (ch * 60 + cm > nh * 60 + nm) {
                    setValidationError(`Overlapping slots on ${formatDay(d.dayOfWeek)}.`);
                    return false;
                }
            }
        }
        return true;
    };

    const handleGlobalChange = (field: keyof Omit<WeeklyScheduleDTO, 'days'>, value: any) => {
        setSchedule(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // 6. Save karana eka (Validation karala backend ekata yawana eka)
    const handleSave = async () => {
        if (!validateSchedule()) return; // Waradi nam save wenne nehe

        try {
            setIsSaving(true);
            await saveAvailability(user.id, schedule); // Data backend ekata yawana eka
            setToastMessage("Schedule successfully synchronized!");
        } catch (err: any) {
            setValidationError("Failed to save: " + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div id="doctor-availability-manager" className="space-y-6 font-sans">

            {/* Toast Notification */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="fixed top-24 right-6 md:right-12 z-50 max-w-md bg-[#082e3e] text-white border border-[#8eb5ca]/35 rounded-[1.5rem] p-4.5 shadow-2xl flex items-center gap-3.5"
                    >
                        <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 shrink-0">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                            <h4 className="font-extrabold text-xs tracking-tight text-white mb-0.5">DTO Registry Sync Complete</h4>
                            <p className="text-[11px] text-slate-300 font-medium leading-relaxed">{toastMessage}</p>
                        </div>
                        <button
                            onClick={() => setToastMessage(null)}
                            className="text-slate-400 hover:text-white font-bold text-xs p-1"
                        >
                            ✕
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Grid Wrapper (Desktop split sidebar & schedule rows) */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">

                {/* Left Side: Global Configurations Panel (1 column) */}
                <div id="availability-config-sidebar" className="bg-white border border-slate-200/50 rounded-[2.25rem] p-6.5 shadow-xs space-y-6">
                    <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
                        <div className="p-2.5 bg-[#f0f5f8] rounded-xl border border-white text-[#0a4053]">
                            <Settings className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="font-extrabold text-sm text-[#082e3e] tracking-tight">Global Controls</h3>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Sync variables</p>
                        </div>
                    </div>

                    {/* Validation Alert */}
                    {validationError && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-50 border border-red-100 rounded-2xl p-4 flex gap-2.5 text-xs text-red-800 font-semibold leading-normal"
                        >
                            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            <span>{validationError}</span>
                        </motion.div>
                    )}

                    {/* Configuration Parameters */}
                    <div className="space-y-4 text-xs">
                        {/* Slot Duration */}
                        <div>
                            <label className="block text-[10px] font-black uppercase text-[#85abc0] tracking-wider mb-2.5">
                                Default Slot Duration
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {[15, 30, 60].map((dur) => (
                                    <button
                                        key={dur}
                                        type="button"
                                        onClick={() => handleGlobalChange('defaultSlotDuration', dur)}
                                        className={`py-2 rounded-xl border font-bold text-[11px] transition cursor-pointer text-center ${schedule.defaultSlotDuration === dur
                                            ? 'bg-[#082e3e] text-white border-transparent shadow-3xs'
                                            : 'bg-[#f8fafc] text-[#0a4053] hover:bg-[#e3edf2] border-slate-200/60'
                                            }`}
                                    >
                                        {dur} min
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Action button */}
                    <div className="pt-2">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-full flex items-center justify-center space-x-2.5 text-xs font-black bg-[#082e3e] hover:bg-[#0d3b4f] disabled:bg-[#082e3e]/70 text-white rounded-xl py-3.5 shadow-3xs cursor-pointer hover:shadow-md transition-all"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Synchronizing...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 text-slate-200" />
                                    <span>Save Availability DTO</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Right Side: Weekly Schedule Card-based list (3 columns) */}
                <div className="lg:col-span-3 space-y-4">

                    {/* Header instructions block */}
                    <div className="bg-white/70 backdrop-blur-md border border-slate-200/40 rounded-[2rem] p-5 flex items-center justify-between text-xs font-medium">
                        <div className="flex items-center space-x-3 text-slate-600">
                            <CalendarDays className="w-5 h-5 text-[#0a4053] shrink-0" />
                            <span>Configure daily active clinician shifts. Adding multiple custom time slots allows split shifts (e.g., morning/evening).</span>
                        </div>

                        <span className="hidden sm:inline-flex bg-slate-100 text-slate-600 px-3 py-1 rounded-md text-[10px] font-bold border border-slate-200/50">
                            DTO Format
                        </span>
                    </div>

                    {/* Days Grid Rows */}
                    <div className="space-y-3.5">
                        {DAYS_ORDER.map((dayName) => {
                            const dayData = schedule.days.find(d => d.dayOfWeek === dayName) || { dayOfWeek: dayName, available: false, slots: [] };
                            const isAvailable = dayData.slots && dayData.slots.length > 0;

                            return (
                                <div
                                    key={dayName}
                                    className={`bg-white border rounded-[2.25rem] transition-all duration-200 overflow-hidden ${isAvailable
                                        ? 'border-[#e3edf2] hover:border-[#8eb5ca]/60 hover:shadow-xs bg-gradient-to-tr from-white to-[#f0f5f8]/10'
                                        : 'border-slate-200/40 bg-slate-50/50'
                                        }`}
                                >
                                    <div className="p-5.5 sm:p-6 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between">

                                        {/* Left details (Day Name and Availability Badge Indicator) */}
                                        <div className="flex items-center space-x-4 shrink-0 min-w-[140px]">

                                            {/* Day toggle switch */}
                                            <button
                                                type="button"
                                                onClick={() => handleToggleDay(dayName)}
                                                disabled={dayData.slots.some(s => s.booked)} // Disable switch if booked
                                                className={`... ${dayData.slots.some(s => s.booked) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            ></button>

                                            <div className="text-left">
                                                <span className="block font-black text-[#082e3e] text-sm leading-none mb-1">
                                                    {formatDay(dayName)}
                                                </span>
                                                <span className={`text-[9px] uppercase tracking-wider font-extrabold ${isAvailable ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                    {isAvailable ? 'Active Shift' : 'Unavailable'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Middle: Active slots config area */}
                                        <div className="flex-1 w-full">
                                            {isAvailable ? (
                                                <div className="flex flex-col gap-3.5">
                                                    {dayData.slots.map((slot, index) => {
                                                        // me line eken check karanawa book wela da kiyala (true or "true" unath awlak nehe)
                                                        const isBooked = slot.booked === true;
                                                        console.log(slot);

                                                        return (
                                                            <div
                                                                key={slot.id || index}
                                                                className={`flex flex-wrap items-center gap-2.5 bg-white border border-slate-200/50 p-2.5 rounded-2xl shadow-3xs ${isBooked ? 'opacity-60 bg-slate-100 pointer-events-none' : ''}`}
                                                            >
                                                                {/* Sequence index */}
                                                                <span className="w-5.5 h-5.5 flex items-center justify-center bg-[#f0f5f8] text-[#0a4053] font-black rounded-lg text-[9px] border border-white">
                                                                    {index + 1}
                                                                </span>

                                                                {/* Time inputs */}
                                                                <div className="flex items-center space-x-2">
                                                                    <div className="relative">
                                                                        <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                                                                        <input
                                                                            type="time"
                                                                            value={slot.startTime}
                                                                            disabled={slot.booked} // meka disable wenawa
                                                                            onChange={(e) => handleUpdateSlotTime(dayName, slot.id, 'startTime', e.target.value)}
                                                                            className={`bg-[#f8fafc] border border-slate-200 rounded-xl pl-8 pr-2.5 py-1.5 font-bold text-xs text-[#0a4053] ${slot.booked ? 'cursor-not-allowed' : 'focus:ring-2 focus:ring-[#8eb5ca]/30'}`}
                                                                        />
                                                                    </div>
                                                                    <span className="text-slate-350 text-[10px] font-bold">to</span>
                                                                    <div className="relative">
                                                                        <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                                                                        <input
                                                                            type="time"
                                                                            value={slot.endTime}
                                                                            disabled={slot.booked} // meka disable wenawa
                                                                            onChange={(e) => handleUpdateSlotTime(dayName, slot.id, 'endTime', e.target.value)}
                                                                            className={`bg-[#f8fafc] border border-slate-200 rounded-xl pl-8 pr-2.5 py-1.5 font-bold text-xs text-[#0a4053] ${slot.booked ? 'cursor-not-allowed' : 'focus:ring-2 focus:ring-[#8eb5ca]/30'}`}
                                                                        />
                                                                    </div>
                                                                </div>

                                                                {/* Remove button - isBooked nam penne nehe */}
                                                                {!isBooked && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleRemoveSlot(dayName, slot.id)}
                                                                        className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 hover:border-red-100 rounded-xl transition border border-slate-200/30 cursor-pointer ml-auto shrink-0"
                                                                    >
                                                                        <Trash2 className="w-3.5 h-3.5" />
                                                                    </button>
                                                                )}

                                                                {/* Booked badge */}
                                                                {isBooked && (
                                                                    <span className="ml-auto text-[9px] font-black uppercase text-rose-500 bg-rose-50 px-2 py-1 rounded-lg">
                                                                        Booked
                                                                    </span>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="flex items-center text-slate-400 text-xs font-semibold select-none bg-slate-100/50 border border-dashed border-slate-250 p-4.5 rounded-[1.5rem] italic justify-center">
                                                    Doctor is out of clinic on {formatDay(dayName)}. Toggle active shift to onboard.
                                                </div>
                                            )}
                                        </div>

                                        {/* Right: Add slots button (only shown if available) */}
                                        <div className="shrink-0 flex items-center md:self-center">
                                            {isAvailable && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleAddSlot(dayName)}
                                                    className="flex items-center space-x-1 px-4 py-2 bg-[#f0f5f8] hover:bg-[#e3edf2] text-[#0a4053] border border-slate-200/30 hover:border-slate-300 rounded-xl transition text-[11px] font-bold cursor-pointer shadow-3xs"
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                    <span>Split Shift</span>
                                                </button>
                                            )}
                                        </div>

                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Symmetrical Statistics / Info Footer */}
                    <div className="bg-white border border-[#e3edf2] rounded-[2rem] p-5.5 flex flex-wrap gap-4 items-center justify-between text-xs">
                        <div className="flex items-center space-x-2 text-slate-400 font-semibold">
                            <Sparkles className="w-4 h-4 text-slate-400" />
                            <span>Auto-generation protocols format available shifts into standard JSON intervals.</span>
                        </div>

                        <div className="flex items-center space-x-4">
                            <span className="text-slate-400 font-bold">Total Active Days:</span>
                            <span className="font-extrabold text-[#082e3e] bg-[#e3edf2] px-3 py-1 rounded-lg border border-white">
                                {schedule.days.filter(d => d.slots && d.slots.length > 0).length} Days
                            </span>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default DoctorAvailability;