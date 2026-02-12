"use client";

import { useTransition, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPropertyOwnerWithUpload } from "@/app/actions/owners";
import { Loader2, ImageIcon, ExternalLink } from "lucide-react";
import { PropertyOwnersHeader } from "../owners/property-owners-header";

export function CreatePropertyOwnerForm() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [phoneValue, setPhoneValue] = useState<string>("");
    const [properties, setProperties] = useState<Array<{ id: string; title: string; address?: string }>>([]);
    const [loadingProperties, setLoadingProperties] = useState<boolean>(false);

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

    return (
        <div>
            <div>
                <PropertyOwnersHeader propertyTitle="Cadastrar novo proprietário" />
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
                                await createPropertyOwnerWithUpload(formData);
                                router.push("/");
                                router.refresh();
                            } catch (err) {
                                setError(err instanceof Error ? err.message : "Erro ao cadastrar proprietário.");
                            }
                        });
                    }}
                >
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome *</Label>
                        <Input id="name" name="name" required placeholder="Ex: João da Silva" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">Endereço *</Label>
                        <Input id="address" name="address" required placeholder="Rua, número, bairro, cidade" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Telefone *</Label>
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            required
                            inputMode="tel"
                            pattern="^\(\d{2}\)\s?\d{4,5}-\d{4}$"
                            placeholder="(99) 99999-9999"
                            value={phoneValue}
                            onChange={(e) => setPhoneValue(formatPhone(e.target.value))}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            inputMode="email"
                            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                            placeholder="exemplo@dominio.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="image">Foto do proprietário</Label>
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

                    <div className="space-y-2">
                        <Label htmlFor="propertyId">Imóvel (opcional)</Label>
                        <select
                            id="propertyId"
                            name="propertyId"
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                            defaultValue=""
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
                                "Cadastrar proprietário"
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
