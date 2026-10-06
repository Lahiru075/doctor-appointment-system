import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FileText, Download, Loader2, AlertCircle, Sparkles, User, Calendar, Pill, Stethoscope } from 'lucide-react';
import { useAuth } from '../context/authContext';
import { getPatientPrescriptions } from '../services/prescription';
import type { PrescriptionResponseDTO } from '../types/types';
import jsPDF from 'jspdf';

const Prescriptions = () => {
    const { user } = useAuth();
    const [prescriptions, setPrescriptions] = useState<PrescriptionResponseDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPrescriptions = async () => {
            setIsLoading(true);
            try {
                const data = await getPatientPrescriptions(user.id);
                setPrescriptions(data);
            } catch (err) {
                console.error("Failed to load prescriptions", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPrescriptions();
    }, [user.id]);


    // Clean & Branded PDF Generation
    const handleDownload = (rx: PrescriptionResponseDTO) => {
        const doc = new jsPDF();

        // 1. Header Banner
        doc.setFillColor(8, 46, 62); // CliniQ Dark Teal
        doc.rect(0, 0, 210, 35, 'F');

        doc.setTextColor(16, 185, 129); // Emerald
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('CliniQ', 15, 20);

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('OFFICIAL MEDICAL PRESCRIPTION', 15, 27);

        // RX ID & Date
        doc.setTextColor(180, 205, 218);
        doc.setFontSize(9);
        doc.text(`RX ID: #${rx.id}`, 155, 18);
        doc.text(`Date: ${rx.createdAt || new Date().toLocaleDateString()}`, 155, 25);

        // 2. Doctor Information Box
        doc.setFillColor(241, 245, 249);
        doc.roundedRect(15, 45, 180, 24, 3, 3, 'F');

        doc.setTextColor(8, 46, 62);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(`Physician: ${rx.doctorName}`, 22, 55);

        doc.setTextColor(100, 116, 139);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(`Specialization: ${rx.specializationName}`, 22, 62);

        // 3. Clinical Diagnosis
        doc.setTextColor(225, 29, 72); // Rose
        doc.setFontSize(10.5);
        doc.setFont('helvetica', 'bold');
        doc.text('CLINICAL DIAGNOSIS', 15, 82);

        doc.setTextColor(15, 23, 42);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(rx.diagnosis || 'N/A', 15, 90);

        // Divider Line
        doc.setDrawColor(226, 232, 240);
        doc.line(15, 98, 195, 98);

        // 4. Prescribed Medications
        doc.setTextColor(16, 185, 129); // Emerald
        doc.setFontSize(10.5);
        doc.setFont('helvetica', 'bold');
        doc.text('PRESCRIBED MEDICATIONS & INSTRUCTIONS', 15, 108);

        doc.setTextColor(30, 41, 59);
        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'normal');

        const splitMedications = doc.splitTextToSize(rx.medications || 'No medications listed.', 180);
        doc.text(splitMedications, 15, 117);

        // 5. Footer Signature Line
        doc.setDrawColor(203, 213, 225);
        doc.line(140, 250, 195, 250);
        doc.setFontSize(8.5);
        doc.setTextColor(100, 116, 139);
        doc.text('Doctor Signature / Stamp', 145, 256);

        doc.setFontSize(7.5);
        doc.setTextColor(148, 163, 184);
        doc.text('Generated via CliniQ Healthcare Platform • Verified Electronic Health Record', 15, 285);

        // Save file
        doc.save(`CliniQ_Prescription_RX_${rx.id}.pdf`);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Top Banner */}
            <div className="bg-gradient-to-br from-[#8eb5ca] via-[#709eb7] to-[#082e3e] rounded-[2.5rem] border border-white p-8 md:p-10 relative overflow-hidden text-white shadow-lg">
                <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 text-left">
                    <div className="inline-flex items-center space-x-1 bg-white/15 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md mb-4 border border-white/10">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Medical Records Archive</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Clinical Prescriptions</h2>
                    <p className="text-slate-100 text-sm mt-3 leading-relaxed max-w-xl font-medium">
                        Access, review, and download your verified medical prescriptions and clinical diagnosis notes issued by your consulting physicians.
                    </p>
                </div>
            </div>

            {/* Prescriptions Grid */}
            <div className="space-y-6 text-left">
                <h3 className="text-xs font-black text-[#082e3e] uppercase tracking-widest flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#0a4053]" /> My Prescription History
                </h3>

                {isLoading ? (
                    <div className="h-64 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-[#082e3e] animate-spin" />
                    </div>
                ) : prescriptions.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {prescriptions.map((rx) => (
                            <div
                                key={rx.id}
                                className="bg-white border border-slate-200/50 rounded-[2.25rem] p-6 hover:border-slate-300 transition-all flex flex-col justify-between shadow-xs"
                            >
                                <div className="space-y-5">
                                    {/* Header: Date & ID */}
                                    <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                                        <div className="flex items-center gap-2 text-[#85abc0] font-bold text-xs">
                                            <Calendar className="w-4 h-4" />
                                            <span>{rx.createdAt}</span>
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/20">
                                            RX ID: #{rx.id}
                                        </span>
                                    </div>

                                    {/* Doctor Info */}
                                    <div className="flex gap-4 items-center">
                                        <div className="p-3 bg-[#e3edf2] text-[#0a4053] rounded-2xl border border-white shadow-3xs shrink-0">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-base font-black text-[#082e3e]">{rx.doctorName}</h4>
                                            <span className="text-[10px] font-black uppercase text-[#85abc0] tracking-wider block mt-0.5">
                                                {rx.specializationName}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Diagnosis */}
                                    <div className="bg-rose-50/50 border border-rose-100/50 rounded-2xl p-4 flex gap-3 items-start">
                                        <Stethoscope className="w-4.5 h-4.5 text-rose-500 mt-0.5 shrink-0" />
                                        <div>
                                            <span className="block text-[10px] font-black uppercase text-rose-400 tracking-wider mb-1">Clinical Diagnosis</span>
                                            <span className="text-sm font-bold text-rose-950">{rx.diagnosis}</span>
                                        </div>
                                    </div>

                                    {/* Medications */}
                                    <div className="bg-[#f8fafc] border border-slate-200/40 rounded-2xl p-4 flex gap-3 items-start">
                                        <Pill className="w-4.5 h-4.5 text-[#85abc0] mt-0.5 shrink-0" />
                                        <div className="w-full">
                                            <span className="block text-[10px] font-black uppercase text-[#85abc0] tracking-wider mb-2">Prescribed Medications</span>
                                            {/* whitespace-pre-wrap makes sure line breaks in text are shown correctly */}
                                            <div className="text-xs text-[#082e3e] font-semibold leading-relaxed whitespace-pre-wrap">
                                                {rx.medications}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Action */}
                                <div className="mt-6 pt-5 border-t border-slate-100 flex justify-end">
                                    <button 
                                        onClick={() => handleDownload(rx)}
                                        className="flex items-center gap-2 bg-[#082e3e] hover:bg-[#0a4053] text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm cursor-pointer"
                                    >
                                        <Download className="w-4 h-4" />
                                        <span>Download PDF</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Empty State Placeholder */
                    <div className="bg-white/40 border border-slate-200/50 border-dashed rounded-[2.5rem] p-16 text-center">
                        <div className="p-4 bg-[#e3edf2] text-[#0a4053] rounded-full inline-block border border-white mb-4">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <h4 className="text-base font-black text-[#082e3e] uppercase tracking-wider">No Prescriptions Found</h4>
                        <p className="text-slate-400 text-xs font-bold leading-relaxed max-w-sm mx-auto mt-2">
                            Your medical record archive is currently empty. Prescriptions will appear here once issued by your doctor after a consultation.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Prescriptions;