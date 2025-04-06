'use client';

import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { deleteJobAction } from "@/lib/actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface JobListRowActionsProps {
    jobId: string;
    jobTitle: string;
}

export function JobListRowActions({ jobId, jobTitle }: JobListRowActionsProps) {
    const router = useRouter();

    return (
        <div className="flex space-x-2">
            <Button asChild variant="outline" size="sm">
                <Link href={`/jobs/${jobId}`} aria-label={`View ${jobTitle} job`}>View</Link>
            </Button>
            <ConfirmationDialog
                triggerButton={
                    <Button variant="destructive" size="sm">
                        Delete
                    </Button>
                }
                title={`Delete Job: ${jobTitle}?`}
                description="This action cannot be undone. This will permanently delete this job posting."
                confirmButtonLabel="Delete"
                onConfirm={async () => {
                    const result = await deleteJobAction(jobId);
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
