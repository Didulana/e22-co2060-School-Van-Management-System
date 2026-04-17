import { sendAnnouncement, getOnboardingStatus } from "../../services/driverService";
import { useAuth } from "../../features/auth/AuthContext";
import { useEffect, useState } from "react";

export default function AnnouncementPage() {
  const { user } = useAuth();
  const [realDriverId, setRealDriverId] = useState<number>(0);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOnboardingStatus()
      .then(status => {
          if (status.driverId) setRealDriverId(status.driverId);
      })
      .catch(err => console.error("Identity sync failure", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSend = async () => {
    if (!message.trim() || !realDriverId) return;
    setSending(true);
    setSuccess(null);
    setError(null);
    try {
      const result = await sendAnnouncement(realDriverId, message.trim());
      setSuccess(`Announcement sent to ${result.recipientCount} parent(s)`);
      setMessage("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Send Announcement</h1>
        <p className="text-slate-500 mt-1">
          Broadcast a message to all parents assigned to your route
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Message</span>
          <textarea
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm min-h-[140px] resize-y outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
            placeholder="e.g. Due to heavy rain, today's evening route will depart 15 minutes late."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            ✓ {success}
          </div>
        )}

        <button
          onClick={handleSend}
          disabled={!message.trim() || sending}
          className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sending ? "Sending..." : "Send Announcement"}
        </button>
      </div>
    </div>
  );
}
