# How to perform the UniConnect test plan

You are checking the working website against agreed expected behavior. A test plan says what
and how to test; a test case gives reproducible steps; an execution log records what actually happened.

## 1. Prepare a local test copy

Accept your GitHub repository invitation, install Node.js 24 and Git, then:

```sh
git clone https://github.com/mohamedhany-44/UniComnect_test.git
cd UniComnect_test
npm install
npm run setup:testing
git rev-parse HEAD
```

Record the printed commit in your run log. If you already cloned the project, update it while
preserving your own uncommitted work rather than cloning over it.

Read [the plan](TEST-PLAN.md) and [starter cases](TEST-CASES.md). Agree the deadline policy and
any proposed timing targets before execution.

## 2. Start the manual testing website

```sh
npm run dev:qa
```

Open **http://127.0.0.1:5173**. This is a disposable testing copy.
Use the local synthetic accounts in [the account table](README.md#fixture-accounts), password
`UniConnect123!`. Shared privileged accounts do not work on the live site.

Keep the terminal open. Restarting this QA environment removes the records you created.
Capture results before restarting. Use separate browser profiles/private windows for different
roles so their cookies do not replace one another.

## 3. Create your execution log

Copy [the log template](templates/EXECUTION-LOG.md) into a new run file, such as
`docs/testing/runs/UC-RUN-001.md`. Create that folder when your team has actual results.

Fill in the commit, date, tester, environment and browser versions. Add rows from the starter cases.
Start every case as **Not Run**. Do not copy old passing results into a new run.

## 4. Perform a smoke test first

Confirm that the catalogue loads, student/instructor/admin fixture accounts can sign in,
an enrolled student can open a course, and a pending instructor cannot sign in.

If normal setup or a role login is broken, record the affected cases as Blocked and investigate
the environment. Continue independent cases that still work.

## 5. Execute one case at a time

Example: **UC-W04 — student submission through grading**.

1. Instructor signs in, opens a course they teach and publishes a uniquely named assignment.
2. Student A signs in in a separate browser session and opens that course/assignment.
3. Student attaches a valid PDF, marks the submission as turned in, refreshes and checks the saved state.
4. Instructor opens the submission, verifies the file, enters grade 80 and feedback such as
   “Reviewed in UC-RUN-001”, then saves.
5. Student refreshes the assignment and checks that the grade and feedback match exactly.
6. Record the actual outcome. Attach screenshots showing saved results, without credentials.

Expected: the correct student's work is visible to the instructor, and the saved grade/feedback
appear to that student. If any stage fails, mark the case Fail and link a defect; do not continue
as though later steps were verified.

A missing dependency can instead make a case Blocked. Example: the upload service is unavailable,
so a case requiring an existing submitted PDF cannot yet be completed.

## 6. Test permissions through requests too

Hiding an admin button does not prove the backend is protected.

On the local test copy, use browser developer tools to inspect a legitimate request from a test
account. Repeat the relevant operation using another test account or another record's ID,
through your API client or a separate browser session.

Example: Student B must not read Student A's submission or change its grade. Expect an
authorization rejection (401/403), then verify the protected record stayed unchanged.
Use real test record IDs so a “record not found” response is not mistaken for a successful
ownership check. Never paste cookies/tokens into a GitHub issue or shared screenshot.

## 7. Report defects

Open the repository's Issues tab and choose **Bug report**. Example:

- Title: “Student B can modify Student A's submission”.
- Environment: local QA, commit, browser version and account roles.
- Preconditions: course membership and the existing submission.
- Steps: exact request/UI actions and data.
- Expected: request rejected; record unchanged.
- Actual: observed status and saved change, with redacted evidence.
- Severity: based on impact, with a reason.
- Link: case ID and execution-log row.

This is an example format, not a claim that the current application has this defect.

## 8. Run the automated checks

Stop manual QA using **Ctrl+C** first. Both environments use the same local ports.

```sh
npm test
npm run test:report
```

Record the actual new totals and commit. HTML output is in
`backend/qa/artifacts/html/`; JSON is `backend/qa/artifacts/results.json`.
Generated artifacts are ignored by Git, so export/share redacted evidence deliberately rather
than assuming teammates can see your local files.

For the populated 65-workflow runner, start `npm run dev:qa` again, then in another terminal:

```sh
npm run test:campus
```

The workflow runner modifies test data. Record its report and run context.
Do not run it against the live website. Run it after manual evidence is captured so its record
changes do not confuse your manual results.

## 9. Verify persistent startup separately

Stop QA and use `npm run dev` in an intended local test copy.

Create a uniquely named account/record, confirm it is saved, stop both servers, then restart
with the same command. Verify the account/record and valid session are still present.
Do not delete `.data/`. This checks normal persistence; disposable QA is expected to reset.

## 10. Retest and finish

After a fix, record its new commit, repeat the exact failed case and verify nearby cases.
Close the issue only after a passing retest; otherwise reopen it. Run final regression on the
same candidate version used for the test summary.

Complete [the summary template](templates/TEST-SUMMARY.md). Include raw counts, open defects,
blocked coverage, accepted limitations and whether the plan's exit criteria were met.

For the live site, `npm run test:public` is the read-only health command.
Use staging with a separate database for hosted workflow testing.

Your final graduation evidence should connect:
**requirement → case → actual execution → defect → fix → retest → final summary**.
