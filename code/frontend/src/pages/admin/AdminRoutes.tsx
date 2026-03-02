import { Plus, MapPin, Clock, Users } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { StatusBadge } from "../../components/StatusBadge";

const routes = [
  { id: "A", name: "Route A - Maple District", stops: 8, students: 34, duration: "35 min", bus: "Bus #12", driver: "John Davis", status: "active" },
  { id: "B", name: "Route B - Oak Valley", stops: 6, students: 28, duration: "28 min", bus: "Bus #7", driver: "Sarah Miller", status: "active" },
  { id: "C", name: "Route C - Pine Heights", stops: 10, students: 31, duration: "42 min", bus: "Bus #3", driver: "Mike Johnson", status: "active" },
  { id: "D", name: "Route D - Cedar Park", stops: 5, students: 22, duration: "25 min", bus: "Bus #15", driver: "Lisa Chen", status: "active" },
  { id: "E", name: "Route E - Birch Lane", stops: 7, students: 26, duration: "32 min", bus: "Bus #9", driver: "Tom Wilson", status: "active" },
  { id: "F", name: "Route F - Elm Street", stops: 9, students: 0, duration: "38 min", bus: "Unassigned", driver: "Unassigned", status: "inactive" },
];

const routeColors = ["bg-blue-500", "bg-emerald-500", "bg-purple-500", "bg-amber-500", "bg-rose-500", "bg-slate-400"];

export default function AdminRoutes() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-foreground">Routes</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage transport routes and stops</p>
        </div>
        <Button className="bg-primary text-white gap-2 self-start">
          <Plus className="size-4" />
          Create Route
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {routes.map((route, i) => (
          <Card key={route.id} className="border-border hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`size-10 rounded-xl ${routeColors[i]} flex items-center justify-center`}>
                    <span className="text-sm text-white">{route.id}</span>
                  </div>
                  <div>
                    <p className="text-foreground">{route.name}</p>
                    <p className="text-xs text-muted-foreground">{route.bus} &middot; {route.driver}</p>
                  </div>
                </div>
                <StatusBadge status={route.status === "active" ? "success" : "neutral"}>
                  {route.status === "active" ? "Active" : "Inactive"}
                </StatusBadge>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="size-4" />
                  <span>{route.stops} stops</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Users className="size-4" />
                  <span>{route.students} students</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="size-4" />
                  <span>{route.duration}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
