# SmartNotes Fullstack

A personal notes application built as a full-stack portfolio project.
Monorepo managed with **pnpm workspaces**.

## Tech Stack

| Layer    | Technology                                         |
| -------- | -------------------------------------------------- |
| Backend  | Node.js 20, TypeScript, NestJS, Prisma, PostgreSQL |
| Frontend | Next.js (App Router), TypeScript, Tailwind CSS     |
| Tooling  | pnpm workspaces, ESLint (flat), Prettier           |
| Auth     | JWT-based (planned, Phase 4)                       |

## Repository Layout

```
NoteStack/
├── apps/
│   ├── api/    # NestJS backend (filled in Phase 2)
│   └── web/    # Next.js frontend (filled in Phase 3)
├── package.json           # root, private, workspace scripts
├── pnpm-workspace.yaml    # workspaces: apps/*
├── tsconfig.base.json     # shared TypeScript config
├── eslint.config.mjs      # shared ESLint flat config
├── .prettierrc            # shared Prettier rules
├── .editorconfig
├── .nvmrc                 # Node 20 LTS
└── .gitignore
```

## Prerequisites

- [Node.js](https://nodejs.org/) 20 LTS (`.nvmrc` pins the version)
- [pnpm](https://pnpm.io/) 9+ (enable via `corepack enable`)

## Getting Started

```bash
# 1. Clone and enter the repo
git clone <your-repo-url> NoteStack
cd NoteStack

# 2. Enable pnpm (one-time, via Node's corepack)
corepack enable

# 3. Install all dependencies for all workspaces
pnpm install

# 4. Run all workspace dev scripts in parallel
pnpm dev

# Other useful commands
pnpm build        # build all apps
pnpm lint         # lint all apps
pnpm test         # run tests in all apps
pnpm typecheck    # TS typecheck across workspaces
pnpm dev:api      # run only api workspace
pnpm dev:web      # run only web workspace
pnpm format       # auto-format with Prettier
```

## Development Phases

| Phase | Scope                                             |
| ----- | ------------------------------------------------- |
| 1     | Monorepo scaffold (pnpm workspaces) — **current** |
| 2     | NestJS API + Prisma schema + PostgreSQL           |
| 3     | Next.js app + Tailwind + base UI                  |
| 4     | JWT authentication (register/login/refresh)       |
| 5     | Notes CRUD feature end-to-end                     |
| 6     | Tests (unit + e2e) and deployment hardening       |

## License

Personal portfolio project — not licensed for external use.
