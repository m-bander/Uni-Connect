# Packaged project verification

Run: 2026-10-27T16:25:45.042Z
Environment: Windows, Node.js v24.19.0, downloaded Playwright Chromium.
Setup: the root setup command installed both frozen application lockfiles and downloaded the browser successfully.
Launch: the root dev command started the frontend (HTTP 200) and seeded backend successfully.
Build: backend TypeScript compile, frontend TypeScript compile and Vite production bundle all passed.
Automated suite: 34 checks, 25 passed, 9 failed, no skipped or flaky tests.
All 7 browser UI checks and all 18 functional API checks passed.
The remaining 9 failures reproduce the documented security and missing-procedure defects.
This matches the original Microsoft Edge baseline. The packaged suite defaults to Chromium, not Edge.

Portable setup commands are provided for Windows, macOS and Linux. Only Windows was executed during this verification.
Linux may need Playwright browser system libraries as described in the main README.

Run npm test to regenerate the full machine-readable result, traces and HTML report on your own machine.
Generated traces and raw results are excluded from version control. See DEFECTS.md and BASELINE.md for the recorded findings.
