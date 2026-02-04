"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createEnquiry } from "@/app/actions/enquiries";
import { Loader2 } from "lucide-react";

export function EnquiryForm({ propertyId }: { propertyId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        startTransition(async () => {
          await createEnquiry({
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            phone: (formData.get("phone") as string) || undefined,
            message: formData.get("message") as string,
            propertyId,
          });
          form.reset();
        });
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nome *</Label>
          <Input id="name" name="name" required placeholder="Seu nome" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="seu@email.com"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input id="phone" name="phone" type="tel" placeholder="(00) 00000-0000" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Mensagem *</Label>
        <Textarea
          id="message"
          name="message"
          required
          placeholder="Sua mensagem sobre o imóvel..."
          rows={4}
        />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Enviando...
          </>
        ) : (
          "Enviar consulta"
        )}
      </Button>
    </form>
  );
}
