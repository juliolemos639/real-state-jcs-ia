import Link from "next/link";
import { getOwnerById } from "@/app/actions/owners";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronLeft, Home, Mail, Phone, MapPin, Edit } from "lucide-react";
import { DeleteOwnerButton } from "@/components/property/delete-owner-button";

interface OwnerDetailsPageProps {
    params: { id: string } | Promise<{ id: string }>;
}

interface Owner {
    id: string;
    name: string;
    address?: string | null;
    phone?: string | null;
    email?: string | null;
    imageUrl?: string | null;
    properties: any[];
}

async function NotFound() {
    return (
        <div className="container mx-auto px-4 py-8">
            <p className="text-center text-muted-foreground">Proprietário não encontrado.</p>
        </div>
    );
}

export default async function OwnerDetailsPage({
    params,
}: OwnerDetailsPageProps) {
    let owner: Owner | null = null;

    try {
        const resolvedParams = await params;
        owner = (await getOwnerById(resolvedParams.id)) as Owner | null;
    } catch (error) {
        console.error("Error fetching owner:", error);
        return <NotFound />;
    }

    if (!owner) {
        return <NotFound />;
    }

    const formatPrice = (price: string) => {
        return Number(price).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                {/* Breadcrumb Navigation */}
                <Breadcrumb className="mb-4">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href="/" className="flex items-center gap-1">
                                    <Home className="h-4 w-4" />
                                    Início
                                </Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href="/owners">Proprietários</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{owner.name}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                {/* Back to Listings Link */}
                <Button variant="ghost" asChild className="mb-4 p-0 h-auto">
                    <Link href="/owners" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                        <ChevronLeft className="h-4 w-4" />
                        Voltar para proprietários
                    </Link>
                </Button>
            </div>

            <div className="max-w-4xl mx-auto">
                {/* Owner Header */}
                <div className="mb-8">
                    <div className="flex gap-6 mb-6">
                        {owner.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={owner.imageUrl}
                                alt={owner.name}
                                className="h-40 w-40 rounded-lg object-cover"
                            />
                        ) : (
                            <div className="h-40 w-40 rounded-lg bg-muted" />
                        )}
                        <div className="flex flex-col justify-between flex-1">
                            <div>
                                <h1 className="text-4xl font-bold mb-4">{owner.name}</h1>
                                <div className="space-y-2">
                                    {owner.address && (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <MapPin className="h-5 w-5" />
                                            <span>{owner.address}</span>
                                        </div>
                                    )}
                                    {owner.phone && (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Phone className="h-5 w-5" />
                                            <span>{owner.phone}</span>
                                        </div>
                                    )}
                                    {owner.email && (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Mail className="h-5 w-5" />
                                            <a href={`mailto:${owner.email}`} className="hover:text-foreground">
                                                {owner.email}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <Button asChild variant="outline" size="sm">
                                    <Link href={`/owners/${owner.id}/edit`} className="flex items-center gap-2">
                                        <Edit className="h-4 w-4" />
                                        Editar
                                    </Link>
                                </Button>
                                <DeleteOwnerButton
                                    ownerId={owner.id}
                                    ownerName={owner.name}
                                    propertiesCount={owner.properties?.length || 0}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Properties Section */}
                <div>
                    <h2 className="text-2xl font-bold mb-6">
                        Imóveis ({owner.properties?.length || 0})
                    </h2>

                    {!owner.properties || owner.properties.length === 0 ? (
                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-center text-muted-foreground">
                                    Nenhum imóvel cadastrado para este proprietário.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                            {owner.properties.map((property) => (
                                <Link
                                    key={property.id}
                                    href={`/property/${property.id}`}
                                >
                                    <Card className="h-full cursor-pointer transition hover:shadow-lg">
                                        {property.imageUrl && (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={property.imageUrl}
                                                alt={property.title}
                                                className="h-40 w-full object-cover"
                                            />
                                        )}
                                        <CardHeader>
                                            <CardTitle className="text-lg">{property.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <p className="text-sm text-muted-foreground">
                                                {property.address}
                                            </p>
                                            <p className="text-xl font-bold text-primary">
                                                {formatPrice(property.price)}
                                            </p>
                                            <div className="flex gap-2">
                                                <Badge variant="outline">
                                                    {property.bedrooms} quartos
                                                </Badge>
                                                <Badge variant="outline">
                                                    {property.bathrooms} banheiros
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
