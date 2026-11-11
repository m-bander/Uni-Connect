# Production authentication recovery and deployment

## Verified diagnosis (11 November 2026)

The repository homepage, https://frontend-iota-gilt-81.vercel.app, responds to `/api/health` with 200. A login using a deliberately nonexistent email returns 500; `/api/catalog` also returns 500 from a database SELECT. Missing login fields and invalid signup bodies return 400. These observations locate the shared failure in database-dependent requests, before token signing in the nonexistent-user login path. They do not identify the underlying database error. Valid production signup was not exercised to avoid creating records.

The older documented address, https://unicomnect-test.vercel.app, returns Vercel `DEPLOYMENT_NOT_FOUND`. Do not use it as the release health target.

Vercel logs, project configuration and the production database are not available through the connected GitHub account. Check the failing request's server log before selecting a database repair: missing URL, rejected credentials, unreachable endpoint, missing schema and insufficient permissions need different remedies. Never fix this by disabling RLS globally or overwriting user data.

## Required runtime configuration

Deploy from the repository root using `vercel.json`, Node 24 and the committed lockfiles. Set these **server-only** variables for the intended Vercel environment:

- `DATABASE_URL`: the provider-issued PostgreSQL connection URI for the actual application database. Use a provider-supported serverless pooler endpoint. Encode special characters in its password and retain the provider's TLS settings. A Supabase publishable/anon key is not a PostgreSQL password. The backend uses PostgreSQL directly, not Supabase Auth.
- `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET`: separate private, randomly generated secrets. Configure the existing legitimate secrets privately; there is no source-code fallback. Never place these or the database URI in a `VITE_*` variable.
- `CLIENT_URL`: the exact public frontend origin, without a trailing slash. Keep it aligned with the deployed URL/custom domain. Vercel deployment and production origins are also accepted by CORS.

Keep local QA/app and legacy-baseline flags unset on Vercel. `SEED_DEMO_USERS` must remain unset for production. Preview deployments need their own database and secrets. Variables must be available to the serverless runtime, not only the build job. Redeploy after changing environment configuration.

Hosted builds set `VITE_HOSTED=1` and an empty `VITE_SERVER_URL`; API requests then use the frontend origin. Build the frontend and API together. Uploads and hosted live updates use PostgreSQL storage and authenticated HTTP polling.

## Read-only diagnosis

After privately configuring the intended database URI in an operator shell, run `node scripts/diagnose-db.mjs`. It opens a read-only transaction, checks auth tables/columns and reports permissions/RLS metadata without printing the URI, credentials, user records or SQL error messages. It never changes the database. Match its result with the Vercel request logs; local success alone does not prove Vercel has the same environment or network access.

New server logs identify an operation and sanitized error codes. Examples: `28P01` means rejected PostgreSQL authentication, `42P01` means missing relation, `42501` means insufficient privilege, `ENOTFOUND` means DNS resolution failed, and `ECONNREFUSED` means the connection was refused. Codes narrow the investigation; absence of a code is not a diagnosis.

`GET /api/health` checks process liveness only. `GET /api/ready` checks required runtime configuration and SELECT access to the login/session schema. It returns 503 on failure without revealing query text or credentials. Readiness does not prove INSERT/DELETE permissions or RLS row visibility: verify those using intended accounts on staging.

## Database release step (separate from builds)

Builds no longer run migrations, seed accounts, change foreign keys or rewrite database permissions. This prevents preview builds from silently changing a shared production database.

1. Identify the actual provider/database and obtain a verified backup or provider restore point. Confirm restore access.
2. Inspect the existing schema, grants and RLS policies. Reproduce the failure on an isolated staging copy. Do not point QA scripts at production.
3. If schema changes are required, review `backend/deploy/initialize.ts` and its SQL files on staging first. Initialization can change constraints, triggers and procedures; demo seeding also creates content and can retire starter users. It is not a universal repair for an existing database.
4. Only after backup and explicit operator approval, set `DATABASE_MIGRATION_APPROVED=1` in the migration shell and run `node --import tsx deploy/initialize.ts` from `backend`. Leave demo seeding disabled. Do not set the approval flag in Vercel build configuration.
5. Use a reviewed, provider-specific permissions change if needed. The application database role needs SELECT/INSERT/UPDATE/DELETE as used by the app, plus required procedure and sequence permissions. With RLS enabled, its role needs suitable policies or an intentionally configured trusted backend role. Do not grant browser-facing anon/authenticated roles unrestricted database access. Generic initialization no longer imposes Supabase-only grants or global RLS changes on arbitrary PostgreSQL databases.

The old credential-bearing maintenance scripts are retired and refuse to run. They previously changed permissions, promoted a fixed user and deleted accounts; none of those operations is part of authentication recovery.

## Exposed credentials

Hardcoded database credentials have been removed from executable scripts. Treat the previously committed credential as compromised: an authorized database owner must rotate/revoke it, update the private deployment setting, review database access logs, and consider coordinated history cleanup. Removing it from the current tree does not remove it from Git history. This change does not rotate or alter any production credential.

Previously public JWT fallback secrets are removed from signing and verification. If production relied on a fallback, the owner must privately configure new signing secrets and redeploy; old sessions will require sign-in again. Do not reuse a public fallback as an environment variable.

## Validation and release

- Install dependencies with `pnpm install --ignore-scripts` at the root, then `node scripts/manage.mjs install`.
- Run `node --import tsx --test tests/auth.test.ts` from `backend` for an in-memory PostgreSQL auth regression suite. `scripts/test-auth-live.mjs` now delegates to this isolated suite; it never connects to a hosted database.
- Run `node scripts/manage.mjs build` at the root, and the existing Playwright suite when browser dependencies are available.
- Publish the reviewed branch/PR. Configure staging, deploy, confirm `/api/ready` is 200, then verify signup, student login, protected profile, refresh, logout and instructor approval. New instructors require approval; student accounts are approved automatically.
- After the production owner completes prerequisites, deploy the reviewed commit and repeat read-only readiness checks. Use intended production accounts for the final login check. Do not run account-creating/deleting smoke scripts on production without a separate plan.

Code rollback cannot reverse database changes. Keep the backup and migration rollback plan separately.
