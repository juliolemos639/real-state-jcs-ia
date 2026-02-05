import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { Badge } from "../ui/badge";

interface PropertyImageSectionProps {
    imageUrl: string | null;
    title: string;
    alt: string;
}

export function PropertyImageSection({ imageUrl, title, alt }: PropertyImageSectionProps) {
    if (!imageUrl) {
        return (
            <div className="mb-8">
                <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                        <ImageIcon className="h-16 w-16 mx-auto mb-2" />
                        <p>Imagem não disponível</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-8">
            <div className="relative w-full h-96 rounded-lg overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                    priority
                />
                <div>
                    {/* <span className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1">
                        Aluguel
                    </span> */}
                    <div className="absolute bottom-2 left-2 size-10">
                        <Badge variant="secondary">Aluguel</Badge>
                    </div>
                </div>
            </div>
        </div>
    );
}