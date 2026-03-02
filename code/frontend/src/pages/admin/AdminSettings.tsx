import { Save, Bell, Shield, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

export default function AdminSettings() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Configure system preferences</p>
      </div>

      {/* Notifications */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="size-5 text-primary" />
            Notifications
          </CardTitle>
          <CardDescription>Configure alert preferences for the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { label: "Trip delay alerts", description: "Notify when a bus is more than 5 minutes late", checked: true },
              { label: "Route changes", description: "Alert when route modifications are made", checked: true },
              { label: "Vehicle maintenance", description: "Reminders for upcoming vehicle maintenance", checked: false },
              { label: "Student updates", description: "Notify on student transport assignment changes", checked: true },
            ].map((setting) => (
              <div key={setting.label} className="flex items-start justify-between gap-4 py-2">
                <div>
                  <p className="text-sm text-foreground">{setting.label}</p>
                  <p className="text-xs text-muted-foreground">{setting.description}</p>
                </div>
                <div
                  className={`w-11 h-6 rounded-full transition-colors cursor-pointer flex items-center px-0.5 ${
                    setting.checked ? "bg-primary" : "bg-slate-200"
                  }`}
                >
                  <div
                    className={`size-5 rounded-full bg-white shadow transition-transform ${
                      setting.checked ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transport Settings */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="size-5 text-primary" />
            Transport Schedule
          </CardTitle>
          <CardDescription>Default timing settings for routes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground block mb-1.5">Morning Pickup Start</label>
              <input
                type="time"
                defaultValue="07:00"
                className="w-full px-3 py-2 rounded-xl border border-border bg-secondary text-sm text-foreground"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-1.5">Morning Drop-off By</label>
              <input
                type="time"
                defaultValue="08:30"
                className="w-full px-3 py-2 rounded-xl border border-border bg-secondary text-sm text-foreground"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-1.5">Afternoon Pickup Start</label>
              <input
                type="time"
                defaultValue="15:00"
                className="w-full px-3 py-2 rounded-xl border border-border bg-secondary text-sm text-foreground"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-1.5">Afternoon Drop-off By</label>
              <input
                type="time"
                defaultValue="16:30"
                className="w-full px-3 py-2 rounded-xl border border-border bg-secondary text-sm text-foreground"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Geofencing */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="size-5 text-primary" />
            Geofencing
          </CardTitle>
          <CardDescription>Set up arrival zones for stops</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground block mb-1.5">Arrival Radius (meters)</label>
              <input
                type="number"
                defaultValue="100"
                className="w-full px-3 py-2 rounded-xl border border-border bg-secondary text-sm text-foreground"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-1.5">Speed Alert Threshold (mph)</label>
              <input
                type="number"
                defaultValue="35"
                className="w-full px-3 py-2 rounded-xl border border-border bg-secondary text-sm text-foreground"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="size-5 text-primary" />
            Security
          </CardTitle>
          <CardDescription>Manage access controls</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { label: "Require two-factor authentication", checked: false },
              { label: "Auto-logout after 30 minutes of inactivity", checked: true },
              { label: "Allow parent self-registration", checked: true },
            ].map((setting) => (
              <div key={setting.label} className="flex items-center justify-between gap-4 py-2">
                <p className="text-sm text-foreground">{setting.label}</p>
                <div
                  className={`w-11 h-6 rounded-full transition-colors cursor-pointer flex items-center px-0.5 ${
                    setting.checked ? "bg-primary" : "bg-slate-200"
                  }`}
                >
                  <div
                    className={`size-5 rounded-full bg-white shadow transition-transform ${
                      setting.checked ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="bg-primary text-white gap-2">
          <Save className="size-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
