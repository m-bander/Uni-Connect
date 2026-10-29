> Current application behavior is documented in [the application guide](../APPLICATION-GUIDE.md). Normal startup is persistent; the earlier disposable modes and shared privileged accounts below are historical.

# UniConnect software testing project

## Current state

Both repositories have been downloaded as sibling folders: frontend/ and backend/.
A local QA mode now runs the real Express controllers and React UI against an isolated
PostgreSQL engine (PGlite). No Docker, external database, or production credentials are required.
The database is held in memory and recreated with known fixtures whenever the QA backend restarts.
Do not use real personal data in this environment.

Original source baselines:
- Frontend: 57e1f72e6a9c23e415e41f44ebdec153728d7914
- Backend: a0295ffdce0b526ed8fcbfd2904444aaa4c77a0a

## Open the app

Frontend: http://localhost:5173
Backend: http://localhost:3000

All seeded accounts use the password: UniConnect123!

| Account | Email | Role |
|---|---|---|
| Student | student@uniconnect.test | Student enrolled in QA-101 |
| Second student | student2@uniconnect.test | Another student, for ownership tests |
| Instructor | instructor@uniconnect.test | Professor/TA teaching QA-101 |
| Administrator | admin@uniconnect.test | System admin |
| Representative | representative@uniconnect.test | Class representative |
| Course head | head@uniconnect.test | Manages QA-101 |
| Pending instructor | pending@uniconnect.test | Login should be blocked pending approval |

Seeded content: QA-101 Software Testing course, enrollment records, instructor,
course head, announcement, assignment, graded submission, calendar event, group and message.
Only use these passwords locally.

## Start again

For a new machine, follow README.md: npm install, npm run setup, npm run dev. Node.js 24+ is required. Chromium is installed automatically for portable browser testing.
Two PowerShell terminals:

    .\Start-Backend.ps1
    .\Start-Frontend.ps1

Or, from backend/: pnpm qa:dev
And from frontend/: pnpm dev --host localhost --port 5173 --strictPort

Reinstall on a new machine with pnpm install --frozen-lockfile --ignore-scripts in each folder.
The root setup command uses the frozen pnpm lockfiles automatically; do not use the older application npm lockfiles.
The backend pins Express types to the original compatible versions.
The committed SQL snapshot in backend/qa/schema is sufficient to initialize the QA tables.

## Run the tests

From the workspace root:

    .\Run-Tests.ps1

Or from backend/:

    pnpm test:qa

Playwright automatically starts both servers when they are stopped.
Stop any manually started QA backend before a clean baseline run to get a fresh database.
The full suite deliberately exits with a nonzero code when it finds unresolved product defects.
These are real failures, not tests marked as expected failures.

Run only the functional and UI checks:

    pnpm exec playwright test functional.spec.ts browser.spec.ts

Run only the defect/security checks:

    pnpm exec playwright test security.spec.ts

View the latest interactive report:

    pnpm test:qa:report

Artifacts:
- backend/qa/artifacts/html/index.html: interactive HTML report
- backend/qa/artifacts/results.json: machine-readable Playwright results
- backend/qa/test-results/: failure traces and error contexts
- backend/qa/reports/BASELINE.md: saved baseline results and limitations
- backend/qa/reports/TEST-CASES.csv: test inventory and recorded outcome
- backend/qa/DEFECTS.md: reproducible defect register

The tests assert safe expected behavior and keep defects visible. Do not change assertions just to get a green report.

## Honest scope and limitations

This is a working starting point for a graduation testing project, not a finished graduation submission.
There are 34 automated tests covering core UI, API, role checks, input handling and security boundaries.
It is not exhaustive coverage of all features or all browser/device combinations.

External UploadThing uploads are disabled only in QA mode; that route returns 404.
No live file-upload/download, submission-file workflow or external storage integration has been verified.
Provide your own UploadThing configuration and use a separate PostgreSQL environment to test those integrations.
The fixture submission is inserted directly into the database; the test of grading does not verify upload/submission creation.

Missing original stored procedures have deliberately NOT been replaced with guessed behavior.
The statistics endpoint fails on this fresh schema; notification-creating flows may also fail.
Request the original SQL definitions from the developers before certifying these areas.
There are no reconstructed triggers or mocked passing business workflows.

PGlite uses PostgreSQL compiled to WebAssembly and a different Drizzle driver.
Repeat integration, concurrency and performance tests against a standalone PostgreSQL server before making production claims.
The local load probe is only a smoke measurement and cannot establish production capacity.

QA-only changes:
- Opt-in embedded database adapter; ordinary startup still uses DATABASE_URL.
- Fresh fixture launcher and randomly generated session secrets.
- Loopback-only QA listener and localhost HTTP cookie settings.
- Disabled external upload endpoint in QA mode.
- Dependency type pins, automated tests, generated schema and reports.

No security fixes have been silently applied; preserve this baseline for before/after evidence.
Before public deployment, fix the critical permission and data-exposure defects.

## Suggested graduation deliverables

1. Supervisor-approved scope and user requirements, validated with the original developers.
2. Risk-based test plan and role/permission matrix.
3. Traceability between requirements, test cases, automated tests and defects.
4. Manual exploratory sessions with dated screenshots and observations.
5. Baseline defect reports, developer fixes, retesting and regression comparison.
6. Standalone PostgreSQL and real storage integration results.
7. Performance, accessibility and compatibility studies with declared environments.
8. Final quality assessment and demonstration.

Credit the original authors and distinguish their implementation from your testing contribution.
