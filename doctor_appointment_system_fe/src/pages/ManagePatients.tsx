import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Users2, ShieldAlert, Loader2, Ban, CheckCircle, Trash2, AlertCircle, Sparkles } from 'lucide-react';
import { getAllPatients, togglePatientStatus, deletePatient } from '../services/patient'; 
import type { PatientResponseDTO } from '../types/types';

const ManagePatients = () => {
    const [patients, setPatients] = useState<PatientResponseDTO[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);
    
    // Feedback States
    const [toast, setToast] = useState<string | null>(null);
    const [errorMsg, setValidationError] = useState<string | null>(null);

    const loadPatients = async () => {
        setIsLoading(true);
        try {
            const data = await getAllPatients();
            console.log(data)
            setPatients(data);
        } catch (err) {
            console.error("Failed to load patients", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadPatients();
    }, []);

    const handleToggleStatus = async (id: number, name: string) => {
        setIsActionLoading(true);
        try {
            await togglePatientStatus(id);
            setToast(`Patient "${name}" status toggled successfully!`);
            setTimeout(() => setToast(null), 4000);
            loadPatients(); 
        } catch (err) {
            setValidationError("Failed to change patient status.");
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleDeletePatient = async (id: number, name: string) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete patient "${name}"? This action is audited.`);
        if (!confirmDelete) return;

        setIsActionLoading(true);
        try {
            await deletePatient(id);
            setToast(`Patient "${name}" soft-deleted successfully!`);
            setTimeout(() => setToast(null), 4000);
            loadPatients(); 
        } catch (err) {
            setValidationError("Failed to delete patient.");
        } finally {
            setIsActionLoading(false);
        }
    };

    const filteredPatients = patients.filter(p => 
        p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#041521] text-white p-6 md:p-8 space-y-6 animate-in fade-in duration-300">
            
            {/* Toast Notification (Emerald Glowing) */}
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
                            <h4 className="font-extrabold text-xs tracking-tight text-white mb-0.5">Admin Security Logged</h4>
                            <p className="text-[11px] text-slate-350 font-medium leading-relaxed">{toast}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Welcome Banner - Command Center Dark Emerald Theme */}
            <div className="bg-gradient-to-br from-[#082e3e] via-[#06222f] to-[#041521] rounded-[2.5rem] border border-[#0f3341] p-8 md:p-10 relative overflow-hidden text-white shadow-xl">
                <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" /> 
                
                <div className="relative z-10 max-w-2xl text-left">
                    <div className="inline-flex items-center space-x-1 bg-white/5 px-3 py-1 rounded-full text-xs font-bold mb-4 border border-white/10">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        <span>System Auditing Enabled</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Outpatients Directory</h2>
                    <p className="text-slate-400 text-sm mt-3 leading-relaxed font-semibold">
                        Audit and manage patient identities. You can activate, deactivate, or soft-delete accounts. All modifications are automatically tracked in the system audit logs.
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

            {/* Search and Quick Filters (Emerald Focused Input) */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#06222f] border border-[#0f3341] p-5 rounded-3xl shadow-sm">
                <div className="relative flex-1 w-full max-w-md">
                    <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search patients by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#041521] border border-[#0f3341] rounded-2xl pl-12 pr-4 py-3.5 font-bold text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all" 
                    />
                </div>

                <div className="text-right shrink-0">
                    <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider block">Total Managed</span>
                    <span className="text-base font-black text-emerald-400 bg-emerald-950/10 border border-emerald-900/30 px-3.5 py-1 rounded-xl block mt-1"> 
                        {patients.length} Registered Patients
                    </span>
                </div>
            </div>

            {/* Glassmorphic Dark Mode Table */}
            <div className="bg-[#06222f] border border-[#0f3341] rounded-[2.25rem] overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        {/* Table Header */}
                        <thead>
                            <tr className="bg-[#041a25]/50 border-b border-[#0f3341] text-emerald-400 text-[10px] font-black uppercase tracking-wider"> 
                                <th className="p-5.5">Patient ID</th>
                                <th className="p-5.5">Full Name</th>
                                <th className="p-5.5">Email Address</th>
                                <th className="p-5.5">Phone Number</th>
                                <th className="p-5.5">Blood</th>
                                <th className="p-5.5">Status</th>
                                <th className="p-5.5 text-right">Actions</th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody className="text-xs font-semibold text-slate-300 divide-y divide-[#0f3341]/40">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="p-16 text-center">
                                        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto" /> 
                                    </td>
                                </tr>
                            ) : filteredPatients.length > 0 ? (
                                filteredPatients.map((patient) => (
                                    <tr key={patient.id} className="hover:bg-[#082e3e]/30 transition-colors">
                                        {/* Patient ID */}
                                        <td className="p-5.5 font-bold text-emerald-400">PT-#{patient.id}</td>
                                        
                                        {/* Full Name */}
                                        <td className="p-5.5 font-black text-white">{patient.fullName}</td>
                                        
                                        {/* Email */}
                                        <td className="p-5.5 text-slate-400">{patient.email}</td>
                                        
                                        {/* Phone */}
                                        <td className="p-5.5">{patient.phoneNumber || 'N/A'}</td>
                                        
                                        {/* Blood Group */}
                                        <td className="p-5.5">
                                            <span className="bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 px-2.5 py-0.5 rounded-lg font-black"> 
                                                {patient.bloodGroup || 'N/A'}
                                            </span>
                                        </td>
                                        
                                        {/* Status Badge */}
                                        <td className="p-5.5">
                                            {patient.active ? (
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

                                        {/* Actions (Toggle & Delete) */}
                                        <td className="p-5.5 text-right">
                                            <div className="flex gap-2 justify-end">
                                                {/* Block/Unblock Toggle */}
                                                <button
                                                    onClick={() => handleToggleStatus(patient.id, patient.fullName)}
                                                    disabled={isActionLoading}
                                                    className={`p-2 bg-[#082e3e] hover:bg-emerald-950/30 border border-[#0f3341] hover:border-emerald-900/30 rounded-xl transition cursor-pointer text-[#8eb5ca] ${
                                                        patient.isActive ? 'hover:text-rose-400' : 'hover:text-emerald-400'
                                                    }`}
                                                    title={patient.isActive ? "Block Account" : "Unblock Account"}
                                                >
                                                    <Ban className="w-4 h-4" />
                                                </button>

                                                {/* Soft Delete */}
                                                <button
                                                    onClick={() => handleDeletePatient(patient.id, patient.fullName)}
                                                    disabled={isActionLoading}
                                                    className="p-2 bg-[#041a25] hover:bg-rose-950/30 border border-[#0f3341] hover:border-rose-900/40 rounded-xl text-slate-400 hover:text-rose-400 transition cursor-pointer"
                                                    title="Delete Patient Record"
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
                                        <p className="text-slate-500 text-xs italic font-bold">No outpatients found matching the search criteria.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManagePatients;