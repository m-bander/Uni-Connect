# Reproduced defect register

Environment: local QA mode, original main-branch business logic, PGlite database, localhost.
Run date: 2026-10-26. Automated checks: qa/tests/security.spec.ts.
All credentials below refer to seeded synthetic accounts; see ../../TESTING.md.

Use IDs from qa/artifacts/fixtures.json. Sign in through POST /api/auth/login.
For authenticated API calls, retain the jwt cookie and send Authorization: Bearer <accessToken>.
The base URL is http://127.0.0.1:3000.
Expected permission status in these tests is either 401 or 403; the project must later standardize its API contract.

| ID | Severity | Reproduction | Expected | Observed |
|---|---|---|---|---|
| SEC-001 | Critical | Login as student; PATCH /api/courses/QA-101/assignments/{assignmentId}/submissions/{submissionId}, body {"grade":100} | Student cannot change a grade | HTTP 200 and returned grade changes |
| SEC-002 | Critical | Login as student2; PATCH the first student's submission with {"feedback":"Unauthorized change"} | Only an authorized instructor may edit another student's feedback | HTTP 200 and feedback changes |
| SEC-003 | High | Without login, GET /api/groups/{groupId}/messages | Reject access | HTTP 200 returns chat and sender data |
| SEC-004 | High | Without login, POST same messages endpoint with another user's sender_id and a content string | Reject unauthenticated posting; derive sender from session | HTTP 201 creates an impersonated message |
| SEC-005 | High | Login as student; GET /api/users/{student2Id} | No password or hash fields in any response object | Response includes password fields |
| SEC-006 | High | Login as student; GET /api/courses/QA-101 | Teacher objects exclude password fields | Response includes teacher password fields |
| SEC-007 | Medium | Keep a login cookie; GET /api/courses with Authorization: Bearer invalid-token | 401/403 authentication error | HTTP 500 |
| SEC-008 | High | Login as student2; GET /api/courses/QA-101/assignments/{assignmentId}/submissions?userId={studentId}&pageIndex=0&pageSize=10 | Reject another student's private submission access | HTTP 200 returns the other student's submission |
| DB-001 | High / setup blocker | Login as admin; GET /api/stats/general against the generated fresh schema | Statistics return successfully after documented setup | HTTP 500; server error says find_count_stats procedure does not exist |

## Root causes and proposed remediation

- SEC-001/002/008: route authentication is present, but submission handlers lack record ownership and instructor-course authorization.
  Separate student-editable fields from instructor-only fields; validate the submission, assignment and course association.
- SEC-003/004: message routes lack authentication; controller accepts sender_id from the caller.
  Authenticate HTTP and socket clients, enforce group membership, and derive sender_id from the session.
- SEC-005/006: relational queries return complete user records.
  Explicitly select safe user fields in all API and socket payloads.
- SEC-007: verifyAuth handles an expired token but treats other JWT verification failures as a server error.
- DB-001: SQL stored procedures referenced by the app are absent from the supplied source.
  Obtain and version the original definitions and include them in the installation/migration workflow.

## Evidence and retesting

The baseline records 25 passing and 9 failing tests. Failure traces are in qa/test-results/.
Machine-readable results and the HTML report are in qa/artifacts/.
The tests do not mark known defects as expected failures.
Security probes mutate only synthetic fixtures, restore changed grade/feedback, and delete their impersonation message.
Restart the backend to restore a completely fresh baseline.

The project also needs manual validation of uploads, browser/device compatibility, accessibility, polling,
notification delivery, deadlines, and course membership boundaries. These are coverage gaps, not verified passes.
