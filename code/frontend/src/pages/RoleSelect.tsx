import { useNavigate } from "react-router";
import { Shield, Heart, Truck, Bus, ArrowRight } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const roles = [
  {
    id: "admin",
    title: "Administrator",
    description: "Manage vehicles, routes, students, and monitor all transport operations.",
    icon: Shield,
    path: "/admin",
    color: "bg-primary",
    lightColor: "bg-blue-50",
    textColor: "text-primary",
  },
  {
    id: "parent",
    title: "Parent / Guardian",
    description: "Track your child's bus in real-time and view trip history.",
    icon: Heart,
    path: "/parent",
    color: "bg-emerald-600",
    lightColor: "bg-emerald-50",
    textColor: "text-emerald-600",
  },
  {
    id: "driver",
    title: "Bus Driver",
    description: "Manage your trips, update status, and view assigned routes.",
    icon: Truck,
    path: "/driver",
    color: "bg-amber-500",
    lightColor: "bg-amber-50",
    textColor: "text-amber-600",
  },
];

export function RoleSelect() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero section */}
      <div className="relative overflow-hidden bg-white border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-amber-50/50" />
        <div className="relative max-w-5xl mx-auto px-4 py-12 md:py-20">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-1.5 mb-6">
                <Bus className="size-4 text-primary" />
                <span className="text-sm text-primary">School Transport Management</span>
              </div>
              <h1 className="text-foreground mb-3">
                Safe Rides, Happy Kids
              </h1>
              <p className="text-muted-foreground max-w-lg">
                Monitor school bus operations, track vehicles in real-time, and
                ensure every child arrives safely. Choose your role to get started.
              </p>
            </div>
            <div className="w-64 h-48 md:w-80 md:h-56 rounded-2xl overflow-hidden shadow-lg shrink-0">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1689973849511-e1995810cf7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBidXMlMjB5ZWxsb3clMjB0cmFuc3BvcnR8ZW58MXx8fHwxNzcxNjgyNzg4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="School bus"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Role cards */}
      <div className="max-w-5xl mx-auto px-4 py-10 md:py-16">
        <h2 className="text-center text-foreground mb-2">Select Your Role</h2>
        <p className="text-center text-muted-foreground mb-10">
          Choose how you'd like to access the system
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role) => (
            <Card
              key={role.id}
              className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border"
              onClick={() => navigate(role.path)}
            >
              <CardContent className="p-6">
                <div
                  className={`size-14 rounded-2xl ${role.lightColor} flex items-center justify-center mb-5`}
                >
                  <role.icon className={`size-7 ${role.textColor}`} />
                </div>
                <h3 className="text-foreground mb-2">{role.title}</h3>
                <p className="text-sm text-muted-foreground mb-6 min-h-[40px]">
                  {role.description}
                </p>
                <Button
                  className={`w-full ${role.color} hover:opacity-90 text-white border-none`}
                >
                  Continue
                  <ArrowRight className="size-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-16 text-center">
          <p className="text-xs text-muted-foreground">
            SchoolBus Transport Management System &middot; Ensuring safe journeys for every student
          </p>
        </div>
      </div>
    </div>
  );
}
