import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import {
  Shield,
  LayoutDashboard,
  Layers,
  UserSquare2,
  Users2,
  LogOut,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

const AdminSidebar = () => {
  const { user, setUser } = useAuth();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    window.location.href = "/login";
  };

  const navItems = [
    {
      label: 'Overview',
      path: '/admin-dashboard',
      icon: LayoutDashboard,
      desc: 'System Telemetry & Stats'
    },
    {
      label: 'Specializations',
      path: '/admin/specializations',
      icon: Layers,
      desc: 'Manage Specialties'
    },
    {
      label: 'Manage Doctors',
      path: '/admin/doctors',
      icon: UserSquare2,
      desc: 'Verify & Audit MDs'
    },
    {
      label: 'Manage Patients',
      path: '/admin/patients',
      icon: Users2,
      desc: 'Lock or Unlock Accounts'
    },
    {
      label: 'Audit Logs',
      path: '/admin/audit-logs',
      icon: ShieldCheck,
      desc: 'Security & System Trace'
    }
  ];

  return (
    <aside 
      id="admin-sidebar" 
      className="w-72 bg-[#06222f] border-r border-[#0f3341] flex flex-col justify-between h-screen sticky top-0 font-sans shadow-xl shrink-0 text-white select-none"
    >
      {/* Top Section */}
      <div className="flex flex-col flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

        {/* Brand Logo Box */}
        <div className="p-4.5 px-5 border-b border-[#0f3341] flex items-center space-x-3 bg-gradient-to-b from-[#041a25] to-[#06222f]">
          <div className="p-2 bg-emerald-950/30 text-emerald-400 rounded-xl border border-emerald-900/30 shadow-xs">
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-left">
            <h1 className="font-extrabold text-xl tracking-tight text-white leading-none mb-1">
              Clini<span className="text-emerald-400">Q</span>
            </h1>
            <span className="text-[9px] uppercase tracking-widest text-[#85abc0] font-black">
              Admin Command
            </span>
          </div>
        </div>

        {/* Identity Profile Box */}
        <div className="px-4.5 py-3.5 border-b border-[#0f3341]">
          <div className="bg-[#041a25] rounded-2xl p-3 border border-[#0f3341] relative overflow-hidden group shadow-2xs">
            <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 w-14 h-14 bg-emerald-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

            <div className="relative z-10 flex flex-col space-y-1.5 text-left">
              <span className="text-[9px] uppercase tracking-wider text-[#85abc0] font-bold">
                Identity Profile
              </span>
              <div className="truncate font-bold text-xs text-slate-200" title={user?.email || 'admin@cliniq.com'}>
                {user?.email || 'admin@cliniq.com'}
              </div>
              <div className="inline-flex">
                <span className="bg-emerald-950/40 border border-emerald-900/40 text-emerald-400 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {user?.role || 'ADMIN'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Elements */}
        <nav className="p-3 space-y-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={
                  `flex items-center justify-between p-2.5 rounded-xl transition-all group cursor-pointer border ${
                    isActive
                      ? 'bg-gradient-to-r from-[#082e3e] to-[#0a4d3c]/20 text-emerald-400 border-emerald-900/35 shadow-md font-bold'
                      : 'text-slate-400 hover:text-emerald-400 hover:bg-[#082e3e]/40 border-transparent'
                  }`
                }
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <span className={`p-1.5 rounded-lg border transition ${
                    isActive 
                      ? 'bg-emerald-950/50 border-emerald-800/30 text-emerald-400' 
                      : 'bg-[#041a25] group-hover:bg-[#082e3e] border-transparent group-hover:border-[#0f3341]'
                  }`}>
                    <Icon className={`w-4 h-4 shrink-0 group-hover:scale-110 transition-transform ${
                      isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-emerald-400'
                    }`} />
                  </span>
                  <div className="truncate text-left leading-normal">
                    <div className="text-xs font-bold truncate leading-tight">{item.label}</div>
                    <div className="text-[10px] text-slate-400 font-medium truncate mt-0.5">{item.desc}</div>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-emerald-400 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5 duration-200 shrink-0" />
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Logout Action */}
      <div className="p-3.5 border-t border-[#0f3341] bg-[#041a25]">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center space-x-2 text-xs font-bold bg-[#06222f] hover:bg-rose-950/20 text-slate-400 hover:text-rose-400 transition border border-[#0f3341] hover:border-rose-900/40 rounded-xl py-2.5 shadow-sm cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-slate-400" />
          <span>System Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;