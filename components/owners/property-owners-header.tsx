import Link from "next/link";
import { ChevronLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PropertyHeaderProps } from "@/app/properties/[id]/types";

interface OwnersHeaderProps {
    propertyTitle: string;
}

export function PropertyOwnersHeader({ propertyTitle }: OwnersHeaderProps) {
    return (
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
                            <Link href="/owners/new">Proprietários</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{propertyTitle}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Back to Listings Link */}
            <Button variant="ghost" asChild className="mb-4 p-0 h-auto">
                <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <ChevronLeft className="h-4 w-4" />
                    Voltar para listagem
                </Link>
            </Button>
        </div>
    );
}