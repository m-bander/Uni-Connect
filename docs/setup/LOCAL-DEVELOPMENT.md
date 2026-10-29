# Local development

## Requirements and installation

Use Node.js **24.x**, npm and Git. This repository is private: sign into GitHub with an invited
account and accept the collaborator invitation before cloning.

```sh
git clone https://github.com/mohamedhany-44/UniComnect_test.git
cd UniComnect_test
npm install
npm run setup
npm run dev
```

Open **http://127.0.0.1:5173**. The backend listens on port **3000**.
Setup installs frontend/backend dependencies with the committed pnpm lockfiles.
Normal setup does not download a test browser. No Docker, hosted account or separate PostgreSQL
installation is required for default local use.

## First administrator

A fresh local database includes the bootstrap administrator:
`admin@uniconnect.test` / `UniConnect123!`.

Use it locally to approve/promote your own registered account to administrator. Sign out and sign
in with your personal account. On the next application startup, shared privileged starter
credentials are retired if an approved administrator with a non-`@uniconnect.test` email exists.
The hosted website already has a personal owner and does not accept the shared admin login.

Do not use the bootstrap password for a personal account. Never commit credentials.

## Persistence and configuration

Default startup is `backend/app/start.ts`. PGlite stores PostgreSQL-compatible data under the
repository's ignored `.data/postgres/`. Random signing secrets are generated once in
`.data/session-secrets.json`. Accounts, uploads and valid sessions survive restarts.

Stop the app before backing up the complete `.data/` directory. Deleting that directory removes
the local database and signing secrets. It is not required for a normal restart.
Local copies do not synchronize with each other or the hosted website.

Optional configuration:

| Variable | Use |
| --- | --- |
| `APP_DATA_DIR` | Override the local data directory; use an absolute path. |
| `DATABASE_URL` | Use external PostgreSQL instead of local PGlite. Startup applies initialization to that database, so use an intended development database. |
| `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET` | Override generated signing secrets; keep values private. |

The normal launcher sets the frontend origin to `http://127.0.0.1:5173` and uses Vite's API proxy.
Use that exact address consistently for local cookies. No manual frontend environment file is
needed for normal startup.

## Commands and Windows helpers

| Command | Effect |
| --- | --- |
| `npm run dev` | Start frontend and persistent backend together. Stop with Ctrl+C. |
| `npm run build` | Compile backend and build frontend. |
| `npm run dev:campus` | Compatibility alias for normal persistent startup. |
| `npm run dev:qa` | Disposable populated testing environment; see testing guide. |

Optional PowerShell scripts are grouped under [scripts/windows](../../scripts/windows/README.md).
Prefer the root npm commands on all operating systems.

## Troubleshooting

- **Cannot clone:** accept the GitHub invitation and use your own Git credentials.
- **Node version error:** use Node 24.x, then reopen the terminal.
- **Missing packages:** run `npm install` and `npm run setup` from the repository root.
- **Port already in use:** stop the previous local server before starting another copy.
- **Login/cookie issues:** use `127.0.0.1:5173` consistently; do not mix it with `localhost`.
- **Instructor cannot sign in:** the administrator must approve the account.
- **Wrong workspace after promotion:** sign out and sign in again.
- **Different data on another device:** expected; each device has its own database.
- **Tests refuse to start:** stop normal local servers first. Do not point fixture-based tests at the live database.

Continue with the [website guide](../product/WEBSITE-GUIDE.md).
