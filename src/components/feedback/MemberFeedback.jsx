"use client";

import { useState } from "react";

export default function MemberFeedback() {
    const [rating, setRating] = useState("🙂");
    const [category, setCategory] = useState("General Improvement");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content) return;
        setLoading(true);
        try {
            const res = await fetch("/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content, category, rating }),
            });
            if (res.ok) setSubmitted(true);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-12 text-center">
                <div className="text-6xl mb-4">✨</div>
                <h3 className="text-2xl font-black text-emerald-900 mb-2">Feedback Received!</h3>
                <p className="text-emerald-700 font-medium">Thank you for helping us grow NexusFlow.</p>
                <button onClick={() => setSubmitted(false)} className="mt-6 text-emerald-600 font-bold uppercase text-xs tracking-widest">Submit Another</button>
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Experience Rating</label>
                    <div className="flex gap-4">
                        {["😞", "😐", "🙂", "🤩"].map((emoji) => (
                            <button
                                key={emoji}
                                type="button"
                                onClick={() => setRating(emoji)}
                                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all ${rating === emoji
                                        ? "bg-indigo-600 text-white scale-110 shadow-lg shadow-indigo-200"
                                        : "bg-slate-50 border border-slate-100 hover:bg-slate-100"
                                    }`}
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Feedback Category</label>
                    <select
                        className="input-field"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option>General Improvement</option>
                        <option>Bug Report</option>
                        <option>Feature Request</option>
                        <option>Performance Issue</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Your Detailed Feedback</label>
                    <textarea
                        className="input-field min-h-[150px] resize-none"
                        placeholder="Tell us what's on your mind..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="btn-primary w-full py-4 text-lg font-black uppercase tracking-widest"
                    disabled={loading}
                >
                    {loading ? "Sending..." : "Submit Feedback"}
                </button>
            </form>
        </div>
    );
}
