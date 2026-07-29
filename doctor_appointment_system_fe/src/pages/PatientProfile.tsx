import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    User, Mail, Droplets, FileText, Save, Loader2,
    CheckCircle2, AlertCircle, Sparkles, Lock, KeyRound, X
} from 'lucide-react';
import { useAuth } from '../context/authContext';
import { updatePatientProfile, changePatientPassword, getPatientProfile } from '../services/patient';
import type { PatientUpdateDTO, PasswordChangeDTO, PatientResponseDTO } from "../types/types";

const PatientProfile = () => {
    const { user } = useAuth();

    // Profile State
    const [profile, setProfile] = useState({
        fullName: '',
        email: '',
        bloodGroup: '',
        medicalHistory: ''
    });

    // UI & Error States
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [profileError, setProfileError] = useState<string | null>(null); 

    // Password Modal States
    const [isPassModalOpen, setIsPassModalOpen] = useState(false);
    const [passData, setPassData] = useState<PasswordChangeDTO>({
        oldPassword: '', newPassword: '', confirmPassword: ''
    });
    const [passLoading, setPassLoading] = useState(false);
    const [passError, setPassError] = useState<string | null>(null); 

    const loadData = async () => {
        setIsLoading(true);
        try {
            const res = await getPatientProfile(user.id);
            setProfile(res);
        } catch (err) {
            console.error("Profile load failed", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [user.id]);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setProfileError(null);
        try {
            await updatePatientProfile(user.id, {
                bloodGroup: profile.bloodGroup,
                medicalHistory: profile.medicalHistory
            });
            setToastMessage("Health profile updated successfully!");
            loadData();
            setTimeout(() => setToastMessage(null), 4000);
        } catch (err: any) {
            setProfileError(err);
        } finally {
            setIsSaving(false);
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setPassError(null);

        // Validation: New passwords match check
        if (passData.newPassword !== passData.confirmPassword) {
            setPassError("New passwords do not match.");
            return;
        }

        setPassLoading(true);
        try {
            await changePatientPassword(user.id, passData);
            setToastMessage("Credentials updated successfully!");
            setIsPassModalOpen(false);
            setPassData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => setToastMessage(null), 4000);
        } catch (err: any) {
            setPassError(err); 
        } finally {
            setPassLoading(false);
        }
    };

    return (
        <div className="w-full space-y-6 pb-10 animate-in fade-in duration-500 text-left px-0">

            {/* Toast Notification (Supreme Theme) */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        className="fixed top-24 right-6 md:right-12 z-50 bg-[#082e3e] text-white border border-emerald-500/30 rounded-2xl p-4.5 shadow-2xl flex items-center gap-3.5"
                    >
                        <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 shrink-0">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-black text-[10px] uppercase tracking-widest text-emerald-400 mb-0.5">System Sync Success</h4>
                            <p className="text-[11px] font-bold text-slate-100">{toastMessage}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header Welcome Banner */}
            <div className="bg-gradient-to-br from-[#85abc0] via-[#709eb7] to-[#082e3e] rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden text-white shadow-lg border border-white/20">
                <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10 mb-4">
                        <Sparkles className="w-3.5 h-3.5" /> 
                        <span>MD-NODE-PATIENT-ACCESS</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight">Personal Health Records</h2>
                    <p className="text-slate-100 text-sm mt-3 leading-relaxed max-w-xl font-medium">
                        Manage your clinical identity, blood group synchronization, and security credentials for a safe healthcare experience.
                    </p>
                </div>
            </div>

            {isLoading ? (
                <div className="h-64 flex items-center justify-center"><Loader2 className="w-8 h-8 text-[#082e3e] animate-spin" /></div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column: Read-only Identity */}
                    <div className="lg:col-span-1 bg-white border border-slate-200 rounded-[2.25rem] p-6 shadow-sm flex flex-col justify-between">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 pb-4 border-b border-slate-50">
                                <div className="p-3 bg-[#f0f7fa] text-[#082e3e] rounded-2xl border border-white shadow-sm"><User className="w-5 h-5" /></div>
                                <div>
                                    <h4 className="font-black text-[#082e3e] text-sm truncate max-w-[150px]">{profile.fullName}</h4>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Verified Identity</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">Authenticated Email</label>
                                    <div className="text-xs font-bold text-[#082e3e] flex items-center gap-2 truncate">
                                        <Mail className="w-3.5 h-3.5 text-[#85abc0]" /> {profile.email}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Updated Credentials Button */}
                        <button
                            type="button"
                            onClick={() => { setPassError(null); setIsPassModalOpen(true); }}
                            className="w-full mt-8 py-4 bg-[#e3edf2] hover:bg-[#d0e0eb] border border-[#8eb5ca]/30 rounded-2xl text-[10px] font-black uppercase text-[#082e3e] transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
                        >
                            <Lock className="w-3.5 h-3.5 text-[#0a4053]" /> Update Credentials
                        </button>
                    </div>

                    {/* Right Column: Health Profile Edit Form */}
                    <form onSubmit={handleProfileUpdate} className="lg:col-span-2 bg-white border border-slate-200 rounded-[2.25rem] p-8 shadow-sm space-y-6 relative overflow-hidden">
                        <h3 className="text-[10px] font-black uppercase text-[#85abc0] tracking-[0.2em] mb-4 border-b border-slate-50 pb-2">Diagnostic Profile Configuration</h3>

                        {profileError && (
                            <div className="bg-red-50 border border-red-100 p-4 rounded-2xl text-xs text-red-600 font-bold flex gap-3 items-start">
                                <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                                <span>{profileError}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-[#082e3e] ml-1">Current Blood Group</label>
                                <div className="relative">
                                    <Droplets className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#85abc0]" />
                                    <select
                                        value={profile.bloodGroup}
                                        onChange={(e) => setProfile({ ...profile, bloodGroup: e.target.value })}
                                        className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl pl-11 pr-4 py-4 font-bold text-xs text-[#082e3e] focus:ring-2 focus:ring-[#85abc0]/30 outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">Choose Group</option>
                                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => <option key={g} value={g}>{g}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-[#082e3e] ml-1">Medical History & Allergies</label>
                            <div className="relative">
                                <FileText className="absolute left-4 top-4 w-4.5 h-4.5 text-[#85abc0]" />
                                <textarea
                                    rows={5}
                                    value={profile.medicalHistory || ''}
                                    onChange={(e) => setProfile({ ...profile, medicalHistory: e.target.value })}
                                    placeholder="Briefly list any chronic conditions, allergies, or past surgical records..."
                                    className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl pl-11 pr-4 py-4 font-bold text-xs text-[#082e3e] focus:ring-2 focus:ring-[#85abc0]/30 outline-none transition-all resize-none placeholder:text-slate-300"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="bg-[#082e3e] hover:bg-[#0a4053] disabled:opacity-70 text-white px-10 py-4 rounded-2xl font-black text-xs transition-all shadow-xl shadow-[#082e3e]/10 flex items-center gap-2 active:scale-95"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Health Profile
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* --- PASSWORD MODAL --- */}
            <AnimatePresence>
                {isPassModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#082e3e]/40 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-[#f8fafc]">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-[#082e3e] text-white rounded-xl shadow-md shadow-[#082e3e]/20">
                                        <KeyRound className="w-4 h-4" />
                                    </div>
                                    <h3 className="font-black text-[#082e3e] text-[11px] uppercase tracking-widest">Update Session Security</h3>
                                </div>
                                <button onClick={() => setIsPassModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X className="w-5 h-5" /></button>
                            </div>

                            <form onSubmit={handlePasswordUpdate} className="p-8 space-y-5">
                                {passError && (
                                    <div className="bg-red-50 border border-red-100 p-4 rounded-2xl text-[11px] text-red-600 font-bold flex gap-2.5 items-center animate-in shake duration-300">
                                        <AlertCircle className="w-4 h-4 shrink-0" />
                                        <span>{passError}</span>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Current Password</label>
                                        <input
                                            required type="password"
                                            value={passData.oldPassword}
                                            onChange={(e) => setPassData({ ...passData, oldPassword: e.target.value })}
                                            className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl px-4 py-3.5 font-bold text-xs text-[#082e3e] outline-none focus:ring-2 focus:ring-[#85abc0]/30 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">New Password</label>
                                        <input
                                            required type="password"
                                            value={passData.newPassword}
                                            onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })}
                                            className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl px-4 py-3.5 font-bold text-xs text-[#082e3e] outline-none focus:ring-2 focus:ring-[#85abc0]/30 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Confirm New Password</label>
                                        <input
                                            required type="password"
                                            value={passData.confirmPassword}
                                            onChange={(e) => setPassData({ ...passData, confirmPassword: e.target.value })}
                                            className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl px-4 py-3.5 font-bold text-xs text-[#082e3e] outline-none focus:ring-2 focus:ring-[#85abc0]/30 transition-all"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={passLoading}
                                    className="w-full mt-4 bg-[#082e3e] hover:bg-[#0a4053] text-white py-4.5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-lg flex justify-center items-center gap-2"
                                >
                                    {passLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Confirm Security Change
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PatientProfile;