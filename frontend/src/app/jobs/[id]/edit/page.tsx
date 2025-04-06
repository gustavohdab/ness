// This page needs to fetch data on the server first
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getJobByIdAction } from "@/lib/actions";
import { notFound } from "next/navigation";
import JobFormWrapper from './JobFormWrapper'; // Separate client component to handle redirection

// Define interface for Job
interface Job {
    _id: string;
    title: string;
    description: string;
    requiredSkills: string[];
    createdAt: string;
    updatedAt: string;
}

interface EditJobPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditJobPage({ params }: EditJobPageProps) {
    // Await and destructure params *before* the try block
    const { id } = await params;

    let job: Job | null = null;
    let error: string | null = null;

    try {
        // Use the awaited id
        job = await getJobByIdAction({ id });
    } catch (err: any) {
        // Log using the awaited id
        console.error(`Failed to fetch job ${id} for edit:`, err);
        if (err.message?.toLowerCase().includes('not found')) {
            notFound();
        }
        error = err.message || "Failed to load job data for editing.";
        // In a real app, might render an error message instead of 404 for non-not-found errors
        notFound();
    }

    if (!job) {
        notFound();
    }

    // Pass fetched data to a client component wrapper that handles the form and redirect
    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Edit Job</CardTitle>
                <CardDescription>Update the details for: {job.title}</CardDescription>
            </CardHeader>
            <CardContent>
                <JobFormWrapper initialData={job} />
            </CardContent>
        </Card>

    );
} 