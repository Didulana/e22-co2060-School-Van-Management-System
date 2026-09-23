import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Bell, Check, Gauge, LayoutGrid, Moon, RefreshCw, Sun } from "lucide-react";
import {
  AppSettings,
  defaultAppSettings,
  readAppSettings,
  saveAppSettings,
} from "../../features/settings/appSettings";

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>(() => readAppSettings());
  const [message, setMessage] = useState("");

  useEffect(() => {
    saveAppSettings(settings);
  }, [settings]);

  const updateSetting = <Key extends keyof AppSettings>(key: Key, value: AppSettings[Key]) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
    setMessage("Settings saved.");
  };

  const resetSettings = () => {
    setSettings(defaultAppSettings);
    setMessage("Settings reset to default.");
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/80 bg-white/80 p-6 shadow-soft md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-600">Account Settings</p>
            <h1 className="font-display mt-2 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
              Personalize KidsRoute
            </h1>
          </div>
          {message && (
            <div className="inline-flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700">
              <Check size={18} /> {message}
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <SettingsPanel icon={<Sun size={22} />} title="Appearance">
          <SegmentedControl
            label="Theme"
            value={settings.theme}
            options={[
              { label: "Light", value: "light", icon: <Sun size={16} /> },
              { label: "Night", value: "night", icon: <Moon size={16} /> },
            ]}
            onChange={(value) => updateSetting("theme", value as AppSettings["theme"])}
          />

          <SegmentedControl
            label="Dashboard Density"
            value={settings.dashboardDensity}
            options={[
              { label: "Comfort", value: "comfortable", icon: <LayoutGrid size={16} /> },
              { label: "Compact", value: "compact", icon: <Gauge size={16} /> },
            ]}
            onChange={(value) => updateSetting("dashboardDensity", value as AppSettings["dashboardDensity"])}
          />
        </SettingsPanel>

        <SettingsPanel icon={<Bell size={22} />} title="Notifications">
          <SwitchRow
            label="Trip updates"
            description="Show pickup, drop-off, and journey alerts."
            checked={settings.tripNotifications}
            onChange={(checked) => updateSetting("tripNotifications", checked)}
          />
          <SwitchRow
            label="Announcements"
            description="Show school and driver announcements."
            checked={settings.announcementNotifications}
            onChange={(checked) => updateSetting("announcementNotifications", checked)}
          />
          <SwitchRow
            label="Show email in account panels"
            description="Display your email in profile summaries."
            checked={settings.showEmailInProfile}
            onChange={(checked) => updateSetting("showEmailInProfile", checked)}
          />
        </SettingsPanel>

        <SettingsPanel icon={<RefreshCw size={22} />} title="Tracking">
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400">
              Map refresh interval
            </span>
            <select
              value={settings.refreshInterval}
              onChange={(event) => updateSetting("refreshInterval", event.target.value as AppSettings["refreshInterval"])}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-900 outline-none transition focus:border-emerald-400"
            >
              <option value="30">Every 30 seconds</option>
              <option value="60">Every 1 minute</option>
              <option value="120">Every 2 minutes</option>
            </select>
          </label>
          <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-500">
            Current tracking refresh: {settings.refreshInterval} seconds.
          </p>
        </SettingsPanel>

        <SettingsPanel icon={<Gauge size={22} />} title="Reset">
          <p className="text-sm font-bold leading-relaxed text-slate-500">
            Restore the default display, notification, and tracking preferences for this browser.
          </p>
          <button
            onClick={resetSettings}
            className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
          >
            Reset Settings
          </button>
        </SettingsPanel>
      </section>
    </div>
  );
}

function SettingsPanel({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="rounded-[1.75rem] border border-white/80 bg-white/80 p-5 shadow-soft">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">{icon}</div>
        <h2 className="font-display text-xl font-black text-slate-950">{title}</h2>
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

function SegmentedControl({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ label: string; value: string; icon: ReactNode }>;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-black uppercase tracking-widest text-slate-400">{label}</p>
      <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1.5">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-black transition ${
              value === option.value ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            {option.icon} {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function SwitchRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div>
        <p className="text-sm font-black text-slate-900">{label}</p>
        <p className="mt-1 text-xs font-bold leading-relaxed text-slate-500">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative h-8 w-14 shrink-0 rounded-full transition ${checked ? "bg-emerald-500" : "bg-slate-300"}`}
        aria-pressed={checked}
      >
        <span
          className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${
            checked ? "left-7" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}
