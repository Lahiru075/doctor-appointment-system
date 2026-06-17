import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { 
  Shield, 
  LayoutDashboard, 
  Layers, 
  UserSquare2, 
  Users2, 
  LogOut, 
  ChevronRight 
} from 'lucide-react';

const AdminSidebar = () => {
  const { user, logout } = useAuth();

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
    }
  ];

  return (
    <aside id="admin-sidebar" className="w-80 bg-white border-r border-[#e3edf2] flex flex-col justify-between h-screen sticky top-0 font-sans shadow-sm shrink-0">
      
      {/* Top Section */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        
        {/* Brand Logo Box */}
        <div className="p-6 border-b border-[#f0f5f8] flex items-center space-x-3.5 bg-gradient-to-b from-[#f8fafc] to-white">
          <div className="p-2.5 bg-[#e3edf2] text-[#082e3e] rounded-2xl border border-white shadow-xs">
            <Shield className="w-6 h-6 text-[#0a4053]" />
          </div>
          <div>
            <h1 className="font-extrabold text-2xl tracking-tight text-[#082e3e] leading-none mb-1">
              Clini<span className="text-[#8eb5ca]">Q</span>
            </h1>
            <span className="text-[10px] uppercase tracking-widest text-[#85abc0] font-black">
              Admin Command
            </span>
          </div>
        </div>

        {/* Identity Box */}
        <div className="px-6 py-5.5 border-b border-[#f0f5f8]">
          <div className="bg-[#f0f5f8] rounded-[1.5rem] p-4.5 border border-[#e3edf2] relative overflow-hidden group shadow-2xs">
            <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 w-16 h-16 bg-[#082e3e]/5 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
            
            <div className="relative z-10 flex flex-col space-y-2">
              <span className="text-[9px] uppercase tracking-wider text-[#85abc0] font-bold">
                Identity Profile
              </span>
              <div className="truncate font-bold text-xs text-[#082e3e]" title={user?.email || 'admin@cliniq.com'}>
                {user?.email || 'admin@cliniq.com'}
              </div>
              <div className="inline-flex">
                <span className="bg-[#082e3e] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  {user?.role || 'ADMIN'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Elements */}
        <nav className="p-4 space-y-1.5 flex-1 select-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between p-3.5 rounded-[1.25rem] transition-all group cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#e3edf2] to-[#f0f5f8] text-[#082e3e] border border-white font-extrabold shadow-3xs'
                      : 'text-slate-500 hover:text-[#082e3e] hover:bg-[#f8fafc] border border-transparent font-medium'
                  }`
                }
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  <span className="p-2 bg-slate-50 group-hover:bg-white rounded-xl border border-transparent group-hover:border-slate-100 transition shadow-2xs">
                    <Icon className="w-5 h-5 shrink-0 text-[#0a4053] group-hover:scale-110 transition-transform" />
                  </span>
                  <div className="truncate text-left leading-normal">
                    <div className="text-sm font-bold truncate leading-tight">{item.label}</div>
                    <div className="text-[10px] text-slate-400 group-hover:text-slate-500 font-semibold truncate mt-0.5">{item.desc}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5 duration-200 shrink-0" />
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Logout Action wrapper */}
      <div className="p-5.5 border-t border-[#f0f5f8] bg-[#f8fafc]">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center space-x-2.5 text-xs font-black bg-white hover:bg-red-50 text-slate-600 hover:text-red-700 transition border border-slate-200 hover:border-red-200 rounded-[1.25rem] py-3.5 shadow-3xs cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-500" />
          <span>System Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;