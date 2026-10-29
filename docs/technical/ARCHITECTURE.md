# Architecture and source map

## Main components

| Component | Technology and responsibility |
| --- | --- |
| Frontend | React, TypeScript, Vite, React Router, TanStack Query, Tailwind/shadcn-style components; forms use React Hook Form and Zod. |
| Backend | Express and TypeScript; routes call controllers that read/write records through Drizzle ORM. |
| Database | PostgreSQL in hosting; persistent PGlite for default local startup. |
| Authentication | Password hashing with bcrypt, short-lived access JWTs and refresh sessions with an HTTP-only cookie. |
| Hosting | Vercel serves the frontend and the API function; Neon stores hosted data. |
| Testing | Playwright browser/API tests, disposable PGlite fixtures and additional workflow scripts. |

## Request flow

1. The user opens a React page or submits a form.
2. The frontend calls `/api/...` using Axios. Hosted requests use the site's origin; Vite proxies
   normal local requests to the backend.
3. Express applies authentication, role and record-access checks.
4. A controller uses Drizzle queries/transactions against the selected database.
5. The API returns data; TanStack Query refreshes the relevant UI state.

Uploaded bytes are validated and stored with file metadata. Authorized UI responses expose token
download URLs. The content route validates that token; it does not require the recipient to log in.

## Where to edit

| Path | Contents |
| --- | --- |
| [frontend/src/main.tsx](../../frontend/src/main.tsx) | Public and role-specific page routes. |
| [frontend/src/pages](../../frontend/src/pages) | Student, instructor, admin and public screens. |
| [frontend/src/components](../../frontend/src/components) | Shared controls, course areas, forms and layouts. |
| [frontend/src/hooks](../../frontend/src/hooks) | Data queries, form submission and UI workflow hooks. |
| [frontend/src/providers](../../frontend/src/providers) | Authentication, theme, modal and query integration. |
| [backend/src/routes](../../backend/src/routes) | API route definitions. |
| [backend/src/controllers](../../backend/src/controllers) | Request handling and application operations. |
| [backend/src/middleware](../../backend/src/middleware) | Authentication, roles, response sanitization and record permissions. |
| [backend/src/drizzle](../../backend/src/drizzle) | Tables, enums, relations and database selection. |
| [backend/app](../../backend/app) | Normal persistent local startup and database adapter. |
| [backend/database](../../backend/database) | Shared SQL schema, base seed and starter-account retirement. |
| [backend/deploy](../../backend/deploy) | Hosted initializer, additive SQL and one-time campus seed. |
| [backend/qa](../../backend/qa) | Isolated tests, fixtures and reports. |
| [api/index.ts](../../api/index.ts) | Vercel backend entry point. |

## Database areas

- **Users and sessions:** users, approvals, roles, refresh tokens and session/usage information.
- **Course access:** courses linked to enrolled students, teaching instructors and assigned managers;
  a blacklist prevents removed users from simply joining again.
- **Resources:** materials and files associated with courses; hosted uploads store file bytes,
  owner, size and a download token.
- **Coursework:** assignments belong to courses; submissions belong to an assignment and student,
  with attached files, turn-in state, grade and feedback.
- **Communication:** announcements are connected to courses or academic years; poll items have votes;
  courses have groups and groups contain messages.
- **Organization:** events, notifications and initialization migration markers.

See [schemas](../../backend/src/drizzle/schemas) and
[relations](../../backend/src/drizzle/relations) for field-level definitions. SQL files in
`backend/database/schema/` create the initial schema; `backend/deploy/*.sql` add procedures and
application changes.

## API map

This is a navigation map, not an exhaustive endpoint/response specification. Prefixes use `/api`.

| Area | Representative routes | Purpose |
| --- | --- | --- |
| Health/catalogue | `GET /health`, `GET /catalog` | Public health and course discovery. |
| Authentication | `POST /auth/login`, `GET /auth/refresh`, `GET /auth/logout` | Establish, refresh and end a session. |
| Accounts | `POST /users/register`, `GET/PATCH /users/me` | Registration and own profile. |
| Administration | `GET /users`, `PUT /users/:id/approve`, `/admin`, `/stats` | User approval/management, course administration and statistics. |
| Courses | `/courses`, `/courses/:code`, `/me/courses/enrolled`, `/me/courses/teaching` | Course records and current user's memberships. |
| Enrollment | `POST /courses/:code/enrollments` | Join a course as an eligible user. |
| Coursework | `/courses/:code/assignments`, nested `/submissions` | Assignments, files, turn-in state, grades and feedback. |
| Materials | `/materials`, `/materials/course/:code` | Course resources. |
| Communication | `/announcements`, `/poll_items`, `/groups/:id/messages` | Announcements, voting and discussions. |
| Organization | `/events`, `/years`, `/notifications` | Calendar, class pages and updates. |
| Files | `POST /uploads`, `GET /content/:id/:token`, `/files` | Upload, token download and file operations. |

Read each route module for methods, payloads and role constraints. Normal protected requests need
both an access token and a valid refresh-session cookie. Current database approval/role and record
membership are checked; public catalogue and token-download routes are explicit exceptions.

## Separate operating modes

| Mode | Data | Intended use |
| --- | --- | --- |
| `npm run dev` | Persistent local PGlite, or explicitly configured PostgreSQL. | Normal development and use. |
| Vercel | Persistent hosted PostgreSQL. | Shared website. |
| `npm test` | Disposable seeded QA database. | Repeatable regression. |
| `npm run dev:qa` | Disposable populated QA database. | Manual/workflow testing. |
| `npm run test:baseline` | Disposable legacy behavior. | Historical defect reproduction only. |

Do not deploy the legacy baseline or confuse its intentionally preserved defects with current results.
