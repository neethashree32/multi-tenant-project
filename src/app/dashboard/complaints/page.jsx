import { requireAuth } from "@/lib/auth";
import ComplaintsPage from "@/components/complaints/ComplaintsPage";

export const metadata = {
  title: "Complaints | NexusFlow",
};

export const dynamic = "force-dynamic";

export default async function Page() {
  const user = await requireAuth();
  return <ComplaintsPage user={user} />;
}
