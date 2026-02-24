import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Home, MapPin, Clock, Bell, LogOut, Bus } from "lucide-react";
import { cn } from "../components/ui/utils";

const navItems = [
  { icon: Home, label: "Home", path: "/parent" },
  { icon: MapPin, label: "Track", path: "/parent/tracking" },
  { icon: Clock, label: "History", path: "/parent/history" },
];

export function ParentLayout() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top bar */}
      <header className="flex items-center justify-between h-14 px-4 bg-white border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
            <Bus className="size-4 text-white" />
          </div>
          <span className="text-sm text-foreground">SchoolBus</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="relative p-2">
            <Bell className="size-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 size-2 rounded-full bg-destructive" />
          </button>
          <div className="size-8 rounded-full bg-amber-100 flex items-center justify-center">
            <span className="text-xs text-amber-700">SM</span>
          </div>
          <button onClick={() => navigate("/")} className="p-2">
            <LogOut className="size-4 text-muted-foreground" />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* Bottom navigation - mobile friendly */}
      <nav className="flex items-center justify-around bg-white border-t border-border py-2 shrink-0 safe-area-pb">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/parent"}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-colors min-w-[64px]",
                isActive ? "text-primary" : "text-muted-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={cn(
                    "flex items-center justify-center size-10 rounded-xl transition-colors",
                    isActive ? "bg-primary/10" : ""
                  )}
                >
                  <item.icon className="size-5" />
                </div>
                <span className="text-xs">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
