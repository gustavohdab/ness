"use server";

import { revalidatePath } from "next/cache";

// Read API Base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
    console.error(
        "FATAL ERROR: NEXT_PUBLIC_API_BASE_URL is not defined in environment variables."
    );
    // In server actions, throwing an error might be appropriate
    // Or provide a default for local dev, but log a warning
    // For now, let's throw to make it explicit
    throw new Error("API base URL configuration is missing.");
}

// Define a standard return type for server actions that perform mutations
export type ActionResult = {
    success: boolean;
    message: string;
    data?: any; // Optional data on success
    error?: string; // Optional error message string on failure
};

// --- Helper Function for API Calls ---
async function fetchApi(path: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${path}`;
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
            // Optional: Add cache control if needed, though Server Actions manage some aspects
            // cache: 'no-store', // Example: uncomment to prevent caching for this specific fetch
        });

        if (!response.ok) {
            // Attempt to parse error message from backend
            let errorData = {
                message: `HTTP error! status: ${response.status}`,
            };
            try {
                errorData = await response.json();
            } catch (e) {
                // Ignore if response body is not JSON
            }
            console.error(
                `API Error (${response.status}) on ${path}:`,
                errorData
            );
            throw new Error(
                errorData.message || `HTTP error! status: ${response.status}`
            );
        }

        // Handle responses that might not have a body (e.g., DELETE 200 OK)
        if (
            response.status === 204 ||
            response.headers.get("content-length") === "0"
        ) {
            return null; // Or return a specific success indicator if preferred
        }

        return await response.json();
    } catch (error) {
        console.error(`Fetch API error for ${url}:`, error);
        // Re-throw the error so the calling component can handle it
        throw error; // Ensure the original error (or a new Error based on it) is thrown
    }
}

// --- Job Actions ---

export async function getAllJobsAction(
    page: number = 1,
    limit: number = 10,
    search?: string,
    skills?: string
) {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", limit.toString());
    if (search) params.set("search", search);
    if (skills) params.set("skills", skills); // Skills should be comma-separated string

    return fetchApi(`/jobs?${params.toString()}`);
}

export async function getJobByIdAction(params: { id: string }) {
    const { id } = params;
    return fetchApi(`/jobs/${id}`);
}

export async function createJobAction(
    prevState: ActionResult,
    formData: FormData
): Promise<ActionResult> {
    try {
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        // Read from the hidden field name
        const skillsString = formData.get("skills_string") as string;

        // Basic validation example
        if (!title || !description || !skillsString) {
            throw new Error("Missing required fields.");
        }

        // Construct the object to send to the API
        const jobData = {
            title: title,
            description: description,
            requiredSkills: (skillsString || "") // Use the string from hidden field
                .split(",")
                .map((s: string) => s.trim())
                .filter(Boolean),
        };

        const newJob = await fetchApi("/jobs", {
            method: "POST",
            body: JSON.stringify(jobData),
        });
        revalidatePath("/jobs"); // Revalidate the job list page
        return {
            success: true,
            message: "Job created successfully.",
            data: newJob,
        };
    } catch (error: any) {
        console.error("Error in createJobAction:", error);
        return {
            success: false,
            message: "Failed to create job.",
            error: error.message || "Unknown error",
        };
    }
}

export async function updateJobAction(
    id: string,
    prevState: ActionResult,
    formData: FormData
): Promise<ActionResult> {
    try {
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        // Read from the hidden field name
        const skillsString = formData.get("skills_string") as string;

        // Basic validation
        if (!title || !description || !skillsString) {
            throw new Error("Missing required fields.");
        }

        // Construct the object to send to the API
        const jobData = {
            title: title,
            description: description,
            requiredSkills: (skillsString || "") // Use the string from hidden field
                .split(",")
                .map((s: string) => s.trim())
                .filter(Boolean),
        };

        const updatedJob = await fetchApi(`/jobs/${id}`, {
            method: "PUT",
            body: JSON.stringify(jobData),
        });
        revalidatePath("/jobs"); // Revalidate list
        revalidatePath(`/jobs/${id}`); // Revalidate detail page
        return {
            success: true,
            message: "Job updated successfully.",
            data: updatedJob,
        };
    } catch (error: any) {
        console.error("Error in updateJobAction:", error);
        return {
            success: false,
            message: "Failed to update job.",
            error: error.message || "Unknown error",
        };
    }
}

export async function deleteJobAction(id: string): Promise<ActionResult> {
    try {
        await fetchApi(`/jobs/${id}`, { method: "DELETE" });
        revalidatePath("/jobs"); // Revalidate list
        // No need to revalidate detail page as it will 404
        return { success: true, message: "Job deleted successfully." };
    } catch (error: any) {
        console.error("Error in deleteJobAction:", error);
        return {
            success: false,
            message: "Failed to delete job.",
            error: error.message || "Unknown error",
        };
    }
}

// --- Developer Actions ---

export async function getAllDevelopersAction(
    page: number = 1,
    limit: number = 10,
    search?: string,
    skills?: string
) {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", limit.toString());
    if (search) params.set("search", search);
    if (skills) params.set("skills", skills); // Skills should be comma-separated string

    return fetchApi(`/developers?${params.toString()}`);
}

export async function getDeveloperByIdAction(params: { id: string }) {
    const { id } = params;
    return fetchApi(`/developers/${id}`);
}

export async function createDeveloperAction(
    prevState: ActionResult,
    formData: FormData
): Promise<ActionResult> {
    try {
        const name = formData.get("name") as string;
        const bio = formData.get("bio") as string | undefined;
        // Read from the hidden field name
        const skillsString = formData.get("skills_string") as string;

        if (!name || !skillsString) {
            throw new Error("Missing required fields (name, skills).");
        }

        const devData = {
            name: name,
            bio: bio || "",
            skills: (skillsString || "") // Use string from hidden field
                .split(",")
                .map((s: string) => s.trim())
                .filter(Boolean),
        };

        const newDeveloper = await fetchApi("/developers", {
            method: "POST",
            body: JSON.stringify(devData),
        });
        revalidatePath("/developers");
        return {
            success: true,
            message: "Developer profile created successfully.",
            data: newDeveloper,
        };
    } catch (error: any) {
        console.error("Error in createDeveloperAction:", error);
        return {
            success: false,
            message: "Failed to create developer profile.",
            error: error.message || "Unknown error",
        };
    }
}

export async function updateDeveloperAction(
    id: string,
    prevState: ActionResult,
    formData: FormData
): Promise<ActionResult> {
    try {
        const name = formData.get("name") as string;
        const bio = formData.get("bio") as string | undefined;
        // Read from the hidden field name
        const skillsString = formData.get("skills_string") as string;

        if (!name || !skillsString) {
            throw new Error("Missing required fields (name, skills).");
        }

        const devData = {
            name: name,
            bio: bio || "",
            skills: (skillsString || "") // Use string from hidden field
                .split(",")
                .map((s: string) => s.trim())
                .filter(Boolean),
        };

        const updatedDeveloper = await fetchApi(`/developers/${id}`, {
            method: "PUT",
            body: JSON.stringify(devData),
        });
        revalidatePath("/developers");
        revalidatePath(`/developers/${id}`);
        return {
            success: true,
            message: "Developer profile updated successfully.",
            data: updatedDeveloper,
        };
    } catch (error: any) {
        console.error("Error in updateDeveloperAction:", error);
        return {
            success: false,
            message: "Failed to update developer profile.",
            error: error.message || "Unknown error",
        };
    }
}

export async function deleteDeveloperAction(id: string): Promise<ActionResult> {
    try {
        await fetchApi(`/developers/${id}`, { method: "DELETE" });
        revalidatePath("/developers");
        return {
            success: true,
            message: "Developer profile deleted successfully.",
        };
    } catch (error: any) {
        console.error("Error in deleteDeveloperAction:", error);
        return {
            success: false,
            message: "Failed to delete developer profile.",
            error: error.message || "Unknown error",
        };
    }
}

// --- Skill Actions ---

export async function getAllSkillsAction(): Promise<string[]> {
    // Assuming fetchApi returns the array directly
    const skills = await fetchApi(`/skills`);
    // Add type assertion or validation if necessary
    return skills as string[];
}

// --- Matching Action ---

export async function getMatchesForJobAction(params: { jobId: string }) {
    const { jobId } = params;
    if (!jobId) {
        throw new Error("Job ID is required for matching.");
    }
    return fetchApi(`/jobs/${jobId}/match`);
}
