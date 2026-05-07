# CLAUDE.md

This file documents the QuizFlow project for Claude Code sessions. **Rule: every time an exploration is done, a pattern is learned, or an insight is gained, it must be saved here under the relevant section.**

---

## Project Overview

QuizFlow is a full-stack quiz management platform. Users can create quizzes with multiple question types (boolean, short input, checkbox), edit them, and take them with live scoring. The project is a monorepo with a NestJS REST API backend and a Next.js 14 App Router frontend, connected to PostgreSQL via Prisma.

---

## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore the codebase.** The graph is faster, cheaper (fewer tokens), and gives you structural context (callers, dependents, test coverage) that file scanning cannot.

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes` or `query_graph` instead of Grep
- **Understanding impact**: `get_impact_radius` instead of manually tracing imports
- **Code review**: `detect_changes` + `get_review_context` instead of reading entire files
- **Finding relationships**: `query_graph` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview` + `list_communities`

Fall back to Grep/Glob/Read **only** when the graph doesn't cover what you need.

### Key Tools

| Tool | Use when |
|------|----------|
| `detect_changes` | Reviewing code changes — gives risk-scored analysis |
| `get_review_context` | Need source snippets for review — token-efficient |
| `get_impact_radius` | Understanding blast radius of a change |
| `get_affected_flows` | Finding which execution paths are impacted |
| `query_graph` | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes` | Finding functions/classes by name or keyword |
| `get_architecture_overview` | Understanding high-level codebase structure |
| `refactor_tool` | Planning renames, finding dead code |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend framework | NestJS 10 |
| Backend language | TypeScript 5 (commonjs, ES2021 target) |
| ORM | Prisma 5 |
| Database | PostgreSQL 16 |
| DTO validation | class-validator + class-transformer |
| Frontend framework | Next.js 14 (App Router) |
| Frontend language | TypeScript 5 (strict mode) |
| UI state | Redux Toolkit |
| Server state | RTK Query |
| Forms | react-hook-form + zod |
| Styles | Tailwind CSS 3 + tailwindcss-animate |
| Icons | lucide-react |
| Package manager | npm |

---

## Project Structure

```
quizflow/
├── backend/                        NestJS API (port 3002)
│   ├── src/
│   │   ├── main.ts                 Bootstrap — port, CORS, global pipes/interceptors
│   │   ├── app.module.ts           Root module — imports PrismaModule, QuizzesModule
│   │   ├── prisma/
│   │   │   ├── prisma.module.ts    Global Prisma module (isGlobal: true)
│   │   │   └── prisma.service.ts   PrismaClient wrapper + onModuleInit/Destroy
│   │   └── quizzes/
│   │       ├── dto/                Request/response shapes (never use raw Prisma types)
│   │       │   ├── create-quiz.dto.ts
│   │       │   ├── update-quiz.dto.ts
│   │       │   ├── quiz-summary.dto.ts
│   │       │   ├── quiz-detail.dto.ts
│   │       │   └── question.dto.ts
│   │       ├── quizzes.controller.ts  Routes only — delegates everything to service
│   │       ├── quizzes.service.ts     All business logic lives here
│   │       └── quizzes.module.ts
│   └── prisma/
│       ├── schema.prisma
│       └── seed.ts
└── frontend/                       Next.js 14 App Router (port 3000)
    ├── app/                        Route files only — thin re-exports from src/pages/
    │   ├── layout.tsx              Root layout — ReduxProvider, Header, Sidebar
    │   ├── page.tsx                redirect("/quizzes")
    │   ├── create/page.tsx
    │   └── quizzes/
    │       ├── page.tsx
    │       └── [id]/
    │           ├── page.tsx
    │           ├── edit/page.tsx
    │           └── take/page.tsx
    └── src/                        Feature-Sliced Design (FSD)
        ├── entities/
        │   └── quiz/               Business types — QuizSummary, QuizDetail, Question, QuestionType
        ├── features/
        │   ├── createQuiz/         Zod schema for quiz creation form
        │   └── deleteQuiz/         Redux slice for per-quiz delete loading state
        ├── shared/
        │   ├── api/                RTK Query — baseApi with all quiz endpoints
        │   ├── lib/                Redux store, RootState/AppDispatch types, cn() utility
        │   └── ui/                 Shared primitive components (FSD shared layer)
        ├── widgets/
        │   ├── Layout/             Header + Sidebar (always-visible shell)
        │   ├── QuizForm/           Create/edit form — supports both modes via existingQuiz prop
        │   ├── QuizList/           Quiz cards grid with delete
        │   ├── QuizDetail/         Read-only quiz preview with edit/take action buttons
        │   └── TakeQuiz/           Interactive quiz runner with scoring and results screen
        └── views/                  FSD pages layer (renamed from pages/ to avoid Next.js Pages Router conflict)
            ├── create/             CreateQuizPage
            ├── quiz-detail/        QuizDetailPage
            ├── edit-quiz/          EditQuizPage
            ├── quizzes/            QuizzesPage
            └── take-quiz/          TakeQuizPage
