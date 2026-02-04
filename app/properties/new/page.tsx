// import { CreatePropertyForm } from "@/components/create-property-form";

import { CreatePropertyForm } from "@/components/create-property-form";

export default function NewPropertyPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Adicionar imóvel</h1>
      <CreatePropertyForm />
    </div>
  );
}
