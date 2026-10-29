# UniConnect test plan

| Item | Value |
| --- | --- |
| Plan ID / version | UC-TP-001 / 1.0 |
| Prepared | 29 October 2026 |
| Product | UniConnect learning and communication website |
| Reference source | `76d9624` (the source before adding this plan) |
| Status | Proposed team plan; ready for review and execution |
| Execution results | Not executed by this document. Record new runs separately. |
| Scope references | [Website guide](../product/WEBSITE-GUIDE.md), [features and limits](../product/FEATURES-AND-LIMITS.md), [flowchart](../diagrams/Flowchart.svg) |

## 1. Purpose

Verify that students, instructors, representatives, course heads and administrators can complete
their permitted tasks, that records are saved correctly, and that other users cannot access or
change protected records.

The graduation deliverable should show how the team derived scenarios from requirements,
executed them, found/retested defects and assessed the remaining risk. Existing automated reports
are supporting evidence, not the results of this new test cycle.

## 2. Scope and requirements

These requirement IDs provide traceability for the starter cases. The team should review the
expected behavior before execution. Unclear behavior becomes a requirements question, not an invented pass.

| Requirement | Expected behavior | Starter cases |
| --- | --- | --- |
| UC-R01 Accounts | Valid registration/login/logout; instructor approval; public signup cannot grant admin access. | UC-A01–UC-A08 |
| UC-R02 Discovery/enrollment | Search/filter catalogue; eligible enrollment; access limited by membership; blacklist respected. | UC-C01–UC-C06 |
| UC-R03 Materials/files | Authorized course staff manage categorized resources; allowed files/limits enforced. | UC-M01–UC-M06 |
| UC-R04 Coursework | Instructor assignments, student submissions/turn-in, grades and feedback with ownership protection. | UC-W01–UC-W07 |
| UC-R05 Communication | Course/class announcements, polls and member-only discussions. | UC-N01–UC-N05 |
| UC-R06 Calendar/notifications | Correct accessible events and supported in-app updates. | UC-E01–UC-E03 |
| UC-R07 Profiles | Own profile/picture/password changes without unauthorized account changes. | UC-P01–UC-P03 |
| UC-R08 Administration | Approved admins manage users, roles, courses, membership and statistics. | UC-D01–UC-D04 |
| UC-R09 Sessions/data protection | Protected routes deny unauthorized requests; sessions expire/end correctly; responses exclude passwords. | UC-S01–UC-S04 plus ownership cases |
| UC-R10 Persistence | Normal application records and valid sessions survive a server restart. | UC-Q01 |
| UC-R11 Usability/compatibility | Core journeys work on selected browsers/devices with usable keyboard/error states. | UC-Q02–UC-Q03 |
| UC-R12 Responsiveness of service | Core pages complete without errors during a small controlled test run. | UC-Q04 |

The starter suite contains **50 manual/API scenarios**. Some scenarios contain multiple boundaries
or browser variants; record a separate result for each variation when executing.

## 3. Exclusions

Do not report the absence of these as unexpected defects: forgotten-password email delivery,
institutional/email verification, video storage, external calendar synchronization, payments,
automatic quiz marking, plagiarism detection or official transcripts.

Full penetration testing, internet load/stress testing and certification against accessibility or
security standards are outside this plan. Limited access-control, keyboard and small local
performance checks are included.

## 4. Risk priorities

| Risk | Priority | How to test |
| --- | --- | --- |
| Another student changes a grade or reads a private submission | P0 | Paired student accounts, direct API ownership requests and before/after record checks. |
| Unapproved users or public signup gain privileged access | P0 | Pending instructor, role escalation, protected routes and revoked sessions. |
| Coursework disappears or grading is saved incorrectly | P0 | End-to-end submission/grade flow and persistent-mode restart. |
| Main student/instructor/admin journey fails | P1 | Smoke tests first, then role-specific positive/negative cases. |
| File limits, course membership or polling cause incorrect behavior | P1 | Boundary files, nonmembers, blacklist and two browser sessions. |
| Layout, labels or secondary filters are confusing | P2 | Exploratory, keyboard and viewport checks. |

