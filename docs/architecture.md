# Architecture Review

## Current Recommendation

Version 1 should remain a mostly static marketing website built on Next.js. The current site does not need a dedicated backend service, database, authentication, or admin system yet.

## Static Frontend Only Right Now

- Home page and future marketing pages
- SEO metadata and structured data
- Services, branches, partners, staff placeholders
- Contact page content and inquiry form presentation layer
- Office details, quick links, footer, and map placeholder

## Backend Not Required Right Now

- No custom API routes are necessary for the public website in its current state
- No SQL database is necessary for public marketing content
- No login, session handling, or protected routes are necessary

## Best Contact Strategy For Version 1

- If the form should actually send inquiries now, use a third-party service first
- Recommended examples: Formspree, Basin, Tally, or a simple email workflow approved by the firm
- Add custom Next.js API routes only when the firm needs validation rules, CRM integration, custom storage, or workflow branching

## Defer Until Employee Portal Phase

- Authentication and role-based authorization
- Employee portal routes and protected layouts
- Admin editing panel or CMS
- SQL database and ORM
- Secure file/document workflows
- Staff directory management
- Internal dashboards and operational workflows

## Future-Ready App Structure

```text
src
|-- app
|   |-- (marketing)
|   |-- (portal)
|   |-- (admin)
|   `-- api
|-- components
|-- content
|-- lib
|-- modules
`-- types
```

For version 1, only the marketing layer should be implemented. The portal and admin layers should
stay as prepared structure until phase 2 and phase 3 begin.

## Portal Preparation Notes

- `src/app/(portal)` is reserved for future employee-facing routes
- `src/app/(admin)` is reserved for future secured admin/content routes
- `src/app/api` is reserved for custom backend handlers when business workflows require them
- `src/modules/*` is reserved for domain logic such as auth, notices, attendance, tasks, and documents
- `src/types/portal.ts` is reserved for future role and module typing

See `docs/technical-roadmap.md` for the phased delivery plan.
