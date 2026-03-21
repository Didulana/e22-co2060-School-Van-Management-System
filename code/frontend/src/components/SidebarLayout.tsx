import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { LayoutDashboard, MapPin, Navigation, BusFront, Truck, ClipboardList, Megaphone, LogOut, Users, History } from "lucide-react";
import { useAuth } from "../features/auth/AuthContext";

export default function SidebarLayout() {
  const { user, logout } = useAuth();
  return (
    <div className="flex h-screen w-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 shadow-sm flex flex-col transition-all z-20">
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="bg-blue-600 p-2 rounded-xl shadow-blue-200 shadow-lg flex items-center justify-center">
            <BusFront className="text-white w-6 h-6" />
          </div>
          <span className="font-extrabold text-xl text-slate-900 tracking-tight">KidsRoute</span>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {/* Admin Section */}
          {user?.role === "admin" && (
            <>
              <SectionLabel label="Admin" />
              <NavItem to="/admin" icon={<LayoutDashboard size={20} />} label="Dashboard" />
              <NavItem to="/routes" icon={<Navigation size={20} />} label="Route Management" />
            </>
          )}

          {/* Driver Section */}
          {user?.role === "driver" && (
            <>
              <SectionLabel label="Driver" />
              <NavItem to="/driver" icon={<Truck size={20} />} label="Driver Dashboard" />
              <NavItem to="/driver/attendance" icon={<ClipboardList size={20} />} label="Attendance" />
              <NavItem to="/driver/announce" icon={<Megaphone size={20} />} label="Announcements" />
            </>
          )}

          {/* Parent Section */}
          {user?.role === "parent" && (
            <>
              <SectionLabel label="Parent" />
              <NavItem to="/parent" icon={<LayoutDashboard size={20} />} label="Dashboard" />
              <NavItem to="/parent/children" icon={<Users size={20} />} label="Children" />
              <NavItem to="/tracking" icon={<MapPin size={20} />} label="Live Tracking" />
              <NavItem to="/parent/history" icon={<History size={20} />} label="Journey History" />
            </>
          )}
        </nav>
        
        <div className="p-4 border-t border-slate-100 flex flex-col gap-3">
          <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">
              {user?.name?.charAt(0) || user?.email?.charAt(0) || user?.role?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-slate-700 truncate">{user?.name || user?.email}</p>
              <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
            </div>
          </div>
          
          <button 
            onClick={logout}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut size={18} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto relative bg-slate-50 shadow-inner">
        <div className="absolute inset-0 max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 mt-5 mb-1 px-4">
      {label}
    </p>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-semibold tracking-wide ${
          isActive
            ? "bg-blue-50 text-blue-700 ring-1 ring-blue-500/30 shadow-sm translate-x-1"
            : "text-slate-500 hover:bg-slate-100/80 hover:text-slate-900"
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}

