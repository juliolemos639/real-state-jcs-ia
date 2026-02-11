import Link from "next/link";
import Image from "next/image";
import { deleteProperty, getProperties } from "@/app/actions/properties";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DeletePropertyButton } from "@/components/property/delete-property-button";
import { MapPin, Bed, Bath, Square } from "lucide-react";
import { EditPropertyButton } from "@/components/property/edit-property-button";
// import { ContextMenu } from "@/components/context-menu";

function formatPrice(value: string | { toString(): string }) {
  const n = Number(value);
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(n);
}

export default async function HomePage() {
  const properties = await getProperties();
  const isAdmin: boolean = true; // Replace with real auth logic
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Imóveis</h1>

        {/* {isAdmin && (
          <Button asChild>
            <Link href="/properties/new">Adicionar imóvel</Link>
          </Button>
        )} */}
      </div>

      {properties.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              Nenhum imóvel cadastrado ainda.
            </p>
            {isAdmin &&
              <Button asChild>
                <Link href="/properties/new">Cadastrar primeiro imóvel</Link>
              </Button>
            }
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => (
            <Card key={p.id} className="overflow-hidden" >
              <div className="relative aspect-video bg-muted">
                {p.imageUrl ? (
                  <Image
                    src={p.imageUrl}
                    alt={p.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <Square className="size-12" />
                  </div>
                )}

                <div className="absolute right-2 top-2">
                  <Badge variant="secondary">{formatPrice(p.price)}</Badge>
                </div>

                <div className="absolute bottom-2 left-2">
                  <Badge variant="secondary">Aluguel</Badge>
                </div>

              </div>
              <CardHeader className="pb-2">
                <CardTitle className="line-clamp-1 text-lg">
                  <Link
                    href={`/property/${p.id}`}
                    className="hover:underline"
                  >
                    {p.title}
                  </Link>
                </CardTitle>
                <CardDescription className="flex items-center gap-1 text-xs">
                  <MapPin className="size-3.5 shrink-0" />
                  <span className="line-clamp-1">{p.address}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Bed className="size-4" /> {p.bedrooms}
                </span>
                <span className="flex items-center gap-1">
                  <Bath className="size-4" /> {p.bathrooms}
                </span>
                {p.area != null && (
                  <span className="flex items-center gap-1">
                    <Square className="size-4" /> {p.area} m²
                  </span>
                )}
              </CardContent>
              <CardFooter className="flex gap-2 border-t pt-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/property/${p.id}`}>Ver detalhes</Link>
                </Button>
                {isAdmin &&
                  <div className="flex gap-2">
                    <DeletePropertyButton id={p.id} />
                    <EditPropertyButton id={p.id} />
                  </div>
                }


              </CardFooter>
              {/* {isAdmin && (
                <div className="flex w-full gap-2">
                  <ContextMenu />
                </div>)
              } */}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
