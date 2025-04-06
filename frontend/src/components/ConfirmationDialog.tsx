'use client'; // NO TOPO DO ARQUIVO

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"; // Importa do original
import { ReactNode, useState, useTransition } from "react";

interface ConfirmationDialogProps {
    triggerButton: ReactNode;
    title: string;
    description: string;
    confirmButtonLabel?: string;
    cancelButtonLabel?: string;
    onConfirm: () => Promise<any>;
    onSuccess?: (result: any) => void;
    onError?: (error: any) => void;
}

export function ConfirmationDialog({
    triggerButton,
    title,
    description,
    confirmButtonLabel = "Confirm",
    cancelButtonLabel = "Cancel",
    onConfirm,
    onSuccess,
    onError,
}: ConfirmationDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleConfirm = () => {
        startTransition(async () => {
            try {
                const result = await onConfirm();
                setIsOpen(false); // Fecha no sucesso
                if (onSuccess) {
                    onSuccess(result);
                }
            } catch (error) {
                console.error("ConfirmationDialog error:", error);
                setIsOpen(false); // Fecha no erro também
                if (onError) {
                    onError(error);
                }
            }
        });
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                {triggerButton}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>
                        {cancelButtonLabel}
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirm} disabled={isPending}>
                        {isPending ? "Processing..." : confirmButtonLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
