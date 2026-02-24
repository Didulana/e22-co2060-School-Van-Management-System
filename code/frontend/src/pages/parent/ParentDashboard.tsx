import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Bus,
  MapPin,
  Clock,
  CheckCircle2,
  Bell,
  ChevronRight,
  Shield,
  Phone,
  Navigation,
} from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { StatusBadge } from "../../components/StatusBadge";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

const notifications = [
  { id: 1, message: "Bus #12 has started the morning route", time: "8:05 AM", type: "info" as const, read: false },
  { id: 2, message: "Emma was picked up from Maple Street stop", time: "8:12 AM", type: "success" as const, read: false },
  { id: 3, message: "Estimated arrival at school: 8:35 AM", time: "8:15 AM", type: "info" as const, read: true },
];

export default function ParentDashboard() {
  const navigate = useNavigate();
  const [currentChild] = useState({
    name: "Emma Thompson",
    grade: "Grade 5",
    school: "Lincoln Elementary School",
    bus: "Bus #12",
    route: "Route A - Maple District",
    driver: "John Davis",
    driverPhone: "(555) 123-4567",
    status: "On Route",
    eta: "12 min",
    pickupTime: "8:12 AM",
    expectedArrival: "8:35 AM",
  });

  return (
    <div className="p-4 pb-6 space-y-5 max-w-lg mx-auto">
      {/* Greeting */}
      <div className="pt-2">
        <p className="text-sm text-muted-foreground">Good morning,</p>
        <h2 className="text-foreground">Sarah Thompson</h2>
      </div>

      {/* Child transport status card - primary card with reassurance */}
      <Card className="border-primary/20 bg-gradient-to-br from-blue-50 to-white overflow-hidden">
        <CardContent className="p-5">
          {/* Child info */}
          <div className="flex items-center gap-3 mb-4">
            <div className="size-12 rounded-full bg-amber-100 flex items-center justify-center">
              <span className="text-amber-700">ET</span>
            </div>
            <div>
              <p className="text-foreground">{currentChild.name}</p>
              <p className="text-xs text-muted-foreground">{currentChild.grade} &middot; {currentChild.school}</p>
            </div>
          </div>

          {/* Status with reassurance */}
          <div className="flex items-center gap-2 mb-4 p-3 bg-white rounded-xl border border-emerald-100">
            <div className="size-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
              <Shield className="size-5 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-emerald-700">Your child is safe on the bus</p>
              <p className="text-xs text-emerald-600/70">Picked up at {currentChild.pickupTime}</p>
            </div>
            <StatusBadge status="info">{currentChild.status}</StatusBadge>
          </div>

          {/* ETA */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-primary" />
              <span className="text-sm text-muted-foreground">Arriving at school in</span>
            </div>
            <span className="text-primary text-lg">{currentChild.eta}</span>
          </div>

          {/* Bus & Route info */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 bg-white rounded-xl border border-border">
              <div className="flex items-center gap-2 mb-1">
                <Bus className="size-4 text-amber-500" />
                <span className="text-xs text-muted-foreground">Bus</span>
              </div>
              <p className="text-sm text-foreground">{currentChild.bus}</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-border">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="size-4 text-primary" />
                <span className="text-xs text-muted-foreground">Route</span>
              </div>
              <p className="text-sm text-foreground">{currentChild.route.split(" - ")[0]}</p>
            </div>
          </div>

          {/* Track button */}
          <Button
            onClick={() => navigate("/parent/tracking")}
            className="w-full bg-primary text-white gap-2 h-12 rounded-xl"
          >
            <Navigation className="size-5" />
            Track Bus Live
          </Button>
        </CardContent>
      </Card>

      {/* Map preview */}
      <Card
        className="border-border overflow-hidden cursor-pointer"
        onClick={() => navigate("/parent/tracking")}
      >
        <div className="relative h-36">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1620662892011-f5c2d523fae2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwbWFwJTIwYWVyaWFsJTIwdmlldyUyMHJvYWRzfGVufDF8fHx8MTc3MTY4Mjc5MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Map preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          {/* Bus marker */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="size-10 rounded-full bg-primary border-3 border-white shadow-lg flex items-center justify-center animate-pulse">
              <Bus className="size-5 text-white" />
            </div>
          </div>
          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur rounded-lg px-3 py-1.5">
            <span className="text-xs text-foreground">Tap to open live tracking</span>
          </div>
        </div>
      </Card>

      {/* Driver contact */}
      <Card className="border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-blue-50 flex items-center justify-center">
                <span className="text-xs text-primary">JD</span>
              </div>
              <div>
                <p className="text-sm text-foreground">{currentChild.driver}</p>
                <p className="text-xs text-muted-foreground">Bus Driver &middot; {currentChild.bus}</p>
              </div>
            </div>
            <Button variant="outline" size="icon" className="size-10 rounded-full">
              <Phone className="size-4 text-primary" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Bell className="size-4 text-muted-foreground" />
            <span className="text-sm text-foreground">Recent Updates</span>
          </div>
          <button
            onClick={() => navigate("/parent/history")}
            className="text-xs text-primary flex items-center gap-1"
          >
            View all <ChevronRight className="size-3" />
          </button>
        </div>

        <div className="space-y-2">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`flex items-start gap-3 p-3 rounded-xl border ${
                notif.read ? "border-border bg-white" : "border-primary/20 bg-blue-50/50"
              }`}
            >
              <div className="mt-0.5">
                {notif.type === "success" ? (
                  <CheckCircle2 className="size-4 text-emerald-500" />
                ) : (
                  <Bus className="size-4 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{notif.message}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{notif.time}</p>
              </div>
              {!notif.read && <div className="size-2 rounded-full bg-primary mt-2 shrink-0" />}
            </div>
          ))}
        </div>
      </div>

      {/* Trip summary */}
      <Card className="border-border">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground mb-3">Today's Trip Summary</p>
          <div className="flex items-center justify-between">
            {[
              { label: "Pickup", time: "8:12 AM", status: "done" },
              { label: "On Route", time: "8:15 AM", status: "active" },
              { label: "Arrival", time: "~8:35 AM", status: "pending" },
            ].map((step, i) => (
              <div key={step.label} className="flex flex-col items-center gap-1.5 relative">
                <div
                  className={`size-8 rounded-full flex items-center justify-center ${
                    step.status === "done"
                      ? "bg-emerald-100"
                      : step.status === "active"
                      ? "bg-primary/10"
                      : "bg-secondary"
                  }`}
                >
                  {step.status === "done" ? (
                    <CheckCircle2 className="size-4 text-emerald-600" />
                  ) : step.status === "active" ? (
                    <Navigation className="size-4 text-primary" />
                  ) : (
                    <MapPin className="size-4 text-muted-foreground" />
                  )}
                </div>
                <span className="text-xs text-foreground">{step.label}</span>
                <span className="text-xs text-muted-foreground">{step.time}</span>
                {/* Connector */}
                {i < 2 && (
                  <div
                    className={`absolute top-4 left-[calc(50%+16px)] w-[calc(100%-8px)] h-0.5 ${
                      step.status === "done" ? "bg-emerald-300" : "bg-border"
                    }`}
                    style={{ width: "60px" }}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
