import { NextResponse } from "next/server";
import { getProperties } from "@/app/actions/properties";

export async function GET() {
    try {
        const list = await getProperties();
        return NextResponse.json(list);
    } catch (err) {
        return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 });
    }
}
