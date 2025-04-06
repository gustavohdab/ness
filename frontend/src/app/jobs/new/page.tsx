'use client'; // Needs to be client to handle redirection

import JobForm from "@/components/jobs/JobForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from 'next/navigation';

export default function NewJobPage() {
    const router = useRouter();

    const handleSuccess = (newJobId?: string) => {
        console.log("Job created successfully!");
        // Redirect to the main jobs list after successful creation
        router.push('/jobs');
        // Or redirect to the new job's detail page:
        // if (newJobId) router.push(`/jobs/${newJobId}`);
    };

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Create New Job</CardTitle>
                <CardDescription>Fill out the details for the new job posting.</CardDescription>
            </CardHeader>
            <CardContent>
                <JobForm onSubmitSuccess={handleSuccess} />
            </CardContent>
        </Card>
    );
} 