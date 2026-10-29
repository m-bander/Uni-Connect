# Application verification

Verified on 29 October 2026 before publication.

- Production build: passed (backend and frontend TypeScript, Vite).
- Current regression suite: 34/34 passed, including 7 browser scenarios and 9 security checks.
- Populated local application workflows: 65/65 passed; details in CAMPUS-SMOKE.json.
- Persistence: a temporary registered account, its access session, and refresh session survived stopping and restarting the normal local application. The temporary account was removed afterward.
- Owner: the user's registered account was promoted to approved system administrator on the hosted database and its role was verified before publication.

Normal startup preserves data in .data/. Test fixtures are disposable and separate. Regression servers refuse to reuse a running normal server. Shared privileged starter credentials are retired when the database has an approved owner with a real email address.

The original baseline and earlier hosted reports describe earlier source versions. They do not replace these current results. Production health checks are read-only; the mutating campus smoke runner refuses the canonical public website.