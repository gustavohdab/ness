import MatchResults from "@/components/jobs/MatchResults"; // UPDATED PATH
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { getJobByIdAction } from "@/lib/actions";
import Link from "next/link";
import { notFound } from "next/navigation";

// Define interface for Job (can be shared)
interface Job {
    _id: string;
    title: string;
    description: string;
    requiredSkills: string[];
    createdAt: string;
    updatedAt: string;
}

// Define props for the page component, including params
interface JobDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
    // Await and destructure params *before* the try block
    const { id } = await params;

    let job: Job | null = null;
    let error: string | null = null;

    try {
        // id is now guaranteed to be available here
        job = await getJobByIdAction({ id });
    } catch (err: any) {
        // Log using the id obtained before the try block
        console.error(`Failed to fetch job ${id}:`, err);

        if (err.message?.toLowerCase().includes('not found')) {
            notFound(); // Trigger Next.js 404 page
        }
        error = err.message || "Failed to load job details.";
    }

    // Handle case where job fetch succeeded but returned null/undefined (shouldn't happen with notFound)
    if (!job && !error) {
        notFound();
    }

    // Handle error state
    if (error) {
        return (
            <div className="text-center text-red-500">
                <p>{error}</p>
                <Button variant="link" asChild>
                    <Link href="/jobs">Back to Jobs</Link>
                </Button>
            </div>
        );
    }

    // Job must be defined here
    if (!job) return null; // Should be unreachable due to error/notFound handling

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                        <CardTitle className="text-2xl">{job.title}</CardTitle>
                        <CardDescription>Posted: {new Date(job.createdAt).toLocaleDateString()}</CardDescription>
                    </div>
                    <div className="flex space-x-2">
                        {/* Edit Button Placeholder - Link to edit page */}
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/jobs/${job._id}/edit`}>Edit</Link>
                        </Button>
                        {/* Delete Button Placeholder - Needs Client Component + Server Action */}
                        {/* <Button variant="destructive" size="sm">Delete</Button> */}
                    </div>
                </CardHeader>
                <CardContent>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground mb-4 whitespace-pre-wrap">
                        {job.description}
                    </p>

                    <h3 className="font-semibold mb-2">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {job.requiredSkills.map((skill) => (
                            <Badge key={skill} variant="secondary">
                                {skill}
                            </Badge>
                        ))}
                        {job.requiredSkills.length === 0 && (
                            <p className="text-sm text-muted-foreground">No skills listed.</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* AI Matching Section */}
            <MatchResults jobId={job._id} />

            <Button variant="link" asChild className="mt-4">
                <Link href="/jobs">← Back to All Jobs</Link>
            </Button>
        </div>
    );
} 