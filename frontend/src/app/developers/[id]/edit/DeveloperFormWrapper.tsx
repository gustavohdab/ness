'use client';

import DeveloperForm from '@/components/developers/DeveloperForm'; // UPDATED PATH
import { useRouter } from 'next/navigation';

interface Developer {
    _id: string;
    name: string;
    bio?: string;
    skills: string[];
}

interface DeveloperFormWrapperProps {
    initialData: Developer;
}

export default function DeveloperFormWrapper({ initialData }: DeveloperFormWrapperProps) {
    const router = useRouter();

    const handleSuccess = (updatedDeveloperId?: string) => {
        console.log("Developer updated successfully!");
        if (updatedDeveloperId) {
            router.push(`/developers/${updatedDeveloperId}`);
        } else {
            router.push('/developers');
        }
    };

    return (
        <DeveloperForm initialData={initialData} onSubmitSuccess={handleSuccess} />
    );
} 