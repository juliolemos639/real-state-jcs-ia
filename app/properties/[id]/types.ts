// TypeScript interfaces for Property Details Page

export interface PropertyDetailsPageProps {
    params: { id: string };
}

export interface Property {
    id: string;
    title: string;
    description: string | null;
    address: string;
    price: string; // Serialized from Decimal
    bedrooms: number;
    bathrooms: number;
    area: number | null;
    imageUrl: string | null;
    createdAt: string; // Serialized from Date
    updatedAt: string; // Serialized from Date
}

export interface Enquiry {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    message: string;
    propertyId: string;
    createdAt: string; // Serialized from Date
}

export interface PropertyWithEnquiries extends Property {
    enquiries: Enquiry[];
}

// Component prop interfaces
export interface PropertyHeaderProps {
    propertyTitle: string;
}

export interface PropertyImageSectionProps {
    imageUrl: string;
    title: string;
    alt: string;
}

export interface PropertyInfoSectionProps {
    property: Property;
}

export interface EnquiryHistorySectionProps {
    enquiries: Enquiry[];
}

export interface EnquiryListItemProps {
    enquiry: Enquiry;
}

// Page state types
export type PropertyPageState =
    | { status: 'loading' }
    | { status: 'success'; property: PropertyWithEnquiries }
    | { status: 'not-found' }
    | { status: 'error'; message: string };