import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function FeedbackPage() {
    const user = await requireAuth();

    if (user.role !== "member") {
        redirect("/dashboard");
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h2 className="text-3xl font-black text-slate-900 mb-2">Member Feedback</h2>
                <p className="text-slate-500 font-medium">We value your input. Help us improve the NexusFlow ecosystem.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Experience Rating</label>
                        <div className="flex gap-4">
                            {["😞", "😐", "🙂", "🤩"].map((emoji, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl hover:bg-indigo-50 hover:border-indigo-200 transition-all"
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Feedback Category</label>
                        <select className="input-field">
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
                        />
                    </div>

                    <button
                        type="button"
                        className="btn-primary w-full py-4 text-lg"
                        onClick={() => alert("Thank you for your feedback! This is a UI demonstration.")}
                    >
                        Submit Feedback
                    </button>
                </form>
            </div>

            <div className="mt-8 bg-indigo-900 rounded-2xl p-6 text-white flex items-center gap-4">
                <div className="text-3xl font-bold">💎</div>
                <p className="text-sm font-medium opacity-90">Your contributions help us build better tools for everyone in the organization.</p>
            </div>
        </div>
    );
}
