# Features and limits

This is the current implementation scope, not a future feature list.

| Area | Implemented | Boundary |
| --- | --- | --- |
| Registration | Student signup and instructor approval requests. | No institution/email verification. Public signup cannot create admins. |
| Accounts | Login/logout, profiles, pictures, password changes and admin user management. | No forgotten-password email flow. |
| Catalogue | Public list, descriptions, teaching names, counts, subject/year filters and keyword search. | Categories are subjects, not separate university tenants. |
| Courses | Enrollment, instructor creation/teaching membership and existing-course administration. | Role and membership rules apply; blacklisted students cannot simply re-enroll. |
| Materials | Categorized course resources with attached files. | A quiz resource is not an automatically graded quiz engine. |
| Assignments | Deadlines, descriptions, files, submissions, turn-in state, grades and feedback. | No plagiarism checking or automatic marking. Displayed deadlines do not establish that every late-submission rule is enforced. |
| Announcements/polls | Course updates, academic-year announcements and voting. | Class-wide authoring belongs to representatives. |
| Discussions | Course groups/messages for members. | Hosted updates poll periodically; no hosted WebSocket delivery guarantee. |
| Calendar | Course events and combined user calendar. | No Google/Outlook calendar synchronization. |
| Notifications | In-app list and indicator. | No email/SMS notification delivery. |
| Statistics | Administrator counts, year distribution, grades/completion, activity and usage. | Not an official transcript/reporting system. |

## Known administrator workflow limitation

The administrator course list displays a Create Course control, but its shared form calls the
instructor-only course-creation endpoint. Use an approved instructor account to create a course.
Administrators can manage existing course records through their management pages. This UI/API
mismatch is a known issue, not a verified administrator creation workflow.

## Subject categories

Subject categories describe the course's field. The initial campus adds three courses in each:

| Subject | Courses |
| --- | --- |
| Computer Science | Programming Fundamentals; Data Structures & Algorithms; Operating Systems |
| Software Engineering | Object-Oriented Design; Software Quality & Testing; Graduation Project Studio |
| Data Science & AI | Data Analysis with Python; Machine Learning; Natural Language Processing |
| Cybersecurity & Networks | Computer Networks; Web Application Security; Digital Forensics |
| Business & Management | Principles of Management; Entrepreneurship; Project Management |
| Mathematics & Statistics | Calculus I; Linear Algebra; Probability & Statistics |
| Design & Media | Visual Communication; User Experience Design; Digital Media Production |
| Languages & Communication | Academic English; Technical Writing; Presentation & Debate |

The initial database also includes `QA-101`, Software Testing. The populated starting point has
25 courses; live totals change as users manage records. This is not a product limit.

## Material categories

Inside a course, resources are grouped as **lecture, sheet, quiz, assignment, tutorial and textbook**.
Assignment resources in the library are distinct from the graded assignment/submission workflow.

## Uploads and downloads

- Accepted: PDF, PNG, JPEG and WebP. The API checks file signatures.
- Maximum decoded size: **1,048,576 bytes (1 MiB)** per file.
- Storage: **20 MiB per owner**, **100 MiB application-wide**.
- File bytes and metadata are stored in PostgreSQL with unguessable token URLs.
- Anyone holding a valid download URL can open it.
- Videos and large media need a separate storage implementation.

## Data and operational limits

- Sample names, enrollment and educational content are fictional illustrations.
- Each local installation and the hosted website have independent databases.
- Normal local data and signing secrets live in `.data/`; keep it private and backed up.
- Test fixtures are disposable and do not describe the live account list.
- No multi-university registrar, tuition payments, accredited certificates, attendance tracking,
  video meetings or institutional single sign-on is implemented.
- Automated passes cover the tested cases; they do not certify accessibility, security,
  browser compatibility or high-load capacity.

Sources: [catalogue definitions](../../backend/src/data/catalog.ts),
[file validation](../../backend/src/routes/campusRoutes.ts).
