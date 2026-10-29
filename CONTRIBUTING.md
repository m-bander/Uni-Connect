# Working together on UniConnect

## Before starting

Accept the GitHub collaborator invitation and clone using your own account.
Read the [website guide](docs/product/WEBSITE-GUIDE.md), [local setup](docs/setup/LOCAL-DEVELOPMENT.md)
and [repository map](README.md#repository-map).

## Change workflow

1. Update your local main branch.
2. Create a descriptive branch, such as `feature/course-filter`, `fix/submission-feedback`
   or `docs/test-plan`.
3. Keep the change focused and update the relevant current documentation.
4. Verify the affected behavior. Run `npm run build` for application code changes and relevant
   checks from the testing guide. Documentation-only edits need link/content checks.
5. Push your branch and open a pull request. Describe the behavior change, checks and limitations.
6. Have a teammate review it before merging. The connected main branch triggers a live deployment.

Do not experiment with record deletion or synthetic coursework against the live site. Use a local
copy or staging with its own database.

## Contributor recognition

Team members are credited in the [README](README.md#team-contributors) and [credits](docs/CREDITS.md).
GitHub's automatic Contributors panel is based on attributed commits, not collaborator access.

To contribute under your own account, make a real project change on your branch (for example,
an executed test report, reviewed test case, documentation improvement or bug fix), commit using
your own Git identity, and open a pull request for review and merge. Use an email associated with
your GitHub account, or its GitHub-provided private commit email, when configuring your Git identity.
Do not use another teammate's identity or add co-author credits for work they did not perform.

## File organization

- UI changes belong in `frontend/src/`; API changes in `backend/src/`.
- Persistent startup belongs in `backend/app/`; shared schema/base data in `backend/database/`.
- Hosted migrations/initialization belong in `backend/deploy/`.
- Test fixtures and reports belong in `backend/qa/`.
- User behavior belongs in `docs/product/`; installation in `docs/setup/`; architecture in
  `docs/technical/`; testing guidance in `docs/testing/`.
- Historical documents stay in `docs/archive/` and must be labeled with their source/version.
- Screenshots inherited from upstream are in `frontend/screenshots/`; they are not current test evidence.

## Bug reports and test evidence

Use the bug template and include the account role, local/staging environment, browser, steps,
expected result, actual result and redacted evidence. Never include passwords, cookies, tokens,
database URLs, private student records or the local `.data/` directory.

Keep evidence tied to the tested source version. Do not claim an old report verifies a new change.
Do not overwrite historical reports to hide original failures.

## Source ownership

Preserve upstream attribution. See [credits](docs/CREDITS.md). This repository does not introduce
a new license for upstream source.
