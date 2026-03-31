# Technical Roadmap

## Phase 1: Public Website

Goals:
- Launch the premium marketing website
- Keep pages fast, SEO-friendly, and simple to maintain
- Centralize editable content and placeholders
- Avoid unnecessary backend complexity

Architecture:
- Next.js App Router for marketing pages
- Static or mostly static rendering
- No SQL database required
- No custom authentication required
- Optional third-party form handling if inquiries must go live

## Phase 2: Employee Portal

Goals:
- Introduce secure employee login
- Add role-based access control
- Launch staff dashboard and internal notices
- Add secure document access
- Prepare attendance and task modules

Architecture:
- Use `src/app/(portal)` for protected employee routes
- Add authentication and session handling
- Introduce a SQL database, preferably PostgreSQL
- Add application modules under `src/modules/*`
- Create portal-specific APIs only where business workflows require them

Suggested sequence:
1. Authentication and role model
2. Employee dashboard
3. Internal notices
4. Document access
5. Attendance and task modules

## Phase 3: Admin / Content Management

Goals:
- Provide a controlled admin interface for content and portal management
- Manage staff, branches, notices, and permissions from a secured backend

Architecture:
- Use `src/app/(admin)` for secured admin routes
- Share auth and permission logic with the portal layer
- Add CRUD flows backed by the database
- Add audit-friendly management for content and access control
