'use client';

import DeveloperForm from "@/components/developers/DeveloperForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from 'next/navigation';

export default function NewDeveloperPage() {
    const router = useRouter();

    const handleSuccess = (newDeveloperId?: string) => {
        console.log("Developer created successfully!");
        router.push('/developers');
    };

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Create Developer Profile</CardTitle>
                <CardDescription>Enter your details and skills.</CardDescription>
            </CardHeader>
            <CardContent>
                <DeveloperForm onSubmitSuccess={handleSuccess} />
            </CardContent>
        </Card>
    );
} 