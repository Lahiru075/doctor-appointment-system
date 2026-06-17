import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { HeartPulse, LogOut, Users, Calendar, Star, User, Menu, X } from 'lucide-react';

const DoctorSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  const navigationItems = [
    { path: '/doctor-dashboard', label: 'Waiting Queue', icon: Users },
    { path: '/doctor/appointments', label: 'Referral Approvals', icon: Calendar },
    { path: '/doctor/availability', label: 'Manage Slots', icon: Calendar },
    { path: '/doctor/reviews', label: 'My Reviews', icon: Star },
    { path: '/doctor/profile', label: 'Profile Setup', icon: User }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 border-r border-slate-200/50 bg-white sticky top-0 h-screen hidden md:flex flex-col justify-between p-6 z-30 shrink-0">
        <div className="space-y-6">
          {/* CliniQ Logo */}
          <div className="flex items-center space-x-3 py-2">
            <div className="p-2.5 bg-[#e3edf2] text-[#082e3e] rounded-2xl border border-white shadow-2xs">
              <HeartPulse className="w-5 h-5 text-[#0a4053]" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight text-[#082e3e] block leading-none">Clini<span className="text-[#86abc0]">Q</span></span>
              <span className="text-[10px] uppercase tracking-widest text-[#8eb5ca] font-extrabold mt-1 block">Professional Portal</span>
            </div>
          </div>

          <div className="bg-[#f4f8fa] border border-slate-200/20 rounded-2xl p-3.5 text-center space-y-1">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">MD Identity</span>
            <span className="text-xs font-extrabold text-[#082e3e] block truncate">{user?.email}</span>
            <span className="inline-block bg-[#082e3e] text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase">
              {user?.role}
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 pt-2">
            {navigationItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 text-xs font-bold px-4 py-3 rounded-2xl transition border cursor-pointer ${
                    isActive 
                      ? 'bg-[#082e3e] text-white border-[#082e3e] shadow-sm shadow-[#082e3e]/10' 
                      : 'text-slate-600 hover:bg-slate-50 border-transparent hover:text-[#082e3e]'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Logout */}
        <div className="pt-4 border-t border-slate-100">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 text-xs font-bold bg-[#082e3e] hover:bg-[#0d3b4f] text-white transition rounded-full py-2.5 cursor-pointer shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Hamburger Header */}
      <nav className="md:hidden bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 px-6 py-4 flex justify-between items-center w-full">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-[#e3edf2] text-[#082e3e] rounded-xl border border-white">
            <HeartPulse className="w-4 h-4 text-[#0a4053]" />
          </div>
          <span className="font-black text-lg tracking-tight text-[#082e3e]">Clini<span className="text-[#86abc0]">Q</span></span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 bg-slate-50 border border-slate-200/60 rounded-xl hover:bg-slate-100 text-[#082e3e]"
        >
          <Menu className="w-5 h-5" />
        </button>
      </nav>

      {/* Mobile Sidebar Sliding Drawer */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 md:hidden" onClick={() => setIsSidebarOpen(false)}>
          <div 
            className="fixed top-0 bottom-0 left-0 w-64 bg-white/95 backdrop-blur-md z-55 flex flex-col justify-between p-6 shadow-2xl border-r border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-[#e3edf2] text-[#082e3e] rounded-xl border border-white">
                    <HeartPulse className="w-4 h-4 text-[#0a4053]" />
                  </div>
                  <span className="font-extrabold text-[#082e3e] text-lg">Clini<span className="text-[#86abc0]">Q</span></span>
                </div>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1.5 bg-slate-50 border border-slate-200/60 rounded-xl hover:bg-slate-100 text-[#082e3e]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-1">
                {navigationItems.map(item => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`w-full flex items-center space-x-3 text-xs font-bold px-4 py-3 rounded-2xl transition border ${
                        isActive 
                          ? 'bg-[#082e3e] text-white border-[#082e3e]' 
                          : 'text-slate-600 hover:bg-slate-50 border-transparent hover:text-[#082e3e]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={logout}
                className="w-full flex items-center justify-center space-x-2 text-xs font-bold bg-[#082e3e] hover:bg-[#0d3b4f] text-white transition rounded-full py-2.5 cursor-pointer shadow-xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DoctorSidebar;