import { useState, useEffect } from "react";
import { useAuth } from "../../features/auth/AuthContext";
import { getDriverPayments } from "../../services/paymentApi";
import { Payment } from "../../types/payment";
import { FileClock } from "lucide-react";

export default function DriverPaymentHistoryPage() {
  const { session } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    if (session) {
      loadPayments();
    }
  }, [session]);

  const loadPayments = async () => {
    try {
      const data = await getDriverPayments(session!.token);
      setPayments(data.filter(p => p.status === 'paid' || p.status === 'rejected'));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = payments.filter(p => {
    const matchMonth = selectedMonth ? p.month === selectedMonth : true;
    const matchStatus = selectedStatus !== 'all' ? p.status === selectedStatus : true;
    return matchMonth && matchStatus;
  });

  const months = Array.from(new Set(payments.map(p => p.month))).sort().reverse();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">Records</span>
        <h1 className="font-display text-3xl font-black text-slate-950 tracking-tight flex items-center gap-2">
          <FileClock size={28} className="text-emerald-600" />
          Payment History
        </h1>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <select 
          className="px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm font-bold outline-none focus:border-emerald-500 transition-colors"
          value={selectedMonth} 
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="">All Months</option>
          {months.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select 
          className="px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm font-bold outline-none focus:border-emerald-500 transition-colors"
          value={selectedStatus} 
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="paid">Paid</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="glass-card rounded-[1.75rem] border border-white/60 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-400">Student</th>
                <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-400">Month</th>
                <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-400">Amount</th>
                <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-400">Approval Date</th>
                <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-400">Status</th>
                <th className="p-4 text-xs font-black uppercase tracking-wider text-slate-400">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-400 font-bold">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-400 font-bold">No history found.</td></tr>
              ) : (
                filtered.map(payment => (
                  <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-bold text-slate-900">{payment.student_name}</td>
                    <td className="p-4 font-bold text-slate-600">{payment.month}</td>
                    <td className="p-4 font-black text-slate-900">LKR {payment.amount_paid}</td>
                    <td className="p-4 text-xs font-bold text-slate-500">{payment.approved_at ? new Date(payment.approved_at).toLocaleString() : '-'}</td>
                    <td className="p-4">
                      {payment.status === 'paid' ? (
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-black uppercase tracking-wider">Paid</span>
                      ) : (
                        <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-[10px] font-black uppercase tracking-wider">Rejected</span>
                      )}
                    </td>
                    <td className="p-4">
                      {payment.receipt_url ? (
                        <a href={payment.receipt_url} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline text-xs font-bold">View</a>
                      ) : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
