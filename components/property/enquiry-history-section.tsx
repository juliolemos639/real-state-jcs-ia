import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Calendar } from "lucide-react";

interface Enquiry {
    id: string;
    propertyId: string;
    name: string;
    email: string;
    phone: string | null;
    message: string;
    createdAt: string;
}

interface EnquiryHistorySectionProps {
    enquiries: Enquiry[];
}

interface EnquiryListItemProps {
    enquiry: Enquiry;
}

function EnquiryListItem({ enquiry }: EnquiryListItemProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h4 className="font-semibold text-lg">{enquiry.name}</h4>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Mail className="h-4 w-4" />
                                {enquiry.email}
                            </div>
                            {enquiry.phone && (
                                <div className="flex items-center gap-1">
                                    <Phone className="h-4 w-4" />
                                    {enquiry.phone}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {formatDate(enquiry.createdAt)}
                    </div>
                </div>
                <div className="border-t pt-4">
                    <p className="text-sm leading-relaxed">{enquiry.message}</p>
                </div>
            </CardContent>
        </Card>
    );
}

export function EnquiryHistorySection({ enquiries }: EnquiryHistorySectionProps) {
    if (!enquiries || enquiries.length === 0) {
        return (
            <div className="mt-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Consultas Recebidas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">
                                Nenhuma consulta foi recebida para este imóvel ainda.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="mt-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                        Consultas Recebidas
                        <Badge variant="secondary">{enquiries.length}</Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {enquiries.map((enquiry) => (
                            <EnquiryListItem key={enquiry.id} enquiry={enquiry} />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}