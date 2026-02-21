import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  Bus,
  Bell,
} from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { StatusBadge } from "../../components/StatusBadge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";

const tripHistory = [
  {
    id: 1,
    date: "Today, Feb 21",
    morningStatus: "in-progress",
    morningLabel: "In Progress",
    morningTime: "8:05 AM - ~8:35 AM",
    afternoonStatus: "scheduled",
    afternoonLabel: "Scheduled",
    afternoonTime: "3:00 PM - 3:35 PM",
    bus: "Bus #12",
    route: "Route A",
  },
  {
    id: 2,
    date: "Yesterday, Feb 20",
    morningStatus: "completed",
    morningLabel: "Completed",
    morningTime: "8:02 AM - 8:30 AM",
    afternoonStatus: "completed",
    afternoonLabel: "Completed",
    afternoonTime: "3:05 PM - 3:38 PM",
    bus: "Bus #12",
    route: "Route A",
  },
  {
    id: 3,
    date: "Wed, Feb 19",
    morningStatus: "completed",
    morningLabel: "Completed",
    morningTime: "8:00 AM - 8:28 AM",
    afternoonStatus: "delayed",
    afternoonLabel: "Delayed +8min",
    afternoonTime: "3:10 PM - 3:50 PM",
    bus: "Bus #12",
    route: "Route A",
  },
  {
    id: 4,
    date: "Tue, Feb 18",
    morningStatus: "completed",
    morningLabel: "Completed",
    morningTime: "8:05 AM - 8:32 AM",
    afternoonStatus: "completed",
    afternoonLabel: "Completed",
    afternoonTime: "3:02 PM - 3:34 PM",
    bus: "Bus #12",
    route: "Route A",
  },
  {
    id: 5,
    date: "Mon, Feb 17",
    morningStatus: "absent",
    morningLabel: "Absent",
    morningTime: "-",
    afternoonStatus: "absent",
    afternoonLabel: "Absent",
    afternoonTime: "-",
    bus: "Bus #12",
    route: "Route A",
  },
];

const allNotifications = [
  { id: 1, message: "Bus #12 has started the morning route", time: "Today, 8:05 AM", type: "info" as const, read: false },
  { id: 2, message: "Emma was picked up from Maple Street stop", time: "Today, 8:12 AM", type: "success" as const, read: false },
  { id: 3, message: "Estimated arrival at school: 8:35 AM", time: "Today, 8:15 AM", type: "info" as const, read: true },
  { id: 4, message: "Emma arrived safely at Lincoln Elementary", time: "Yesterday, 8:30 AM", type: "success" as const, read: true },
  { id: 5, message: "Afternoon trip completed - Emma dropped off", time: "Yesterday, 3:38 PM", type: "success" as const, read: true },
  { id: 6, message: "Bus #12 was delayed due to traffic on Highway 9", time: "Wed, 3:10 PM", type: "warning" as const, read: true },
  { id: 7, message: "Route A schedule updated for next week", time: "Tue, 4:00 PM", type: "info" as const, read: true },
  { id: 8, message: "Morning trip completed successfully", time: "Tue, 8:32 AM", type: "success" as const, read: true },
];

function getStatusBadge(status: string, label: string) {
  const map: Record<string, "success" | "info" | "warning" | "error" | "neutral"> = {
    completed: "success",
    "in-progress": "info",
    delayed: "warning",
    absent: "neutral",
    scheduled: "neutral",
  };
  return <StatusBadge status={map[status] || "neutral"}>{label}</StatusBadge>;
}

export function TripHistory() {
  return (
    <div className="p-4 pb-6 max-w-lg mx-auto space-y-5">
      <div className="pt-2">
        <h2 className="text-foreground">Trip History & Notifications</h2>
        <p className="text-sm text-muted-foreground mt-1">Track Emma's transport history</p>
      </div>

      <Tabs defaultValue="history">
        <TabsList className="w-full grid grid-cols-2 h-11 bg-secondary rounded-xl">
          <TabsTrigger value="history" className="rounded-xl gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Calendar className="size-4" />
            Trip History
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-xl gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Bell className="size-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="mt-4 space-y-3">
          {tripHistory.map((trip) => (
            <Card key={trip.id} className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{trip.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Bus className="size-3" />
                    <span>{trip.bus}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Morning */}
                  <div className="p-3 bg-secondary/50 rounded-xl">
                    <p className="text-xs text-muted-foreground mb-1.5">Morning</p>
                    {getStatusBadge(trip.morningStatus, trip.morningLabel)}
                    <p className="text-xs text-muted-foreground mt-2">{trip.morningTime}</p>
                  </div>
                  {/* Afternoon */}
                  <div className="p-3 bg-secondary/50 rounded-xl">
                    <p className="text-xs text-muted-foreground mb-1.5">Afternoon</p>
                    {getStatusBadge(trip.afternoonStatus, trip.afternoonLabel)}
                    <p className="text-xs text-muted-foreground mt-2">{trip.afternoonTime}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Summary */}
          <Card className="border-border bg-blue-50/50">
            <CardContent className="p-4">
              <p className="text-sm text-foreground mb-3">This Week's Summary</p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-xl text-emerald-600">7</p>
                  <p className="text-xs text-muted-foreground">On Time</p>
                </div>
                <div>
                  <p className="text-xl text-amber-600">1</p>
                  <p className="text-xs text-muted-foreground">Delayed</p>
                </div>
                <div>
                  <p className="text-xl text-slate-400">2</p>
                  <p className="text-xs text-muted-foreground">Absent</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4 space-y-2">
          {allNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`flex items-start gap-3 p-3.5 rounded-xl border transition-colors ${
                notif.read
                  ? "border-border bg-white"
                  : "border-primary/20 bg-blue-50/50"
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {notif.type === "success" ? (
                  <CheckCircle2 className="size-5 text-emerald-500" />
                ) : notif.type === "warning" ? (
                  <AlertTriangle className="size-5 text-amber-500" />
                ) : (
                  <Clock className="size-5 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{notif.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
              </div>
              {!notif.read && <div className="size-2.5 rounded-full bg-primary mt-2 shrink-0" />}
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
