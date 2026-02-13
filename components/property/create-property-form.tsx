"use client";

import { useTransition, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createPropertyWithUpload } from "@/app/actions/properties";
import { Loader2, ImageIcon, ExternalLink } from "lucide-react";
import Property from "@/app/property/[id]/page";
import { PropertyHeader } from "./property-header";

// Zod Schema for form validation
const phoneRegex = /^\(\d{2}\)\s?\d{4,5}-\d{4}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createPropertySchema = z.object({
  // Owner fields (optional)
  ownerName: z.string().optional().or(z.literal("")),
  ownerAddress: z.string().optional().or(z.literal("")),
  ownerPhone: z.string().optional().or(z.literal("")).refine(
    (val) => !val || phoneRegex.test(val),
    "Formato de telefone inválido. Use: (99) 99999-9999"
  ),
  ownerEmail: z.string().optional().or(z.literal("")).refine(
    (val) => !val || emailRegex.test(val),
    "Email inválido"
  ),
  ownerImageUrl: z.string().optional().or(z.literal("")),
  ownerId: z.string().optional().or(z.literal("")),
  // Property fields
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  description: z.string().optional().or(z.literal("")),
  address: z.string().min(5, "Endereço deve ter pelo menos 5 caracteres"),
  price: z.string().min(1, "Preço é obrigatório").refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    "Preço deve ser maior que 0"
  ),
  area: z.string().optional().or(z.literal("")).refine(
    (val) => !val || !isNaN(parseFloat(val)),
    "Área deve ser um número válido"
  ),
  bedrooms: z.string().min(1, "Quartos é obrigatório").refine(
    (val) => !isNaN(parseInt(val)) && parseInt(val) >= 0,
    "Quartos deve ser um número válido"
  ),
  bathrooms: z.string().min(1, "Banheiros é obrigatório").refine(
    (val) => !isNaN(parseInt(val)) && parseInt(val) >= 0,
    "Banheiros deve ser um número válido"
  ),
  imageUrl: z.string().optional().or(z.literal("")),
});

type CreatePropertyFormData = z.infer<typeof createPropertySchema>;

