# Hosted initialization

Current operational instructions are in the [deployment guide](../../docs/setup/DEPLOYMENT.md).

- `initialize.ts`: non-destructive initialization under a transaction/advisory lock.
- `001_procedures.sql`: database procedures.
- `002_full_app.sql`: application schema additions.
- `seed-campus.ts`: one-time fictional campus resources and content.

The Vercel project builds from the repository root. Never enable disposable local QA or legacy
baseline behavior on a public deployment. Required secrets belong in server configuration,
not source control or frontend variables.
