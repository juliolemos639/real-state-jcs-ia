import { CreatePropertyOwnerForm } from "@/components/property/create-property-owner-form";

export default function NewPropertyOwnerPage() {
    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Cadastrar proprietário</h1>
            <CreatePropertyOwnerForm />
        </div>
    );
}
