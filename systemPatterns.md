# System Patterns: AI Developer Candidate Matcher

## 1. High-Level Architecture

-   **Frontend (Client):** Next.js 15 (App Router), React 19, Shadcn UI, Tailwind CSS.
    -   Responsible for displaying UI for Job Postings and Developer Profiles.
    -   Handles user input for creating/editing jobs and profiles.
    -   Initiates requests to the backend API for data and actions (CRUD, matching).
    -   Displays AI-generated match results.
    -   Leverages Server Components for data fetching and Client Components for interactivity.
-   **Backend (Server):** Node.js, Express.js REST API.
    -   Provides API endpoints (`/api/jobs`, `/api/developers`, `/api/jobs/:id/match`).
    -   Handles business logic for CRUD operations on jobs and developers.
    -   Contains the core AI Matching Logic.
    -   Interacts with the MongoDB database via Mongoose.
-   **Database:** MongoDB (using Mongoose ODM).
    -   Stores `jobs` collection (schema: `title`, `description`, `requiredSkills: [String]`, etc.).
    -   Stores `developers` collection (schema: `name`, `bio`, `skills: [String]`, etc.).
-   **AI Matching Logic (Hosted in Backend):**
    -   **Initial Approach:** Keyword/Skill Set Comparison. When matching is requested for a job:
        1. Retrieve the `requiredSkills` for the job.
        2. Retrieve all developers and their `skills`.
        3. Implement an algorithm (e.g., Jaccard index, simple overlap count) to calculate a relevance score between the job's required skills and each developer's skills.
        4. Return a ranked list of developers based on the score.
    -   **Potential Future Extension:** Vector Embeddings. Convert skill lists/descriptions to vectors and use cosine similarity for semantic matching.
-   **Deployment (Planned):**
    -   Frontend (Next.js): Vercel
    -   Backend (Node.js/Express): Render / Fly.io / Similar PaaS
    -   Database (MongoDB): MongoDB Atlas (Cloud)

## 2. Key Technical Decisions (Initial)

-   **AI Matching Method:** Start with backend-implemented keyword/skill set overlap calculation.
-   **Authentication:** Defer implementation. Assume public access or basic role simulation initially.
-   **State Management (Frontend):** Primarily rely on Next.js App Router features (Server Components, `fetch` in Server Actions/Route Handlers) and basic React state (`useState`, `useReducer`, `Context`) for client-side needs.
-   **Real-time Communication:** Not required for core functionality.
-   **Database Interaction:** Mongoose ODM for schema definition and database operations.
-   **API Style:** RESTful principles for backend API endpoints.
-   **Error Handling:** Standard Express middleware for backend error handling; appropriate UI feedback on the frontend.

## 3. Development Patterns & Reinforcement Rules

### 3.1 Handling Dynamic Route Params in Async Server Components (Next.js 15+)

-   **Problem:** Encountered `Error: Route "/path/[id]" used \`params.id\`. \`params\` should be awaited before using its properties.`when accessing`params`within async Server Components, especially on dynamic routes (e.g.,`[id]/page.tsx`).
-   **Solution:** To reliably access route parameters in async Server Components:
    1.  Define the `params` prop type as a `Promise` in the component's props interface:
        ````typescript
        interface PageProps {\n            params: Promise<{ id: string; /* other params */ }>;\n        }\n        ```
        ````
    2.  Explicitly `await` the `params` object _before_ any `try...catch` block where its properties might be needed (especially for fetching data or logging errors):
        ````typescript
        export default async function Page({ params }: PageProps) {\n            const { id } = await params; // Await and destructure BEFORE try block\n\n            let data = null;\n            try {\n                data = await fetchDataAction({ id }); \n            } catch (error) {\n                console.error(`Failed operation for id: ${id}`, error);\n                // ... handle error ...\n            }\n            // ... rest of component using id and data ...\n        }\n        ```
        ````
-   **Reinforcement:** Always use this `await params` pattern for dynamic route Server Components in this project to avoid the potential runtime error.

## 4. Backend API Specification (v1 - Initial)

**Base Path:** `/api`

### 4.1 Jobs Resource (`/jobs`)

