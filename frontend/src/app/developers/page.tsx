import { DeveloperListRowActions } from "@/components/developers/DeveloperListRowActions";
import { SearchInput } from "@/components/ui/SearchInput";
import { SkillsFilter } from "@/components/ui/SkillsFilter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getAllDevelopersAction } from '@/lib/actions';
import Link from 'next/link';

// Define an interface for the Developer shape
interface Developer {
    _id: string;
    name: string;
    bio?: string;
    skills: string[];
    createdAt: string;
    updatedAt: string;
}

// Interface remains simple
interface PageProps {
    searchParams?: Promise<{ [key: string]: string | undefined }>;
}

export default async function DevelopersPage({ searchParams }: PageProps) {
    // Await the searchParams object itself
    const resolvedSearchParams = await searchParams;

    // Read params from the awaited object
    const page = resolvedSearchParams?.['page'] ?? '1';
    const limit = resolvedSearchParams?.['limit'] ?? '10';
    const search = resolvedSearchParams?.['search'] ?? '';
    const skills = resolvedSearchParams?.['skills'] ?? '';

    const currentPage = Number(page);
    const currentLimit = Number(limit);

    let devsData = {
        data: [] as Developer[],
        totalItems: 0,
        totalPages: 1,
    };
    let error: string | null = null;

    try {
        // Fetch developers for the current page with filters
        const result = await getAllDevelopersAction(currentPage, currentLimit, search, skills);
        devsData = {
            data: result.data,
            totalItems: result.totalItems,
            totalPages: result.totalPages,
        };
    } catch (err: any) {
        console.error("Failed to fetch developers:", err);
        error = err.message || "Failed to load developers. Please try again later.";
    }

    const developers = devsData.data;
    const totalPages = devsData.totalPages;
    const totalItems = devsData.totalItems;

    // --- Pagination URL Logic --- 
    const createPageURL = (pageNumber: number) => {
        const params = new URLSearchParams(resolvedSearchParams as Record<string, string>);
        params.set('page', pageNumber.toString());
        params.set('limit', currentLimit.toString());
        return `/developers?${params.toString()}`;
    };

    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage >= totalPages;
    // --- End Pagination URL Logic --- 

    const hasFilters = search !== '' || skills !== '';
    const noResultsFound = developers.length === 0 && totalItems === 0 && hasFilters;
    const noDevelopersYet = developers.length === 0 && totalItems === 0 && !hasFilters;

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <CardTitle>Developers</CardTitle>
                        <CardDescription>Browse, filter, and manage developer profiles.</CardDescription>
                    </div>
                    <Button asChild>
                        <Link href="/developers/new">Create New Profile</Link>
                    </Button>
                </div>
                {/* Add Filter Row */}
                <div className="mt-4 flex items-center gap-2">
                    <SearchInput initialValue={search} placeholder="Search name/bio..." />
                    <SkillsFilter initialValue={skills} title="Skills" />
                </div>
            </CardHeader>
            <CardContent>
                {error ? (
                    <p className="text-red-500 text-center py-10">{error}</p>
                ) : noResultsFound ? (
                    <p className="text-center text-muted-foreground py-10">
                        No developers found matching your filters.
                    </p>
                ) : noDevelopersYet ? (
                    <p className="text-center text-muted-foreground py-10">
                        No developers found.
                    </p>
                ) : (
                    <>
                        <Table aria-label="Developer Profiles List">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead className="hidden md:table-cell">Bio</TableHead>
                                    <TableHead>Skills</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {developers.map((dev) => (
                                    <TableRow key={dev._id}>
                                        <TableCell className="font-medium">{dev.name}</TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            {dev.bio && dev.bio.length > 60
                                                ? `${dev.bio.substring(0, 60)}...`
                                                : dev.bio}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1 max-w-xs">
                                                {dev.skills.slice(0, 5).map((skill) => (
                                                    <Badge key={skill} variant="secondary">{skill}</Badge>
                                                ))}
                                                {dev.skills.length > 5 && (
                                                    <Badge variant="outline">+{dev.skills.length - 5} more</Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right flex justify-end">
                                            <DeveloperListRowActions developerId={dev._id} developerName={dev.name} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {/* Message for empty page when paginating */}
                                {developers.length === 0 && totalItems > 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                                            No results found for this page.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-4 flex justify-center">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                href={createPageURL(currentPage - 1)}
                                                aria-disabled={isFirstPage}
                                                tabIndex={isFirstPage ? -1 : undefined}
                                                className={isFirstPage ? 'pointer-events-none opacity-50' : undefined}
                                            />
                                        </PaginationItem>
                                        <PaginationItem className="hidden sm:block">
                                            <span className="px-4 py-2 text-sm font-medium">
                                                Page {currentPage} of {totalPages}
                                            </span>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationNext
                                                href={createPageURL(currentPage + 1)}
                                                aria-disabled={isLastPage}
                                                tabIndex={isLastPage ? -1 : undefined}
                                                className={isLastPage ? 'pointer-events-none opacity-50' : undefined}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
} 