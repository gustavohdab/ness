import { JobListRowActions } from "@/components/jobs/JobListRowActions";
import { SearchInput } from "@/components/ui/SearchInput";
import { SkillsFilter } from "@/components/ui/SkillsFilter";
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
import { getAllJobsAction } from '@/lib/actions';
import Link from 'next/link';

// Define an interface for the Job shape (adjust based on actual API response)
interface Job {
    _id: string;
    title: string;
    description: string;
    requiredSkills: string[];
    createdAt: string;
    updatedAt: string;
}

// Interface remains simple, the await happens inside
interface PageProps {
    searchParams?: Promise<{ [key: string]: string | undefined }>;
}

export default async function JobsPage({ searchParams }: PageProps) {
    // Await the searchParams object itself
    const resolvedSearchParams = await searchParams;

    // Read params from the awaited object
    const page = resolvedSearchParams?.['page'] ?? '1';
    const limit = resolvedSearchParams?.['limit'] ?? '10';
    const search = resolvedSearchParams?.['search'] ?? '';
    const skills = resolvedSearchParams?.['skills'] ?? '';

    const currentPage = Number(page);
    const currentLimit = Number(limit);

    let jobsData = {
        data: [] as Job[],
        totalItems: 0,
        totalPages: 1,
    };
    let error: string | null = null;

    try {
        // Fetch jobs for the current page, including search and skills filters
        const result = await getAllJobsAction(currentPage, currentLimit, search, skills);
        // Assuming the action returns the structured object from backend
        jobsData = {
            data: result.data,
            totalItems: result.totalItems,
            totalPages: result.totalPages,
        };
    } catch (err: any) {
        console.error("Failed to fetch jobs:", err);
        error = err.message || "Failed to load jobs. Please try again later.";
    }

    const jobs = jobsData.data; // Extract jobs array
    const totalPages = jobsData.totalPages; // Extract total pages
    const totalItems = jobsData.totalItems; // Extract total items

    // --- Pagination URL Logic --- 
    const createPageURL = (pageNumber: number) => {
        const params = new URLSearchParams(resolvedSearchParams as Record<string, string>);
        params.set('page', pageNumber.toString());
        params.set('limit', currentLimit.toString());
        return `/jobs?${params.toString()}`;
    };

    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage >= totalPages;
    // --- End Pagination URL Logic --- 

    const hasFilters = search !== '' || skills !== '';
    const noResultsFound = jobs.length === 0 && totalItems === 0 && hasFilters;
    const noJobsYet = jobs.length === 0 && totalItems === 0 && !hasFilters;

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <CardTitle>Job Postings</CardTitle>
                        <CardDescription>View, filter, and manage job postings.</CardDescription>
                    </div>
                    <Button asChild>
                        <Link href="/jobs/new">Create New Job</Link>
                    </Button>
                </div>
                <div className="mt-4 flex items-center gap-2">
                    <SearchInput initialValue={search} placeholder="Search title/description..." />
                    <SkillsFilter initialValue={skills} title="Required Skills" />
                </div>
            </CardHeader>
            <CardContent>
                {error ? (
                    <p className="text-red-500 text-center py-10">{error}</p>
                ) : noResultsFound ? (
                    <p className="text-center text-muted-foreground py-10">
                        No jobs found matching your filters.
                    </p>
                ) : noJobsYet ? (
                    <p className="text-center text-muted-foreground py-10">
                        No jobs posted yet.
                    </p>
                ) : (
                    <>
                        <Table aria-label="Job Postings List">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead className="hidden md:table-cell">Description</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {jobs.map((job) => (
                                    <TableRow key={job._id}>
                                        <TableCell className="font-medium">{job.title}</TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            {job.description.length > 100
                                                ? `${job.description.substring(0, 100)}...`
                                                : job.description}
                                        </TableCell>
                                        <TableCell className="text-right flex justify-end">
                                            <JobListRowActions jobId={job._id} jobTitle={job.title} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {jobs.length === 0 && totalItems > 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                                            No results found for this page.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
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