export function CreatePropertyForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const ownerImageFileRef = useRef<HTMLInputElement>(null);
  const [owners, setOwners] = useState<Array<{ id: string; name: string; email?: string; phone?: string; address?: string; imageUrl?: string }>>([]);
  const [loadingOwners, setLoadingOwners] = useState<boolean>(false);
  const [ownerPreviewUrl, setOwnerPreviewUrl] = useState<string | null>(null);

  const form = useForm<CreatePropertyFormData>({
    resolver: zodResolver(createPropertySchema),
    defaultValues: {
      ownerName: "",
      ownerAddress: "",
      ownerPhone: "",
      ownerEmail: "",
      ownerImageUrl: "",
      ownerId: "",
      title: "",
      description: "",
      address: "",
      price: "",
      area: "",
      bedrooms: "0",
      bathrooms: "0",
      imageUrl: "",
    },
  }) as any;


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

  function handleOwnerSelect(ownerId: string) {
    if (!ownerId) {
      form.reset({
        ownerName: "",
        ownerAddress: "",
        ownerPhone: "",
        ownerEmail: "",
        ownerImageUrl: "",
        ownerId: "",
      });
      return;
    }

    const selectedOwner = owners.find(o => o.id === ownerId);
    if (selectedOwner) {
      form.setValue("ownerName", selectedOwner.name || "");
      form.setValue("ownerAddress", selectedOwner.address || "");
      form.setValue("ownerEmail", selectedOwner.email || "");
      form.setValue("ownerImageUrl", selectedOwner.imageUrl || "");
      if (selectedOwner.phone) {
        form.setValue("ownerPhone", formatPhone(selectedOwner.phone));
      }
    }
  }

  return (
    <div>
      <div>
        <PropertyHeader propertyTitle="Cadastrar novo imóvel" />
      </div>
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data: CreatePropertyFormData) => {
              const formData = new FormData();
              // Owner fields
              if (data.ownerName) formData.append("ownerName", data.ownerName);
              if (data.ownerAddress) formData.append("ownerAddress", data.ownerAddress);
              if (data.ownerPhone) formData.append("ownerPhone", data.ownerPhone);
              if (data.ownerEmail) formData.append("ownerEmail", data.ownerEmail);
              if (data.ownerId) formData.append("ownerId", data.ownerId);
              if (data.ownerImageUrl) formData.append("ownerImageUrl", data.ownerImageUrl);
              if (ownerImageFileRef.current?.files?.[0]) {
                formData.append("ownerImage", ownerImageFileRef.current.files[0]);
              }
              // Property fields
              formData.append("title", data.title);
              if (data.description) formData.append("description", data.description);
              formData.append("address", data.address);
              formData.append("price", data.price);
              if (data.area) formData.append("area", data.area);
              formData.append("bedrooms", data.bedrooms);
              formData.append("bathrooms", data.bathrooms);
              if (data.imageUrl) formData.append("imageUrl", data.imageUrl);
              if (fileInputRef.current?.files?.[0]) {
                formData.append("image", fileInputRef.current.files[0]);
              }

              startTransition(async () => {
                try {
                  await createPropertyWithUpload(formData);
                  router.push("/");
                  router.refresh();
                } catch (err) {
                  form.setError("root", {
                    message: err instanceof Error ? err.message : "Erro ao cadastrar imóvel.",
                  });
                }
              });
            })}
            className="space-y-6"
          >
            <div className="border-b pb-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Proprietário do Imóvel (opcional)</h3>

              <FormItem className="space-y-2 mb-4">
                <FormLabel htmlFor="ownerId">Selecionar proprietário existente</FormLabel>
                <select
                  id="ownerId"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  onChange={(e) => handleOwnerSelect(e.target.value)}
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
              </FormItem>

              <FormField
                control={form.control}
                name="ownerName"
                render={({ field }: any) => (
                  <FormItem>
                    <FormLabel>Nome do proprietário</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Ex: João da Silva"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ownerAddress"
                render={({ field }: any) => (
                  <FormItem>
                    <FormLabel>Endereço do proprietário</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Rua, número, bairro, cidade"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ownerPhone"
                render={({ field }: any) => (
                  <FormItem>
                    <FormLabel>Telefone do proprietário</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="tel"
                        inputMode="tel"
                        placeholder="(99) 99999-9999"
                        onChange={(e) => {
                          const formatted = formatPhone(e.target.value);
                          field.onChange(formatted);
                        }}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormDescription>
                      Formato: (99) 99999-9999
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ownerEmail"
                render={({ field }: any) => (
                  <FormItem>
                    <FormLabel>Email do proprietário</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="exemplo@dominio.com"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>Foto do proprietário (opcional)</FormLabel>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 rounded-md border border-input bg-muted/30 px-3 py-2">
                    <ImageIcon className="size-5 shrink-0 text-muted-foreground" />
                    <input
                      ref={ownerImageFileRef}
                      id="ownerImage"
                      name="ownerImage"
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      className="border-0 bg-transparent p-0 file:mr-2 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground file:transition-colors hover:file:bg-primary/90 disabled:opacity-50"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (ownerPreviewUrl) {
                          URL.revokeObjectURL(ownerPreviewUrl);
                          setOwnerPreviewUrl(null);
                        }
                        if (file && file.type.startsWith("image/")) {
                          setOwnerPreviewUrl(URL.createObjectURL(file));
                        }
                      }}
                      disabled={isPending}
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
                  <FormDescription>
                    JPG, PNG, GIF ou WebP. Máximo 5 MB. Ou use a URL abaixo.
                  </FormDescription>
                </div>
              </FormItem>

              <FormField
                control={form.control}
                name="ownerImageUrl"
                render={({ field }: any) => (
                  <FormItem>
                    <FormLabel>Ou URL da foto do proprietário</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="url"
                        placeholder="https://..."
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-lg font-semibold mb-4">Dados do Imóvel</h3>

            <FormField
              control={form.control}
              name="title"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Título *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ex: Apartamento 3 quartos"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Descreva o imóvel..."
                      rows={3}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Endereço *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Rua, número, bairro, cidade"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="price"
                render={({ field }: any) => (
                  <FormItem>
                    <FormLabel>Preço (R$) *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0,00"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="area"
                render={({ field }: any) => (
                  <FormItem>
                    <FormLabel>Área (m²)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        placeholder="0"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="bedrooms"
                render={({ field }: any) => (
                  <FormItem>
                    <FormLabel>Quartos *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }: any) => (
                  <FormItem>
                    <FormLabel>Banheiros *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormItem>
              <FormLabel>Imagem do imóvel</FormLabel>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 rounded-md border border-input bg-muted/30 px-3 py-2">
                  <ImageIcon className="size-5 shrink-0 text-muted-foreground" />
                  <input
                    ref={fileInputRef}
                    id="image"
                    name="image"
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    className="border-0 bg-transparent p-0 file:mr-2 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground file:transition-colors hover:file:bg-primary/90 disabled:opacity-50"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (previewUrl) {
                        URL.revokeObjectURL(previewUrl);
                        setPreviewUrl(null);
                      }
                      if (file && file.type.startsWith("image/")) {
                        setPreviewUrl(URL.createObjectURL(file));
                      }
                    }}
                    disabled={isPending}
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
                <FormDescription>
                  JPG, PNG, GIF ou WebP. Máximo 5 MB. Ou use a URL abaixo.
                </FormDescription>
              </div>
            </FormItem>

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Ou URL da imagem</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="url"
                      placeholder="https://..."
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {form.formState.errors.root.message}
              </div>
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
                disabled={isPending}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
