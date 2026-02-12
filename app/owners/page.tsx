import Link from "next/link";
import { getOwners } from "@/app/actions/owners";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Mail, Phone } from "lucide-react";

interface Owner {
    id: string;
    name: string;
    address?: string | null;
    phone?: string | null;
    email?: string | null;
    imageUrl?: string | null;
    properties: any[];
    createdAt: string;
    updatedAt: string;
}

export default async function OwnersPage() {
    const owners = (await getOwners()) as Owner[];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-3xl font-bold">Proprietários</h1>
                <Button asChild>
                    <Link href="/owners/new" className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Novo Proprietário
                    </Link>
                </Button>
            </div>

            {owners.length === 0 ? (
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-center text-muted-foreground">
                            Nenhum proprietário cadastrado ainda.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {owners.map((owner) => (
                        <Link key={owner.id} href={`/owners/${owner.id}`}>
                            <Card className="h-full cursor-pointer transition hover:shadow-lg">
                                <CardHeader className="pb-3">
                                    {owner.imageUrl && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={owner.imageUrl}
                                            alt={owner.name}
                                            className="mb-3 h-32 w-full rounded-md object-cover"
                                        />
                                    )}
                                    <CardTitle>{owner.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {owner.address && (
                                        <p className="text-sm text-muted-foreground">{owner.address}</p>
                                    )}
                                    <div className="space-y-2">
                                        {owner.phone && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Phone className="h-4 w-4 text-muted-foreground" />
                                                <span>{owner.phone}</span>
                                            </div>
                                        )}
                                        {owner.email && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Mail className="h-4 w-4 text-muted-foreground" />
                                                <span>{owner.email}</span>
                                            </div>
                                        )}
                                    </div>
                                    {owner.properties && owner.properties.length > 0 && (
                                        <div className="pt-2">
                                            <Badge variant="secondary">
                                                {owner.properties.length}{" "}
                                                {owner.properties.length === 1 ? "imóvel" : "imóveis"}
                                            </Badge>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
