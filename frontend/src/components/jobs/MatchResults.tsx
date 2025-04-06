'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getMatchesForJobAction } from "@/lib/actions";
import Link from 'next/link';
import { useState } from 'react';

// Define interfaces (consider sharing these via a types file)
interface Developer {
    _id: string;
    name: string;
    bio?: string;
    skills: string[];
}

interface Match {
    developer: Developer;
    score: number;
}

interface MatchResultsProps {
    jobId: string;
}

export default function MatchResults({ jobId }: MatchResultsProps) {
    const [matches, setMatches] = useState<Match[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleFindMatches = async () => {
        setIsLoading(true);
        setError(null);
        setMatches(null);
        try {
            const results = await getMatchesForJobAction({ jobId });
            setMatches(results);
        } catch (err: any) {
            console.error("Failed to get matches:", err);
            setError(err.message || "Failed to find matches. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Developer Matches</CardTitle>
                <CardDescription>Find suitable developers based on required skills.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button onClick={handleFindMatches} disabled={isLoading}>
                    {isLoading ? "Finding Matches..." : "Find Matching Developers"}
                </Button>

                {error && <p className="text-red-500 text-sm">Error: {error}</p>}

                {matches !== null && (
                    <div className="space-y-4">
                        {matches.length === 0 ? (
                            <p className="text-muted-foreground text-sm">No suitable developers found.</p>
                        ) : (
                            <>
                                <h4 className="font-medium">Top Matches:</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {matches.map((match) => (
                                        <Card key={match.developer._id}>
                                            <CardHeader>
                                                <CardTitle className="text-lg">
                                                    <Link href={`/developers/${match.developer._id}`} className="hover:underline">
                                                        {match.developer.name}
                                                    </Link>
                                                </CardTitle>
                                                <CardDescription>
                                                    Match Score: {Math.round(match.score * 100)}%
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <h5 className="text-sm font-medium mb-2">Skills:</h5>
                                                <div className="flex flex-wrap gap-1">
                                                    {match.developer.skills.map((skill) => (
                                                        <Badge key={skill} variant="secondary">{skill}</Badge>
                                                    ))}
                                                    {match.developer.skills.length === 0 && <span className="text-xs text-muted-foreground">No skills listed</span>}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 