import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { ShieldCheck, Cpu } from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();

  // Map route paths to premium descriptive headings
  const getPageTitle = (pathname: string) => {
    if (pathname.includes('/admin-dashboard')) {
      return 'Command Center Overview';
    }
    if (pathname.includes('/admin/specializations')) {
      return 'Specialization Management';
    }
    if (pathname.includes('/admin/doctors')) {
      return 'Manage Doctors (Audit & Verification)';
    }
    if (pathname.includes('/admin/patients')) {
      return 'Manage Patient Directory';
    }
    return 'Administrative Workspace';
  };

  return (
    <div id="admin-layout" className="flex min-h-screen bg-[#041521] text-slate-100 font-sans">
      
      {/* Sticky Left Sidebar Navigation (Dark Mode with Emerald Accents) */}
      <AdminSidebar />

      {/* Main Workspace Frame container */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Sticky Utility Header (Dark Glassmorphic) */}
        <header className="bg-[#041a25]/80 backdrop-blur-md border-b border-[#0f3341] sticky top-0 z-40 px-8 py-4.5 flex items-center justify-between shadow-lg shadow-black/10">
          
          {/* Breadcrumb / Title area */}
          <div className="flex items-center space-x-3 min-w-0">
            {/* background and border set to emerald themed */}
            <div className="p-2 bg-emerald-950/20 text-emerald-400 rounded-xl border border-emerald-900/30 shrink-0 shadow-3xs">
              <Cpu className="w-4 h-4 text-emerald-400" /> {/* කොළ පාට කළා */}
            </div>
            <div className="min-w-0 text-left">
              <span className="text-[9px] uppercase tracking-wider text-emerald-500 font-bold block leading-none mb-1"> {/* කොළ පාට කළා */}
                Security Node / Root Console
              </span>
              <h2 className="text-lg font-black text-white tracking-tight truncate leading-tight">
                {getPageTitle(location.pathname)}
              </h2>
            </div>
          </div>

          {/* Secure Telemetry & Token Verification Indicator (Neon Dark Badge) */}
          <div className="flex items-center space-x-3.5 shrink-0">
            <div className="inline-flex items-center space-x-1.5 bg-emerald-950/30 text-emerald-400 border border-emerald-900/50 hover:bg-emerald-900/20 transition rounded-full px-3.5 py-1.5 text-[10px] font-black tracking-wider shadow-3xs select-none">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span>JWT SESSION ACTIVE</span>
            </div>
          </div>
        </header>

        {/* Content canvas viewport */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;