-   **`GET /jobs`**: List all job postings.
    -   **Query Parameters (Optional):**
        -   `page` (Number): Page number for pagination (Default: 1)
        -   `limit` (Number): Items per page (Default: 10)
        -   `search` (String): Keyword search term (searches `title`, `description`).
        -   `skills` (String): Comma-separated list of skills to filter by (matches jobs requiring _all_ listed skills).
    -   **Response:** `200 OK`
        ```json
        {
            "data": [
                {
                    "_id": "job_id_1",
                    "title": "Frontend Developer",
                    "description": "Build awesome UIs.",
                    "requiredSkills": ["react", "next.js", "typescript"],
                    "createdAt": "timestamp",
                    "updatedAt": "timestamp"
                }
                // ... other jobs
            ],
            "totalPages": 5,
            "currentPage": 1
        }
        ```
-   **`POST /jobs`**: Create a new job posting.
    -   **Request Body:**
        ```json
        {
            "title": "Backend Developer",
            "description": "Build robust APIs.",
            "requiredSkills": ["Node.js", "Express", "MongoDB"]
        }
        ```
    -   **Response:** `201 Created`
        ```json
        {
            "_id": "new_job_id",
            "title": "Backend Developer",
            "description": "Build robust APIs.",
            "requiredSkills": ["Node.js", "Express", "MongoDB"],
            "createdAt": "timestamp",
            "updatedAt": "timestamp"
        }
        ```
    -   **Error Responses:** `400 Bad Request` (validation errors)
-   **`GET /jobs/:id`**: Get a specific job by ID.
    -   **Response:** `200 OK` (Job object) or `404 Not Found`
-   **`PUT /jobs/:id`**: Update a specific job by ID.
    -   **Request Body:** (Partial updates allowed)
        ```json
        {
            "title": "Senior Frontend Developer",
            "requiredSkills": ["React", "Next.js", "TypeScript", "GraphQL"]
        }
        ```
    -   **Response:** `200 OK` (Updated Job object) or `404 Not Found`
    -   **Error Responses:** `400 Bad Request` (validation errors)
-   **`DELETE /jobs/:id`**: Delete a specific job by ID.
    -   **Response:** `200 OK` `{ "message": "Job deleted successfully" }` or `404 Not Found`

### 4.2 Developers Resource (`/developers`)

-   **`GET /developers`**: List all developer profiles.
    -   **Query Parameters (Optional):**
        -   `page` (Number): Page number for pagination (Default: 1)
        -   `limit` (Number): Items per page (Default: 10)
        -   `search` (String): Keyword search term (searches `name`, `bio`).
        -   `skills` (String): Comma-separated list of skills to filter by (matches developers possessing _all_ listed skills).
    -   **Response:** `200 OK`
        ```json
        {
            "data": [
                {
                    "_id": "dev_id_1",
                    "name": "Alice Wonderland",
                    "bio": "Full-stack explorer.",
                    "skills": ["react", "node.js", "mongodb"],
                    "createdAt": "timestamp",
                    "updatedAt": "timestamp"
                }
                // ... other developers
            ],
            "totalPages": 3,
            "currentPage": 1
        }
        ```
-   **`POST /developers`**: Create a new developer profile.
    -   **Request Body:**
        ```json
        {
            "name": "Bob The Builder",
            "bio": "Can fix anything.",
            "skills": ["JavaScript", "CSS", "HTML", "Problem Solving"]
        }
        ```
    -   **Response:** `201 Created` (Developer object)
    -   **Error Responses:** `400 Bad Request` (validation errors)
-   **`GET /developers/:id`**: Get a specific developer by ID.
    -   **Response:** `200 OK` (Developer object) or `404 Not Found`
-   **`PUT /developers/:id`**: Update a specific developer profile by ID.
    -   **Request Body:** (Partial updates allowed)
        ```json
        {
            "bio": "Experienced full-stack engineer.",
            "skills": ["React", "Node.js", "MongoDB", "AWS"]
        }
        ```
    -   **Response:** `200 OK` (Updated Developer object) or `404 Not Found`
    -   **Error Responses:** `400 Bad Request` (validation errors)
-   **`DELETE /developers/:id`**: Delete a specific developer profile by ID.
    -   **Response:** `200 OK` `{ "message": "Developer profile deleted successfully" }` or `404 Not Found`

### 4.3 Matching Resource (`/jobs/:id/match`)

