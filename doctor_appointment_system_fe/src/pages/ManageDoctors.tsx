import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, UserPlus, ShieldAlert, Loader2, Ban, CheckCircle, Trash2, AlertCircle, Sparkles, X, Plus, Edit2, DollarSign, Award, Clipboard } from 'lucide-react';
import { getAllDoctors, registerDoctor, updateDoctorByAdmin, toggleDoctorStatus, deleteDoctor } from '../services/doctor'; // doctor services [1]
import { getSpecializations } from '../services/specialization'; // specializations dropdown [1]
import type { DoctorResponseDTO, Specialization, DoctorRegisterDTO, DoctorUpdateDTO } from '../types/types';

const ManageDoctors = () => {
    const [doctors, setDoctors] = useState<DoctorResponseDTO[]>([]);
    const [specializations, setSpecializations] = useState<Specialization[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);

    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<DoctorResponseDTO | null>(null);

    const [registerForm, setRegisterForm] = useState<DoctorRegisterDTO>({
        fullName: '',
        email: '',
        password: '',
        phoneNumber: '',
        experienceYears: 5,
        specializationId: 0,
        biography: '',
        consultationFee: 2000
    });

    const [editForm, setEditForm] = useState<DoctorUpdateDTO>({
        specializationId: 0,
        biography: '',
        consultationFee: 2000,
        experienceYears: 5
    });

    // Errors & Success Feedback States
    const [toast, setToast] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);

    const loadDoctors = async () => {
        setIsLoading(true);
        try {
            const data = await getAllDoctors();
            setDoctors(data);
        } catch (err) {
            console.error("Failed to load doctors", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadDoctors();
        const loadSpecs = async () => {
            try {
                const data = await getSpecializations();
                setSpecializations(data);
            } catch (err) { console.error(err); }
        };
        loadSpecs();
    }, []);

    const handleToggleStatus = async (id: number, name: string) => {
        setIsActionLoading(true);
        try {
            await toggleDoctorStatus(id);
            setToast(`Doctor "${name}" status toggled successfully!`);
            setTimeout(() => setToast(null), 4000);
            loadDoctors();
        } catch (err) {
            setErrorMsg("Failed to toggle doctor status.");
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleDeleteDoctor = async (id: number, name: string) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete Dr. ${name}? This action is audited.`);
        if (!confirmDelete) return;

        setIsActionLoading(true);
        try {
            await deleteDoctor(id);
            setToast(`Doctor "${name}" soft-deleted successfully!`);
            setTimeout(() => setToast(null), 4000);
            loadDoctors();
        } catch (err) {
            setErrorMsg("Failed to delete doctor.");
        } finally {
            setIsActionLoading(false);
        }
    };

    const openRegisterModal = () => {
        setRegisterForm({
            fullName: '',
            email: '',
            password: '',
            phoneNumber: '',
            experienceYears: 5,
            specializationId: 0,
            biography: '',
            consultationFee: 2000
        });
        setFormError(null);
        setIsRegisterOpen(true);
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        // Validation
        if (!registerForm.fullName || !registerForm.email || !registerForm.specializationId || registerForm.consultationFee <= 0) {
            setFormError("Please fill out all required fields with valid values.");
            return;
        }
        if (!registerForm.password || registerForm.password.length < 6) {
            setFormError("Password must be at least 6 characters.");
            return;
        }

        setIsActionLoading(true);
        try {
            await registerDoctor(registerForm);
            setToast(`Dr. ${registerForm.fullName} registered successfully!`);
            setTimeout(() => setToast(null), 4000);
            setIsRegisterOpen(false);
            loadDoctors();
        } catch (err: any) {
            setFormError(err.response?.data?.message || "Registration failed.");
        } finally {
            setIsActionLoading(false);
        }
    };

    const openEditModal = (doc: DoctorResponseDTO) => {
        setSelectedDoctor(doc);
        const spec = specializations.find(s => s.name === doc.specializationName);


        setEditForm({
            specializationId: spec ? spec.id : 0,
            biography: doc.biography,
            consultationFee: doc.consultationFee,
            experienceYears: doc.experienceYears
        });
        setFormError(null);
        setIsEditOpen(true);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        if (!selectedDoctor) return;

        setIsActionLoading(true);
        try {

            await updateDoctorByAdmin(selectedDoctor.doctorId, editForm);

            setToast(`Dr. ${selectedDoctor.fullName} credentials updated!`);
            setTimeout(() => setToast(null), 4000);
            setIsEditOpen(false);
            loadDoctors();
        } catch (err: any) {
            setFormError(err.response?.data?.message || "Update failed.");
        } finally {
            setIsActionLoading(false);
        }
    };

    // Client-side search [1]
    const filteredDoctors = doctors.filter(d =>
        d.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.specializationName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#041521] text-white p-6 md:p-8 space-y-6 animate-in fade-in duration-300">

            {/* Toast Notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="fixed top-24 right-6 md:right-12 z-50 max-w-md bg-[#082e3e] text-white border border-emerald-900/40 rounded-[1.5rem] p-4.5 shadow-2xl flex items-center gap-3.5"
                    >
                        <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 shrink-0">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                            <h4 className="font-extrabold text-xs tracking-tight text-white mb-0.5">Admin Action Logged</h4>
                            <p className="text-[11px] text-slate-355 font-medium leading-relaxed">{toast}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Welcome Banner */}
            <div className="bg-gradient-to-br from-[#082e3e] via-[#06222f] to-[#041521] rounded-[2.5rem] border border-[#0f3341] p-8 md:p-10 relative overflow-hidden text-white shadow-xl">
                <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 max-w-2xl text-left">
                    <div className="inline-flex items-center space-x-1 bg-white/5 px-3 py-1 rounded-full text-xs font-bold mb-4 border border-white/10">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        <span>MD Ledger Management</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Physician Directory</h2>
                    <p className="text-slate-400 text-sm mt-3 leading-relaxed font-semibold">
                        Register new board-certified doctors, audit clinical summaries, adjust consultation fees, and verify accounts. All registration protocols are strictly audited.
                    </p>
                </div>
            </div>

            {/* Error Display */}
            {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl p-4 flex gap-2.5 text-xs font-semibold leading-normal max-w-md text-left">
                    <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                </div>
            )}

            {/* Search and Action Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#06222f] border border-[#0f3341] p-5 rounded-3xl shadow-sm">
                <div className="relative flex-1 w-full max-w-md">
                    <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search doctors by name or specialty..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#041521] border border-[#0f3341] rounded-2xl pl-12 pr-4 py-3.5 font-bold text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                    />
                </div>

                <button
                    onClick={openRegisterModal}
                    className="w-full sm:w-auto bg-[#10b981] hover:bg-emerald-600 text-white px-6 py-3.5 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 cursor-pointer"
                >
                    <UserPlus className="w-4 h-4" />
                    <span>Register New Doctor</span>
                </button>
            </div>

            {/* Glassmorphic Dark Mode Table */}
            <div className="bg-[#06222f] border border-[#0f3341] rounded-[2.25rem] overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#041a25]/50 border-b border-[#0f3341] text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                                <th className="p-5.5">MD ID</th>
                                <th className="p-5.5">Full Name</th>
                                <th className="p-5.5">Specialization</th>
                                <th className="p-5.5">Experience</th>
                                <th className="p-5.5">Fee (LKR)</th>
                                <th className="p-5.5">Status</th>
                                <th className="p-5.5 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="text-xs font-semibold text-slate-300 divide-y divide-[#0f3341]/40">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="p-16 text-center">
                                        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                                    </td>
                                </tr>
                            ) : filteredDoctors.length > 0 ? (
                                filteredDoctors.map((doc) => (
                                    <tr key={doc.id} className="hover:bg-[#082e3e]/30 transition-colors">
                                        <td className="p-5.5 font-bold text-emerald-400">MD-#{doc.doctorId}</td>
                                        <td className="p-5.5 font-black text-white">{doc.fullName}</td>
                                        <td className="p-5.5">
                                            <span className="bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 px-2.5 py-0.5 rounded-lg font-black">
                                                {doc.specializationName}
                                            </span>
                                        </td>
                                        <td className="p-5.5">{doc.experienceYears} Years</td>
                                        <td className="p-5.5 font-bold">{doc.consultationFee.toLocaleString()}</td>
                                        <td className="p-5.5">
                                            {doc.active ? (
                                                <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                                                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                                    <span>Active</span>
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                                                    <span className="w-1.5 h-1.5 bg-rose-400 rounded-full" />
                                                    <span>Blocked</span>
                                                </span>
                                            )}
                                        </td>

                                        <td className="p-5.5 text-right">
                                            <div className="flex gap-2 justify-end">
                                                {/* Edit Profile */}
                                                <button
                                                    onClick={() => openEditModal(doc)}
                                                    className="p-2 bg-[#082e3e] hover:bg-[#0a4053] border border-[#0f3341] rounded-xl transition cursor-pointer text-slate-300 hover:text-white"
                                                    title="Edit Doctor Credentials"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>

                                                {/* Block/Unblock */}
                                                <button
                                                    onClick={() => handleToggleStatus(doc.doctorId, doc.fullName)}
                                                    disabled={isActionLoading}
                                                    className="p-2 bg-[#082e3e] hover:bg-emerald-950/30 border border-[#0f3341] hover:border-emerald-900/30 rounded-xl transition cursor-pointer text-[#8eb5ca] hover:text-emerald-400"
                                                    title="Toggle Account Status"
                                                >
                                                    <Ban className="w-4 h-4" />
                                                </button>

                                                {/* Soft Delete */}
                                                <button
                                                    onClick={() => handleDeleteDoctor(doc.doctorId, doc.fullName)}
                                                    disabled={isActionLoading}
                                                    className="p-2 bg-[#041a25] hover:bg-rose-950/30 border border-[#0f3341] hover:border-rose-900/40 rounded-xl text-slate-400 hover:text-rose-400 transition cursor-pointer"
                                                    title="Delete Doctor Record"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="p-16 text-center">
                                        <AlertCircle className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                                        <p className="text-slate-500 text-xs italic font-bold">No physicians found matching the search criteria.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- MODAL 1: REGISTER DOCTOR FORM MODAL --- */}
            <AnimatePresence>
                {isRegisterOpen && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-[#06222f] border border-[#0f3341] w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col justify-between text-white text-left"
                        >
                            <div className="p-6 border-b border-[#0f3341] flex justify-between items-center bg-[#041a25]/60">
                                <div>
                                    <h3 className="text-lg font-black text-white">Register Board-Certified Doctor</h3>
                                    <p className="text-[11px] text-emerald-400 font-bold uppercase mt-0.5">Auto-Audited Enrollment Protocols</p>
                                </div>
                                <button onClick={() => setIsRegisterOpen(false)} className="p-2 bg-[#041a25] hover:bg-[#082e3e] border border-[#0f3341] rounded-xl text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
                            </div>

                            <form onSubmit={handleRegisterSubmit} className="p-6 space-y-4 max-h-[35rem] overflow-y-auto pr-1">
                                {formError && (
                                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl p-4 flex gap-2.5 text-xs font-semibold leading-normal">
                                        <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0 mt-0.5" />
                                        <span>{formError}</span>
                                    </div>
                                )}

                                <div className="space-y-4 text-xs font-bold">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="block text-[#85abc0]">Full Name</label>
                                            <input type="text" value={registerForm.fullName} onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })} className="w-full bg-[#041521] border border-[#0f3341] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="block text-[#85abc0]">Email Address</label>
                                            <input type="email" value={registerForm.email} onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })} className="w-full bg-[#041521] border border-[#0f3341] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="block text-[#85abc0]">Account Password</label>
                                            <input type="password" value={registerForm.password} onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} className="w-full bg-[#041521] border border-[#0f3341] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="block text-[#85abc0]">Phone Number</label>
                                            <input type="text" value={registerForm.phoneNumber || ''} onChange={(e) => setRegisterForm({ ...registerForm, phoneNumber: e.target.value })} className="w-full bg-[#041521] border border-[#0f3341] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="block text-[#85abc0]">Clinical Specialization</label>
                                            <select value={registerForm.specializationId} onChange={(e) => setRegisterForm({ ...registerForm, specializationId: Number(e.target.value) })} className="w-full bg-[#041521] border border-[#0f3341] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 cursor-pointer">
                                                <option value={0}>Select Specialty</option>
                                                {specializations.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="block text-[#85abc0]">Experience (Years)</label>
                                            <input type="number" value={registerForm.experienceYears} onChange={(e) => setRegisterForm({ ...registerForm, experienceYears: Number(e.target.value) })} className="w-full bg-[#041521] border border-[#0f3341] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500" />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 w-full sm:w-1/2">
                                        <label className="block text-[#85abc0]">Consultation Fee (LKR)</label>
                                        <input type="number" value={registerForm.consultationFee} onChange={(e) => setRegisterForm({ ...registerForm, consultationFee: Number(e.target.value) })} className="w-full bg-[#041521] border border-[#0f3341] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500" />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-[#85abc0]">Professional Summary</label>
                                        <textarea placeholder="Write a brief professional summary..." value={registerForm.biography || ''} onChange={(e) => setRegisterForm({ ...registerForm, biography: e.target.value })} rows={3} className="w-full bg-[#041521] border border-[#0f3341] rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 resize-none font-semibold leading-relaxed" />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-[#0f3341] flex items-center justify-end gap-3">
                                    <button type="button" onClick={() => setIsRegisterOpen(false)} className="px-5 py-3 border border-[#0f3341] hover:bg-[#041521]/60 text-slate-400 rounded-xl font-bold text-xs cursor-pointer">Cancel</button>
                                    <button type="submit" disabled={isActionLoading} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-black text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md">{isActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />} Enroll Physician</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- MODAL 2: EDIT DOCTOR FORM MODAL --- */}
            <AnimatePresence>
                {isEditOpen && selectedDoctor && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-[#06222f] border border-[#0f3341] w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col justify-between text-white text-left"
                        >
                            <div className="p-6 border-b border-[#0f3341] flex justify-between items-center bg-[#041a25]/60">
                                <div>
                                    <h3 className="text-lg font-black text-white">Edit Physician Credentials</h3>
                                    <p className="text-[11px] text-emerald-400 font-bold uppercase mt-0.5">MD-ID: #{selectedDoctor.id}</p>
                                </div>
                                <button onClick={() => setIsEditOpen(false)} className="p-2 bg-[#041a25] hover:bg-[#082e3e] border border-[#0f3341] rounded-xl text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
                            </div>

                            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 max-h-[35rem] overflow-y-auto pr-1">
                                {formError && (
                                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl p-4 flex gap-2.5 text-xs font-semibold leading-normal">
                                        <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0 mt-0.5" />
                                        <span>{formError}</span>
                                    </div>
                                )}

                                <div className="space-y-4 text-xs font-bold">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="block text-[#85abc0]">Clinical Specialization</label>
                                            <select value={editForm.specializationId} onChange={(e) => setEditForm({ ...editForm, specializationId: Number(e.target.value) })} className="w-full bg-[#041521] border border-[#0f3341] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 cursor-pointer">
                                                <option value={0}>Select Specialty</option>
                                                {specializations.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="block text-[#85abc0]">Experience (Years)</label>
                                            <input type="number" value={editForm.experienceYears} onChange={(e) => setEditForm({ ...editForm, experienceYears: Number(e.target.value) })} className="w-full bg-[#041521] border border-[#0f3341] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500" />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 w-full sm:w-1/2">
                                        <label className="block text-[#85abc0]">Consultation Fee (LKR)</label>
                                        <input type="number" value={editForm.consultationFee} onChange={(e) => setEditForm({ ...editForm, consultationFee: Number(e.target.value) })} className="w-full bg-[#041521] border border-[#0f3341] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500" />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-[#85abc0]">Professional Summary</label>
                                        <textarea placeholder="Write a brief professional summary..." value={editForm.biography || ''} onChange={(e) => setEditForm({ ...editForm, biography: e.target.value })} rows={3} className="w-full bg-[#041521] border border-[#0f3341] rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 resize-none font-semibold leading-relaxed" />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-[#0f3341] flex items-center justify-end gap-3">
                                    <button type="button" onClick={() => setIsEditOpen(false)} className="px-5 py-3 border border-[#0f3341] hover:bg-[#041521]/60 text-slate-400 rounded-xl font-bold text-xs cursor-pointer">Cancel</button>
                                    <button type="submit" disabled={isActionLoading} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-black text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md">{isActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />} Update Credentials</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageDoctors;