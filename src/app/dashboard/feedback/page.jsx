import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import MemberFeedback from "@/components/feedback/MemberFeedback";

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

            <MemberFeedback />

            <div className="mt-8 bg-indigo-900 rounded-2xl p-6 text-white flex items-center gap-4">
                <div className="text-3xl font-bold">💎</div>
                <p className="text-sm font-medium opacity-90">Your contributions help us build better tools for everyone in the organization.</p>
            </div>
        </div>
    );
}
