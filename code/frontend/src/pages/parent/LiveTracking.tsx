import { useState } from "react";
import {
  Bus,
  MapPin,
  CheckCircle2,
  Navigation,
  ChevronUp,
  ChevronDown,
  Phone,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "../../components/ui/button";
import { StatusBadge } from "../../components/StatusBadge";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

const timelineSteps = [
  { label: "Trip Started", time: "8:05 AM", description: "Bus #12 departed from depot", status: "done" },
  { label: "Stop 1 - Oak Avenue", time: "8:08 AM", description: "3 students picked up", status: "done" },
  { label: "Stop 2 - Maple Street", time: "8:12 AM", description: "Emma picked up", status: "done" },
  { label: "Stop 3 - Pine Road", time: "8:18 AM", description: "4 students picked up", status: "done" },
  { label: "Stop 4 - Cedar Lane", time: "~8:22 AM", description: "2 students waiting", status: "active" },
  { label: "Stop 5 - Birch Drive", time: "~8:26 AM", description: "5 students waiting", status: "pending" },
  { label: "Lincoln Elementary", time: "~8:35 AM", description: "Final destination", status: "pending" },
] as const;

export default function LiveTracking() {
  const navigate = useNavigate();
  const [panelExpanded, setPanelExpanded] = useState(false);

  return (
    <div className="flex flex-col h-full relative">
      {/* Map area */}
      <div className="flex-1 relative min-h-[300px]">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1620662892011-f5c2d523fae2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
          alt="Live tracking map"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-white/30" />

        {/* Back button */}
        <button
          onClick={() => navigate("/parent")}
          className="absolute top-4 left-4 size-10 rounded-full bg-white shadow-lg flex items-center justify-center z-10"
          aria-label="Back"
        >
          <ArrowLeft className="size-5 text-foreground" />
        </button>

        {/* Bus marker */}
        <div className="absolute top-[40%] left-[45%]">
          <div className="relative">
            <div className="size-14 rounded-full bg-primary border-4 border-white shadow-xl flex items-center justify-center animate-pulse">
              <Bus className="size-7 text-white" />
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-primary text-white text-xs px-2 py-0.5 rounded-full whitespace-nowrap shadow">
              Bus #12
            </div>
          </div>
        </div>

        {/* School marker */}
        <div className="absolute top-[20%] right-[20%]">
          <div className="size-10 rounded-full bg-emerald-500 border-2 border-white shadow-lg flex items-center justify-center">
            <MapPin className="size-5 text-white" />
          </div>
          <span className="text-xs bg-white rounded px-1.5 py-0.5 shadow block mt-1 text-center">
            School
          </span>
        </div>

        {/* Completed stops */}
        {[
          { top: "60%", left: "25%" },
          { top: "55%", left: "40%" },
          { top: "50%", left: "52%" },
        ].map((pos, i) => (
          <div key={i} className="absolute" style={{ top: pos.top, left: pos.left }}>
            <div className="size-6 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="size-3 text-emerald-600" />
            </div>
          </div>
        ))}

        {/* ETA overlay */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
          <p className="text-xs text-muted-foreground">Arriving in</p>
          <p className="text-2xl text-primary">12 min</p>
          <p className="text-xs text-muted-foreground">ETA: 8:35 AM</p>
        </div>
      </div>

      {/* Bottom panel */}
      <div
        className={`bg-white border-t border-border rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 ${
          panelExpanded ? "max-h-[60vh]" : "max-h-[220px]"
        } overflow-hidden`}
      >
        {/* Handle */}
        <button
          onClick={() => setPanelExpanded(!panelExpanded)}
          className="w-full flex flex-col items-center pt-3 pb-2"
          aria-label={panelExpanded ? "Hide details" : "Show details"}
        >
          <div className="w-10 h-1 rounded-full bg-border mb-2" />
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {panelExpanded ? (
              <>
                <ChevronDown className="size-3" /> Hide details
              </>
            ) : (
              <>
                <ChevronUp className="size-3" /> Show route details
              </>
            )}
          </div>
        </button>

        <div
          className="px-4 pb-4 overflow-y-auto"
          style={{ maxHeight: panelExpanded ? "calc(60vh - 50px)" : "170px" }}
        >
          {/* Status bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Navigation className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-foreground">Bus #12 · Route A</p>
                <p className="text-xs text-muted-foreground">Driver: John Davis</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status="info">On Route</StatusBadge>
              <Button variant="outline" size="icon" className="size-9 rounded-full shrink-0" aria-label="Call driver">
                <Phone className="size-4 text-primary" />
              </Button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
              <span>4 of 7 stops completed</span>
              <span>57%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: "57%" }} />
            </div>
          </div>

          {/* Status Timeline */}
          <div className="space-y-0">
            {timelineSteps.map((step, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`size-6 rounded-full flex items-center justify-center shrink-0 ${
                      step.status === "done"
                        ? "bg-emerald-100"
                        : step.status === "active"
                        ? "bg-primary/10 ring-2 ring-primary/30"
                        : "bg-secondary"
                    }`}
                  >
                    {step.status === "done" ? (
                      <CheckCircle2 className="size-3.5 text-emerald-600" />
                    ) : step.status === "active" ? (
                      <div className="size-2.5 rounded-full bg-primary animate-pulse" />
                    ) : (
                      <div className="size-2 rounded-full bg-muted-foreground/30" />
                    )}
                  </div>

                  {i < timelineSteps.length - 1 && (
                    <div
                      className={`w-0.5 flex-1 min-h-[28px] ${
                        step.status === "done" ? "bg-emerald-200" : "bg-border"
                      }`}
                    />
                  )}
                </div>

                <div className="pb-4 pt-0.5">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm ${step.status === "active" ? "text-primary" : "text-foreground"}`}>
                      {step.label}
                    </p>
                    {step.label.includes("Emma") && (
                      <span className="text-xs bg-amber-50 text-amber-700 rounded-full px-2 py-0.5 border border-amber-200">
                        Your child
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {step.time} · {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Optional spacer */}
          <div className="h-2" />
        </div>
      </div>
    </div>
  );
}