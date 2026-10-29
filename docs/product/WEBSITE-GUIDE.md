# What UniConnect does

## Website flowchart

[Open or download the website flowchart (SVG)](../diagrams/Flowchart.svg).

![UniConnect website flowchart](../diagrams/Flowchart.svg)

UniConnect brings a class's materials, assignments, announcements, calendar and discussions into
one website. Students join courses and use their workspaces throughout the learning process.
Instructors publish content, collect work and give feedback. Administrators manage access and
the overall user/course records.

It is a learning and communication platform. It does not register students with a real university,
collect tuition or issue accredited qualifications.

## Roles and workspaces

| Role | Main responsibility | Workspace |
| --- | --- | --- |
| Student | Join courses, study resources, submit work, see grades and participate in discussions/polls. | Student dashboard, courses, calendar, class pages and profile. |
| Instructor / teaching assistant | Create courses or join a teaching team, publish content and assignments, grade work and manage course activities. | Instructor courses, submissions, calendar, groups and profile. |
| Course head | Student delegated to manage resources, announcements and events in assigned courses. | Student workspace with additional controls for managed courses. |
| Class representative | Publish class announcements, manage supported content in courses they belong to and assign course heads. | Student workspace with additional class/course controls. |
| System administrator | Manage users, approvals, existing courses, membership, administrator accounts and statistics. | Administrator dashboard, users, pending users, courses, statistics and profile. |

Public signup offers student and instructor roles. Other privileges are assigned through authorized
management actions. Instructors need approval before login. Membership and ownership restrict
record access in addition to role. Administrator management pages are separate from instructor teaching pages.

## Public pages

- **Home (`/`)** introduces the product and provides sign-in/signup links.
- **Catalogue (`/catalog`)** lists course descriptions, teaching names and enrollment counts.
  Filter by subject/year or search names, codes, descriptions and instructors.
- **Sign up (`/signup`)** accepts student details including student code/year, or an instructor request.
- **Sign in (`/login`)** opens the workspace appropriate to your role.

Browsing does not enroll a visitor. Joining requires a signed-in student-type account.

## Student journey: join a course and complete coursework

1. Create a student account and sign in.
2. Find a course in the catalogue and choose **Join course**.
3. Open the course from the catalogue or your courses page. The dashboard shows enrolled courses,
   announcements and upcoming work.
4. Browse materials grouped as lectures, tutorials, sheets, quizzes, assignment resources and
   textbooks. Open/download attached resources.
5. Open an assignment to read its description, due date and supporting files.
6. Create your submission and attach supported files. Check the turn-in state: attaching files
   and marking work as turned in are separate actions.
7. Return after grading to read the instructor's grade and feedback.
8. Use the course group for questions, the calendar for events and the notification menu for updates.

Students manage their own submissions. They cannot change grades or read another student's
private submission records. Download URLs themselves are shareable; see the limits below.

## Instructor journey: teach and grade

1. Register as an instructor and wait for administrator approval.
2. Sign in and open **Courses**. Create a course with its code, name, year, category and description,
   or use the available-course flow to join an existing teaching team.
3. Open a course you teach and upload resources into the appropriate material categories.
4. Publish an assignment with a description and deadline; attach supporting resources when needed.
5. Open its submissions, inspect student work and enter grades and feedback.
6. Publish course announcements or polls and create calendar events.
7. Communicate through the course group and view the member list.

Teaching permissions depend on course membership. Instructor approval does not grant access to
administrator user-management pages.

## Administrator journey: manage the website

1. Sign in using your personal administrator account. After a role change, sign out and sign in again.
2. Review **Pending users** and approve legitimate instructor requests.
3. Use **Users** to search, create/edit supported account details, change roles or remove accounts.
4. Use **Courses** to inspect/edit existing courses and manage student/instructor membership.
   Instructors create teaching courses through their own workspace.
5. Use **Create admin** when another trusted person needs administrator access.
6. Open **Statistics** for aggregate totals, students by year, group activity, course grades,
   assignment completion and usage/session information.

Deleting users, courses or coursework can remove related records. Experiment with destructive
testing on a separate copy.

## Communication and organization

**Announcements and polls:** course staff publish course updates and polls. Class representatives
can also publish academic-year announcements. Members can vote on poll choices.

**Groups:** each course has a discussion group for enrolled students, assigned managers and teaching
members. Users can manage their own messages through the supported controls.

**Calendar:** combines accessible course events so users can track dates. Authorized course staff
add and edit events.

**Profiles and notifications:** edit your own profile/picture, change your password and check the
notification menu. The student workspace includes academic-year class members and announcements.

Hosted discussion and announcement/poll queries refresh approximately every ten seconds.
Updates can therefore take a few seconds to appear.

## Saved data and starter content

Accounts, memberships, materials, assignments, submissions, grades, announcements, polls, messages,
events and uploads are stored in the database. Restarting normal startup does not reset them.
The hosted website uses PostgreSQL; each local installation stores its own database in `.data/`.

The initial campus contains fictional identities, courses and illustrative PDF guides. These
are not official university records. New records created through ordinary workflows are saved
alongside the starter content.

## Boundaries

Uploads accept PDF, PNG, JPEG and WebP up to **1 MiB per file**, **20 MiB per owner** and **100 MiB total**.
Anyone with a valid file download URL can open it; download access is not tied to a fresh login
check. Avoid confidential documents.

Forgotten-password emails, institutional/email verification, video storage, payments and formal
university transcripts are outside the current implementation.
See [features and limits](FEATURES-AND-LIMITS.md).

## Source references

This guide follows the implemented [page routes](../../frontend/src/main.tsx),
[course routes](../../backend/src/routes/courseRoutes.ts),
[record permissions](../../backend/src/middleware/publicHost.ts),
[catalogue/uploads](../../backend/src/routes/campusRoutes.ts) and
[statistics](../../backend/src/controllers/statsController.ts).
