import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { getDeveloperByIdAction } from "@/lib/actions";
import Link from "next/link";
import { notFound } from "next/navigation";

// Define interface for Developer
interface Developer {
    _id: string;
    name: string;
    bio?: string;
    skills: string[];
    createdAt: string;
    updatedAt: string;
}

interface DeveloperDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function DeveloperDetailPage({ params }: DeveloperDetailPageProps) {
    // Await and destructure params *before* the try block
    const { id } = await params;

    let developer: Developer | null = null;
    let error: string | null = null;

    try {
        // Use the awaited id
        developer = await getDeveloperByIdAction({ id });
    } catch (err: any) {
        // Log using the awaited id
        console.error(`Failed to fetch developer ${id}:`, err);
        if (err.message?.toLowerCase().includes('not found')) {
            notFound();
        }
        error = err.message || "Failed to load developer details.";
    }

    if (!developer && !error) {
        notFound();
    }

    if (error) {
        return (
            <div className="text-center text-red-500">
                <p>{error}</p>
                <Button variant="link" asChild>
                    <Link href="/developers">Back to Developers</Link>
                </Button>
            </div>
        );
    }

    if (!developer) return null;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                        <CardTitle className="text-2xl">{developer.name}</CardTitle>
                        <CardDescription>Profile created: {new Date(developer.createdAt).toLocaleDateString()}</CardDescription>
                    </div>
                    <div className="flex space-x-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/developers/${developer._id}/edit`}>Edit Profile</Link>
                        </Button>
                        {/* Delete Button Placeholder */}
                        {/* <Button variant="destructive" size="sm">Delete Profile</Button> */}
                    </div>
                </CardHeader>
                <CardContent>
                    {developer.bio && (
                        <>
                            <h3 className="font-semibold mb-2">Bio</h3>
                            <p className="text-muted-foreground mb-4 whitespace-pre-wrap">
                                {developer.bio}
                            </p>
                        </>
                    )}

                    <h3 className="font-semibold mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {developer.skills.map((skill) => (
                            <Badge key={skill} variant="secondary">
                                {skill}
                            </Badge>
                        ))}
                        {developer.skills.length === 0 && (
                            <p className="text-sm text-muted-foreground">No skills listed.</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Button variant="link" asChild className="mt-4">
                <Link href="/developers">← Back to All Developers</Link>
            </Button>
        </div>
    );
} 