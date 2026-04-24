"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";

export default function FeedbackInbox() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/feedback")
            .then(r => r.json())
            .then(d => setFeedbacks(d.feedbacks || []))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-center p-12 text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Feedbacks...</div>;

    if (feedbacks.length === 0) {
        return (
            <div className="bg-slate-50 rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
                <div className="text-4xl mb-2">📥</div>
                <p className="text-slate-500 font-bold">No feedback received yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {feedbacks.map((fb) => (
                <div key={fb.id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-300 transition-all shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-xl shadow-inner">
                                {fb.rating}
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900">{fb.userName || "Unknown Member"}</h4>
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                                    {format(new Date(fb.createdAt), "MMM dd, yyyy · HH:mm")}
                                </p>
                            </div>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            {fb.category}
                        </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed font-medium">
                        "{fb.content}"
                    </p>
                </div>
            ))}
        </div>
    );
}
