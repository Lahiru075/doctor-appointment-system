import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Clipboard, DollarSign, Award, Save, Loader2, CheckCircle2, AlertCircle, Sparkles, Lock, KeyRound, X } from 'lucide-react';
import { useAuth } from '../context/authContext';
import { updateDoctorProfile, getDoctorProfile } from '../services/doctor';
import { changeDoctorPassword } from '../services/doctor';
import type { DoctorResponseDTO, PasswordChangeDTO } from "../types/types";

const DoctorProfile = () => {
    const { user } = useAuth();

    // Form and Data States
    const [profile, setProfile] = useState<DoctorResponseDTO>({
        id: 0,
        userId: 0,
        fullName: '',
        email: '',
        active: true,
        experienceYears: 5,
        specializationName: '',
        consultationFee: 2000,
        biography: '',
        averageRating: 0
    });

    // UI States
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);

    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordData, setPasswordData] = useState<PasswordChangeDTO>({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    useEffect(() => {
        const loadProfileData = async () => {
            setIsLoading(true);
            try {

                const res = await getDoctorProfile(user.id);
                setProfile(res);
            } catch (err) {
                console.error("Failed to load doctor profile", err);
            } finally {
                setIsLoading(false);
            }
        };
        loadProfileData();
    }, [user.id]);

    const handleChange = (field: keyof DoctorResponseDTO, value: any) => {
        setProfile(prev => ({ ...prev, [field]: value }));
        setValidationError(null);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (profile.consultationFee <= 0) {
            setValidationError("Consultation fee must be a positive number.");
            return;
        }
        if (profile.experienceYears < 0) {
            setValidationError("Experience years cannot be negative.");
            return;
        }

        setIsSaving(true);
        setValidationError(null);

        try {

            await updateDoctorProfile(user.id, {
                biography: profile.biography,
                consultationFee: profile.consultationFee,
                experienceYears: profile.experienceYears
            });

            setToastMessage("Professional profile updated successfully!");
            setTimeout(() => setToastMessage(null), 4000);
        } catch (err) {
            setValidationError("Failed to save profile. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError(null);
        setPasswordLoading(true);

        try {
            await changeDoctorPassword(user.id, passwordData);
            setToastMessage("Password updated successfully!");
            setIsPasswordModalOpen(false);
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => setToastMessage(null), 4000);
        } catch (err: any) {
            setPasswordError(err || "Failed to change password.");
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-16 animate-in fade-in duration-300">

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
                            <h4 className="font-extrabold text-xs tracking-tight text-white mb-0.5">Registry Sync Complete</h4>
                            <p className="text-[11px] text-slate-300 font-medium leading-relaxed">{toastMessage}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header Welcome Banner */}
            <div className="bg-gradient-to-br from-[#8eb5ca] via-[#709eb7] to-[#082e3e] rounded-[2.5rem] border border-white p-8 relative overflow-hidden text-white shadow-lg">
                <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 max-w-xl text-left">
                    <div className="inline-flex items-center space-x-1 bg-white/15 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md mb-4 border border-white/10">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>MD Identity Gateway</span>
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight">Professional Profile</h2>
                    <p className="text-slate-100 text-sm mt-3 leading-relaxed font-semibold">
                        Keep your clinical summary, consultation fees, and experience log synchronized to provide accurate diagnostics matching to outpatient searches.
                    </p>
                </div>
            </div>

            {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-[#082e3e] animate-spin" />
                </div>
            ) : (
                <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

                    {/* Left Column: Read-only Identity Card (1 column) */}
                    <div className="md:col-span-1 bg-white border border-slate-200/50 rounded-[2.25rem] p-6 shadow-xs space-y-5 text-left">
                        <span className="block text-[10px] font-black uppercase text-[#85abc0] tracking-wider mb-2">Verified Identity</span>

                        <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
                            <div className="p-3 bg-[#e3edf2] text-[#0a4053] rounded-2xl border border-white shadow-3xs shrink-0">
                                <User className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                                <h4 className="font-extrabold text-[#082e3e] text-sm truncate">{profile.fullName}</h4>
                                <span className="text-[10px] text-slate-400 font-bold uppercase block mt-0.5">{user.role}</span>
                            </div>
                        </div>

                        <div className="space-y-3.5 text-xs">
                            <div>
                                <span className="text-slate-400 font-bold block">Email Address</span>
                                <span className="font-extrabold text-[#082e3e] mt-0.5 block truncate">{profile.email}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 font-bold block">Clinical Specialization</span>
                                <span className="inline-block bg-[#e3edf2] text-[#0a4053] text-[10px] font-black px-3 py-1 rounded-full uppercase border border-white mt-1">
                                    {profile.specializationName}
                                </span>
                            </div>
                        </div>

                        {/* // */}
                        <button
                            type="button"
                            onClick={() => setIsPasswordModalOpen(true)}
                            className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 bg-[#e3edf2] hover:bg-[#d0e0eb] border border-[#8eb5ca]/40 rounded-2xl text-[10px] font-black uppercase text-[#082e3e] transition-all cursor-pointer shadow-sm active:scale-[0.98] group"
                        >
                            <Lock className="w-3.5 h-3.5 text-[#0a4053] group-hover:scale-110 transition-transform" />
                            Update Credentials
                        </button>
                    </div>

                    {/* Right Column: Editable Profile Fields (2 columns) */}
                    <div className="md:col-span-2 bg-white border border-slate-200/50 rounded-[2.25rem] p-6.5 shadow-xs space-y-6 text-left">
                        <span className="block text-[10px] font-black uppercase text-[#85abc0] tracking-wider">Configure Profile Settings</span>

                        {validationError && (
                            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex gap-2.5 text-xs text-red-800 font-semibold leading-normal">
                                <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0 mt-0.5" />
                                <span>{validationError}</span>
                            </div>
                        )}

                        <div className="space-y-4">
                            {/* Consultation Fee */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-xs font-extrabold text-[#082e3e]">Consultation Fee (LKR)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                        <input
                                            type="number"
                                            value={profile.consultationFee}
                                            onChange={(e) => handleChange('consultationFee', Number(e.target.value))}
                                            className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl pl-10 pr-4 py-3 font-bold text-xs text-[#082e3e] focus:outline-none focus:ring-2 focus:ring-[#8eb5ca]/30 focus:border-[#8eb5ca]"
                                        />
                                    </div>
                                </div>

                                {/* Experience Years */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-extrabold text-[#082e3e]">Experience (Years)</label>
                                    <div className="relative">
                                        <Award className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                        <input
                                            type="number"
                                            value={profile.experienceYears}
                                            onChange={(e) => handleChange('experienceYears', Number(e.target.value))}
                                            className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl pl-10 pr-4 py-3 font-bold text-xs text-[#082e3e] focus:outline-none focus:ring-2 focus:ring-[#8eb5ca]/30 focus:border-[#8eb5ca]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Biography Textarea */}
                            <div className="space-y-2">
                                <label className="block text-xs font-extrabold text-[#082e3e]">Professional Biography</label>
                                <div className="relative">
                                    <Clipboard className="absolute left-4 top-4.5 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
                                    <textarea
                                        placeholder="Write a brief professional summary about your medical practice and experience..."
                                        value={profile.biography}
                                        onChange={(e) => handleChange('biography', e.target.value)}
                                        rows={4}
                                        className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 font-bold text-xs text-[#082e3e] focus:outline-none focus:ring-2 focus:ring-[#8eb5ca]/30 focus:border-[#8eb5ca] resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="pt-2 flex justify-end">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="bg-[#082e3e] hover:bg-[#0a4053] disabled:bg-[#082e3e]/70 text-white px-8 py-3.5 rounded-2xl font-black text-xs transition-all shadow-md cursor-pointer flex items-center gap-2"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                <span>Save Changes</span>
                            </button>
                        </div>
                    </div>
                </form>
            )}
            {/* // */}
            <AnimatePresence>
                {isPasswordModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#082e3e]/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-md rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-[#082e3e] text-white rounded-xl shadow-lg shadow-[#082e3e]/20">
                                        <KeyRound className="w-4 h-4" />
                                    </div>
                                    <h3 className="font-black text-[#082e3e] text-sm uppercase tracking-tight">Change Password</h3>
                                </div>
                                <button onClick={() => setIsPasswordModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handlePasswordChange} className="p-8 space-y-5">
                                {passwordError && (
                                    <div className="bg-red-50 border border-red-100 p-3.5 rounded-2xl text-[11px] text-red-600 font-bold flex gap-2 items-center">
                                        <AlertCircle className="w-4 h-4 shrink-0" />
                                        {passwordError}
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div className="space-y-1.5 text-left">
                                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Current Password</label>
                                        <input
                                            required type="password"
                                            value={passwordData.oldPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                            className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl px-4 py-3 font-bold text-xs focus:ring-2 focus:ring-[#8eb5ca]/30 focus:border-[#8eb5ca] outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1.5 text-left">
                                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">New Password</label>
                                        <input
                                            required type="password"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl px-4 py-3 font-bold text-xs focus:ring-2 focus:ring-[#8eb5ca]/30 focus:border-[#8eb5ca] outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1.5 text-left">
                                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Confirm New Password</label>
                                        <input
                                            required type="password"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl px-4 py-3 font-bold text-xs focus:ring-2 focus:ring-[#8eb5ca]/30 focus:border-[#8eb5ca] outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={passwordLoading}
                                    className="w-full bg-[#082e3e] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#082e3e]/20 hover:bg-[#0a4053] transition-all flex justify-center items-center gap-2"
                                >
                                    {passwordLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Confirm Change
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DoctorProfile;