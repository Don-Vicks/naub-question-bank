# NAUB Question Bank Monorepo

Monorepo for the NAUB Question Bank application, containing the frontend and pipeline services.

## Structure

```
naub-question-bank/
├── apps/
│   ├── frontend/          # Next.js frontend application
│   └── pipeline/          # NestJS question extraction pipeline
├── packages/
│   ├── shared/            # Shared types and utilities
│   └── config/            # Shared configuration (ESLint, Prettier, TypeScript)
├── docs/                  # Documentation (brand, design system, UX flows)
└── turbo.json             # Turborepo configuration
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9+
- Redis (for BullMQ queue)

### Installation

```bash
pnpm install
```

### Development

Run all services in development mode:

```bash
pnpm dev
```

Run specific services:

```bash
pnpm --filter @naub/frontend dev
pnpm --filter @naub/pipeline start:dev
```

### Building

```bash
pnpm build
```

### Testing

```bash
pnpm test
```

### Linting

```bash
pnpm lint
```

## Services

### Frontend (@naub/frontend)

Next.js application for viewing and managing question bank content.

- **Tech Stack**: Next.js 14, React, TailwindCSS, TanStack Query
- **Port**: 3001 (default)

### Pipeline (@naub/pipeline)

NestJS service for extracting questions from PDF/images using Gemini AI.

- **Tech Stack**: NestJS, TypeORM, BullMQ, Gemini AI
- **Port**: 3000 (default)
- **Database**: SQLite (development)

## Environment Variables

Copy `.env.example` to `.env` in each app directory:

```bash
# Pipeline (apps/pipeline/.env)
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.0-flash
REDIS_HOST=localhost
REDIS_PORT=6379
STORAGE_BUCKET_PATH=./uploads/diagrams
CONFIDENCE_THRESHOLD=0.75
PORT=3000

# Frontend (apps/frontend/.env)
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Documentation

- [Brand Guidelines](docs/brand.md)
- [Design System](docs/design-system.md)
- [UX Flows](docs/ux-flows.md)
- [Project Plan](docs/plan.md)

## Pipeline Setup Notes

The pipeline requires Redis for BullMQ queue management. Start Redis locally:

```bash
# Using Docker
docker run -d -p 6379:6379 redis:alpine

# Or using Homebrew (macOS)
brew services start redis
```

For PDF processing, install poppler-utils:

```bash
# macOS
brew install poppler

# Ubuntu/Debian
sudo apt-get install -y poppler-utils
```
