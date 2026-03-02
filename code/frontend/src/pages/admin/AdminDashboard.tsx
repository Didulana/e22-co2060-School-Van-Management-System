import {
  Bus,
  Users,
  Route,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { StatusBadge } from "../../components/StatusBadge";

const stats = [
  { label: "Active Buses", value: "24", change: "+2", icon: Bus, color: "text-primary", bg: "bg-blue-50" },
  { label: "Students Today", value: "847", change: "+12", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Active Routes", value: "16", change: "0", icon: Route, color: "text-amber-600", bg: "bg-amber-50" },
  { label: "Alerts", value: "3", change: "-1", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
];

const recentTrips = [
  { id: "T-001", route: "Route A - Maple District", driver: "John Davis", bus: "Bus #12", status: "success" as const, statusLabel: "Completed", students: 34, time: "8:15 AM" },
  { id: "T-002", route: "Route B - Oak Valley", driver: "Sarah Miller", bus: "Bus #7", status: "info" as const, statusLabel: "In Transit", students: 28, time: "8:20 AM" },
  { id: "T-003", route: "Route C - Pine Heights", driver: "Mike Johnson", bus: "Bus #3", status: "info" as const, statusLabel: "In Transit", students: 31, time: "8:10 AM" },
  { id: "T-004", route: "Route D - Cedar Park", driver: "Lisa Chen", bus: "Bus #15", status: "warning" as const, statusLabel: "Delayed", students: 22, time: "8:25 AM" },
  { id: "T-005", route: "Route E - Birch Lane", driver: "Tom Wilson", bus: "Bus #9", status: "neutral" as const, statusLabel: "Scheduled", students: 26, time: "8:45 AM" },
];

const alerts = [
  { message: "Bus #15 is running 8 minutes behind schedule", type: "warning" as const, time: "2 min ago" },
  { message: "Bus #3 reported minor traffic on Highway 9", type: "info" as const, time: "5 min ago" },
  { message: "Route F maintenance scheduled for tomorrow", type: "neutral" as const, time: "1 hr ago" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Overview of today's transport operations &middot; Saturday, Feb 21, 2026
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl text-foreground mt-1">{stat.value}</p>
                </div>
                <div className={`size-11 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`size-5 ${stat.color}`} />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3">
                <TrendingUp className="size-3 text-emerald-500" />
                <span className="text-xs text-emerald-600">{stat.change}</span>
                <span className="text-xs text-muted-foreground">from yesterday</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Trips Table */}
        <Card className="lg:col-span-2 border-border">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Clock className="size-5 text-primary" />
              Today's Trips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-muted-foreground">Route</th>
                    <th className="text-left py-3 px-2 text-muted-foreground hidden sm:table-cell">Driver</th>
                    <th className="text-left py-3 px-2 text-muted-foreground hidden md:table-cell">Bus</th>
                    <th className="text-center py-3 px-2 text-muted-foreground">Students</th>
                    <th className="text-left py-3 px-2 text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTrips.map((trip) => (
                    <tr key={trip.id} className="border-b border-border/50 last:border-0 hover:bg-accent/30 transition-colors">
                      <td className="py-3 px-2">
                        <p className="text-foreground">{trip.route}</p>
                        <p className="text-xs text-muted-foreground sm:hidden">{trip.driver}</p>
                      </td>
                      <td className="py-3 px-2 text-muted-foreground hidden sm:table-cell">{trip.driver}</td>
                      <td className="py-3 px-2 text-muted-foreground hidden md:table-cell">{trip.bus}</td>
                      <td className="py-3 px-2 text-center text-foreground">{trip.students}</td>
                      <td className="py-3 px-2">
                        <StatusBadge status={trip.status}>{trip.statusLabel}</StatusBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Alerts panel */}
        <Card className="border-border">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-amber-500" />
              Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50"
                >
                  <div className="mt-0.5">
                    {alert.type === "warning" && <AlertTriangle className="size-4 text-amber-500" />}
                    {alert.type === "info" && <MapPin className="size-4 text-blue-500" />}
                    {alert.type === "neutral" && <CheckCircle2 className="size-4 text-slate-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Add Student", icon: Users, color: "bg-blue-50 text-primary" },
              { label: "Add Vehicle", icon: Bus, color: "bg-amber-50 text-amber-600" },
              { label: "Create Route", icon: Route, color: "bg-emerald-50 text-emerald-600" },
              { label: "Live Tracking", icon: MapPin, color: "bg-purple-50 text-purple-600" },
            ].map((action) => (
              <button
                key={action.label}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:bg-accent/50 transition-colors"
              >
                <div className={`size-10 rounded-xl ${action.color} flex items-center justify-center`}>
                  <action.icon className="size-5" />
                </div>
                <span className="text-sm text-foreground">{action.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