Priority is execution order. Defect severity measures impact; it is not automatically the same
as case priority.

## 5. Environments and test data

### A. Disposable QA environment — manual/API workflows

Run `npm run dev:qa`; use `http://127.0.0.1:5173` and API port 3000.
It contains fictional accounts and populated courses. Data is reset when the backend stops.
Use the [fixture account table](README.md#fixture-accounts).

Use separate browser profiles/private windows for student A, student B, instructor and administrator.
Do not mix up roles in one cookie session.

### B. Automatic regression environment

Stop other local servers and run `npm test`. The suite starts isolated fixtures and its own servers.
It refuses to reuse an existing server. Do not run it concurrently with manual work on the same ports.

### C. Persistent local environment — restart verification

Run `npm run dev` using an intended test copy of the repository. Its database is in `.data/`.
Run UC-Q01 here, not in disposable QA. Back up important local data before experimentation.
Never point this test at the hosted database.

### D. Hosted checks

The live site is limited to `npm run test:public` read-only health checks in this plan.
If hosted workflow coverage is needed, use a separate staging deployment with its own PostgreSQL
database and secrets. Free-hosting performance is not equivalent to local performance.

### Data checklist

- Student A enrolled in course A; student B for ownership checks; a nonmember of course B.
- Approved instructor teaching course A, another instructor not teaching course A, pending instructor.
- Administrator, representative and course head assigned to a specific course.
- Existing assignment/submission, a new assignment, valid poll and known calendar event.
- Valid small PDF, PNG/JPEG/WebP; unsupported text/executable file; renamed invalid file.
- Valid files immediately below, at and above 1,048,576 decoded bytes; use real formats, not only changed extensions.
- Unique synthetic identifiers, e.g. `uc-run-01` in course/message/assignment names.
- No real student records, private passwords or confidential coursework.

For quota checks, measure remaining allowance before preparing uploads. The database already
contains starter files. Verify 20 MiB per owner and 100 MiB total only in disposable/local copies.

## 6. Test approach

1. **Static review:** compare page flow, requirements, API permissions and current documentation.
2. **Smoke:** prove that each role can sign in and reach one core page.
3. **Functional/manual:** execute positive, invalid-input, boundary and empty-state cases.
4. **Integration/end-to-end:** trace instructor creation → student turn-in → instructor grading →
   student feedback, checking the saved record at each stage.
5. **API/permissions:** reuse observed valid requests with another role or record ID; verify rejection
   and confirm the protected data did not change. Do not stop at checking a hidden button.
6. **Exploratory:** short focused sessions on interrupted uploads, double clicks, refreshing, stale
   tabs, pagination and errors. Record the session and new cases.
7. **Compatibility/usability:** current Chrome and Edge on desktop; a 390px-wide viewport plus one
   real phone if available. Record actual versions. Add Firefox/Safari only if the team can execute them.
8. **Regression:** rerun relevant cases after each fix, then the complete current automated suite.

Use browser developer tools or an API client for request checks. Obtain test credentials/tokens
only from your own local test login and keep them out of evidence. A successful HTTP response alone
does not prove correctness: inspect the saved state and the visible result.

### Performance observation

On an isolated local/staging environment, warm up first, then measure five sequential loads of
dashboard/catalogue/course pages and record timings, HTTP failures and environment details.
A proposed project target is each warm load completing within 5 seconds with no failed core request.
Agree this target before using it for pass/fail. This is a small observation, not a load capacity claim.
Do not run quota filling or concurrent load against the live site.

## 7. Entry criteria

- Tested source commit and environment are recorded.
- Setup succeeds; frontend/API are reachable.
- Required roles, memberships and test files are available.
- Expected results, deadline policy and performance target are reviewed by the team.
- No blocking environment issue prevents the role smoke tests.

A failed entry check is recorded as **Blocked**, with a reason and owner.

## 8. Exit criteria

- Every planned case and agreed variation has an execution status and evidence or a clear blocker.
- All P0/P1 cases pass on the final candidate; no unresolved Critical/High defect remains.
- At least 95% of all executed applicable cases pass. Report Not Run, Blocked and N/A separately;
  they cannot be hidden by the pass percentage.
- Fixed defects have a linked passing retest and relevant regression.
- Any remaining Medium/Low defects or scope exclusions are explicitly accepted by the project owner/team.
- Final summary states tested commit, environments, coverage, results and remaining limits.

If a criterion is not met, report the release/test cycle as incomplete. Do not label a failed known
issue as a pass because it was documented.

## 9. Defect workflow

`New → Triaged → In progress → Ready for retest → Closed`

If the retest fails, return the defect to **Reopened**. Duplicate, cannot reproduce and deferred
outcomes need an explanation and links to supporting evidence.

Use the existing [GitHub bug template](../../.github/ISSUE_TEMPLATE/bug_report.md).
Include case ID, source/environment/browser, role, preconditions, steps, expected/actual result,
reproducibility, severity and redacted evidence.

| Severity | Example |
| --- | --- |
| Critical | Unauthorized grade/account changes or loss of substantial coursework with no recovery. |
| High | Core submission/login/approval flow unavailable without a practical workaround. |
| Medium | A feature fails but a reasonable workaround exists. |
| Low | Cosmetic or wording issue with limited impact. |

### Existing issues and questions to verify

- The admin course page shows Create Course but its shared form targets an instructor-only endpoint.
  UC-D03 should reproduce and log this mismatch; do not count instructor creation as an admin pass.
- Late-submission policy is not a fully specified contract. Record observed behavior and ask whether
  late work should be allowed/flagged/blocked before judging enforcement.
- File URLs are intentionally shareable capabilities. A successful download with a valid shared
  token is documented behavior, not by itself an authentication bypass. Invalid tokens must fail.

## 10. Suggested team division and schedule

This is a proposal, not an assignment notification.

| Person | Suggested focus | Review partner |
| --- | --- | --- |
| Mohamed / owner | Scope, environment, admin cases, triage and final summary. | Ahmed |
| Ahmed-Ayman22 | Registration, sessions and access-control cases. | Karim |
| karimElmalt-95 | Courses, materials, uploads and coursework. | Adam |
| Adam-Ehab32 | Communication, calendar, compatibility and usability. | Mohamed |

| Working day | Deliverable |
| --- | --- |
| 1 | Review requirements, environment and test data; agree questions. |
| 2 | Review starter cases, add variations and complete role smoke tests. |
| 3–4 | Execute functional/API and exploratory cases; file defects as found. |
| 5–6 | Fixes, retests, persistence and compatibility checks. |
| 7 | Final regression and remaining-risk review. |
| 8 | Test summary, evidence cleanup and graduation demonstration. |

Adjust dates to your deadline; preserve the dependency order rather than claiming these dates
have already occurred.

## 11. Deliverables and measurement

- This plan and the [starter cases](TEST-CASES.md).
- Run-specific [execution log](templates/EXECUTION-LOG.md) with individual results.
- GitHub defects linked to cases/evidence and fixes.
- Automated HTML/JSON reports with run date and tested commit.
- Retest/regression evidence.
- Completed [test summary](templates/TEST-SUMMARY.md).

Case coverage = executed applicable cases / planned applicable cases.
Pass rate = passed / executed cases with a Pass or Fail outcome.
Always publish raw counts for Pass, Fail, Blocked, Not Run and N/A alongside percentages.
N/A requires a documented reason; Blocked cases remain a coverage gap.

Follow the [execution walkthrough](HOW-TO-TEST.md) to perform the first cycle.