```

---

## Architecture

### Backend — NestJS patterns

**Controllers are dumb.** The controller's only job is to map HTTP to a service call and return the result. No conditionals, no data transformation, no Prisma calls — everything lives in the service.

```ts
// CORRECT — controller delegates
@Get(":id")
findOne(@Param("id") id: string): Promise<QuizDetailDto> {
    return this.quizzesService.findOne(id);
}

// WRONG — logic in controller
@Get(":id")
async findOne(@Param("id") id: string) {
    const quiz = await this.prisma.quiz.findUnique({ where: { id } });
    if (!quiz) throw new NotFoundException();
    return quiz;
}
```

**Services own all business logic.** Database queries, error handling (`NotFoundException`), data transformation, and orchestration all belong in the service.

**DTOs are the only public interface.** Never return raw Prisma model types from endpoints. Every response shape is an explicit DTO class decorated with `@Expose()`. The global `ClassSerializerInterceptor` with `excludeExtraneousValues: true` enforces this — any field without `@Expose()` is stripped from the response automatically.

**One module per resource.** Every new feature gets its own `<resource>.module.ts`, `<resource>.controller.ts`, `<resource>.service.ts`, and `dto/` folder. Register the module in `app.module.ts`.

**`PrismaModule` is global.** It is declared with `isGlobal: true`, so other modules do not need to import it — just inject `PrismaService` directly.

**Global pipes and interceptors are configured in `main.ts`:**
- `ValidationPipe` — `whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`
- `ClassSerializerInterceptor` — `excludeExtraneousValues: true`

**Update strategy for nested collections:** When updating a quiz, all questions are deleted and recreated (`deleteMany` + nested `create`). This avoids complex patch diffing. Acceptable for this domain.

**SOLID principles:**
- **S** — one class, one responsibility. Controller routes. Service orchestrates. Prisma service connects.
- **O** — extend by adding new services/modules, never by modifying existing ones.
- **L** — DTOs extend each other only when the contract is truly a subset.
- **I** — keep service methods focused; don't add unrelated methods to an existing service.
- **D** — depend on injected abstractions (`PrismaService`), not on `new PrismaClient()` inline.

---

### Frontend — Feature-Sliced Design (FSD)

**Layer import direction is strict — lower layers cannot import from higher layers:**

```
app (Next.js routes) → pages → widgets → features → entities → shared
```

No skipping layers upward. A `widget` can import from `features`, `entities`, and `shared`, but never from `pages`.

**FSD layer rules:**

| Layer | What belongs here | What does NOT belong here |
|---|---|---|
| `shared/ui` | Pure, stateless UI primitives — zero business logic | Domain data, API calls, complex state |
| `shared/lib` | Redux store, generic utilities (`cn`, `formatDate`) | Feature-specific logic, domain types |
| `shared/api` | RTK Query base API with all endpoint definitions | Business logic, UI state |
| `entities` | Business types and enums (`QuizSummary`, `QuestionType`) | Feature interactions, UI |
| `features` | Self-contained user interactions with their own state/validation | Layout composition, page orchestration |
| `widgets` | Composite UI blocks combining features/entities (QuizForm, TakeQuiz) | Page routing, app config |
| `pages` | Page components assembled from widgets — thin wrappers | Business logic, direct API calls |

**`app/` route files are re-exports only.** One-liner: `export { QuizzesPage as default } from "@/views/quizzes/ui/QuizzesPage"`. No JSX, no logic, no layout in route files — all that lives in `src/views/`.

**Every FSD slice must have an `index.ts` barrel.** Public API is what the barrel exports. Internal files are not consumed directly from outside the slice.

**`"use client"` goes only on leaf components that need it** — components with `useState`, `useEffect`, event handlers, or browser APIs. Server Components can render Client Components; don't mark a whole page client just because one child needs interactivity.

**RTK Query is the only data-fetching mechanism.** No `useEffect` + `fetch`. No `axios` directly in components. All endpoints are defined in `src/shared/api/baseApi.ts`.

**Redux is only for UI state.** Server state (quizzes, questions) lives in RTK Query cache. Redux slices are only for client-only UI state — e.g. `deleteQuiz` tracks per-item loading state during optimistic UI.

**Path alias `@/*` maps to `src/`.** So `@/shared/api` → `src/shared/api`, `@/widgets/QuizForm` → `src/widgets/QuizForm`.

**Naming:**
- FSD slice directories: `kebab-case`
- Component files: `PascalCase.tsx`
- Non-component files: `camelCase.ts`
- Named exports everywhere — no default exports except Next.js page/layout files

---

## Code Style

- **Indentation**: 4 spaces
- **Quotes**: double quotes
- **Semicolons**: always
- **Trailing commas**: all
- **Print width**: 100 characters
- **Formatter**: Prettier (`.prettierrc` in both `backend/` and `frontend/`)
- **No comments**: never write code comments — inline, block, or JSDoc. If something needs explanation, raise it in conversation instead.
- **No default exports** except Next.js page/layout files and Redux slice reducers
- **Tailwind only** — no inline `style={{}}` for visual styling, no CSS modules
- **`cn()`** from `src/shared/lib/utils.ts` for conditional class merging

---

## Database

- Schema: `backend/prisma/schema.prisma`
- Seed: `backend/prisma/seed.ts` — run with `npx prisma db seed`
- Migrations: `backend/prisma/migrations/`

### Models

```prisma
model Quiz {
    id        String     @id @default(uuid())
    title     String
    createdAt DateTime   @default(now())
    updatedAt DateTime   @updatedAt
    questions Question[]
}

model Question {
    id            String       @id @default(uuid())
    quizId        String
    quiz          Quiz         @relation(fields: [quizId], references: [id], onDelete: Cascade)
    type          QuestionType  // BOOLEAN | INPUT | CHECKBOX
    label         String
    options       Json?         // string[] — CHECKBOX only
    correctAnswer Json?         // bool | string | string[]
    order         Int
    createdAt     DateTime     @default(now())
}
```

### Question types

| Type | `correctAnswer` | `options` |
|------|----------------|-----------|
| `BOOLEAN` | `true` or `false` | — |
| `INPUT` | `string` (compared case-insensitively on frontend) | — |
| `CHECKBOX` | `string[]` (exact set match) | `string[]` required, min 2 items |

---

## API Endpoints

Backend runs on **port 3002**. Frontend runs on **port 3000**.

| Method | Path | DTO in | DTO out |
|--------|------|--------|---------|
| GET | `/quizzes` | — | `QuizSummaryDto[]` |
| GET | `/quizzes/:id` | — | `QuizDetailDto` |
| POST | `/quizzes` | `CreateQuizDto` | `QuizDetailDto` |
| PUT | `/quizzes/:id` | `UpdateQuizDto` | `QuizDetailDto` |
| DELETE | `/quizzes/:id` | — | 204 No Content |

---

## Commands

### Backend

```bash
cd backend
npm run start:dev       # watch mode (ts-node + nest watch)
npm run build           # compile to dist/
npm run start:prod      # run compiled dist/main.js

npx prisma migrate dev          # apply schema changes + regenerate client
npx prisma migrate deploy       # apply migrations in CI/prod (no prompt)
npx prisma db seed              # seed with sample quiz
npx prisma studio               # open DB GUI at localhost:5555
npx tsc --noEmit                # type-check without emitting
```

### Frontend

```bash
cd frontend
npm run dev             # dev server (port 3000)
npm run build           # production build
npm run lint            # ESLint via next lint
```

### Docker (all services)

```bash
docker compose up --build       # start postgres + backend + frontend
docker compose down             # stop
docker compose down -v          # stop + wipe DB volume
```

---

## Environment Variables

### `backend/.env`

```env
DATABASE_URL="postgresql://<user>@localhost:5432/quizflow"
PORT=3002
```

### `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3002
```

In Docker, `NEXT_PUBLIC_API_URL` is passed as a build arg — the value is baked into the Next.js bundle at build time, not runtime.

---

## Patterns & Insights

### Global config is the source of truth

- `ValidationPipe` and `ClassSerializerInterceptor` are global in `main.ts`. Do not add per-controller or per-handler validation pipes — the global ones already fire.
- `excludeExtraneousValues: true` on the interceptor means any DTO property without `@Expose()` is silently stripped. Always add `@Expose()` to every field you want in the response.

### FSD `app/` route files are one-liners

Every `app/**/page.tsx` is exactly: `export { XPage as default } from "@/pages/x/ui/XPage"`. If you find yourself writing JSX in a route file, extract it to `src/pages/`.

### QuizForm supports both create and edit via a single prop

`QuizForm` accepts an optional `existingQuiz?: QuizDetail` prop. When present, it pre-populates defaults and calls `PUT /quizzes/:id` on submit; when absent, it calls `POST /quizzes`. Do not create a separate EditQuizForm component.

### Correct answer capture happens in the form, not on take

`correctAnswer` is stored per-question in the DB. The `TakeQuiz` widget reads it from the API response and checks answers client-side. The form's `BooleanQuestion` and `InputQuestion` sub-components bind to `questions.${index}.correctAnswer` via `Controller`.

### Safelist for dynamic Tailwind classes

The `tailwind.config.ts` safelist includes `bg-blue-50`, `text-blue-600`, `bg-purple-50`, `text-purple-600`, `bg-emerald-50`, `text-emerald-600`. These are generated dynamically from `QuestionType` in `QuizForm` and `QuizDetail` using string interpolation — Tailwind's JIT cannot detect them statically without the safelist.

### RTK Query tag invalidation

After `createQuiz` and `deleteQuiz`, the `"Quiz"` tag is invalidated, which refetches `getQuizzes`. After `updateQuiz`, both `{ type: "Quiz", id }` and the list tag `"Quiz"` are invalidated to refresh both the detail view and the sidebar quiz list.

### FSD pages layer is named `src/views/`, not `src/pages/`

Next.js treats any `src/pages/` directory as the Pages Router. Since this project uses App Router (`app/` at root), having `src/pages/` caused a build failure: Next.js tried to treat FSD page components as Pages Router routes. The layer was renamed to `src/views/`. All `app/**/page.tsx` imports use `@/views/...`.

### Docker — use `node:20` not Alpine for both services

Alpine (musl libc) causes binary incompatibilities with both Prisma's query engine and Next.js's SWC compiler. Use `node:20` (Debian/glibc) for backend (single stage) and frontend builder. Frontend runtime uses `node:20-slim`.

### Backend compiled output is at `dist/src/main.js`, not `dist/main.js`

The backend `tsconfig.json` has no `rootDir`. TypeScript infers the common root as the project root (since `prisma/seed.ts` is also included). Output mirrors the source tree: `src/main.ts` → `dist/src/main.js`. The Docker CMD uses `node dist/src/main`.

### Scope changes tightly

When asked to fix or adjust a specific component, do NOT sweep the same change across every similar component. If a fix looks like it should generalise, mention it and ask before editing other files. Prefer precise edits scoped to what was asked.

### Exploration efficiency

For simple tasks, do NOT explore the whole file structure. Read only:
1. Files explicitly mentioned.
2. Files directly involved in the change.
3. `CLAUDE.md` for architecture and patterns.

Everything else — layer rules, FSD structure, API contracts, question types — is documented here. Trust it. Only reach for Grep/Read when CLAUDE.md is silent on something.
