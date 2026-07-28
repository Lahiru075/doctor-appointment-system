import React, { useEffect, useState } from 'react';
import { 
    Plus, Search, Edit3, Trash2, Sparkles, 
    AlertCircle, Loader2, CheckCircle, X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
    getAllSpecializations, 
    createSpecialization, 
    updateSpecialization, 
    deleteSpecialization 
} from '../services/specializationService';
import  type { SpecializationResponseDTO, SpecializationDTO } from '../types/types';

const SpecializationManagement = () => {
    // States
    const [specializations, setSpecializations] = useState<SpecializationResponseDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [toast, setToast] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSpec, setEditingSpec] = useState<SpecializationResponseDTO | null>(null);
    const [formData, setFormData] = useState<SpecializationDTO>({ name: '', description: '' });

    useEffect(() => {
        fetchSpecializations();
    }, []);

    const fetchSpecializations = async () => {
        try {
            setIsLoading(true);
            const data = await getAllSpecializations();
            setSpecializations(data);
        } catch (err) {
            setErrorMsg("Failed to load specializations.");
        } finally {
            setIsLoading(false);
        }
    };

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const handleOpenModal = (spec?: SpecializationResponseDTO) => {
        if (spec) {
            setEditingSpec(spec);
            setFormData({ name: spec.name, description: spec.description });
        } else {
            setEditingSpec(null);
            setFormData({ name: '', description: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsActionLoading(true);
        try {
            if (editingSpec) {
                await updateSpecialization(editingSpec.id, formData);
                showToast("Specialization updated successfully!");
            } else {
                await createSpecialization(formData);
                showToast("New specialization added!");
            }
            setIsModalOpen(false);
            fetchSpecializations();
        } catch (err) {
            setErrorMsg("Action failed. Please try again.");
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this specialization?")) return;
        setIsActionLoading(true);
        try {
            await deleteSpecialization(id);
            showToast("Specialization removed successfully!");
            fetchSpecializations();
        } catch (err) {
            setErrorMsg("Could not delete specialization.");
        } finally {
            setIsActionLoading(false);
        }
    };

    const filteredSpecs = specializations.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#041521] text-white p-6 md:p-8 space-y-6 animate-in fade-in duration-300">
            
            {/* Toast Notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        className="fixed top-24 right-6 z-50 bg-[#082e3e] text-white border border-emerald-900/40 rounded-2xl p-4 shadow-2xl flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                        <span className="text-xs font-bold">{toast}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header Banner */}
            <div className="bg-gradient-to-br from-[#082e3e] via-[#06222f] to-[#041521] rounded-[2.5rem] border border-[#0f3341] p-8 relative overflow-hidden shadow-xl">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="inline-flex items-center space-x-1 bg-white/5 px-3 py-1 rounded-full text-[10px] font-bold mb-4 border border-white/10">
                            <Sparkles className="w-3 h-3 text-emerald-400" />
                            <span>Clinical Directory Settings</span>
                        </div>
                        <h2 className="text-3xl font-extrabold tracking-tight">Specialization Expertises</h2>
                        <p className="text-slate-400 text-sm mt-2 font-medium">Manage medical categories and doctor classifications.</p>
                    </div>
                    <button 
                        onClick={() => handleOpenModal()}
                        className="bg-emerald-500 hover:bg-emerald-600 text-[#041521] px-6 py-3 rounded-2xl font-black text-xs transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95"
                    >
                        <Plus className="w-4 h-4" /> ADD NEW CATEGORY
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 bg-[#06222f] border border-[#0f3341] p-5 rounded-3xl shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search expertise by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#041521] border border-[#0f3341] rounded-2xl pl-12 pr-4 py-3.5 font-bold text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition-all" 
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#06222f] border border-[#0f3341] rounded-[2.25rem] overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#041a25]/50 border-b border-[#0f3341] text-emerald-400 text-[10px] font-black uppercase tracking-wider"> 
                                <th className="p-5.5 text-center w-24">ID</th>
                                <th className="p-5.5">Expertise Name</th>
                                <th className="p-5.5">Description</th>
                                <th className="p-5.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs font-semibold text-slate-300 divide-y divide-[#0f3341]/40">
                            {isLoading ? (
                                <tr><td colSpan={4} className="p-16 text-center"><Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto" /></td></tr>
                            ) : filteredSpecs.map((spec) => (
                                <tr key={spec.id} className="hover:bg-[#082e3e]/30 transition-colors">
                                    <td className="p-5.5 text-center font-bold text-emerald-400">#{spec.id}</td>
                                    <td className="p-5.5 font-black text-white">{spec.name}</td>
                                    <td className="p-5.5 text-slate-400 max-w-xs truncate">{spec.description}</td>
                                    <td className="p-5.5 text-right flex justify-end gap-2">
                                        <button onClick={() => handleOpenModal(spec)} className="p-2 bg-[#082e3e] border border-[#0f3341] rounded-xl hover:text-emerald-400 transition"><Edit3 className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(spec.id)} className="p-2 bg-[#041a25] border border-[#0f3341] rounded-xl hover:text-rose-400 transition"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#041521]/80 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#06222f] border border-[#0f3341] w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl">
                            <div className="p-6 border-b border-[#0f3341] flex justify-between items-center">
                                <h3 className="text-lg font-black text-white">{editingSpec ? 'Update Expertise' : 'New Specialization'}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white"><X className="w-5 h-5"/></button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-emerald-400 mb-1.5 block">Category Name</label>
                                    <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full bg-[#041521] border border-[#0f3341] rounded-xl px-4 py-3 text-xs font-bold text-white focus:border-emerald-500 outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-emerald-400 mb-1.5 block">Description</label>
                                    <textarea rows={4} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        className="w-full bg-[#041521] border border-[#0f3341] rounded-xl px-4 py-3 text-xs font-bold text-white focus:border-emerald-500 outline-none transition-all resize-none" />
                                </div>
                                <button disabled={isActionLoading} className="w-full bg-emerald-500 hover:bg-emerald-600 text-[#041521] py-4 rounded-xl font-black text-xs transition-all flex justify-center items-center gap-2 mt-4">
                                    {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : editingSpec ? 'SAVE CHANGES' : 'CREATE CATEGORY'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SpecializationManagement;