import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnquiryForm } from "@/components/enquiry-form";

interface EnquirySectionProps {
    propertyId: string;
}

export function EnquirySection({ propertyId }: EnquirySectionProps) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Interessado?</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-6">
                        Entre em contato conosco para mais informações sobre este imóvel.
                    </p>
                    <EnquiryForm propertyId={propertyId} />
                </CardContent>
            </Card>
        </div>
    );
}