import React, { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, Save, Loader2, Settings, Calendar } from 'lucide-react';
import { useAuth } from '../context/authContext';
import { saveAvailability, getAvailability } from "../services/doctor";
import type { WeeklyScheduleDTO, DayOfWeek } from "../types/types";

const DAYS: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

const DoctorAvailability = () => {
    const { user } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const [schedule, setSchedule] = useState<WeeklyScheduleDTO>({
        defaultSlotDuration: 30,
        days: DAYS.map(day => ({ dayOfWeek: day, slots: [] }))
    });

    const hasDbData = schedule.days.some(day =>
        day.slots.some(slot => slot.id && !slot.id.startsWith('new-') && !slot.id.startsWith('temp-'))
    );

    // 1. Load data from Backend
    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await getAvailability(user.id);
                if (data) setSchedule(data);
            } catch (err) { console.error("Load failed"); }
        };
        loadData();
    }, [user.id]);

    // Dates calculate kirima (Next Week fallback) 
    const getNextWeekDate = (dayName: DayOfWeek) => {
        const now = new Date();
        const dayMap: any = { 'MONDAY': 1, 'TUESDAY': 2, 'WEDNESDAY': 3, 'THURSDAY': 4, 'FRIDAY': 5, 'SATURDAY': 6, 'SUNDAY': 7 };
        const todayIdx = now.getDay() === 0 ? 7 : now.getDay();
        const targetIdx = dayMap[dayName];
        let diff = targetIdx - todayIdx + 7;
        const nextDate = new Date(now);
        nextDate.setDate(now.getDate() + diff);
        return nextDate.toLocaleDateString('en-CA'); // YYYY-MM-DD
    };

    // Past time check kirima 
    const isSlotLocked = (slotDate: string, endTime: string, booked: boolean) => {
        if (booked) return true;

        const now = new Date();
        const todayStr = now.toLocaleDateString('en-CA');

        // (Ex: If July 6 < July 7 Expired)
        if (slotDate < todayStr) return true;

        // If the slot is for today, check if the end time has passed
        if (slotDate === todayStr) {
            const [h, m] = endTime.split(':').map(Number);
            const slotTime = new Date();
            slotTime.setHours(h, m, 0);
            return slotTime < now;
        }

        return false;
    };

    // Add Slot
    const addSlot = (dayName: DayOfWeek) => {
        if (dayName === 'SUNDAY') return;
        const newSlot = {
            id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            startTime: '09:00',
            endTime: '10:00',
            booked: false
        };
        setSchedule({
            ...schedule,
            days: schedule.days.map(d => d.dayOfWeek === dayName ? { ...d, slots: [...d.slots, newSlot] } : d)
        });
    };

    // Remove Slot
    const removeSlot = (dayName: DayOfWeek, slotId: string | number) => {
        setSchedule({
            ...schedule,
            days: schedule.days.map(d => d.dayOfWeek === dayName ? {
                ...d, slots: d.slots.filter(s => String(s.id) !== String(slotId))
            } : d)
        });
    };

    // Update Time
    const updateTime = (dayName: DayOfWeek, slotId: string | number, field: 'startTime' | 'endTime', value: string) => {
        setSchedule({
            ...schedule,
            days: schedule.days.map(d => d.dayOfWeek === dayName ? {
                ...d, slots: d.slots.map(s => String(s.id) === String(slotId) ? { ...s, [field]: value } : s)
            } : d)
        });
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {

            if (!schedule.days.some(d => d.slots.length > 0)) {
                alert("Error: Schedule is empty.");
                return;
            }

            await saveAvailability(user.id, schedule);
            alert("Success: Weekly Schedule Updated!");
        } catch (err) {
            alert("Error: Could not save schedule.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">



            {/* Top Control Panel */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="space-y-1 text-center md:text-left">
                    <h2 className="text-3xl font-black text-[#082e3e] tracking-tight">Weekly Availability</h2>
                    <p className="text-slate-400 font-medium text-sm italic">Planning for the upcoming clinical week</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                        <Settings className="w-4 h-4 text-[#85abc0] ml-2" />
                        <div className="flex gap-1">
                            {[15, 30, 45, 60].map(m => (
                                <button
                                    key={m}
                                    disabled={hasDbData} 
                                    onClick={() => setSchedule({ ...schedule, defaultSlotDuration: m })}
                                    className={`px-4 py-1.5 rounded-xl text-[11px] font-black transition-all ${schedule.defaultSlotDuration === m
                                            ? 'bg-[#082e3e] text-white shadow-md'
                                            : 'text-slate-400 hover:bg-white'
                                        } ${hasDbData ? 'opacity-40 cursor-not-allowed' : ''}`} 
                                >
                                    {m}m
                                </button>
                            ))}
                        </div>
                    </div>
                    <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 bg-[#082e3e] text-white px-10 py-4 rounded-[1.5rem] font-black hover:bg-[#0a4053] transition-all shadow-xl shadow-[#082e3e]/20 disabled:opacity-50">
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Sync Schedule
                    </button>
                </div>
            </div>

            {/* Days Grid */}
            <div className="grid gap-5">
                {schedule.days.map((day) => {
                    const isSunday = day.dayOfWeek === 'SUNDAY';

                    // DB date ho getNextWeekDate use kirima 
                    const displayDate = (day as any).date ? (day as any).date : getNextWeekDate(day.dayOfWeek);

                    return (
                        <div key={day.dayOfWeek} className={`bg-white p-6 rounded-[2.5rem] border transition-all flex flex-col lg:flex-row gap-8 ${isSunday ? 'border-dashed border-slate-200 bg-slate-50/50' : 'border-slate-100 shadow-xs'}`}>

                            {/* Day & Date Info */}
                            <div className="lg:w-48 shrink-0">
                                <h3 className={`text-xl font-black ${isSunday ? 'text-slate-300' : 'text-[#082e3e]'}`}>{day.dayOfWeek}</h3>
                                <div className="flex items-center gap-1.5 text-[#85abc0] font-bold text-xs mt-1">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>{displayDate}</span>
                                </div>
                                {isSunday && <span className="inline-block mt-3 text-[10px] font-black text-rose-400 bg-rose-50 px-3 py-1 rounded-full uppercase">Forced Holiday</span>}
                            </div>

                            {/* Shifts Area */}
                            <div className="flex-1 space-y-3">
                                {day.slots.length > 0 ? (
                                    day.slots.map((slot) => {
                                        const locked = isSlotLocked(displayDate, slot.endTime, slot.booked);
                                        return (
                                            <div key={slot.id} className={`flex items-center gap-4 p-4 rounded-[1.5rem] border transition-all ${locked ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-[#f8fafc] border-slate-200 hover:shadow-sm'}`}>
                                                <Clock className={`w-4 h-4 ${locked ? 'text-slate-300' : 'text-[#85abc0]'}`} />
                                                <div className="flex items-center gap-3 font-black text-[#082e3e]">
                                                    <input type="time" value={slot.startTime} disabled={locked} onChange={(e) => updateTime(day.dayOfWeek, slot.id, 'startTime', e.target.value)} className="bg-transparent outline-none cursor-pointer focus:text-blue-600" />
                                                    <span className="text-slate-300 text-xs font-bold uppercase">to</span>
                                                    <input type="time" value={slot.endTime} disabled={locked} onChange={(e) => updateTime(day.dayOfWeek, slot.id, 'endTime', e.target.value)} className="bg-transparent font-bold text-[#082e3e] outline-none cursor-pointer" />
                                                </div>

                                                <div className="ml-auto flex items-center gap-2">
                                                    {slot.booked && <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase border border-emerald-100">Booked</span>}
                                                    {locked && !slot.booked && <span className="text-[10px] font-black bg-slate-200 text-slate-500 px-3 py-1 rounded-lg uppercase">Expired</span>}
                                                    {!locked && (
                                                        <button onClick={() => removeSlot(day.dayOfWeek, slot.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors hover:bg-rose-50 rounded-xl">
                                                            <Trash2 className="w-4.5 h-4.5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="h-16 flex items-center justify-center border border-dashed border-slate-200 rounded-[1.5rem]">
                                        <p className="text-slate-300 text-xs font-bold uppercase tracking-widest italic">No shifts scheduled</p>
                                    </div>
                                )}
                            </div>

                            {/* Add Button */}
                            <div className="lg:w-40 flex items-center justify-center">
                                {!isSunday && (
                                    <button onClick={() => addSlot(day.dayOfWeek)} className="group flex items-center gap-2 text-[#85abc0] font-extrabold text-xs hover:text-[#082e3e] transition-all bg-slate-50 hover:bg-slate-100 px-5 py-3 rounded-2xl border border-slate-100">
                                        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                                        Add Shift
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DoctorAvailability;