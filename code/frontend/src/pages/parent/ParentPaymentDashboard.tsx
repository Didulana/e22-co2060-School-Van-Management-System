import { useState, useEffect } from "react";
import { useAuth } from "../../features/auth/AuthContext";
import { getParentPayments, uploadPaymentReceipt } from "../../services/paymentApi";
import { Payment } from "../../types/payment";
import { CreditCard, Upload, ExternalLink, X, AlertCircle, Calendar } from "lucide-react";

export default function ParentPaymentDashboard() {
  const { session } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [receiptUrl, setReceiptUrl] = useState("");
  const [receiptRef, setReceiptRef] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (session) {
      loadPayments();
    }
  }, [session]);

  const loadPayments = async () => {
    try {
      const data = await getParentPayments(session!.token);
      setPayments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayment) return;
    setIsUploading(true);
    try {
      await uploadPaymentReceipt(session!.token, selectedPayment.id, receiptUrl, receiptRef);
      setSelectedPayment(null);
      setReceiptUrl("");
      setReceiptRef("");
      loadPayments();
      alert("Receipt uploaded successfully!");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const dues = payments.filter(p => p.status === 'pending' || p.status === 'overdue' || p.status === 'rejected');
  const history = payments.filter(p => p.status === 'paid' || p.status === 'receipt_submitted');

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">Dashboard</span>
        <h1 className="font-display text-3xl font-black text-slate-950 tracking-tight flex items-center gap-2">
          <CreditCard size={28} className="text-emerald-600" />
          Fee Management
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Dues Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-black text-slate-800 px-1">Current Dues</h2>
          {isLoading ? (
            <div className="glass-card p-8 rounded-[1.75rem] text-center text-slate-400 font-bold animate-pulse">Loading...</div>
          ) : dues.length === 0 ? (
            <div className="glass-card p-8 rounded-[1.75rem] text-center border border-white/60">
              <CheckCircle size={48} className="mx-auto text-emerald-300 mb-4" />
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">You're all caught up!</p>
            </div>
          ) : (
            dues.map(due => (
              <div key={due.id} className="glass-card rounded-[1.75rem] p-6 border border-white/60 shadow-soft relative overflow-hidden">
                {due.status === 'overdue' && <div className="absolute top-0 left-0 right-0 h-1 bg-red-500" />}
                {due.status === 'rejected' && <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />}
                
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-wider mb-2">
                      <Calendar size={10} /> {due.month}
                    </span>
                    <h3 className="font-display text-xl font-black text-slate-900">{due.student_name}</h3>
                    <p className="text-sm font-bold text-slate-500 mt-1">Due by {new Date(due.due_date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Amount</p>
                    <p className="font-black text-2xl text-emerald-600">LKR {due.amount_due}</p>
                  </div>
                </div>

                {due.status === 'rejected' && (
                  <div className="mb-6 p-4 bg-amber-50 rounded-2xl border border-amber-100 text-sm font-bold text-amber-800 flex gap-2 items-start">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[10px] uppercase tracking-widest text-amber-600 mb-1">Previous Receipt Rejected</span>
                      {due.reject_reason || "Please upload a clear receipt."}
                    </div>
                  </div>
                )}

                <button 
                  onClick={() => setSelectedPayment(due)}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm hover:bg-slate-800 transition-all flex justify-center items-center gap-2"
                >
                  <Upload size={16} /> Upload Payment Receipt
                </button>
              </div>
            ))
          )}
        </div>

        {/* History Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-black text-slate-800 px-1">Payment History</h2>
          <div className="glass-card rounded-[1.75rem] border border-white/60 shadow-soft overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center text-slate-400 font-bold">Loading...</div>
            ) : history.length === 0 ? (
              <div className="p-8 text-center text-slate-400 font-bold">No history yet.</div>
            ) : (
              <div className="divide-y divide-slate-100/50">
                {history.map(h => (
                  <div key={h.id} className="p-5 hover:bg-white/50 transition-colors flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-900">{h.student_name} <span className="text-slate-400 font-medium">({h.month})</span></p>
                      <p className="text-xs font-bold text-slate-500 mt-1 flex items-center gap-2">
                        LKR {h.amount_due}
                        {h.status === 'paid' ? (
                          <span className="text-[9px] px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full uppercase tracking-wider font-black">Paid</span>
                        ) : (
                          <span className="text-[9px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full uppercase tracking-wider font-black">Reviewing</span>
                        )}
                      </p>
                    </div>
                    {h.receipt_url && (
                      <a href={h.receipt_url} target="_blank" rel="noreferrer" className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors">
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Dialog */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-display text-xl font-black text-slate-900 flex items-center gap-2">
                <Upload className="text-emerald-600" /> Upload Receipt
              </h2>
              <button onClick={() => setSelectedPayment(null)} className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUpload} className="p-6 space-y-6">
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-sm font-bold text-emerald-800">
                You are submitting payment for <strong>{selectedPayment.student_name}</strong> ({selectedPayment.month}). Amount due: LKR {selectedPayment.amount_due}
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2 px-1">Receipt Image URL (Mock)</label>
                <input 
                  type="url" 
                  required
                  placeholder="https://example.com/receipt.jpg"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-100 bg-slate-50 text-slate-800 font-bold focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all outline-none text-sm"
                  value={receiptUrl}
                  onChange={(e) => setReceiptUrl(e.target.value)}
                />
                <p className="mt-2 text-xs font-medium text-slate-500 px-1">In a real app, this would be a file upload to Supabase Storage.</p>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2 px-1">Bank Reference Number</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. TR-987654321"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-100 bg-slate-50 text-slate-800 font-bold focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all outline-none text-sm"
                  value={receiptRef}
                  onChange={(e) => setReceiptRef(e.target.value)}
                />
              </div>

              <button 
                type="submit" 
                disabled={isUploading}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isUploading ? "Submitting..." : "Submit Receipt"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Temporary CheckCircle icon component since it wasn't imported properly at top
function CheckCircle(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );
}
