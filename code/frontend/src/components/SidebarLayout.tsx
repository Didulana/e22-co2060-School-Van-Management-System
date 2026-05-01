import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { LayoutDashboard, MapPin, Navigation, BusFront, Truck, ClipboardList, Megaphone, LogOut, Users, History } from "lucide-react";
import { useAuth } from "../features/auth/AuthContext";

export default function SidebarLayout() {
  const { user, logout } = useAuth();
  
  return (
    <div className="flex h-screen w-screen bg-[#fdfdfc] text-slate-800 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-100 shadow-soft flex flex-col transition-all z-20">
        <div className="p-8 flex items-center gap-4 mb-4">
          <div className="bg-emerald-500 p-2.5 rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center justify-center">
            <BusFront className="text-white w-6 h-6" />
          </div>
          <div>
            <span className="block font-black text-2xl text-slate-900 tracking-tighter leading-none">KidsRoute</span>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1 block">School Van System</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 space-y-1.5 scrollbar-hide">
          {user?.role === "admin" && (
            <>
              <SectionLabel label="Operations" />
              <NavItem to="/admin/dashboard" icon={<LayoutDashboard size={20} />} label="Overview" />
              <NavItem to="/routes" icon={<Navigation size={20} />} label="Route Map" />
            </>
          )}

          {user?.role === "driver" && (
            <>
              <SectionLabel label="Driver Menu" />
              <NavItem to="/driver" icon={<Truck size={20} />} label="Home Dashboard" />
              <NavItem to="/driver/attendance" icon={<ClipboardList size={20} />} label="Attendance History" />
              <NavItem to="/driver/announce" icon={<Megaphone size={20} />} label="Announcements" />
            </>
          )}

          {user?.role === "parent" && (
            <>
              <SectionLabel label="Parent Menu" />
              <NavItem to="/parent" icon={<LayoutDashboard size={20} />} label="Home" />
              <NavItem to="/parent/children" icon={<Users size={20} />} label="My Children" />
              <NavItem to="/tracking" icon={<MapPin size={20} />} label="Track Van" />
              <NavItem to="/parent/history" icon={<History size={20} />} label="Trip History" />
            </>
          )}
        </nav>
        
        <div className="p-6 border-t border-slate-50 mt-auto">
          <div className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-2xl border border-slate-100/50 mb-3">
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm text-emerald-600 font-black flex items-center justify-center shrink-0 border border-slate-100">
              {user?.name?.charAt(0) || user?.email?.charAt(0) || user?.role?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-800 truncate">{user?.name || user?.email?.split('@')[0]}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{user?.role}</p>
            </div>
          </div>
          
          <button 
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all group"
          >
            <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto relative bg-[#fdfdfc]">
        <div className="absolute inset-0 max-w-[1400px] mx-auto w-full p-8 lg:p-12">
            <Outlet />
        </div>
      </main>
    </div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mt-8 mb-3 px-4">
      {label}
    </p>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-500 font-bold ${
          isActive
            ? "bg-slate-900 text-white shadow-xl shadow-slate-200 translate-x-1"
            : "text-slate-400 hover:bg-slate-100/50 hover:text-slate-800"
        }`
      }
    >
      <div className="shrink-0 transition-transform duration-500 group-hover:scale-110">
        {icon}
      </div>
      <span className="tracking-tight">{label}</span>
    </NavLink>
  );
}

