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
import { PropertyHeader } from "./property-header";

export function XCreatePropertyForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [owners, setOwners] = useState<Array<{ id: string; name: string; email?: string; phone?: string; address?: string; imageUrl?: string }>>([]);
  const [loadingOwners, setLoadingOwners] = useState<boolean>(false);
  const [phoneValue, setPhoneValue] = useState<string>("");
  const ownerNameRef = useRef<HTMLInputElement>(null);
  const ownerAddressRef = useRef<HTMLInputElement>(null);
  const ownerPhoneRef = useRef<HTMLInputElement>(null);
  const ownerEmailRef = useRef<HTMLInputElement>(null);
  const ownerImageFileRef = useRef<HTMLInputElement>(null);
  const [ownerPreviewUrl, setOwnerPreviewUrl] = useState<string | null>(null);


  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  }

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

  function handleOwnerImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (ownerPreviewUrl) {
      URL.revokeObjectURL(ownerPreviewUrl);
      setOwnerPreviewUrl(null);
    }
    if (file && file.type.startsWith("image/")) {
      setOwnerPreviewUrl(URL.createObjectURL(file));
    }
  }

  useEffect(() => {
    let mounted = true;
    setLoadingOwners(true);
    fetch("/api/owners")
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        if (Array.isArray(data)) setOwners(data.map((o: any) => ({ id: o.id, name: o.name, email: o.email, phone: o.phone, address: o.address, imageUrl: o.imageUrl })));
      })
      .catch(() => {
        /* ignore */
      })
      .finally(() => mounted && setLoadingOwners(false));
    return () => {
      mounted = false;
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (ownerPreviewUrl) URL.revokeObjectURL(ownerPreviewUrl);
    };
  }, []);

  function handleOwnerSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const ownerId = e.target.value;
    if (!ownerId) {
      // Limpar campos se nenhum proprietário for selecionado
      if (ownerNameRef.current) ownerNameRef.current.value = "";
      if (ownerAddressRef.current) ownerAddressRef.current.value = "";
      if (ownerEmailRef.current) ownerEmailRef.current.value = "";
      if (ownerPhoneRef.current) ownerPhoneRef.current.value = "";
      setPhoneValue("");
      return;
    }

    // Encontrar o proprietário na lista e preencher os campos
    const selectedOwner = owners.find(o => o.id === ownerId);
    if (selectedOwner) {
      if (ownerNameRef.current) ownerNameRef.current.value = selectedOwner.name || "";
      if (ownerAddressRef.current) ownerAddressRef.current.value = selectedOwner.address || "";
      if (ownerEmailRef.current) ownerEmailRef.current.value = selectedOwner.email || "";
      if (selectedOwner.phone) {
        setPhoneValue(formatPhone(selectedOwner.phone));
      }
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
          <div className="border-b pb-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Proprietário do Imóvel (opcional)</h3>

            <div className="space-y-2 mb-4">
              <Label htmlFor="ownerId">Selecionar proprietário existente</Label>
              <select
                id="ownerId"
                name="ownerId"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                onChange={handleOwnerSelect}
                disabled={loadingOwners}
                defaultValue=""
              >
                <option value="">Selecione um proprietário ou deixe em branco para novo</option>
                {loadingOwners ? (
                  <option disabled>Carregando...</option>
                ) : (
                  owners.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ownerName">Nome do proprietário</Label>
              <Input
                ref={ownerNameRef}
                id="ownerName"
                name="ownerName"
                placeholder="Ex: João da Silva"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerAddress">Endereço do proprietário</Label>
              <Input
                ref={ownerAddressRef}
                id="ownerAddress"
                name="ownerAddress"
                placeholder="Rua, número, bairro, cidade"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerPhone">Telefone do proprietário</Label>
              <Input
                ref={ownerPhoneRef}
                id="ownerPhone"
                name="ownerPhone"
                type="tel"
                inputMode="tel"
                pattern="^\(\d{2}\)\s?\d{4,5}-\d{4}$"
                placeholder="(99) 99999-9999"
                value={phoneValue}
                onChange={(e) => setPhoneValue(formatPhone(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerEmail">Email do proprietário</Label>
              <Input
                ref={ownerEmailRef}
                id="ownerEmail"
                name="ownerEmail"
                type="email"
                placeholder="exemplo@dominio.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ownerImage">Foto do proprietário (opcional)</Label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 rounded-md border border-input bg-muted/30 px-3 py-2">
                  <ImageIcon className="size-5 shrink-0 text-muted-foreground" />
                  <Input
                    ref={ownerImageFileRef}
                    id="ownerImage"
                    name="ownerImage"
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    className="border-0 bg-transparent p-0 file:mr-2 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground file:transition-colors hover:file:bg-primary/90"
                    onChange={handleOwnerImageChange}
                  />
                </div>
                {ownerPreviewUrl && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      Pré-visualização (verifique a imagem):
                    </p>
                    <div className="relative aspect-square max-w-xs overflow-hidden rounded-lg border border-border bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={ownerPreviewUrl}
                        alt="Pré-visualização do proprietário"
                        className="h-full w-full object-contain"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="absolute right-2 top-2 gap-1"
                        onClick={() => window.open(ownerPreviewUrl, "_blank", "noopener")}
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
              <Label htmlFor="ownerImageUrl">Ou URL da foto do proprietário</Label>
              <Input
                id="ownerImageUrl"
                name="ownerImageUrl"
                type="url"
                placeholder="https://..."
              />
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-4">Dados do Imóvel</h3>

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
