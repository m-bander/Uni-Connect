# UniConnect backend

Express/TypeScript API with Drizzle ORM and PostgreSQL-compatible storage.

Use setup/start commands from the [root README](../README.md).

| Directory | Purpose |
| --- | --- |
| `app/` | Normal persistent local startup and PGlite adapter. |
| `database/` | Shared initial SQL, base data and starter-account handling. |
| `deploy/` | Hosted initialization, migrations and campus seed. |
| `src/routes/` | API paths and method/role constraints. |
| `src/controllers/` | Application operations. |
| `src/middleware/` | Authentication, roles and record permissions. |
| `src/drizzle/` | Models, relations and database selection. |
| `qa/` | Disposable test database, fixtures, checks and reports. |

See [architecture/API map](../docs/technical/ARCHITECTURE.md),
[deployment](../docs/setup/DEPLOYMENT.md) and [testing](../docs/testing/README.md).

Do not use `src/seed.ts` or the legacy database scripts as the normal application launcher.
The current root commands use `app/start.ts` locally and `deploy/initialize.ts` during hosted builds.
