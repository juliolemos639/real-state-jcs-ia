// import { notFound } from "next/navigation";
import { getPropertyById } from "@/app/actions/properties";
import { PropertyHeader } from "@/components/property/property-header";
import { PropertyImageSection } from "@/components/property/property-image-section";
import { PropertyInfoSection } from "@/components/property/property-info-section";
import { EnquirySection } from "@/components/property/enquiry-section";
import { EnquiryHistorySection } from "@/components/property/enquiry-history-section";
import NotFound from "@/app/properties/[id]/not-found";

interface PropertyDetailsPageProps {
    params: { id: string } | Promise<{ id: string }>;
}

interface Property {
    id: string;
    title: string;
    description: string | null;
    address: string;
    price: string;
    bedrooms: number;
    bathrooms: number;
    area: number | null;
    imageUrl: string | null;
    createdAt: string;
    updatedAt: string;
}

interface Owner {
    id: string;
    name: string;
    address?: string | null;
    phone?: string | null;
    email?: string | null;
    imageUrl?: string | null;
}

interface Enquiry {
    id: string;
    propertyId: string;
    name: string;
    email: string;
    phone: string | null;
    message: string;
    createdAt: string;
}

interface PropertyWithEnquiries extends Property {
    enquiries: Enquiry[];
    owner?: Owner | null;
}

export default async function Property({
    params,
}: PropertyDetailsPageProps) {
    let property: PropertyWithEnquiries | null = null;

    try {
        const resolvedParams = await params;
        property = await getPropertyById(resolvedParams.id);
    } catch (error) {
        console.error("Error fetching property:", error);
        // For database errors, we'll still show not found for now
        // In a production app, you might want to show a different error page
        return <NotFound />;
    }

    if (!property) {
        return <NotFound />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <PropertyHeader propertyTitle={property.title} />

                <PropertyImageSection
                    imageUrl={property.imageUrl}
                    title={property.title}
                    alt={`Imagem do imóvel: ${property.title}`}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <PropertyInfoSection property={property} />
                    <EnquirySection propertyId={property.id} />
                </div>

                <EnquiryHistorySection enquiries={property.enquiries} />
            </div>
        </div>
    );
}