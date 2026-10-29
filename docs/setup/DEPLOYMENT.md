# Hosted deployment

The current website is [unicomnect-test.vercel.app](https://unicomnect-test.vercel.app).
The frontend and API deploy together from the repository root on Vercel.
The hosted database is persistent Neon PostgreSQL. Local `.data/` is not uploaded.

## Configuration

The root [vercel.json](../../vercel.json) defines installation, builds, routing and the API function.
It uses [scripts/vercel-build.mjs](../../scripts/vercel-build.mjs) to compile both applications and,
when a database URL is present, initialize the database.

| Server variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Hosted PostgreSQL connection string. |
| `ACCESS_TOKEN_SECRET` | Private access-token signing secret. |
| `REFRESH_TOKEN_SECRET` | Separate private refresh-token signing secret. |
| `CLIENT_URL` | Exact public frontend origin, e.g. `https://unicomnect-test.vercel.app`. |

Hosted builds set `VITE_HOSTED=1` and an empty `VITE_SERVER_URL` so requests use the same origin.
Do not place secrets in `VITE_*` variables: those are browser-visible.
Application permissions are enabled by default; do not set local QA or legacy-baseline flags
on a public deployment.

## Database initialization

[initialize.ts](../../backend/deploy/initialize.ts) runs inside a transaction with an advisory lock.
It creates the schema on a fresh database, applies SQL migrations and seeds the base records only
when no users exist. Expanded campus content is added once using an `app_migration` marker.

Subsequent builds preserve existing users and coursework. They do not recreate deleted sample
courses. When a real approved owner exists, known shared privileged starter credentials are
retired; the personal owner is retained.

Initialization changes the configured database. For staging or preview testing, provide a
separate database and signing secrets rather than sharing the live database.

## Release workflow

1. Review the change and complete checks appropriate to its scope.
2. Merge/push to the connected main branch.
3. Wait for the Vercel deployment to succeed.
4. Run `npm run test:public` for read-only website/API/catalogue health checks.
5. Review any changed user workflow with intended accounts on staging.

A previous deployment can restore code, but code rollback does not restore deleted database
records. Arrange database backups separately before important data changes.

## Uploads and live updates

PDF/images are stored in PostgreSQL; hosted uploads do not require UploadThing.
Limits are documented in [features and limits](../product/FEATURES-AND-LIMITS.md).
Download URLs are shareable capabilities, not confidential authenticated storage.

Hosted discussion and announcement/poll updates use periodic authenticated HTTP queries,
approximately every ten seconds. Hosted builds disable Socket.IO transport. The original
socket implementation remains in the source for legacy testing.

The project was configured with Vercel Hobby and Neon Free. Check the hosting dashboards before
changing plans or increasing usage; this guide does not guarantee future pricing or unlimited usage.
