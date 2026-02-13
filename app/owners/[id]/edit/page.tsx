import { getOwnerById } from "@/app/actions/owners";
import { EditPropertyOwnerForm } from "@/components/property/edit-property-owner-form";
import { notFound } from "next/navigation";

interface EditOwnerPageProps {
    params: { id: string } | Promise<{ id: string }>;
}

export default async function EditOwnerPage({ params }: EditOwnerPageProps) {
    const resolvedParams = await params;
    const owner = await getOwnerById(resolvedParams.id);

    if (!owner) {
        notFound();
    }

    return (
        <EditPropertyOwnerForm
            ownerId={resolvedParams.id}
            initialData={{
                name: owner.name,
                address: owner.address,
                phone: owner.phone,
                email: owner.email,
                imageUrl: owner.imageUrl,
            }}
        />
    );
}
