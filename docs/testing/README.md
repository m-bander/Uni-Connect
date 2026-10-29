# Testing UniConnect

## Plan and execution pack

- [Test plan](TEST-PLAN.md): scope, requirements, priorities, environments, team proposal and completion criteria.
- [Word edition of the test plan](UniConnect-Test-Plan.docx): editable, formatted document for your team and graduation submission.
- [How to perform testing](HOW-TO-TEST.md): step-by-step first cycle and a complete coursework example.
- [50 starter scenarios](TEST-CASES.md): preconditions, steps and expected results; new execution starts as Not Run.
- [Execution log template](templates/EXECUTION-LOG.md): copy for each new run.
- [Test summary template](templates/TEST-SUMMARY.md): final coverage, defects and decision.

Test the working application on a separate copy. Normal application startup and the live database
are not disposable test fixtures.

## Automated commands

```sh
npm run setup:testing
npm test
npm run test:report
```

Stop normal local servers first. The regression suite starts its own backend/frontend and refuses
to reuse a running server. It uses temporary fixtures and does not alter normal `.data/`.

The current suite has 34 checks across browser, functional/API and security tests.
Its latest execution before the repository documentation reorganization passed 34/34.
See [current evidence](../../backend/qa/reports/README.md); tests were not rerun merely to edit documentation.

For a populated disposable workspace:

```sh
npm run dev:qa
```

In another terminal, run `npm run test:campus`. It exercises workflows and creates/removes records;
use it only against an intended test environment. It refuses the canonical live hostname.
The default target is the local API. Use the QA UI at `http://127.0.0.1:5173`.
Data disappears when that QA backend stops.

`npm run test:public` performs read-only live website/API/catalogue checks.
`npm run test:baseline` reproduces historical original behavior in isolation; never deploy it.

## Fixture accounts

Only for fresh local QA fixtures, all using password `UniConnect123!`:

| Email | Purpose |
| --- | --- |
| `student@uniconnect.test` | Enrolled student. |
| `student2@uniconnect.test` | Different student for ownership checks. |
| `instructor@uniconnect.test` | Approved instructor. |
| `admin@uniconnect.test` | Fixture administrator. |
| `representative@uniconnect.test` | Class representative. |
| `head@uniconnect.test` | Course head. |
| `pending@uniconnect.test` | Instructor awaiting approval. |

These are not an access guide for the hosted website. Shared privileged accounts there are retired.

## Graduation-project test planning

Use [the feature scope](../product/FEATURES-AND-LIMITS.md) to agree expected behavior before writing cases.

1. Define objectives, in-scope features, exclusions, browsers/devices, environment and team assignments.
2. Write cases with ID, feature/requirement, preconditions, account role, data, steps and expected result.
3. Execute positive and negative scenarios: login/approval, enrollment, ownership, uploads, coursework,
   grading, communication and administrator permissions.
4. Record actual results and evidence. File reproducible defects with severity and environment.
5. Retest fixes and run relevant regression checks.
6. Summarize coverage, unresolved defects and limitations before the final demonstration.

The repository's automated evidence is a starting point, not a replacement for the team's own
exploratory, usability, compatibility or accessibility work.

## Reports

- [Report index](../../backend/qa/reports/README.md): current versus historical evidence.
- Generated HTML: `backend/qa/artifacts/html/index.html` after a regression run; ignored by Git.
- Generated machine-readable results: `backend/qa/artifacts/results.json`; ignored by Git.
- Screenshots/traces on failure: `backend/qa/test-results/`; ignored by Git.

Use GitHub's bug-report template for new findings. Treat the original defect register as historical
until a defect is reproduced on the current application.
