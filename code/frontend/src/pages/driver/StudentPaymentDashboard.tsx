import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";
import { getDriverPayments, generateMonthlyPayments, verifyPayment } from "../../services/paymentApi";
import { Payment } from "../../types/payment";
import { CreditCard, Check, X, RefreshCw, FileText, Settings } from "lucide-react";

export default function StudentPaymentDashboard() {
  const { session } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid' | 'overdue' | 'receipt_submitted'>('all');
  
  // Verification Dialog State
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    if (session) {
      loadPayments();
    }
  }, [session]);

  const loadPayments = async () => {
    setIsLoading(true);
    try {
      const data = await getDriverPayments(session!.token);
      setPayments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await generateMonthlyPayments(session!.token);
      await loadPayments();
      alert("Monthly payments generated successfully!");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVerify = async (status: 'paid' | 'rejected') => {
    if (!selectedPayment) return;
    try {
      await verifyPayment(session!.token, selectedPayment.id, status, status === 'rejected' ? rejectReason : undefined);
      setSelectedPayment(null);
      setRejectReason("");
      loadPayments();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filtered = filter === 'all' ? payments : payments.filter(p => p.status === filter);

  const getStatusBadge = (status: string) => {
    const map: Record<string, { bg: string, text: string, label: string }> = {
      paid: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Paid' },
      pending: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Pending' },
      overdue: { bg: 'bg-red-100', text: 'text-red-800', label: 'Overdue' },
      receipt_submitted: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Reviewing' },
      rejected: { bg: 'bg-slate-100', text: 'text-slate-800', label: 'Rejected' },
    };
    const mapped = map[status] || map.pending;
    return <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${mapped.bg} ${mapped.text}`}>{mapped.label}</span>;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">Financials</span>
          <h1 className="font-display text-3xl font-black text-slate-950 tracking-tight flex items-center gap-2">
            <CreditCard size={28} className="text-emerald-600" />
            Student Payments
          </h1>
        </div>
        <div className="flex gap-3">
          <Link 
            to="/driver/payments/settings"
            className="bg-white border border-slate-200 text-slate-700 px-5 py-3 rounded-2xl text-sm font-black shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <Settings size={16} />
            Payment Settings
          </Link>
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-slate-900 text-white px-5 py-3 rounded-2xl text-sm font-black shadow-lg hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw size={16} className={isGenerating ? "animate-spin" : ""} />
            Generate This Month's Dues
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'pending', 'paid', 'overdue', 'receipt_submitted'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${filter === f ? 'bg-emerald-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}
          >
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="glass-card rounded-[1.75rem] border border-white/60 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-400">Student</th>
                <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-400">Month</th>
                <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-400">Amount Due</th>
                <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-400">Distance</th>
                <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-400">Status</th>
                <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-400 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-400 font-bold">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-400 font-bold">No payments found.</td></tr>
              ) : (
                filtered.map(payment => (
                  <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{payment.student_name}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{payment.parent_name}</p>
                    </td>
                    <td className="p-4 font-bold text-slate-600">{payment.month}</td>
                    <td className="p-4 font-black text-slate-900">LKR {payment.amount_due}</td>
                    <td className="p-4 text-xs font-bold text-slate-500">{payment.distance?.toFixed(1)} km</td>
                    <td className="p-4">{getStatusBadge(payment.status)}</td>
                    <td className="p-4 text-right">
                      {payment.status === 'receipt_submitted' && (
                        <button 
                          onClick={() => setSelectedPayment(payment)}
                          className="bg-emerald-50 text-emerald-700 px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-emerald-100 transition-colors inline-flex items-center gap-1"
                        >
                          <Check size={14} /> Verify Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification Dialog */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-display text-xl font-black text-slate-900 flex items-center gap-2">
                <FileText className="text-emerald-600" /> Verify Receipt
              </h2>
              <button onClick={() => setSelectedPayment(null)} className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Student</span>
                  <span className="font-bold text-slate-900">{selectedPayment.student_name}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Amount Due</span>
                  <span className="font-black text-emerald-600 text-lg">LKR {selectedPayment.amount_due}</span>
                </div>
                <div className="col-span-2">
                  <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Reference Number</span>
                  <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-lg">{selectedPayment.receipt_ref || "N/A"}</span>
                </div>
              </div>

              {selectedPayment.receipt_url && (
                <div>
                  <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Receipt Image</span>
                  <img src={selectedPayment.receipt_url} alt="Receipt" className="w-full rounded-2xl border border-slate-200 shadow-sm" />
                </div>
              )}

              <div>
                <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Rejection Remarks (Optional)</span>
                <textarea 
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-emerald-50 outline-none transition-all text-sm font-medium resize-none h-24"
                  placeholder="Why are you rejecting this?"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
              <button 
                onClick={() => handleVerify('paid')}
                className="flex-1 bg-emerald-600 text-white py-3 rounded-xl text-sm font-black uppercase tracking-wider shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
              >
                <Check size={18} /> Accept
              </button>
              <button 
                onClick={() => handleVerify('rejected')}
                className="flex-1 bg-white border border-red-200 text-red-600 py-3 rounded-xl text-sm font-black uppercase tracking-wider hover:bg-red-50 transition-all flex items-center justify-center gap-2"
              >
                <X size={18} /> Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
