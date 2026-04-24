import { NextResponse } from "next/server";
import { db } from "@/db";
import { feedbacks, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getCurrentUser, requireAuth } from "@/lib/auth";

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user || (user.role !== "organization" && user.role !== "admin")) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const orgId = user.organizationId;
        if (!orgId) return NextResponse.json({ feedbacks: [] });

        const results = await db
            .select({
                id: feedbacks.id,
                content: feedbacks.content,
                category: feedbacks.category,
                rating: feedbacks.rating,
                createdAt: feedbacks.createdAt,
                userName: users.name,
            })
            .from(feedbacks)
            .leftJoin(users, eq(feedbacks.userId, users.id))
            .where(eq(feedbacks.organizationId, orgId))
            .orderBy(desc(feedbacks.createdAt));

        return NextResponse.json({ feedbacks: results });
    } catch (error) {
        console.error("Feedback GET error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const user = await requireAuth();
        if (user.role !== "member") {
            return NextResponse.json({ error: "Only members can submit feedback" }, { status: 403 });
        }

        const { content, category, rating } = await req.json();
        if (!content || !category || !rating) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        await db.insert(feedbacks).values({
            content,
            category,
            rating,
            organizationId: user.organizationId,
            userId: user.id
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Feedback POST error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
