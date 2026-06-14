import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
    Heart,
    Sparkles,
    Search,
    Calendar,
    CheckCircle2,
    PhoneCall,
    Stethoscope,
    Star,
    ShieldCheck,
    ArrowRight,
    ChevronRight,
    MapPin,
    Smile,
    Zap,
    Activity,
    HeartPulse,
    Award,
    Video
} from 'lucide-react';

interface Doctor {
    name: string;
    specialty: string;
    rating: number;
    reviews: string;
    experience: string;
    patients: string;
    price: string;
    color: string;
    bgDark: boolean;
    avatarId: string;
}

const Landing = () => {
    const navigate = useNavigate();

    // Interactive States
    const [selectedSpecialty, setSelectedSpecialty] = useState<string>('General Visits');
    const [selectedHeroDate, setSelectedHeroDate] = useState<number>(24);

    // Doctors data
    const doctors: Doctor[] = [
        {
            name: 'Dr. Sarah Johnson',
            specialty: 'Medicine Specialist',
            rating: 4.6,
            reviews: '2.8k +',
            experience: '8 Years',
            patients: '3.5k +',
            price: '$89',
            color: '#abc9d8',
            bgDark: false,
            avatarId: 'sarah'
        },
        {
            name: 'Dr. Ching Ming Yu',
            specialty: 'Cardiovascular Specialist',
            rating: 4.9,
            reviews: '4.2k +',
            experience: '12 Years',
            patients: '5.1k +',
            price: '$289',
            color: '#082e3e',
            bgDark: true,
            avatarId: 'ching'
        }
    ];

    // Specialty options
    const specialties = [
        { name: 'General Visits', price: '~$89', icon: Stethoscope, desc: 'Primary diagnosis & wellness screening' },
        { name: 'Specialist Visits', price: '~$289', icon: Award, desc: 'Advanced tailored clinical care' },
        { name: 'Medical Tests', price: '~$179', icon: Activity, desc: 'Diagnostic imaging & blood analysis' },
        { name: 'Therapeutic', price: '~$55', icon: HeartPulse, desc: 'Rehabilitation & somatic recovery' }
    ];

    // Selected Doctor details for appointment calculator
    const [calcDoctor, setCalcDoctor] = useState<Doctor>(doctors[0]);
    const [calcDate, setCalcDate] = useState<string>('2026-06-24');
    const [calcTime, setCalcTime] = useState<string>('08:30 AM');
    const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

    const handleBookingTest = (e: React.FormEvent) => {
        e.preventDefault();
        setBookingSuccess(true);
        setTimeout(() => setBookingSuccess(false), 5000);
    };

    return (
        <div id="landing-root" className="min-h-screen bg-gradient-to-tr from-[#abc9d8]/30 via-[#f4f8fa] to-white font-sans text-[#082e3e] flex flex-col antialiased selection:bg-[#abc9d8]/50 overflow-x-hidden">

            {/* Decorative Top Mesh Grid Background */}
            <div className="absolute top-0 left-0 right-0 h-[600px] bg-[linear-gradient(to_bottom,rgba(142,181,202,0.1)_0%,rgba(244,248,2fa,0)_100%)] pointer-events-none" />

            {/* Header / Navbar */}
            <nav id="main-nav" className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-white/50 px-6 py-4 transition-all">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2.5">
                        <div className="p-2 bg-[#e3edf2] rounded-2xl border border-white shrink-0">
                            <Heart className="w-6 h-6 text-[#082e3e]" />
                        </div>
                        <span className="text-2xl font-black tracking-tight text-[#082e3e]">
                            Clini<span className="text-[#86abc0]">Q</span>
                        </span>
                    </Link>

                    {/* Nav middle links */}
                    <div className="hidden md:flex items-center space-x-8 text-sm font-semibold">
                        <a href="#specialties" className="hover:text-[#86abc0] transition-colors">Our Services</a>
                        <a href="#doctors" className="hover:text-[#86abc0] transition-colors">Specialists</a>
                        <a href="#interactive-demo" className="hover:text-[#86abc0] transition-colors">Live Scheduler</a>
                        <a href="#security" className="hover:text-[#86abc0] transition-colors">JWT Security</a>
                    </div>

                    {/* Action CTA Buttons */}
                    <div className="flex items-center space-x-3">
                        <Link
                            to="/login"
                            className="text-xs sm:text-sm font-bold text-[#082e3e] px-4 py-2 hover:bg-[#e3edf2]/70 rounded-full transition-all"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/register"
                            className="text-xs sm:text-sm font-black bg-[#082e3e] hover:bg-[#0a4053] text-white px-5 py-2.5 rounded-full shadow-lg shadow-[#082e3e]/10 transition-all active:scale-[0.98]"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section id="hero" className="relative max-w-7xl w-full mx-auto px-6 pt-12 pb-20 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                {/* Left Side Content */}
                <div className="lg:col-span-6 space-y-8 text-left z-10">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center space-x-2 bg-[#e3edf2] border border-white px-4 py-1.5 rounded-full text-xs font-bold text-[#0a4053] shadow-2xs"
                    >
                        <Sparkles className="w-4 h-4 text-[#86abc0]" />
                        <span>Next Generation AI-Guided Clinic Scheduling</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] text-[#082e3e]"
                    >
                        Let's find <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#082e3e] via-[#4d86a4] to-[#86abc0]">your perfect. <br />healthcare guide.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-600 font-medium text-sm sm:text-base leading-relaxed max-w-lg"
                    >
                        Welcome to <strong>CliniQ</strong>. Book certified specialist doctors, manage prescriptions, track healthcare telemetry, and verify permissions inside our safe role-based Spring Boot & React platform.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-wrap gap-4 pt-2"
                    >
                        <Link
                            to="/register"
                            className="flex items-center space-x-2 bg-[#082e3e] hover:bg-[#0a4053] text-white font-extrabold px-7 py-4 rounded-2xl shadow-xl shadow-[#082e3e]/15 transition-all text-sm group"
                        >
                            <span>Register Patient Account</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/login"
                            className="flex items-center space-x-2 bg-white hover:bg-slate-50 border border-slate-200 text-[#082e3e] font-extrabold px-6 py-4 rounded-2xl transition-all text-sm"
                        >
                            <span>Enter Staff Portal</span>
                        </Link>
                    </motion.div>

                    {/* Live Trust Telemetry */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="pt-6 border-t border-slate-200/60 max-w-md grid grid-cols-3 gap-4"
                    >
                        <div>
                            <span className="block text-2xl font-black text-[#082e3e]">8 Years</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">Clinical Expert Level</span>
                        </div>
                        <div>
                            <span className="block text-2xl font-black text-[#082e3e]">3.5k +</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">Active Safe Patients</span>
                        </div>
                        <div>
                            <span className="block text-2xl font-black text-[#082e3e]">2.8k +</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">Verified Reviews</span>
                        </div>
                    </motion.div>
                </div>

                {/* Right Side Visuals - Symmetrical Mobile App Screens */}
                <div className="lg:col-span-6 relative flex flex-col sm:flex-row items-center justify-center gap-6 mt-10 lg:mt-0">

                    {/* Decorative Back Glow Blobs */}
                    <div className="absolute w-80 h-80 rounded-full bg-[#abc9d8]/40 blur-3xl -top-10 -right-10 pointer-events-none" />
                    <div className="absolute w-80 h-80 rounded-full bg-[#e3edf2]/60 blur-3xl -bottom-10 -left-10 pointer-events-none" />

                    {/* Mock Mobile Screen 1: CliniQ Booking Details page */}
                    <motion.div
                        initial={{ opacity: 0, x: -30, y: 10 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full max-w-[280px] bg-[#f4f8fa] rounded-[2.5rem] border-8 border-white shadow-2xl relative overflow-hidden flex flex-col"
                    >
                        {/* Status bar */}
                        <div className="px-5 pt-3.5 pb-2 flex justify-between items-center text-[10px] font-extrabold text-slate-400">
                            <span>9:41 AM</span>
                            <div className="w-16 h-4.5 bg-[#abc9d8]/30 rounded-full absolute left-1/2 -translate-x-1/2 top-1 border border-white/20" />
                            <div className="flex items-center space-x-1">
                                <span>LTE</span>
                                <span className="w-2.5 h-1.5 bg-slate-400 rounded-xs" />
                            </div>
                        </div>

                        {/* Profile area */}
                        <div className="p-4 bg-gradient-to-b from-[#abc9d8]/70 text-[#082e3e] flex-1 flex flex-col justify-between relative overflow-hidden">
                            <div className="flex justify-between items-center mb-2.5">
                                <button className="p-1.5 bg-white/70 backdrop-blur-md rounded-full shadow-xs text-[#082e3e]">
                                    <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                                </button>
                                <button className="p-1.5 bg-white/70 backdrop-blur-md rounded-full shadow-xs text-[#0a4053]">
                                    <Heart className="w-3.5 h-3.5 fill-[#0a4053]" />
                                </button>
                            </div>

                            {/* Styled CSS Vector Medical Avatar */}
                            <div className="w-28 h-28 mx-auto bg-gradient-to-tr from-[#abc9d8] to-white rounded-full border-4 border-white/80 overflow-hidden relative shadow-sm mt-2">
                                <div className="absolute inset-0 flex items-center justify-center pt-4">
                                    <div className="w-14 h-14 bg-[#082e3e] rounded-full absolute bottom-[-4px] border-2 border-white" />
                                    <div className="w-10 h-10 bg-[#e3edf2] rounded-full absolute bottom-8 border border-[#082e3e]/30 flex items-center justify-center">
                                        <Smile className="w-6 h-6 text-[#082e3e]" />
                                    </div>
                                    <div className="absolute w-12 h-[3px] bg-[#abc9d8] bottom-7 rotate-45" />
                                    <div className="absolute w-12 h-[3px] bg-[#abc9d8] bottom-7 -rotate-45" />
                                </div>
                            </div>

                            <div className="text-center mt-3">
                                <div className="inline-flex items-center space-x-1 bg-white/60 backdrop-blur px-2 py-0.5 rounded-full text-[9px] font-black border border-white">
                                    <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                                    <span>4.6 Rating</span>
                                </div>
                                <h4 className="font-extrabold text-[#082e3e] text-base mt-1 leading-tight">Dr. Sarah Johnson</h4>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">MBBS, MD Medicine Specialist</p>
                            </div>

                            {/* Stats buttons overlay */}
                            <div className="grid grid-cols-3 gap-1 bg-white/80 backdrop-blur p-1.5 rounded-2xl border border-white/60 mt-4 text-[9px] font-black">
                                <div className="text-center p-1 bg-white rounded-xl">
                                    <span className="text-[#86abc0] block text-[8px] uppercase">Exp</span>
                                    <span className="text-[#082e3e]">8 Years</span>
                                </div>
                                <div className="text-center p-1">
                                    <span className="text-slate-400 block text-[8px] uppercase">Patients</span>
                                    <span className="text-[#082e3e]">3.5k+</span>
                                </div>
                                <div className="text-center p-1">
                                    <span className="text-slate-400 block text-[8px] uppercase">Reviews</span>
                                    <span className="text-[#082e3e]">2.8k+</span>
                                </div>
                            </div>
                        </div>

                        {/* Date and time options */}
                        <div className="bg-white p-4 space-y-4">
                            <div>
                                <div className="flex justify-between items-center text-[10px] font-black tracking-tight text-slate-400">
                                    <span>Select Date</span>
                                    <span className="text-slate-600 flex items-center">June <ChevronRight className="w-2.5 h-2.5 ml-0.5" /></span>
                                </div>
                                <div className="flex justify-between gap-1 mt-2">
                                    {[22, 23, 24, 25].map((day) => (
                                        <button
                                            key={day}
                                            onClick={() => setSelectedHeroDate(day)}
                                            className={`flex-1 py-1.5 rounded-xl border flex flex-col items-center justify-center transition-all ${selectedHeroDate === day
                                                    ? 'bg-[#082e3e] text-white border-[#082e3e] shadow-md'
                                                    : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100'
                                                }`}
                                        >
                                            <span className="text-[11px] font-extrabold">{day}</span>
                                            <span className="text-[7px] uppercase tracking-wider">
                                                {day === 22 ? 'Fri' : day === 23 ? 'Sat' : day === 24 ? 'Sun' : 'Mon'}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/register')}
                                className="w-full bg-[#082e3e] hover:bg-[#0a4053] text-white text-xs font-bold py-3 rounded-xl transition shadow-md cursor-pointer text-center block"
                            >
                                Book Session
                            </button>
                        </div>
                    </motion.div>

                    {/* Mock Mobile Screen 2: Specialties categories page */}
                    <motion.div
                        initial={{ opacity: 0, x: 30, y: -10 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full max-w-[280px] bg-[#f4f8fa] rounded-[2.5rem] border-8 border-white shadow-2xl relative overflow-hidden hidden sm:flex flex-col"
                    >
                        <div className="p-5 pb-2 flex justify-between items-center">
                            <span className="font-black text-sm tracking-tight text-[#082e3e]">Clini<span className="text-[#86abc0]">Q</span></span>
                            <div className="flex items-center space-x-2">
                                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full block animate-pulse" />
                                <span className="text-[9px] font-extrabold text-slate-400">Live MD Queue</span>
                            </div>
                        </div>

                        <div className="px-5 pt-2 pb-4">
                            <h3 className="text-xs font-black text-slate-400">Let's find</h3>
                            <h2 className="text-lg font-black text-[#082e3e] mt-0.5 leading-tight">your doctor</h2>

                            <div className="relative mt-3">
                                <Search className="absolute w-3.5 h-3.5 left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    disabled
                                    placeholder="Specialist, Symptom, Location..."
                                    className="w-full bg-white border border-slate-200/60 rounded-xl py-2 pl-8 pr-2 text-[10px] text-slate-400 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="px-5 pb-5 flex-1 space-y-3">
                            {[
                                { name: 'General Visits', cost: '~$89', highlight: false },
                                { name: 'Specialist Visits', cost: '~$289', highlight: false },
                                { name: 'Medical Tests', cost: '~$179', highlight: false },
                                { name: 'Therapeutic', cost: '~$55', highlight: true }
                            ].map((spec, i) => (
                                <div
                                    key={i}
                                    className={`p-3 rounded-2xl border transition-all flex justify-between items-center ${spec.highlight
                                            ? 'bg-[#082e3e] text-white border-[#082e3e] shadow-md'
                                            : 'bg-white text-[#082e3e] border-slate-200/50 hover:border-slate-300'
                                        }`}
                                >
                                    <div>
                                        <h5 className="font-extrabold text-xs">{spec.name}</h5>
                                        <span className={`text-[10px] block mt-1.5 font-bold ${spec.highlight ? 'text-slate-300' : 'text-slate-400'}`}>
                                            {spec.cost} <span className="font-normal text-[8px]/none">/ per session</span>
                                        </span>
                                    </div>

                                    <div className={`p-2 rounded-xl shrink-0 ${spec.highlight ? 'bg-white/10 text-white' : 'bg-[#f4f8fa] text-[#0a4053]'}`}>
                                        <ChevronRight className="w-3 h-3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                </div>
            </section>

            {/* Specialties Section */}
            <section id="specialties" className="bg-white py-20 border-t border-slate-200/40 relative">
                <div className="max-w-7xl mx-auto px-6">

                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                        <span className="text-[#86abc0] text-xs font-black uppercase tracking-wider block">Clinical Offerings</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-[#082e3e]">Let's find your designated care</h2>
                        <p className="text-slate-500 font-medium text-sm">
                            Explore diagnostics tiers featured in CliniQ. Select categories to examine typical clinical fee models and triage systems.
                        </p>
                    </div>

                    {/* Specialties Categories Switcher */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {specialties.map((spec) => {
                            const IconComp = spec.icon;
                            const isSelected = selectedSpecialty === spec.name;

                            return (
                                <div
                                    key={spec.name}
                                    onClick={() => setSelectedSpecialty(spec.name)}
                                    className={`p-6 rounded-[2rem] border transition-all duration-300 cursor-pointer flex flex-col justify-between h-56 ${isSelected
                                            ? 'bg-[#082e3e] text-white border-[#082e3e] shadow-xl -translate-y-2'
                                            : 'bg-[#f4f8fa] text-[#082e3e] border-[#abc9d8]/20 hover:border-[#abc9d8]/50 hover:bg-[#eaf1f4]/40 hover:-translate-y-1'
                                        }`}
                                >
                                    <div className="space-y-4">
                                        <div className={`p-3.5 rounded-2xl w-fit border ${isSelected ? 'bg-white/10 border-white/20 text-white' : 'bg-white border-slate-200/50 text-[#0a4053]'
                                            }`}>
                                            <IconComp className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-extrabold text-lg leading-tight">{spec.name}</h3>
                                            <p className={`text-xs mt-1.5 leading-relaxed font-semibold transition-all ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                                                {spec.desc}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-4 border-t border-dashed border-slate-200/20">
                                        <span className="text-xs font-black">Starting rate</span>
                                        <span className="text-sm font-extrabold">{spec.price}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-12 bg-[#f4f8fa] border border-slate-200/50 rounded-[2rem] p-8 flex flex-col lg:flex-row justify-between items-center gap-8">
                        <div className="space-y-3 max-w-xl">
                            <div className="inline-flex items-center space-x-1.5 bg-[#e3edf2] px-3.5 py-1 rounded-full text-xs font-extrabold text-[#082e3e]">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Selected Focus: {selectedSpecialty}</span>
                            </div>
                            <h3 className="text-2xl font-extrabold text-[#082e3e]">Instant Treatment Assignment</h3>
                            <p className="text-slate-600 font-semibold text-xs leading-relaxed">
                                Under CliniQ role protocols, you can register immediately as a patient. Our queue system then matches you with specialized experts. Spring Security tokens handle credentials state safely across all clinic network nodes.
                            </p>
                        </div>
                        <div className="flex gap-4 shrink-0">
                            <Link
                                to="/register"
                                className="bg-[#082e3e] hover:bg-[#0a4053] text-white font-extrabold px-6 py-3.5 rounded-xl text-xs transition duration-200 shadow-md cursor-pointer"
                            >
                                Register & Book Doctor
                            </Link>
                        </div>
                    </div>

                </div>
            </section>

            {/* Meet Our Specialists section */}
            <section id="doctors" className="bg-gradient-to-b from-white to-[#f4f8fa] py-20 relative">
                <div className="max-w-7xl mx-auto px-6">

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
                        <div className="space-y-3 max-w-xl">
                            <span className="text-[#86abc0] text-xs font-black uppercase tracking-wider block">Clinical Staff</span>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-[#082e3e]">Consult leading medical professionals</h2>
                            <p className="text-slate-500 font-medium text-sm">
                                Connect with peer-reviewed MD specialists directly. Our doctor dashboard empowers practitioners to process incoming patient queues smoothly.
                            </p>
                        </div>
                        <Link
                            to="/register"
                            className="text-xs font-black bg-[#e3edf2] hover:bg-[#d4e4ee] text-[#082e3e] border border-white px-5 py-3 rounded-xl transition duration-200 flex items-center gap-1.5"
                        >
                            <span>See All Outpatient Doctors</span>
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Doctor profiles matching CliniQ */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {doctors.map((doc) => (
                            <div
                                key={doc.name}
                                className="bg-white border border-slate-200/50 rounded-[2.5rem] p-8 md:p-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-xs relative overflow-hidden"
                            >
                                {doc.bgDark && (
                                    <div className="absolute right-0 top-0 w-2.5 h-full bg-[#86abc0]" />
                                )}

                                <div className="space-y-6 flex-1">
                                    <div>
                                        <div className="inline-flex items-center space-x-1 mb-3">
                                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                            <span className="text-xs font-black text-[#082e3e]">{doc.rating}</span>
                                            <span className="text-[10px] text-slate-400 font-bold">({doc.reviews})</span>
                                        </div>

                                        <h3 className="text-2xl font-black text-[#082e3e] leading-tight">{doc.name}</h3>
                                        <p className="text-xs text-slate-400 font-extrabold uppercase mt-1 tracking-wider">{doc.specialty}</p>
                                    </div>

                                    {/* Doctor stats metrics */}
                                    <div className="grid grid-cols-3 gap-3 bg-[#f4f8fa] p-3 rounded-2xl text-[11px] font-black border border-slate-200/10">
                                        <div>
                                            <span className="text-slate-400 text-[9px] uppercase block">Experience</span>
                                            <span className="text-[#082e3e] mt-0.5 block">{doc.experience}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-400 text-[9px] uppercase block">Clients</span>
                                            <span className="text-[#082e3e] mt-0.5 block">{doc.patients}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-400 text-[9px] uppercase block">Direct Rate</span>
                                            <span className="text-[#0a4053] mt-0.5 block">{doc.price}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center justify-between h-full space-y-4 shrink-0 w-full sm:w-auto">
                                    <div className="w-24 h-24 rounded-full bg-[#e3edf2] relative overflow-hidden border border-slate-200/60 shadow-xs flex items-center justify-center">
                                        <span className="font-extrabold text-[#0a4053] text-xl">
                                            {doc.name.split(' ').slice(1).join(' ').substring(0, 2).toUpperCase()}
                                        </span>
                                        <div className="absolute bottom-1 w-12 h-1 bg-[#86abc0] rounded-full" />
                                    </div>

                                    <button
                                        onClick={() => {
                                            setCalcDoctor(doc);
                                            const target = document.getElementById('interactive-demo');
                                            if (target) {
                                                target.scrollIntoView({ behavior: 'smooth' });
                                            }
                                        }}
                                        className="w-full sm:w-auto bg-[#0a4053] hover:bg-[#082e3e] text-white text-xs font-extrabold px-5 py-3 rounded-xl transition duration-200 shadow-xs cursor-pointer"
                                    >
                                        Calculate Cost
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            {/* Interactive Appointment Calculator Widget Section */}
            <section id="interactive-demo" className="py-20 bg-white border-t border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                    {/* Information */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="inline-flex items-center space-x-1 bg-[#e3edf2] px-3.5 py-1 rounded-full text-xs font-extrabold text-[#082e3e]">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Interactive Simulator</span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#082e3e] tracking-tight">
                            Test your booking layout instantly
                        </h2>

                        <p className="text-slate-500 font-medium text-sm leading-relaxed">
                            Use this interactive widget to calculate diagnostic packages. Simply change doctor, choose date parameters and inspect pricing outputs. Click <strong>Verify Live Booking</strong> to try state flow!
                        </p>

                        <div className="space-y-4 pt-2 font-medium text-xs text-slate-600">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                                <span>Immediate outpatient queue allocation</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                                <span>Spring Security token state verification check</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                                <span>Outpatient health telemetry synchronizer</span>
                            </div>
                        </div>
                    </div>

                    {/* Booking calculator box */}
                    <div className="lg:col-span-7">
                        <div className="bg-[#f4f8fa] border border-slate-200/50 rounded-[2.5rem] p-8 shadow-md relative overflow-hidden">

                            <div className="absolute right-0 top-0 bg-[#e3edf2] p-4 text-xs font-bold text-[#082e3e] rounded-bl-3xl border-l border-b border-white">
                                Diagnostics Node Demo
                            </div>

                            <h3 className="text-lg font-black text-[#082e3e] mb-6">Appointment Calculator</h3>

                            {bookingSuccess && (
                                <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center space-x-2">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                                    <span>
                                        <strong>Demo Mode Success:</strong> This is only a preview simulation. To make a real appointment, please <strong>Register</strong> or <strong>Login</strong> to your account.
                                    </span>
                                </div>
                            )}

                            <form onSubmit={handleBookingTest} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Select Doctor */}
                                    <div>
                                        <label className="block text-[10px] font-bold text-[#082e3e]/80 uppercase tracking-widest mb-1.5 ml-1">
                                            Choose Specialist
                                        </label>
                                        <select
                                            className="w-full bg-white border border-slate-200 rounded-xl text-xs py-2.5 px-3 font-semibold text-[#082e3e]"
                                            value={calcDoctor.name}
                                            onChange={(e) => {
                                                const match = doctors.find((d) => d.name === e.target.value);
                                                if (match) setCalcDoctor(match);
                                            }}
                                        >
                                            {doctors.map((d) => (
                                                <option key={d.name} value={d.name}>
                                                    {d.name} ({d.specialty})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Choose Date */}
                                    <div>
                                        <label className="block text-[10px] font-bold text-[#082e3e]/80 uppercase tracking-widest mb-1.5 ml-1">
                                            Select Date
                                        </label>
                                        <input
                                            type="date"
                                            className="w-full bg-white border border-slate-200 rounded-xl text-xs py-2.5 px-3 font-semibold text-[#082e3e]"
                                            value={calcDate}
                                            onChange={(e) => setCalcDate(e.target.value)}
                                        />
                                    </div>

                                    {/* Choose Time */}
                                    <div>
                                        <label className="block text-[10px] font-bold text-[#082e3e]/80 uppercase tracking-widest mb-1.5 ml-1">
                                            Preferred Time Slot
                                        </label>
                                        <select
                                            className="w-full bg-white border border-slate-200 rounded-xl text-xs py-2.5 px-3 font-semibold text-[#082e3e]"
                                            value={calcTime}
                                            onChange={(e) => setCalcTime(e.target.value)}
                                        >
                                            <option value="08:30 AM">08:30 AM (Reserved)</option>
                                            <option value="09:00 AM">09:00 AM</option>
                                            <option value="10:30 AM">10:30 AM (Available)</option>
                                            <option value="14:15 PM">14:15 PM</option>
                                            <option value="15:30 PM">15:30 PM (Reserved)</option>
                                        </select>
                                    </div>

                                    {/* Pricing Output */}
                                    <div className="bg-white p-3.5 rounded-xl border border-slate-200/60 flex flex-col justify-between">
                                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Outpatient Consultation Fee</span>
                                        <span className="text-xl font-black text-[#082e3e] mt-1">{calcDoctor.price}</span>
                                    </div>
                                </div>

                                {/* Submit */}
                                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-[#082e3e] hover:bg-[#0a4053] justify-center items-center text-white font-extrabold py-3 px-4 rounded-xl text-xs transition duration-200 flex space-x-2 cursor-pointer shadow-xs"
                                    >
                                        <span>Verify Live Booking</span>
                                    </button>
                                    <Link
                                        to="/register"
                                        className="bg-white hover:bg-slate-50 border border-slate-200 justify-center items-center text-[#082e3e] font-extrabold py-3 px-4 rounded-xl text-xs transition duration-200 flex space-x-2"
                                    >
                                        <span>Create Safe Patient Account</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </form>

                        </div>
                    </div>

                </div>
            </section>

            {/* Security and JWT Demonstration Guide */}
            <section id="security" className="bg-[#f0f6f9] py-20 relative border-b border-slate-200/30">
                <div className="max-w-7xl mx-auto px-6">

                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                        <span className="text-[#86abc0] text-xs font-black uppercase tracking-wider block">Security Compliance</span>
                        <h2 className="text-3xl font-extrabold text-[#082e3e]">Secure Role Authorization Protocols</h2>
                        <p className="text-slate-500 font-medium text-sm">
                            Explore how our React Router protectors safely guard medical views based on authenticated JWT tokens.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs font-semibold">

                        {/* Sec 1 */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-200/50 space-y-4">
                            <div className="p-3 bg-[#e3edf2] text-[#082e3e] rounded-2xl w-fit">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <h3 className="font-extrabold text-sm text-[#082e3e]">Role-Restricted Dashboards</h3>
                            <p className="text-slate-500 leading-relaxed font-semibold">
                                Routes like `/patient/dashboard`, `/doctor/dashboard`, and `/admin/dashboard` are dynamically verified. Users attempting unauthorized role access are redirected automatically.
                            </p>
                        </div>

                        {/* Sec 2 */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-200/50 space-y-4">
                            <div className="p-3 bg-[#e3edf2] text-[#082e3e] rounded-2xl w-fit">
                                <Video className="w-5 h-5" />
                            </div>
                            <div className="flex items-center space-x-2">
                                <h3 className="font-extrabold text-sm text-[#082e3e]">Spring Boot Gateway</h3>
                                <span className="bg-indigo-50 text-[#082e3e] px-2 py-0.5 rounded-full text-[8px] font-black tracking-widest uppercase">Port 8080</span>
                            </div>
                            <p className="text-slate-500 leading-relaxed font-semibold">
                                The frontend proxies call signals directly to port 8080. If local server goes offline, built-in Cache fallback allows simulating full patient, MD, or Admin views with a single click.
                            </p>
                        </div>

                        {/* Sec 3 */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-200/50 space-y-4">
                            <div className="p-3 bg-rose-50 text-rose-700 rounded-2xl w-fit">
                                <Zap className="w-5 h-5" />
                            </div>
                            <h3 className="font-extrabold text-sm text-[#082e3e]">Cache Persistence</h3>
                            <p className="text-slate-500 leading-relaxed font-semibold">
                                Access tokens are cached inside client localstorage. Safe logout actions clear auth states instantly, ensuring HIPAA diagnostic telemetry confidentiality.
                            </p>
                        </div>

                    </div>

                    <div className="mt-12 bg-white/80 border border-slate-200/40 rounded-[2rem] p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center space-x-3 text-[#0a4053]">
                            <Smile className="w-5 h-5" />
                            <p className="text-xs font-semibold">
                                <strong className="text-[#082e3e]">Testing Showcase:</strong> You can click below to instantly sign in using cached credentials to demonstrate each workspace.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2 shrink-0">
                            <Link
                                to="/login"
                                className="px-4 py-2 bg-[#abc9d8] hover:bg-[#99b9ca] text-[#082e3e] rounded-xl font-bold transition text-xs shadow-2xs"
                            >
                                Access Portals Dashboard
                            </Link>
                        </div>
                    </div>

                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#082e3e] text-white py-16">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">

                    <div className="space-y-4 col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2.5">
                            <div className="p-2 bg-white/10 rounded-2xl">
                                <Heart className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-black tracking-tight">Clini<span className="text-[#86abc0]">Q</span></span>
                        </div>
                        <p className="text-slate-300 text-xs leading-relaxed font-medium max-w-sm">
                            Providing modern outpatient diagnostics orchestration under state-of-the-art secure JWT authorization gates. Pair healthcare needs with verified practitioners instantly.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Portal Gateways</h4>
                        <ul className="text-xs space-y-2 text-slate-300 font-semibold">
                            <li><Link to="/login" className="hover:text-white transition">Patient Cabin</Link></li>
                            <li><Link to="/login" className="hover:text-white transition">MD Consultant Panel</Link></li>
                            <li><Link to="/login" className="hover:text-white transition">System Administrator</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Emergency & Care</h4>
                        <ul className="text-xs space-y-2 text-slate-300 font-semibold">
                            <li className="flex items-center gap-1"><PhoneCall className="w-3.5 h-3.5" /> <span>911-CLINIQ</span></li>
                            <li className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> <span>Hospital Complex, Outpatient Hall C</span></li>
                        </ul>
                    </div>

                </div>

                <div className="max-w-7xl mx-auto px-6 pt-12 mt-12 border-t border-white/10 text-center text-[11px] text-slate-400 font-medium">
                    <p>© 2026 CliniQ Medical Information System. Integrated with Spring Security Role Authorization & JWT Token validation standards.</p>
                </div>
            </footer>

        </div>
    );
}

export default Landing;