# Explicit database initialization

Follow [the deployment guide](../../docs/setup/DEPLOYMENT.md). Vercel builds never run this initializer.

`initialize.ts` requires `DATABASE_URL` and `DATABASE_MIGRATION_APPROVED=1` after backup, staging review and operator approval. It changes schema/procedures/constraints inside a transaction and advisory lock. Optional demo seeding can retire starter accounts; leave it disabled on production. This is not a repair for arbitrary existing schemas or permissions.

Provider-specific role grants and RLS policy changes must be reviewed separately. The generic initializer does not impose Supabase roles or alter all public tables' RLS settings.
