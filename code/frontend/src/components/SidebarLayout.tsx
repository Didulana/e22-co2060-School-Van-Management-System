import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { LayoutDashboard, MapPin, Navigation, BusFront, Truck, ClipboardList, Megaphone } from "lucide-react";

export default function SidebarLayout() {
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
          <SectionLabel label="Admin" />
          <NavItem to="/admin" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavItem to="/routes" icon={<Navigation size={20} />} label="Route Management" />

          {/* Driver Section */}
          <SectionLabel label="Driver" />
          <NavItem to="/driver" icon={<Truck size={20} />} label="Driver Dashboard" />
          <NavItem to="/driver/attendance" icon={<ClipboardList size={20} />} label="Attendance" />
          <NavItem to="/driver/announce" icon={<Megaphone size={20} />} label="Announcements" />

          {/* Parent Section */}
          <SectionLabel label="Parent" />
          <NavItem to="/tracking" icon={<MapPin size={20} />} label="Live Tracking" />
        </nav>
        
        <div className="p-6 border-t border-slate-100">
          <p className="text-xs text-slate-400 font-semibold text-center uppercase tracking-wider">
            KidsRoute © 2026
          </p>
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

