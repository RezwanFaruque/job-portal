# Project Structure

Scalable structure for the Job Portal frontend. Use this as the source of truth for where to put code.

## Directory Overview

```
job-portal-frontend/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Auth route group: login, register
│   ├── (dashboard)/        # Protected/dashboard route group
│   ├── (marketing)/        # Marketing/public pages
│   ├── api/                # API routes (e.g. /api/health)
│   ├── globals.css
│   ├── layout.tsx          # Root layout
│   └── page.tsx
├── components/
│   ├── ui/                 # Reusable primitives (Button, Input, Card)
│   ├── layout/             # App shell (Header, Footer, Sidebar)
│   └── features/           # Feature-specific (JobCard, ApplicationForm)
├── lib/                    # Utilities, helpers (cn, format, validators)
├── hooks/                  # Custom React hooks (useDebounce, useLocalStorage)
├── services/               # API clients, external services
├── types/                  # TypeScript interfaces and types
├── constants/              # App constants (routes, enums)
├── config/                 # App config (env validation)
├── styles/                 # SCSS (variables, mixins, base)
├── public/                 # Static assets
├── middleware.ts           # Global middleware (auth, redirects)
└── PROJECT_STRUCTURE.md    # This file
```

## Guidelines

| Folder | Purpose | Import |
|--------|---------|--------|
| `components/ui` | Dumb, reusable UI primitives | `@/components/ui` |
| `components/layout` | Header, Footer, Sidebar, layouts | `@/components/layout` |
| `components/features` | Feature-specific, may use hooks | `@/components/features` |
| `lib` | Pure utilities, no React | `@/lib` |
| `hooks` | Custom React hooks | `@/hooks` |
| `services` | API calls, external integrations | `@/services` |
| `types` | Shared TypeScript types | `@/types` |
| `constants` | Routes, config, magic values | `@/constants` |
| `config` | Env, app configuration | `@/config` |

## Route Groups

- **(auth)** — Login, register. Shared auth layout.
- **(dashboard)** — Protected pages. Add auth guard, sidebar.
- **(marketing)** — Public landing, marketing pages.
- **api/** — API routes. Use for backend-for-frontend or proxies.

## Adding New Code

1. **New component** → `components/ui` (generic) or `components/features/[feature]` (domain-specific)
2. **New API call** → `services/[domain].ts` (e.g. `services/jobs.ts`)
3. **New hook** → `hooks/` with export in `index.ts`
4. **New type** → `types/index.ts` or `types/[domain].ts`
5. **New route** → `app/[route]` or `app/(group)/[route]`
6. **New constant** → `constants/index.ts`
