"use client";

import { useTransition, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { createPropertyOwnerWithUpload } from "@/app/actions/owners";
import { Loader2, ImageIcon, ExternalLink } from "lucide-react";
import { PropertyOwnersHeader } from "../owners/property-owners-header";

// Zod Schema for form validation
const phoneRegex = /^\(\d{2}\)\s?\d{4,5}-\d{4}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createPropertyOwnerSchema = z.object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    address: z.string().min(5, "Endereço deve ter pelo menos 5 caracteres"),
    phone: z
        .string()
        .min(10, "Telefone inválido")
        .regex(phoneRegex, "Formato de telefone inválido. Use: (99) 99999-9999"),
    email: z
        .string()
        .regex(emailRegex, "Email inválido"),
    imageUrl: z.string().url("URL deve ser válida").optional().or(z.literal("")),
    propertyId: z.string().optional(),
    ownerId: z.string().optional(),
});

type CreatePropertyOwnerFormData = z.infer<typeof createPropertyOwnerSchema>;

export function CreatePropertyOwnerForm() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [properties, setProperties] = useState<Array<{ id: string; title: string; address?: string }>>([]);
    const [owners, setOwners] = useState<Array<{ id: string; name: string; email?: string; phone?: string; address?: string; imageUrl?: string }>>([]);
    const [loadingProperties, setLoadingProperties] = useState<boolean>(false);
    const [loadingOwners, setLoadingOwners] = useState<boolean>(false);

    const form = useForm<CreatePropertyOwnerFormData>({
        resolver: zodResolver(createPropertyOwnerSchema),
        defaultValues: {
            name: "",
            address: "",
            phone: "",
            email: "",
            propertyId: "",
            ownerId: "",
        },
    }) as any;

    function formatPhone(value: string) {
        const digits = value.replace(/\D/g, "").slice(0, 11);
        if (digits.length <= 2) return `(${digits}`;
        if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
        if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
    }

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

    useEffect(() => {
        let mounted = true;
        setLoadingProperties(true);
        fetch("/api/properties")
            .then((res) => res.json())
            .then((data) => {
                if (!mounted) return;
                if (Array.isArray(data)) setProperties(data.map((p: any) => ({ id: p.id, title: p.title, address: p.address })));
            })
            .catch(() => {
                /* ignore */
            })
            .finally(() => mounted && setLoadingProperties(false));
        return () => {
            mounted = false;
        };
    }, []);

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
        };
    }, []);

    async function handleOwnerSelect(ownerId: string) {
        if (!ownerId) {
            form.reset({
                name: "",
                address: "",
                phone: "",
                email: "",
                propertyId: "",
                ownerId: "",
            });
            return;
        }

        const selectedOwner = owners.find(o => o.id === ownerId);
        if (selectedOwner) {
            form.setValue("name", selectedOwner.name || "");
            form.setValue("address", selectedOwner.address || "");
            form.setValue("email", selectedOwner.email || "");
            form.setValue("imageUrl", selectedOwner.imageUrl || "");
            if (selectedOwner.phone) {
                form.setValue("phone", formatPhone(selectedOwner.phone));
            }
        }
    }

    return (
        <div>
            <div>
                <PropertyOwnersHeader propertyTitle="Cadastrar novo proprietário" />
            </div>
            <div>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((data: CreatePropertyOwnerFormData) => {
                            const formData = new FormData();
                            formData.append("name", data.name);
                            formData.append("address", data.address);
                            formData.append("phone", data.phone);
                            formData.append("email", data.email);
                            if (data.propertyId) formData.append("propertyId", data.propertyId);
                            if (data.imageUrl) formData.append("imageUrl", data.imageUrl);
                            if (fileInputRef.current?.files?.[0]) {
                                formData.append("image", fileInputRef.current.files[0]);
                            }

                            startTransition(async () => {
                                try {
                                    await createPropertyOwnerWithUpload(formData);
                                    router.push("/");
                                    router.refresh();
                                } catch (err) {
                                    form.setError("root", {
                                        message: err instanceof Error ? err.message : "Erro ao cadastrar proprietário.",
                                    });
                                }
                            });
                        })}
                        className="space-y-6"
                    >
                        <FormItem className="space-y-2">
                            <FormLabel htmlFor="ownerId">Buscar proprietário existente (opcional)</FormLabel>
                            <select
                                id="ownerId"
                                className="w-full rounded-md border border-input bg-background px-3 py-2"
                                onChange={(e) => handleOwnerSelect(e.target.value)}
                                disabled={loadingOwners}
                                defaultValue=""
                            >
                                <option value="">Selecione um proprietário para carregar dados</option>
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
                            name="name"
                            render={({ field }: any) => (
                                <FormItem>
                                    <FormLabel>Nome *{owners.length > 0 && " (Digite para novo proprietário ou selecione acima)"}</FormLabel>
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

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }: any) => (
                                <FormItem>
                                    <FormLabel>Telefone *</FormLabel>
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
                            name="email"
                            render={({ field }: any) => (
                                <FormItem>
                                    <FormLabel>Email *</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="email"
                                            inputMode="email"
                                            placeholder="exemplo@dominio.com"
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormItem>
                            <FormLabel>Foto do proprietário</FormLabel>
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
                                        onChange={handleImageChange}
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
                                                alt="Pré-visualização do proprietário"
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

                        <FormField
                            control={form.control}
                            name="propertyId"
                            render={({ field }: any) => (
                                <FormItem>
                                    <FormLabel>Imóvel (opcional)</FormLabel>
                                    <select
                                        {...field}
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 disabled:opacity-50"
                                        disabled={loadingProperties || isPending}
                                    >
                                        <option value="">Selecione um imóvel (opcional)</option>
                                        {loadingProperties ? (
                                            <option disabled>Carregando...</option>
                                        ) : (
                                            properties.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.title} {p.address ? `— ${p.address}` : ""}
                                                </option>
                                            ))
                                        )}
                                    </select>
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
                                    "Cadastrar proprietário"
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
