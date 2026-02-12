import { NextResponse } from "next/server";
import { getPropertyById } from "@/app/actions/properties";

export async function GET(
    request: Request,
    { params }: { params: { id: string } | Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const property = await getPropertyById(resolvedParams.id);

        if (!property) {
            return NextResponse.json(
                { error: "Property not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(property);
    } catch (error) {
        console.error("Error fetching property:", error);
        return NextResponse.json(
            { error: "Failed to fetch property" },
            { status: 500 }
        );
    }
}
