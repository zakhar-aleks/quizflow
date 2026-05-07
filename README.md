# QuizFlow

Create, edit, and take quizzes. NestJS backend · Next.js 14 frontend · PostgreSQL.

---

## Architecture

```
quizflow/
├── backend/                  NestJS REST API — port 3002
│   ├── src/
│   │   ├── quizzes/          CRUD endpoints + DTOs
│   │   └── prisma/           PrismaService
│   └── prisma/
│       ├── schema.prisma
│       └── seed.ts
├── frontend/                 Next.js 14 App Router — port 3000
│   ├── app/
│   │   ├── quizzes/
│   │   │   ├── page.tsx             Quiz list
│   │   │   └── [id]/
│   │   │       ├── page.tsx         Quiz detail
│   │   │       ├── edit/page.tsx    Edit quiz
│   │   │       └── take/page.tsx    Take quiz
│   │   └── create/page.tsx          Create quiz
│   └── src/
│       ├── entities/quiz/           Shared types
│       ├── features/                createQuiz schema, deleteQuiz slice
│       ├── shared/api/              RTK Query (baseApi)
│       ├── widgets/                 UI components
│       └── pages/                   Page-level components
└── docker-compose.yml
```

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/quizzes` | List all quizzes |
| GET | `/quizzes/:id` | Get quiz with questions |
| POST | `/quizzes` | Create quiz |
| PUT | `/quizzes/:id` | Replace quiz (title + questions) |
| DELETE | `/quizzes/:id` | Delete quiz |

### Tech Stack

| | Backend | Frontend |
|---|---------|----------|
| Framework | NestJS 10 | Next.js 14 |
| ORM / State | Prisma 5 | RTK Query |
| Validation | class-validator + zod | react-hook-form + zod |
| Database | PostgreSQL 16 | — |
| Styles | — | Tailwind CSS 3 |

---

## Running with Docker

Starts PostgreSQL, backend, and frontend in one command:

```bash
docker compose up --build
```

- Frontend → http://localhost:3000
- Backend → http://localhost:3002

```bash
# Stop
docker compose down

# Stop and wipe database volume
docker compose down -v
```

---

## Running Manually

### 1. Clone and install dependencies

```bash
git clone <repo-url>
cd quizflow

# Install backend deps
cd backend && npm install && cd ..

# Install frontend deps
cd frontend && npm install && cd ..
```

### 2. Set up PostgreSQL

```bash
# macOS — install and start
brew install postgresql@16
brew services start postgresql@16

# Create database
psql postgres -c "CREATE DATABASE quizflow;"
```

Create **`backend/.env`**:

```env
DATABASE_URL="postgresql://<your-os-username>@localhost:5432/quizflow"
PORT=3002
```

> Replace `<your-os-username>` with the output of `whoami`.

Create **`frontend/.env.local`**:

```env
NEXT_PUBLIC_API_URL=http://localhost:3002
```

### 3. Run migrations and seed

```bash
cd backend

# Apply schema to the database
npx prisma migrate dev

# (Optional) Seed with a sample quiz
npx prisma db seed
```

The seed creates one quiz: *"Sample Full-Stack Developer Quiz"* with a BOOLEAN, INPUT, and CHECKBOX question.

### 4. Start the backend

```bash
cd backend
npm run start:dev       # watch mode — reloads on file change
```

Backend ready at http://localhost:3002

### 5. Start the frontend

```bash
cd frontend
npm run dev
```

Frontend ready at http://localhost:3000

---

## Example: create a quiz via curl

```bash
curl -s -X POST http://localhost:3002/quizzes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "JavaScript Basics",
    "questions": [
      {
        "type": "BOOLEAN",
        "label": "typeof null === \"object\" in JavaScript.",
        "correctAnswer": true
      },
      {
        "type": "INPUT",
        "label": "What method converts a JSON string to an object?",
        "correctAnswer": "JSON.parse"
      },
      {
        "type": "CHECKBOX",
        "label": "Which are JavaScript array methods?",
        "options": ["map", "filter", "grep", "reduce"],
        "correctAnswer": ["map", "filter", "reduce"]
      }
    ]
  }' | json_pp
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Prisma PostgreSQL connection string |
| `PORT` | No | API port (default: `3002`) |

### Frontend (`frontend/.env.local`)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | Backend base URL |

---

## Database Schema

```prisma
model Quiz {
  id        String     @id @default(uuid())
  title     String
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  questions Question[]
}

model Question {
  id            String        @id @default(uuid())
  quizId        String
  type          QuestionType  // BOOLEAN | INPUT | CHECKBOX
  label         String
  options       Json?         // string[] — used by CHECKBOX
  correctAnswer Json?         // bool | string | string[]
  order         Int
}
```
