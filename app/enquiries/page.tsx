import Link from "next/link";
import { getEnquiries } from "@/app/actions/enquiries";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function formatDate(d: Date | string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(d));
}

export default async function EnquiriesPage() {
  const enquiries = await getEnquiries();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Consultas</h1>

      {enquiries.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              Nenhuma consulta recebida ainda.
            </p>
            <Button asChild>
              <Link href="/">Ver imóveis e enviar consulta</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {enquiries.map((e) => (
            <Card key={e.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base">{e.name}</CardTitle>
                    <CardDescription>
                      {e.email}
                      {e.phone && ` · ${e.phone}`}
                    </CardDescription>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {formatDate(e.createdAt)}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">{e.message}</p>
                <Button variant="link" size="sm" className="h-auto p-0" asChild>
                  <Link href={`/properties/${e.property.id}`}>
                    Imóvel: {e.property.title}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
