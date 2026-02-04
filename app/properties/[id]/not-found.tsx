import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-md mx-auto text-center">
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <h2 className="text-2xl font-semibold mb-4">Imóvel não encontrado</h2>
                <p className="text-muted-foreground mb-8">
                    O imóvel que você está procurando não existe ou foi removido.
                </p>
                <div className="space-y-4">
                    <Button asChild className="w-full">
                        <Link href="/">Ver todos os imóveis</Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full">
                        <Link href="/">Voltar ao início</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}