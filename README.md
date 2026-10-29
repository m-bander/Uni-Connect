# UniConnect

A university learning and communication website. Students join courses, access materials,
submit coursework and discuss it with their class. Instructors organize teaching and grade
submissions. Administrators manage accounts, approvals and course membership.

**[Open the website](https://unicomnect-test.vercel.app)** ·
**[Website guide](docs/product/WEBSITE-GUIDE.md)** ·
**[All documentation](docs/README.md)**

The website saves accounts and coursework. Testing is a separate workspace for the graduation
project. The repository name is `Uni-Connect`.

## What the website does

| Area | Supported workflows |
| --- | --- |
| Accounts | Student/instructor registration, login, profile editing and password changes. Instructors require approval. |
| Catalogue | Search courses, topics and instructors; filter by subject/year; join courses as a student. |
| Materials | Lectures, sheets, quizzes, assignments, tutorials and textbooks with attached files. Authorized staff manage resources. |
| Coursework | Instructors publish assignments and deadlines; students upload and turn in work; instructors grade and give feedback. |
| Communication | Course/class announcements, poll voting, course discussion groups and in-app notifications. |
| Calendar | Course events and dates in a combined user calendar; authorized staff manage events. |
| Administration | Users, instructor approvals, existing courses, membership, administrator accounts and statistics. |

Read the [website guide](docs/product/WEBSITE-GUIDE.md) for roles and step-by-step journeys.
See [features and limits](docs/product/FEATURES-AND-LIMITS.md) for the exact current scope.

## Use the website

1. [Create your own account](https://unicomnect-test.vercel.app/signup).
2. Sign in. Students can join courses; instructors wait for administrator approval.
3. Open **My workspace** for the pages available to your role.

The owner uses a personal administrator account. Shared privileged starter logins are disabled
on the hosted site. The included academic content and sample identities are fictional.

## Run on your device

Install **Node.js 24** and Git. Accept your GitHub collaborator invitation first.

```sh
git clone https://github.com/m-bander/Uni-Connect.git
cd Uni-Connect
npm install
npm run setup
npm run dev
```

Open **http://127.0.0.1:5173**. A separate database installation is not required.
Data and sessions persist in the ignored `.data/` folder. Each device has an independent
database; it does not synchronize with the live site.
See [local setup](docs/setup/LOCAL-DEVELOPMENT.md), including first administrator setup.

## Repository map

```text
UniComnect_test/
├── frontend/          React pages, components, forms and browser assets
├── backend/
│   ├── app/           Persistent local application startup
│   ├── database/      Shared schema and starter account initialization
│   ├── deploy/        Hosted initialization, migrations and campus seed
│   ├── src/           API routes, controllers, permissions and database models
│   └── qa/            Isolated fixtures, automated checks and reports
├── api/               Vercel backend entry point
├── scripts/           Setup, development, build and Windows helpers
├── docs/              Product, setup, technical, testing and archived guides
└── .github/           Issue and pull request templates
```

## Common commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Normal persistent website. |
| `npm run build` | Compile backend and build frontend. |
| `npm run setup:testing` | Install dependencies and the optional test browser. |
| `npm test` | Regression suite with disposable fixtures. |
| `npm run dev:qa` | Disposable populated testing website. |
| `npm run test:campus` | Workflow checks against a separate local test server. |
| `npm run test:public` | Read-only health checks on the live site. |
| `npm run test:report` | Generated browser test report. |

Read the [testing guide](docs/testing/README.md) before tests that create records.
Original baseline failures describe older code, not the current website's results.

## Team contributors

| Contributor | Project role |
| --- | --- |
| **Mohamed Bander** | Project Owner & Lead Developer |
| **Adam Ehab** | Team Contributor |
| **Mohamed Hany** | Team Contributor |
| **Karim Mohamed** | Team Contributor |
| **Ahmed Aymen** | Team Contributor |

This is the project's team credit list. GitHub's automatic Contributors panel is generated from
attributed commits; collaborator invitations alone do not add someone to that panel.
See [how to contribute](CONTRIBUTING.md#contributor-recognition).

## Documentation and teamwork

- [Documentation index](docs/README.md): where to start.
- [Website guide](docs/product/WEBSITE-GUIDE.md): roles, pages and user journeys.
- [Features and limits](docs/product/FEATURES-AND-LIMITS.md): exact scope and categories.
- [Architecture](docs/technical/ARCHITECTURE.md): frontend, API and database.
- [Deployment](docs/setup/DEPLOYMENT.md): Vercel and PostgreSQL configuration.
- [Contributing](CONTRIBUTING.md): branches, bug reports and team review.
- [Test plan and walkthrough](docs/testing/TEST-PLAN.md): what to test and how your team should execute it.
- [Credits](docs/CREDITS.md): original authors and source history.

Uploads support PDF, PNG, JPEG and WebP: **1 MiB per file**, **20 MiB per owner**, **100 MiB total**.
Anyone with a download URL can open it. Password-reset email, video storage and institutional
identity verification are not implemented.

Original authors: **Moslem Ahmed, Marwan Mohammed and Abdulrhman Jalal**.
Original repositories: [frontend](https://github.com/MoslemAhmed1/UniConnectFrontEnd) and
[backend](https://github.com/MoslemAhmed1/UniConnectBackEnd). This combined repository extends
their work and does not relicense upstream source code.
