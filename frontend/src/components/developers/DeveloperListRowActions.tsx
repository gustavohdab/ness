'use client';

import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { deleteDeveloperAction } from "@/lib/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DeveloperListRowActionsProps {
    developerId: string;
    developerName: string;
}

export function DeveloperListRowActions({ developerId, developerName }: DeveloperListRowActionsProps) {
    const router = useRouter();

    return (
        <div className="flex space-x-2">
            <Button asChild variant="outline" size="sm">
                <Link href={`/developers/${developerId}`} aria-label={`View ${developerName}'s profile`}>View Profile</Link>
            </Button>
            <ConfirmationDialog
                triggerButton={
                    <Button variant="destructive" size="sm">
                        Delete
                    </Button>
                }
                title={`Delete Developer: ${developerName}?`}
                description="This action cannot be undone. This will permanently delete this developer profile."
                confirmButtonLabel="Delete"
                onConfirm={async () => {
                    const result = await deleteDeveloperAction(developerId);
                    if (result.success) {
                        toast.success(result.message);
                        router.refresh();
                    } else {
                        toast.error(result.message, { description: result.error });
                    }
                }}
            />
        </div>
    );
}
