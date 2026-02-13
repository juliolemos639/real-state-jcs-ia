"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { deleteOwner } from "@/app/actions/owners";
import { Trash2, Loader2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteOwnerButtonProps {
    ownerId: string;
    ownerName: string;
    propertiesCount?: number;
}

export function DeleteOwnerButton({
    ownerId,
    ownerName,
    propertiesCount = 0,
}: DeleteOwnerButtonProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            await deleteOwner(ownerId);
            router.push("/owners");
            router.refresh();
        } catch (error) {
            console.error("Erro ao deletar proprietário:", error);
            setIsLoading(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={isLoading}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    {isLoading ? "Deletando..." : "Deletar"}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Deletar proprietário?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Você está prestes a deletar <strong>{ownerName}</strong>.
                        {propertiesCount > 0 && (
                            <>
                                <br />
                                <br />
                                ⚠️ Este proprietário têm <strong>{propertiesCount}</strong>{" "}
                                {propertiesCount === 1 ? "imóvel" : "imóveis"} associado(s). Os imóveis serão
                                mantidos, mas a associação com o proprietário será removida.
                            </>
                        )}
                        <br />
                        <br />
                        Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Deletando...
                        </>
                    ) : (
                        "Deletar"
                    )}
                </AlertDialogAction>
            </AlertDialogContent>
        </AlertDialog>
    );
}
