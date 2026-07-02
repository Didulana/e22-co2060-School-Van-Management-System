import { useState, useEffect } from "react";
import { useAuth } from "../../features/auth/AuthContext";
import { getPaymentSettings, updatePaymentSettings } from "../../services/paymentApi";
import { PaymentSettings } from "../../types/payment";
import { Settings, Save, AlertCircle, CheckCircle2 } from "lucide-react";

export default function PaymentSettingsPage() {
  const { session } = useAuth();
  const [settings, setSettings] = useState<PaymentSettings>({
    mode: 'fixed',
    fixed_amount: 0,
    base_charge: 0,
    charge_per_km: 0,
    due_date_day: 5
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (session) {
      loadSettings();
    }
  }, [session]);

  const loadSettings = async () => {
    try {
      const data = await getPaymentSettings(session!.token);
      setSettings(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess("");
    try {
      await updatePaymentSettings(session!.token, settings);
      setSuccess("Payment settings saved successfully.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-slate-500 font-bold animate-pulse">Loading settings...</div>;

  const inputStyles = "w-full px-4 py-3 rounded-2xl border border-slate-100 bg-slate-50 text-slate-800 font-bold focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all outline-none text-sm";
  const labelStyles = "block text-xs font-black uppercase tracking-wider text-slate-400 mb-2 px-1";

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">Driver Controls</span>
        <h1 className="font-display text-3xl font-black text-slate-950 tracking-tight flex items-center gap-2">
          <Settings size={28} className="text-emerald-600" />
          Payment Settings
        </h1>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-100 text-sm font-bold text-red-600">
          <AlertCircle size={18} /> <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-sm font-bold text-emerald-700">
          <CheckCircle2 size={18} /> <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-card rounded-[1.75rem] p-6 sm:p-8 border border-white/60 shadow-soft space-y-8">
        
        <div>
          <label className={labelStyles}>Payment Mode</label>
          <div className="grid grid-cols-2 gap-4">
            <label className={`cursor-pointer rounded-2xl p-4 border-2 transition-all flex flex-col items-center justify-center gap-2 ${settings.mode === 'fixed' ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-slate-100 bg-white text-slate-500 hover:border-emerald-200'}`}>
              <input 
                type="radio" 
                className="hidden" 
                checked={settings.mode === 'fixed'} 
                onChange={() => setSettings({ ...settings, mode: 'fixed' })} 
              />
              <span className="font-black text-lg">Fixed Rate</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-center">Same amount for all</span>
            </label>
            <label className={`cursor-pointer rounded-2xl p-4 border-2 transition-all flex flex-col items-center justify-center gap-2 ${settings.mode === 'dynamic' ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-slate-100 bg-white text-slate-500 hover:border-emerald-200'}`}>
              <input 
                type="radio" 
                className="hidden" 
                checked={settings.mode === 'dynamic'} 
                onChange={() => setSettings({ ...settings, mode: 'dynamic' })} 
              />
              <span className="font-black text-lg">Distance Based</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-center">Base + Per KM</span>
            </label>
          </div>
        </div>

        {settings.mode === 'fixed' && (
          <div className="animate-in slide-in-from-top-2 fade-in">
            <label className={labelStyles}>Monthly Fixed Amount (LKR)</label>
            <input 
              type="number" 
              required 
              min="0"
              className={inputStyles} 
              value={settings.fixed_amount}
              onChange={(e) => setSettings({ ...settings, fixed_amount: Number(e.target.value) })}
            />
          </div>
        )}

        {settings.mode === 'dynamic' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in slide-in-from-top-2 fade-in">
            <div>
              <label className={labelStyles}>Base Charge (LKR)</label>
              <input 
                type="number" 
                required 
                min="0"
                className={inputStyles} 
                value={settings.base_charge}
                onChange={(e) => setSettings({ ...settings, base_charge: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className={labelStyles}>Charge Per KM (LKR)</label>
              <input 
                type="number" 
                required 
                min="0"
                className={inputStyles} 
                value={settings.charge_per_km}
                onChange={(e) => setSettings({ ...settings, charge_per_km: Number(e.target.value) })}
              />
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-slate-100">
          <label className={labelStyles}>Monthly Due Date (Day of Month)</label>
          <input 
            type="number" 
            required 
            min="1" 
            max="28"
            className={inputStyles} 
            value={settings.due_date_day}
            onChange={(e) => setSettings({ ...settings, due_date_day: Number(e.target.value) })}
          />
          <p className="mt-2 text-xs font-semibold text-slate-500 px-1">Payments will be marked due on this day every month.</p>
        </div>

        <button 
          type="submit" 
          disabled={isSaving}
          className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSaving ? "Saving..." : <><Save size={18} /> Save Settings</>}
        </button>
      </form>
    </div>
  );
}
