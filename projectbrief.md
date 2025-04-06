# Project Brief: AI Developer Candidate Matcher

## 1. Overview

A full-stack application designed as a learning project to explore AI-powered matching between job requirements and developer profiles. It allows companies to post jobs (specifying required skills) and developers to create profiles (listing their skills). An AI component suggests suitable developer candidates for each job.

## 2. Goals

-   Implement a functional web application using Next.js 15, React 19, and Shadcn for the frontend.
-   Develop a backend REST API using Node.js and Express for managing jobs, profiles, and AI interactions.
-   Integrate MongoDB to store job postings and developer profiles.
-   Incorporate an AI component (e.g., using keyword analysis or vector embeddings) to match developers to jobs based on skill similarity.
-   Gain practical experience with full-stack development, database modeling, API design, and AI integration.
-   Follow best practices for development, architecture, and documentation.

## 3. Scope (Initial)

-   **Core Features:**
    -   Company users can create, view, update, and delete job postings (CRUD).
    -   Developer users can create, view, update, and delete profiles (CRUD).
    -   AI matching functionality: Given a job, display a list of potentially suitable developers ranked by relevance.
-   **AI Component:** Initial implementation might use enhanced keyword matching. Potential extension to use vector embeddings for semantic matching.
-   **Database:** MongoDB schemas for `Jobs` and `Developers`.
-   **Frontend:** Basic UI for listing/creating/editing jobs and profiles, and displaying match results.
-   **Authentication:** Simple or mock authentication initially (TBD: Full implementation like NextAuth.js could be a later goal).

## 4. Target Audience

-   Primarily for the developer(s) as a learning tool.

## 5. Success Criteria

-   A demonstrable application where jobs can be created, developer profiles exist, and clicking a 'match' button on a job displays relevant developers.
-   The AI matching logic provides reasonable results based on skill overlap.
-   Clear, well-documented code and architecture for frontend, backend, and database.
-   Successful completion of the learning objectives related to the tech stack and AI integration.
