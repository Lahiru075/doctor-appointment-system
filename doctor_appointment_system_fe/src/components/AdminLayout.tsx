import React from 'react';
import { Outlet, useLocation, useMatches } from 'react-router-dom';
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
    <div id="admin-layout" className="flex min-h-screen bg-gradient-to-tr from-[#abc9d8]/40 via-[#f0f5f8] to-white text-[#082e3e] font-sans">
      
      {/* Sticky Left Sidebar Navigation */}
      <AdminSidebar />

      {/* Main Workspace Frame container */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Sticky Utility Header */}
        <header className="bg-white/70 backdrop-blur-md border-b border-[#e3edf2] sticky top-0 z-40 px-8 py-4.5 flex items-center justify-between shadow-[0_1px_2px_0_rgba(8,46,62,0.02)]">
          
          {/* Breadcrumb / Title area */}
          <div className="flex items-center space-x-3 min-w-0">
            <div className="p-2 bg-[#f0f5f8] rounded-xl border border-white shrink-0 shadow-3xs">
              <Cpu className="w-4 h-4 text-[#0a4053]" />
            </div>
            <div className="min-w-0">
              <span className="text-[9px] uppercase tracking-wider text-[#85abc0] font-bold block leading-none mb-1">
                Security Node / Root Console
              </span>
              <h2 className="text-lg font-black text-[#082e3e] tracking-tight truncate leading-tight">
                {getPageTitle(location.pathname)}
              </h2>
            </div>
          </div>

          {/* Secure Telemetry & Token Verification Indicator */}
          <div className="flex items-center space-x-3.5 shrink-0">
            <div className="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-800 border border-emerald-100 hover:bg-emerald-100 transition rounded-full px-3.5 py-1.5 text-[10px] font-black tracking-wider shadow-3xs select-none">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
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