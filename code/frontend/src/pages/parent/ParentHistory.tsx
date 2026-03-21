import { useEffect, useState } from "react";
import { getJourneyHistory, JourneyHistoryItem } from "../../services/parentService";
import { History, Calendar, Clock, MapPin, ArrowUpCircle, ArrowDownCircle } from "lucide-react";

export default function ParentHistory() {
    const [history, setHistory] = useState<JourneyHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const data = await getJourneyHistory();
                setHistory(data);
            } catch (err) {
                console.error("Failed to load history");
            } finally {
                setLoading(false);
            }
        };
        loadHistory();
    }, []);

    if (loading) return (
        <div className="flex min-h-[400px] items-center justify-center bg-[#f8f8f6]">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8f8f6] p-6 lg:p-10 text-slate-900">
            <div className="mx-auto max-w-4xl">
                {/* Header Section */}
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-800">Journey History</h1>
                    <p className="mt-1 text-base text-slate-500">View logged boarding and drop-off events</p>
                </div>

                {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-16 shadow-sm border border-slate-200 animate-in fade-in">
                        <div className="mb-6 h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
                            <History size={32} />
                        </div>
                        <h2 className="text-xl font-semibold text-slate-800">No events found</h2>
                        <p className="mt-1 text-slate-500">Transportation logs will appear here when active.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {history.map((item, index) => (
                            <div key={`${item.event_id}-${item.type}`} className="flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${index * 50}ms` }}>
                                <div className="mt-6 flex flex-col items-center">
                                    <div className={`h-10 w-10 rounded-full border-4 border-white shadow-sm flex items-center justify-center text-white ${
                                        item.type === 'boarding' ? 'bg-emerald-500' : 'bg-blue-500'
                                    }`}>
                                        {item.type === 'boarding' ? <ArrowUpCircle size={14} /> : <ArrowDownCircle size={14} />}
                                    </div>
                                    <div className="w-px h-full bg-slate-200 mt-2 min-h-[40px]" />
                                </div>

                                <div className="flex-1 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm transition hover:shadow-md">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="text-lg font-bold text-slate-800">{item.student_name}</h4>
                                            <div className="flex items-center gap-2 mt-1 text-xs font-semibold text-slate-400">
                                                <MapPin size={12} />
                                                <span>{item.route_name}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                                                <Calendar size={12} />
                                                {new Date(item.event_time).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mt-0.5">
                                                <Clock size={12} className="text-emerald-500" />
                                                {new Date(item.event_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`mt-4 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                                        item.type === 'boarding' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                                    }`}>
                                        {item.type === 'boarding' ? 'Successfully Boarded' : 'Dropped Off'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
