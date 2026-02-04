"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { deleteProperty } from "@/app/actions/properties";
import { Loader2 } from "lucide-react";

export function DeletePropertyButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="destructive"
      size="sm"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await deleteProperty(id);
          window.location.href = "/";
        })
      }
    >
      {isPending ? <Loader2 className="size-4 animate-spin" /> : "Excluir"}
    </Button>
  );
}
