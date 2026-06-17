import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DoctorSidebar from '../components/DoctorSidebar'; 

const DoctorLayout = () => {
  const location = useLocation();

  const getHeaderTitle = (pathname: string) => {
    if (pathname.includes('/doctor/appointments')) return 'Pending Referrals & Approvals';
    if (pathname.includes('/doctor/availability')) return 'Manage Time Slots & Availability';
    if (pathname.includes('/doctor/reviews')) return 'Patient Ratings & Reviews';
    if (pathname.includes('/doctor/profile')) return 'Professional Profile Management';
    return 'Clinical Waiting Queue Overview'; // Default
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#abc9d8]/50 via-[#f0f5f8] to-white text-[#082e3e] flex flex-col md:flex-row font-sans relative antialiased">
      
      {/* 1. Doctor Sidebar */}
      <DoctorSidebar />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
        
        {/* Sticky Header */}
        <header className="bg-white/60 backdrop-blur-md border-b border-slate-200/20 px-6 py-4.5 hidden md:flex justify-between items-center sticky top-0 z-20">
          <div>
            <h1 className="text-lg font-black text-[#082e3e]">
              {getHeaderTitle(location.pathname)}
            </h1>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">CliniQ Core System Gateway</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-100 px-3.5 py-1.5 rounded-full text-[10px] font-extrabold text-emerald-800">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span>JWT SESSION ACTIVE</span>
            </div>
          </div>
        </header>

        <main className="p-6 md:p-8 flex-1 space-y-6 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DoctorLayout;