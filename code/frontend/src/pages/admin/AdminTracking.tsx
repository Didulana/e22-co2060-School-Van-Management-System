import { Bus, MapPin, Navigation } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { StatusBadge } from "../../components/StatusBadge";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

const activeBuses = [
  { id: "Bus #12", route: "Route A", driver: "John Davis", status: "On Route", speed: "32 mph", eta: "5 min", statusType: "info" as const },
  { id: "Bus #7", route: "Route B", driver: "Sarah Miller", status: "On Route", speed: "28 mph", eta: "12 min", statusType: "info" as const },
  { id: "Bus #3", route: "Route C", driver: "Mike Johnson", status: "At Stop", speed: "0 mph", eta: "8 min", statusType: "success" as const },
  { id: "Bus #15", route: "Route D", driver: "Lisa Chen", status: "Delayed", speed: "15 mph", eta: "18 min", statusType: "warning" as const },
];

export default function AdminTracking() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground">Live Tracking</h1>
        <p className="text-muted-foreground text-sm mt-1">Real-time location of all active buses</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map placeholder */}
        <Card className="lg:col-span-2 border-border overflow-hidden">
          <div className="relative h-[400px] lg:h-[500px]">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1620662892011-f5c2d523fae2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwbWFwJTIwYWVyaWFsJTIwdmlldyUyMHJvYWRzfGVufDF8fHx8MTc3MTY4Mjc5MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Map"
              className="w-full h-full object-cover"
            />
            {/* Map overlay with bus markers */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

            {/* Simulated bus markers */}
            <div className="absolute top-[30%] left-[40%] flex flex-col items-center">
              <div className="size-10 rounded-full bg-primary border-3 border-white shadow-lg flex items-center justify-center animate-pulse">
                <Bus className="size-5 text-white" />
              </div>
              <span className="text-xs bg-white rounded px-1.5 py-0.5 shadow mt-1">Bus #12</span>
            </div>
            <div className="absolute top-[55%] left-[60%] flex flex-col items-center">
              <div className="size-10 rounded-full bg-emerald-500 border-3 border-white shadow-lg flex items-center justify-center">
                <Bus className="size-5 text-white" />
              </div>
              <span className="text-xs bg-white rounded px-1.5 py-0.5 shadow mt-1">Bus #3</span>
            </div>
            <div className="absolute top-[45%] left-[25%] flex flex-col items-center">
              <div className="size-10 rounded-full bg-primary border-3 border-white shadow-lg flex items-center justify-center">
                <Bus className="size-5 text-white" />
              </div>
              <span className="text-xs bg-white rounded px-1.5 py-0.5 shadow mt-1">Bus #7</span>
            </div>
            <div className="absolute top-[70%] left-[50%] flex flex-col items-center">
              <div className="size-10 rounded-full bg-amber-500 border-3 border-white shadow-lg flex items-center justify-center">
                <Bus className="size-5 text-white" />
              </div>
              <span className="text-xs bg-white rounded px-1.5 py-0.5 shadow mt-1">Bus #15</span>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur rounded-xl p-3 shadow-lg">
              <p className="text-xs text-muted-foreground mb-2">Live &middot; 4 buses active</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="size-3 rounded-full bg-primary" />
                  <span className="text-xs">On Route</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="size-3 rounded-full bg-emerald-500" />
                  <span className="text-xs">At Stop</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="size-3 rounded-full bg-amber-500" />
                  <span className="text-xs">Delayed</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Bus list */}
        <Card className="border-border">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Navigation className="size-5 text-primary" />
              Active Buses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeBuses.map((bus) => (
                <div
                  key={bus.id}
                  className="p-3 rounded-xl border border-border hover:bg-accent/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Bus className="size-4 text-primary" />
                      <span className="text-sm text-foreground">{bus.id}</span>
                    </div>
                    <StatusBadge status={bus.statusType} dot={false}>{bus.status}</StatusBadge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div>Route: <span className="text-foreground">{bus.route}</span></div>
                    <div>Speed: <span className="text-foreground">{bus.speed}</span></div>
                    <div>Driver: <span className="text-foreground">{bus.driver}</span></div>
                    <div>ETA: <span className="text-foreground">{bus.eta}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
