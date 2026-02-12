import { NextResponse } from "next/server";
import { getOwners } from "@/app/actions/owners";

export async function GET() {
    try {
        const list = await getOwners();
        return NextResponse.json(list);
    } catch (err) {
        console.error("Error fetching owners:", err);
        return NextResponse.json({ error: "Failed to fetch owners" }, { status: 500 });
    }
}
