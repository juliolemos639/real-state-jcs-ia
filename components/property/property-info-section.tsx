import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bed, Bath, Square } from "lucide-react";

interface Property {
    id: string;
    title: string;
    description: string | null;
    address: string;
    price: string;
    bedrooms: number;
    bathrooms: number;
    area: number | null;
    imageUrl: string | null;
    createdAt: string;
    updatedAt: string;
}

interface PropertyInfoSectionProps {
    property: Property;
}

export function PropertyInfoSection({ property }: PropertyInfoSectionProps) {
    const formatPrice = (price: string) => {
        return Number(price).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const formatArea = (area: number | null) => {
        if (!area) return null;
        return `${area.toLocaleString("pt-BR")} m²`;
    };

    return (
        <div className="space-y-6">
            {/* Property Title and Price */}
            <div>
                <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                <p className="text-2xl font-semibold text-primary mb-2">
                    {formatPrice(property.price)}
                </p>
                <p className="text-muted-foreground">{property.address}</p>
            </div>

            {/* Property Features */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Características do Imóvel</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                            <Bed className="h-5 w-5 text-muted-foreground" />
                            <span className="font-medium">{property.bedrooms}</span>
                            <span className="text-muted-foreground">
                                {property.bedrooms === 1 ? "quarto" : "quartos"}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Bath className="h-5 w-5 text-muted-foreground" />
                            <span className="font-medium">{property.bathrooms}</span>
                            <span className="text-muted-foreground">
                                {property.bathrooms === 1 ? "banheiro" : "banheiros"}
                            </span>
                        </div>

                        {property.area && (
                            <div className="flex items-center gap-2">
                                <Square className="h-5 w-5 text-muted-foreground" />
                                <span className="font-medium">{formatArea(property.area)}</span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Property Description */}
            {property.description && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Descrição</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground leading-relaxed">
                            {property.description}
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}