# Nayyar and Nayyar Co. Website

Production-ready phase 1 website for `casanjaygulati.in`, built as a premium public-facing chartered accountancy site with a clean path to a future employee portal and admin layer.

## Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS

## Phase 1 Architecture

Phase 1 is intentionally simple:
- Public marketing website only
- Static or mostly static rendering
- No SQL database
- No custom backend service
- No authentication
- No admin panel

The project is already prepared structurally for later expansion:
- `src/app/(marketing)` for the public website
- `src/app/(portal)` reserved for the future employee portal
- `src/app/(admin)` reserved for future admin/content management
- `src/app/api` reserved for future backend handlers
- `src/modules/*` reserved for future business/domain logic

See [docs/architecture.md](D:\University\Third Year\Projects\docs\architecture.md) and [docs/technical-roadmap.md](D:\University\Third Year\Projects\docs\technical-roadmap.md) for the phased plan.

## Content Updates

Most editable content lives under:

```text
src/content/sections
|-- about.ts
|-- contact.ts
|-- firm.ts
|-- footer.ts
|-- navigation.ts
|-- placeholders.ts
|-- seo.ts
`-- services.ts
```

You can update firm details, services, branches, partners, staff placeholders, contact details, and SEO copy there without changing component logic.

## Local Setup

1. Install dependencies

```bash
npm install
```

2. Start the development server

```bash
npm run dev
```

3. Open:

```text
http://localhost:3000
```

## Production Checks

Run these before deployment:

```bash
npm run typecheck
npm run lint
npm run build
```

## Environment

Phase 1 does not require secrets.

An example file is included at:
- [.env.example](D:\University\Third Year\Projects\.env.example)

You only need real environment variables later if you add:
- a third-party form service
- authentication
- database connections
- CRM or email integrations

## SEO and Deployment Basics Included

- metadata in [layout.tsx](D:\University\Third Year\Projects\src\app\layout.tsx)
- structured data in [layout.tsx](D:\University\Third Year\Projects\src\app\layout.tsx)
- favicon placeholder in [icon.svg](D:\University\Third Year\Projects\src\app\icon.svg)
- manifest in [manifest.ts](D:\University\Third Year\Projects\src\app\manifest.ts)
- robots file in [robots.ts](D:\University\Third Year\Projects\src\app\robots.ts)
- sitemap in [sitemap.ts](D:\University\Third Year\Projects\src\app\sitemap.ts)

## Deploying Phase 1

Recommended: Vercel

Why it fits phase 1:
- best fit for a Next.js marketing site
- minimal DevOps overhead
- straightforward custom domain setup
- easy preview deployments
- good performance for a mostly static professional website

### Vercel deployment steps

1. Push the repository to GitHub, GitLab, or Bitbucket
2. Import the project into Vercel
3. Set the production domain to `casanjaygulati.in`
4. Deploy

For phase 1, no backend infrastructure is required beyond the Next.js app itself.

## Hosting Recommendation

### Now: Phase 1

- Use Vercel
- Keep the site static or mostly static
- Add a third-party contact form service later only if needed

### Later: Employee Portal Phase

Recommended default path:
- Keep the Next.js app on Vercel
- Add a managed PostgreSQL database
- Add authentication
- Add API routes or server actions only for real portal workflows

Only consider moving to a fuller backend host later if you introduce:
- heavy background jobs
- long-running internal processes
- very custom backend services outside normal Next.js patterns
- complex file processing or enterprise infrastructure requirements

## Recommended Content To Finalize Before Launch

- final phone number
- final email routing
- real branch details
- partner names and profiles
- staff details
- registration and compliance disclosures
- privacy policy and legal pages
- map embed or location directions
