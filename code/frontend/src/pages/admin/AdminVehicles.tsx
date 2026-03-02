import { Plus, Bus, Fuel, Wrench } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { StatusBadge } from "../../components/StatusBadge";

const vehicles = [
  { id: "Bus #3", plate: "SCH-0312", capacity: 42, driver: "Mike Johnson", status: "active", fuel: 78, nextMaintenance: "Mar 5" },
  { id: "Bus #7", plate: "SCH-0718", capacity: 38, driver: "Sarah Miller", status: "active", fuel: 92, nextMaintenance: "Mar 12" },
  { id: "Bus #9", plate: "SCH-0921", capacity: 40, driver: "Tom Wilson", status: "active", fuel: 65, nextMaintenance: "Feb 28" },
  { id: "Bus #12", plate: "SCH-1205", capacity: 44, driver: "John Davis", status: "active", fuel: 83, nextMaintenance: "Mar 8" },
  { id: "Bus #15", plate: "SCH-1509", capacity: 36, driver: "Lisa Chen", status: "maintenance", fuel: 45, nextMaintenance: "Today" },
  { id: "Bus #18", plate: "SCH-1814", capacity: 40, driver: "Unassigned", status: "inactive", fuel: 100, nextMaintenance: "Apr 1" },
];

export default function AdminVehicles() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-foreground">Vehicles</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your fleet of school buses</p>
        </div>
        <Button className="bg-primary text-white gap-2 self-start">
          <Plus className="size-4" />
          Add Vehicle
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id} className="border-border hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="size-11 rounded-xl bg-amber-50 flex items-center justify-center">
                    <Bus className="size-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-foreground">{vehicle.id}</p>
                    <p className="text-xs text-muted-foreground">{vehicle.plate}</p>
                  </div>
                </div>
                <StatusBadge
                  status={
                    vehicle.status === "active" ? "success" :
                    vehicle.status === "maintenance" ? "warning" : "neutral"
                  }
                >
                  {vehicle.status === "active" ? "Active" :
                   vehicle.status === "maintenance" ? "Maintenance" : "Inactive"}
                </StatusBadge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Driver</span>
                  <span className="text-foreground">{vehicle.driver}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Capacity</span>
                  <span className="text-foreground">{vehicle.capacity} seats</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Fuel className="size-3" /> Fuel
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 rounded-full bg-secondary overflow-hidden">
                      <div
                        className={`h-full rounded-full ${vehicle.fuel > 50 ? "bg-emerald-500" : vehicle.fuel > 25 ? "bg-amber-500" : "bg-red-500"}`}
                        style={{ width: `${vehicle.fuel}%` }}
                      />
                    </div>
                    <span className="text-foreground text-xs">{vehicle.fuel}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Wrench className="size-3" /> Next Service
                  </span>
                  <span className="text-foreground">{vehicle.nextMaintenance}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