-   **`GET /jobs/:id/match`**: Get ranked developer matches for a specific job.
    -   **Response:** `200 OK`
        ```json
        [
            {
                "developer": {
                    "_id": "dev_id_1",
                    "name": "Alice Wonderland",
                    "bio": "Full-stack explorer.",
                    "skills": ["React", "Node.js", "MongoDB"]
                    // ... other developer fields
                },
                "score": 0.85 // Example score based on matching algorithm
            },
            {
                "developer": {
                    "_id": "dev_id_3",
                    "name": "Charlie Chaplin",
                    "skills": ["React", "TypeScript"]
                    // ... other developer fields
                },
                "score": 0.6
            }
            // ... other ranked matches
        ]
        ```
    -   **Error Responses:** `404 Not Found` (if job ID is invalid)

## 5. Database Schemas (Mongoose)

These schemas define the structure of documents within their respective MongoDB collections. Timestamps (`createdAt`, `updatedAt`) are automatically managed by Mongoose.

### 5.1 Job Schema (`models/Job.js`)

```javascript
const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Job title is required."],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Job description is required."],
            trim: true,
        },
        requiredSkills: [
            {
                type: String,
                required: [true, "At least one skill is required."],
                trim: true,
                lowercase: true, // Standardize skills for matching
            },
        ],
    },
    { timestamps: true }
);

// Potential Index for faster skill-based lookups if needed later
// jobSchema.index({ requiredSkills: 1 });

module.exports = mongoose.model("Job", jobSchema);
```

### 5.2 Developer Schema (`models/Developer.js`)

```javascript
const mongoose = require("mongoose");

const developerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Developer name is required."],
            trim: true,
        },
        bio: {
            type: String,
            trim: true,
            default: "",
        },
        skills: [
            {
                type: String,
                required: [true, "At least one skill is required."],
                trim: true,
                lowercase: true, // Standardize skills for matching
            },
        ],
    },
    { timestamps: true }
);

// Index for efficient lookup by skills
developerSchema.index({ skills: 1 });

module.exports = mongoose.model("Developer", developerSchema);
```

## 6. Frontend Structure & Data Flow (Next.js App Router)

### 6.1 Project Structure (Revised)

_Centralizing feature-specific components previously nested in route segments into the main `src/components` directory, organized by feature._

```
/app
  /layout.tsx
  /page.tsx
  /jobs
    /page.tsx
    /new/page.tsx
    /[id]
      /page.tsx
      /edit/page.tsx
      /edit/JobFormWrapper.tsx    # Wrapper for client-side redirect logic
      /components/              # <-- REMOVED: No longer storing components here
        # MatchResults.tsx      # MOVED
        # JobForm.tsx           # MOVED
  /developers
    /page.tsx
    /new/page.tsx
    /[id]
      /page.tsx
      /edit/page.tsx
      /edit/DeveloperFormWrapper.tsx # Wrapper for client-side redirect logic
      /components/              # <-- REMOVED: No longer storing components here
        # DeveloperForm.tsx     # MOVED
  /components/                # Shared & Feature Components
    /jobs/                    # Feature-specific components for Jobs
      JobForm.tsx             # MOVED HERE
      MatchResults.tsx        # MOVED HERE
    /developers/              # Feature-specific components for Developers
      DeveloperForm.tsx       # MOVED HERE
    /ui/                      # Shadcn UI components (e.g., button.tsx, card.tsx)
      ...
    Header.tsx                # Shared layout component
    Footer.tsx                # Shared layout component
  /lib/
    actions.ts
    api.ts
    utils.ts
/models/ (or /types/)
  index.ts
```

### 6.2 Data Flow Strategy

-   **Data Fetching (Read):** Primarily use **Server Components** (`page.tsx` files in `/jobs` and `/developers`). These components will fetch data directly on the server (either via Server Actions calling the backend API or direct `fetch` calls if colocating). This minimizes client-side JavaScript and improves initial load performance.
-   **Data Mutation (Create, Update, Delete):** Use **Server Actions** defined in `/lib/actions.ts`. Client Components (like forms - `JobForm.tsx`, `DeveloperForm.tsx`) will import and call these server actions directly upon form submission or button click. React 19's `useTransition` and `useOptimistic` hooks can be used for pending/optimistic UI updates.
-   **AI Matching:**
    1.  The Job Detail page (`/app/jobs/[id]/page.tsx`) will be a Server Component, fetching the job details.
    2.  Within this page, include a Client Component (e.g., `MatchResults.tsx` or a simple button).
    3.  Clicking the "Find Matches" button in the Client Component will trigger a Server Action (`getMatchesForJob(jobId)`).
    4.  The Server Action calls the backend API endpoint (`GET /api/jobs/:id/match`).
    5.  The Server Action returns the ranked list of developers.
    6.  The Client Component uses `useState` to store the match results and displays them.
