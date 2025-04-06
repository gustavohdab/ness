'use client';

import JobForm from '@/components/jobs/JobForm'; // UPDATED PATH
import { useRouter } from 'next/navigation';

// Define props for the component
interface JobFormWrapperProps {
    initialData: {
        _id: string;
        title: string;
        description: string;
        requiredSkills: string[];
    }
}

export default function JobFormWrapper({ initialData }: JobFormWrapperProps) {
    const router = useRouter();

    const handleSuccess = (updatedJobId?: string) => {
        console.log("Job updated successfully!");
        // Redirect to the job detail page after successful update
        if (updatedJobId) {
            router.push(`/jobs/${updatedJobId}`);
        } else {
            // Fallback if ID isn't returned, though it should be
            router.push('/jobs');
        }
    };

    return (
        <JobForm initialData={initialData} onSubmitSuccess={handleSuccess} />
    );
} 