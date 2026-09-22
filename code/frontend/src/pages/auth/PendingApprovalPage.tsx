import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";
import { ShieldCheck, LogOut, Clock } from "lucide-react";

export default function PendingApprovalPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#f8f8f6] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md text-center animate-in fade-in zoom-in-95 duration-700">
        {/* Animated Icon */}
        <div className="relative mx-auto mb-8">
          <div className="flex h-24 w-24 mx-auto items-center justify-center rounded-[2rem] bg-amber-50 border-4 border-amber-200 text-amber-500">
            <Clock size={48} className="animate-pulse" />
          </div>
          <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-amber-400 flex items-center justify-center">
            <ShieldCheck size={14} className="text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Pending Approval</h1>
        <p className="mt-4 text-slate-500 font-medium leading-relaxed max-w-sm mx-auto">
          Your driver application is being reviewed by our admin team. 
          You'll receive an email notification once your account has been approved.
        </p>

        <div className="mt-8 space-y-3">
          <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                <ShieldCheck size={16} />
              </div>
              <div className="text-left">
                <p className="text-xs font-black text-slate-900 uppercase tracking-wider">Verification in Progress</p>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">Usually completed within 1–2 business days</p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-amber-50/50 rounded-2xl border border-amber-100">
            <p className="text-xs font-bold text-amber-700">Your personal details, driving licence, and vehicle information are being verified.</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 w-full py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <LogOut size={16} /> Sign Out
        </button>

        <p className="mt-4 text-xs text-slate-400">
          Need help? Contact our support team.
        </p>
      </div>
    </div>
  );
}
