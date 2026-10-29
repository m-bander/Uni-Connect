# Executed baseline report

Run: 2026-10-26T17:46:30.421Z
Duration: 32.7 seconds.
Result: 25 passed, 9 failed, 0 skipped, 0 flaky.

A second clean run, with Playwright automatically starting both servers and recreating all database fixtures, reproduced the same 25/9 split.

| Group | Passed | Failed |
|---|---:|---:|
| Browser UI | 7 | 0 |
| Functional API | 18 | 0 |
| Security and database | 0 | 9 |

Frontend: React/Vite development server. Browser: installed Microsoft Edge through Playwright.
Backend: original Express controllers with the isolated PGlite adapter and QA-only localhost cookie configuration.
Both frontend and backend production build checks passed. Frontend reports a large bundle warning.

## Failed checks

- SEC-001 student cannot change their own grade
- SEC-002 another student cannot modify someone else's submission
- SEC-003 unauthenticated caller cannot read course chat
- SEC-004 unauthenticated caller cannot impersonate a chat sender
- SEC-005 user profile responses never expose password fields
- SEC-006 course response never exposes instructors' password fields
- SEC-007 malformed access token is rejected as an auth error
- SEC-008 student cannot read another student's submissions
- DB-001 general statistics work on a fresh database

See ../DEFECTS.md for expected behavior, observed behavior, reproduction and severity.

## Local load smoke

50/50 successful GET /api/courses requests at concurrency 5.
Median 22 ms; p95 39 ms; max 40 ms.
This is an embedded-database smoke measurement, not a production load/capacity result.

## Coverage limits

No live UploadThing uploads, submission-file creation lifecycle, standalone PostgreSQL, mobile/device matrix, accessibility audit or sustained load test has been executed.
Database procedures and triggers are not supplied in the original repository; missing procedure failures remain visible.
The test inventory is an inferred technical baseline, not a stakeholder-approved requirements specification.
These results do not constitute a finished graduation project or a release certification.

## Reproduce

From backend/: pnpm test:qa. See ../../../TESTING.md for complete setup and accounts.
Run the tests to generate ../artifacts/html/index.html and ../artifacts/results.json locally. See PACKAGED-VERIFICATION.md for the combined repository verification.
The suite returns nonzero while required safe behavior fails.