-   **State Management:** Keep client-side state minimal. Use React's built-in hooks (`useState`, `useReducer`, `useContext`) within Client Components where necessary (e.g., form state, UI toggles, storing fetched match results). Avoid complex global state managers initially.
-   **UI Components:** Utilize Shadcn UI components extensively for building the user interface quickly and consistently.

### 6.X Filtering/Searching Components (Task 47)

-   **`components/ui/SearchInput.tsx` (New - Client):**
    -   Reusable input component for keyword search.
    -   Likely uses Shadcn `Input`.
    -   Manages its own state debounce/throttling before triggering URL update.
    -   Updates the `search` URL query parameter.
-   **`components/ui/SkillsFilter.tsx` (New - Client):**
    -   Reusable component for filtering by skills.
    -   Could use Shadcn `MultiSelect` (if available/added) or a custom implementation with `Command` + `Badges`.
    -   Manages selected skills state.
    -   Updates the `skills` URL query parameter (comma-separated string).
-   **`jobs/page.tsx` & `developers/page.tsx` (Updates - Server):**
    -   Read `search` and `skills` from `searchParams`.
    -   Pass these parameters to `getAllJobsAction`/`getAllDevelopersAction`.
    -   Render `SearchInput` and `SkillsFilter` components, passing initial values from `searchParams`.
-   **`lib/actions.ts` (Updates):**
    -   Modify `getAllJobsAction`/`getAllDevelopersAction` to accept `search` and `skills` parameters.
    -   Pass these parameters in the `fetchApi` call to the backend.

## 7. AI Matching Algorithm (v1 - Keyword Overlap)

This section details the initial algorithm used by the backend (`GET /api/jobs/:id/match`) to find suitable developer candidates for a given job based on skill overlap.

**Goal:** To provide a simple, baseline matching mechanism.

**Assumptions:**

-   Skills in both `Job.requiredSkills` and `Developer.skills` are stored as arrays of strings.
-   Skills are consistently stored in lowercase (enforced by Mongoose schema) to ensure case-insensitive matching.

**Algorithm Steps:**

1.  **Input:** `jobId` (from the API request path).
2.  **Fetch Job:** Retrieve the specific job document from MongoDB using `jobId`.
    -   If not found, return `404 Not Found`.
    -   Extract the `requiredSkills` array (let's call it `jobSkills`).
3.  **Fetch Developers:** Retrieve all developer documents from MongoDB.
    -   Consider optimization for large datasets later (e.g., fetching only developers with at least one matching skill using database indices), but for v1, fetch all.
4.  **Calculate Scores:** For each developer:
    -   Get the developer's `skills` array (let's call it `devSkills`).
    -   Calculate the **intersection** of `jobSkills` and `devSkills` (i.e., the skills present in both arrays).
    -   Calculate the **score** as the ratio of matching skills to the total required skills for the job:
        ```
        score = (number of skills in intersection) / (number of skills in jobSkills)
        ```
        -   Example: Job requires `["react", "node", "css"]`. Developer has `["react", "css", "java"]`. Intersection is `["react", "css"]`. Score = 2 / 3 = 0.67.
    -   Store the developer object and the calculated score.
5.  **Filter & Rank:**
    -   Filter out developers with a score of 0 (no matching skills).
    -   Sort the remaining developers in descending order based on their score.
6.  **Output:** Return the ranked list of `{ developer, score }` objects as specified in the API documentation (Section 3.3).

**Example Calculation (Pseudo-code):**

```
function calculateMatchScore(jobSkills, devSkills) {
  const jobSkillSet = new Set(jobSkills);
  const devSkillSet = new Set(devSkills);

  let intersectionSize = 0;
  for (const skill of devSkillSet) {
    if (jobSkillSet.has(skill)) {
      intersectionSize++;
    }
  }

  if (jobSkills.length === 0) {
    return 0; // Avoid division by zero
  }

  return intersectionSize / jobSkills.length;
}
```

**Future Enhancements:**

-   Consider weighting important skills.
-   Implement more sophisticated matching using NLP/Vector Embeddings.
