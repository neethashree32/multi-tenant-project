import { requireAuth } from "@/lib/auth";
import MemberFeedback from "@/components/feedback/MemberFeedback";
import FeedbackInbox from "@/components/feedback/FeedbackInbox";

export const dynamic = "force-dynamic";

export default async function FeedbackPage() {
    const user = await requireAuth();
    const isAdminOrOrg = user.role === "organization" || user.role === "admin";

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">
                    {isAdminOrOrg ? "Feedback Inbox" : "Member Feedback"}
                </h2>
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">
                    {isAdminOrOrg ? "Listening to your multi-tenant ecosystem" : "Help us improve the NexusFlow experience"}
                </p>
            </div>

            {isAdminOrOrg ? (
                <FeedbackInbox />
            ) : (
                <div className="space-y-8">
                    <MemberFeedback />
                    <div className="mt-8 bg-slate-900 rounded-3xl p-8 text-white flex items-center gap-6 shadow-2xl">
                        <div className="text-4xl">💎</div>
                        <div>
                            <h4 className="font-black text-base mb-1">Your Voice Matters</h4>
                            <p className="text-xs font-medium text-slate-400 leading-relaxed">
                                Feedback helps us build better tools for everyone. Thank you for your contributions.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
