# SmartNotes

Personal notes app built as a full-stack portfolio project. Monorepo with **pnpm workspaces**: NestJS API, Next.js web, PostgreSQL, JWT auth, and user-scoped notes CRUD.

## Features

- **Auth** — Register, login, refresh tokens, protected `/auth/me`
- **Notes** — Create, list, read, update, delete (scoped per user)
- **Web** — Landing, login/register, notes list, create/edit, account
- **Quality** — API unit + e2e tests, GitHub Actions CI

## Tech stack

| Layer    | Technology                                         |
| -------- | -------------------------------------------------- |
| Backend  | Node.js 20, TypeScript, NestJS, Prisma, PostgreSQL |
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS  |
| Tooling  | pnpm workspaces, ESLint, Prettier, GitHub Actions  |
| Auth     | JWT (access + refresh), Passport, bcrypt           |

## Quick start

Prerequisites: **Node 20**, **pnpm 9+**, **Docker** (for PostgreSQL).

```bash
git clone <your-repo-url> NoteStack
cd NoteStack
corepack enable
pnpm install
docker compose up -d
cp apps/api/.env.example apps/api/.env    # Windows: Copy-Item ...
cp apps/web/.env.example apps/web/.env.local
pnpm --filter @smartnotes/api exec prisma migrate deploy
pnpm dev
```

- Web: http://localhost:3000  
- API: http://localhost:3001/api  
- Health: http://localhost:3001/api/health  

Full setup, env vars, and troubleshooting: **[docs/SETUP.md](docs/SETUP.md)**.

## Repository layout

```
NoteStack/
├── apps/
│   ├── api/          # NestJS + Prisma
│   └── web/          # Next.js App Router
├── docs/
│   └── SETUP.md      # Local development guide
├── .github/workflows/ci.yml
├── docker-compose.yml
├── package.json
└── pnpm-workspace.yaml
```

## Scripts (root)

| Command        | Description                          |
| -------------- | ------------------------------------ |
| `pnpm dev`     | Run API + web in parallel            |
| `pnpm dev:api` | API only (port 3001)                 |
| `pnpm dev:web` | Web only (port 3000)                 |
| `pnpm build`   | Build all workspaces                 |
| `pnpm lint`    | Lint API + web                       |
| `pnpm test`    | Run tests (API unit; web has none)   |
| `pnpm typecheck` | TypeScript check across workspaces |

API-only: `pnpm --filter @smartnotes/api run test:e2e` (requires Postgres).

## API overview

| Method | Path              | Auth   | Description        |
| ------ | ----------------- | ------ | ------------------ |
| GET    | `/api/health`     | No     | Health check       |
| POST   | `/api/auth/register` | No  | Register           |
| POST   | `/api/auth/login` | No     | Login              |
| POST   | `/api/auth/refresh` | No   | Refresh access token |
| GET    | `/api/auth/me`    | Bearer | Current user       |
| GET/POST | `/api/notes`    | Bearer | List / create      |
| GET/PATCH/DELETE | `/api/notes/:id` | Bearer | CRUD one note |

## CI

On push/PR to `main`, GitHub Actions runs: install → Prisma migrate → build → API unit tests → API e2e (Postgres service).

## License

Personal portfolio project — not licensed for external use.
