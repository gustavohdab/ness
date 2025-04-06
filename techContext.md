# Tech Context

## 1. Core Technologies

-   **Frontend Framework:** Next.js 15 (App Router)
-   **UI Library:** React 19
-   **Component Library:** Shadcn UI
-   **Backend Runtime:** Node.js (Latest LTS recommended)
-   **Backend Framework:** Express.js
-   **Database:** MongoDB
-   **AI Component:** TBD (e.g., OpenAI API, Hugging Face Transformers, local model)

## 2. Development Environment

-   **Package Manager:** npm or yarn (User preference)
-   **Version Control:** Git
-   **Code Editor:** (User preference, e.g., VS Code)
-   **OS:** (User's OS - win32 10.0.26100)
-   **Shell:** (User's shell - C:\Program Files\Git\usr\bin\bash.exe)

## 3. Key Libraries/Tools (Potential)

-   **ODM (MongoDB):** Mongoose
-   **State Management:** Zustand / Jotai / React Context
-   **Authentication:** NextAuth.js / Clerk
-   **Styling:** Tailwind CSS (via Shadcn)
-   **Linting/Formatting:** ESLint, Prettier
-   **API Testing:** Postman / Insomnia
-   **Deployment:** Vercel, Render, Docker (TBD)

## 4. Setup Notes

-   Requires Node.js and npm/yarn installed.
-   Requires Git installed.
-   MongoDB instance needed (local or cloud Atlas).
-   API keys for AI services if applicable.

## 5. Frontend Development Practices

-   **Handling Action State & Side Effects:**
    -   When implementing client-side UI updates (e.g., toasts, redirects) based on Server Action results, leverage the latest recommended React hooks (currently `useActionState` or `useFormState`).
    -   For triggering side effects based on the action's result state, use `useEffect` as the standard pattern.
    -   However, actively research and favor newer, potentially simpler official React patterns for managing action-related side effects as they emerge, particularly if they reduce the need for `useEffect`.
