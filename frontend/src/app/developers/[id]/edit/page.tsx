import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDeveloperByIdAction } from "@/lib/actions";
import { notFound } from "next/navigation";
import DeveloperFormWrapper from './DeveloperFormWrapper';

interface Developer {
    _id: string;
    name: string;
    bio?: string;
    skills: string[];
}

interface EditDeveloperPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditDeveloperPage({ params }: EditDeveloperPageProps) {
    const { id } = await params;

    let developer: Developer | null = null;

    try {
        developer = await getDeveloperByIdAction({ id });
    } catch (err: any) {
        console.error(`Failed to fetch developer ${id} for edit:`, err);
        notFound();
    }

    if (!developer) {
        notFound();
    }

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>Update details for {developer.name}</CardDescription>
            </CardHeader>
            <CardContent>
                <DeveloperFormWrapper initialData={developer} />
            </CardContent>
        </Card>
    );
} 