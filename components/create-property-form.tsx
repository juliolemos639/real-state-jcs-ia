"use client";

import { useTransition, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createPropertyWithUpload } from "@/app/actions/properties";
import { Loader2, ImageIcon, ExternalLink } from "lucide-react";
import Property from "@/app/property/[id]/page";
import { PropertyHeader } from "./property/property-header";

export function CreatePropertyForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (file && file.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  }

  return (
    <div>
      <div>
        <PropertyHeader propertyTitle="Cadastrar novo imóvel" />
      </div>
      <div>
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            const form = e.currentTarget;
            const formData = new FormData(form);
            startTransition(async () => {
              try {
                await createPropertyWithUpload(formData);
                router.push("/");
                router.refresh();
              } catch (err) {
                setError(err instanceof Error ? err.message : "Erro ao cadastrar imóvel.");
              }
            });
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input id="title" name="title" required placeholder="Ex: Apartamento 3 quartos" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Descreva o imóvel..."
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Endereço *</Label>
            <Input id="address" name="address" required placeholder="Rua, número, bairro, cidade" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="0,00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="area">Área (m²)</Label>
              <Input
                id="area"
                name="area"
                type="number"
                min="0"
                placeholder="0"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Quartos *</Label>
              <Input
                id="bedrooms"
                name="bedrooms"
                type="number"
                min="0"
                required
                defaultValue={0}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bathrooms">Banheiros *</Label>
              <Input
                id="bathrooms"
                name="bathrooms"
                type="number"
                min="0"
                required
                defaultValue={0}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Imagem do imóvel</Label>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 rounded-md border border-input bg-muted/30 px-3 py-2">
                <ImageIcon className="size-5 shrink-0 text-muted-foreground" />
                <Input
                  ref={fileInputRef}
                  id="image"
                  name="image"
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="border-0 bg-transparent p-0 file:mr-2 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground file:transition-colors hover:file:bg-primary/90"
                  onChange={handleImageChange}
                />
              </div>
              {previewUrl && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Pré-visualização (verifique a imagem):
                  </p>
                  <div className="relative aspect-video max-w-md overflow-hidden rounded-lg border border-border bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt="Pré-visualização do imóvel"
                      className="h-full w-full object-contain"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="absolute right-2 top-2 gap-1"
                      onClick={() => window.open(previewUrl, "_blank", "noopener")}
                    >
                      <ExternalLink className="size-4" />
                      Abrir em nova aba
                    </Button>
                  </div>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                JPG, PNG, GIF ou WebP. Máximo 5 MB. Ou use a URL abaixo.
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Ou URL da imagem</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              type="url"
              placeholder="https://..."
            />
          </div>
          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
          <div className="flex gap-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Cadastrar imóvel"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
