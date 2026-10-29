# UniConnect starter test cases

These **50 scenarios** support [UC-TP-001](TEST-PLAN.md). All are **Not Run** for a new cycle.
Use [the walkthrough](HOW-TO-TEST.md) and copy cases into [a run log](templates/EXECUTION-LOG.md).
Split compound boundary/browser/role scenarios into separate execution rows. P0 comes first,
then P1, then P2. Synthetic accounts and data only; destructive/API cases use local or staging.

## Accounts and approval

Requirement: **UC-R01**.

| ID | Priority | Preconditions/data | Steps | Expected result |
| --- | --- | --- | --- | --- |
| UC-A01 | P1 | Fresh student email and valid code/year. | Register student; sign in; open student workspace. | Account saved and student workspace opens; no privileged role is granted. |
| UC-A02 | P1 | Existing account email. | Register again using that email. | Duplicate rejected with a useful error; original account unchanged. |
| UC-A03 | P1 | Approved account. | Try incorrect password, then correct password. | Wrong password rejected; correct password signs in. Record each variation. |
| UC-A04 | P0 | New instructor; separate admin session. | Register instructor; attempt login; admin approves; try login again. | Pending login denied; approved login opens instructor workspace. |
| UC-A05 | P0 | Public registration request based on a valid signup. | Submit registration with system_admin role; repeat with isApproved field. | Unauthorized role rejected; client cannot grant privileged status. Verify saved state. |
| UC-A06 | P1 | Signed-in student with an accessible course. | Refresh page; navigate directly to the course; sign out; reload protected route. | Valid session survives refresh; signed-out UI returns to login and protected data is unavailable. |
| UC-A07 | P0 | Approved instructor with active session; test admin. | Admin revokes approval; repeat instructor protected request and refresh/login. | Revoked account cannot keep accessing protected data or sign in; verify no mutation. |
| UC-A08 | P1 | Registration/login forms. | Submit missing required fields, invalid email, short password and mismatched confirmation. | Invalid input rejected without creating an account or starting a session; record each variation. |

## Discovery and enrollment

Requirement: **UC-R02**.

| ID | Priority | Preconditions/data | Steps | Expected result |
| --- | --- | --- | --- | --- |
| UC-C01 | P1 | Guest browser; populated catalogue. | Open catalogue; search known code/name/instructor and a nonexistent term. | Correct matches appear; no-match state is understandable; no private coursework exposed. |
| UC-C02 | P2 | Courses from different years/subjects. | Apply subject and year filters together; clear them. | Results satisfy both filters; clearing restores complete available list. |
| UC-C03 | P1 | Student not yet enrolled in chosen course. | Join course; open it from My Courses; refresh. | Single enrollment saved; correct materials, assignments and group become accessible. |
| UC-C04 | P0 | Student not enrolled in course B. | Open course B protected page/API using known IDs. | Protected course records are rejected; public catalogue remains available. |
| UC-C05 | P1 | Student enrolled in a disposable course; admin. | Remove/blacklist student; attempt course access and re-enrollment. | Protected access denied and blacklist prevents immediate re-enrollment. |
| UC-C06 | P1 | Student already enrolled. | Repeat enrollment request or double-click join; refresh catalogue/My Courses. | No duplicate enrollment/count inflation; UI and saved membership remain consistent. |

## Materials and files

Requirement: **UC-R03**.

| ID | Priority | Preconditions/data | Steps | Expected result |
| --- | --- | --- | --- | --- |
| UC-M01 | P1 | Instructor teaching a course; valid PDF. | Publish resource in lecture category; student opens category/download. | Correct category/title and original file are available to course members. |
| UC-M02 | P1 | Student member and unrelated instructor; existing material. | Attempt resource create/edit/delete using each unauthorized account. | Request denied and resource remains unchanged. Record each role/action variation. |
| UC-M03 | P1 | Valid PDF/PNG/JPEG/WebP and invalid text/renamed file. | Upload each supported format; upload unsupported and mismatched-signature files. | Supported valid formats accepted; unsupported/mismatched files rejected without usable records. |
| UC-M04 | P1 | Real valid files below/at/above 1,048,576 bytes; available quota. | Upload each boundary file; inspect response and file record. | Below/at size limit accepted if valid and quota permits; above limit rejected. Log actual byte counts. |
| UC-M05 | P1 | Disposable database; measured current usage and valid small files. | Reach owner quota, then attempt overflow; separately reach total quota and overflow. | Uploads cannot exceed 20 MiB per owner or 100 MiB total; failed upload leaves no usable dangling file. |
| UC-M06 | P1 | Existing token download URL. | Download with valid token; alter token and request again. | Valid shared token downloads correct file; invalid token returns no content. Valid guest sharing is documented behavior. |

## Assignments and submissions

Requirement: **UC-R04**.

| ID | Priority | Preconditions/data | Steps | Expected result |
| --- | --- | --- | --- | --- |
| UC-W01 | P1 | Instructor teaches course; student enrolled. | Create assignment with unique title/description/deadline; student refreshes course. | Correct assignment appears with saved fields and course association. |
| UC-W02 | P0 | Student and instructor not teaching target course. | Attempt assignment creation/edit through valid course API shapes. | Unauthorized requests denied and assignment data unchanged. |
| UC-W03 | P1 | Enrolled student; open assignment; valid PDF. | Create own submission, attach file, turn in, refresh; use supported unturn-in control if available. | Own files and turn-in state persist; file upload and turn-in are distinguishable. |
| UC-W04 | P0 | Teaching instructor, student A, new assignment and PDF. | Run assignment creation → student attachment/turn-in → instructor grade 80/feedback → student view. | Correct work reaches instructor; grade 80 and exact feedback are saved and shown to student A. |
| UC-W05 | P0 | Student with graded submission. | Attempt to PATCH own grade or feedback via API; reread record. | Rejected; original instructor grade/feedback unchanged. |
| UC-W06 | P0 | Students A and B; A has a known submission; both enrolled. | As B attempt to list A's submissions and edit/delete/attach files to A's submission. | Access/mutations rejected; A's submission remains unchanged. Log each operation. |
| UC-W07 | P2 | Past/future due dates; policy agreed before execution. | Check displayed due dates; attempt turn-in before/after due time. | Dates display correctly; enforcement matches agreed policy. If policy unclear, record question/Blocked rather than inventing pass. |

## Communication

Requirement: **UC-R05**.

| ID | Priority | Preconditions/data | Steps | Expected result |
| --- | --- | --- | --- | --- |
| UC-N01 | P1 | Course instructor and enrolled student sessions. | Publish course announcement/poll; student waits for refresh and reloads. | Correct course members receive saved content; hosted polling delay is distinguished from loss. |
| UC-N02 | P1 | Member student and poll with choices. | Vote; refresh; change/repeat vote using supported UI. | Own selection/counts remain consistent with saved votes; duplicate requests do not inflate counts. |
| UC-N03 | P1 | Representative and students in two academic years. | Publish class announcement; inspect relevant and different-year class views. | Target year sees correct announcement; UI does not merge unrelated-year notices. |
| UC-N04 | P1 | Student/instructor members in separate sessions. | Send unique message; observe other session; edit/delete own message through supported controls. | Correct sender/content visible; edits/deletions persist within refresh behavior. |
| UC-N05 | P0 | Known group and message IDs; guest and course nonmember. | Read group/messages or send message; member attempts spoofed sender ID. | Guest/nonmember denied; authenticated sender cannot impersonate another user; no unauthorized saved message. |

## Calendar and notifications

Requirement: **UC-R06**.

| ID | Priority | Preconditions/data | Steps | Expected result |
| --- | --- | --- | --- | --- |
| UC-E01 | P1 | Instructor and enrolled student; known date/time. | Create/edit event for course; inspect student combined calendar. | Correct event/date/time appears; edits persist and only appropriate accessible course data is shown. |
| UC-E02 | P1 | Course head assigned only to A; representative enrolled in A; ordinary student. | Try authorized content/event actions in A, then unauthorized course B/student writes. | Delegation works only where permitted; ordinary/nonmember writes fail without changes. |
| UC-E03 | P2 | Student and a known notification-triggering course action. | Instructor performs action; student checks notification list/indicator and follows supported link. | Relevant in-app notification is correctly associated with user/content; no email delivery is assumed. |

## Profiles

Requirement: **UC-R07**.

| ID | Priority | Preconditions/data | Steps | Expected result |
| --- | --- | --- | --- | --- |
| UC-P01 | P1 | Signed-in account and valid small image. | Edit name/profile fields and picture; save; refresh and sign in again. | Own fields/image remain saved; UI refreshes to current data. |
| UC-P02 | P1 | Own disposable account; existing password. | Change password with invalid current password, then valid current password; logout; test old/new login. | Invalid change rejected; successful change requires new password; old password no longer logs in. |
| UC-P03 | P0 | Student A and B; B's known user ID. | As A attempt privileged role/approval fields and updates to B's account. | Unauthorized changes denied/ignored; both saved roles and B's profile remain unchanged. |

## Administration

Requirement: **UC-R08**.

| ID | Priority | Preconditions/data | Steps | Expected result |
| --- | --- | --- | --- | --- |
| UC-D01 | P1 | Admin and fresh instructor request. | Find pending user; approve; search/edit supported account details. | Correct account approved/updated; instructor can subsequently log in. |
| UC-D02 | P1 | Admin and disposable existing course/members. | Edit course fields; inspect members; remove a member. | Correct course/member saved state reflected; unrelated courses/users unchanged. |
| UC-D03 | P2 | Admin session and unique new course details. | Use admin Create Course control and submit valid form. | Intended control should create course or be unavailable with clear guidance; reproduce current endpoint mismatch and log Fail when present. |
| UC-D04 | P1 | Admin; known fixture totals; student session. | Load statistics; compare selected totals with fixture records; repeat stats API as student. | Admin statistics consistent with data; student denied access to protected statistics. |

## Sessions and data protection

Requirement: **UC-R09**.

| ID | Priority | Preconditions/data | Steps | Expected result |
| --- | --- | --- | --- | --- |
| UC-S01 | P0 | Guest, student and instructor sessions. | Open admin routes directly and request user list/admin APIs with each unauthorized role. | Protected UI/data denied; hidden buttons are not the only check. |
| UC-S02 | P0 | Valid disposable account with active refresh cookie/access token. | Logout; replay previously valid refresh/protected request from that test session. | Ended session rejected; protected data/mutations unavailable. |
| UC-S03 | P0 | Authorized test requests returning nested user/course data. | Inspect profile/course/member JSON responses and errors. | No password hashes, signing secrets or unintended session tokens appear in ordinary data responses. |
| UC-S04 | P1 | Test access token allowed to expire while refresh session is valid. | Make protected request after expiry; repeat with expired/invalid refresh session. | Valid refresh restores intended request; invalid refresh requires login without a retry loop. |

## Persistence, usability and service

Requirement: **UC-R10–UC-R12**.

| ID | Priority | Preconditions/data | Steps | Expected result |
| --- | --- | --- | --- | --- |
| UC-Q01 | P0 | Normal persistent local test copy; not dev:qa; valid account/session. | Create named record, stop/restart normal app without deleting .data, reopen record and refresh session. | Record/account remain saved; still-valid sessions work; no reseeding overwrites data. |
| UC-Q02 | P1 | Chrome/Edge desktop plus 390px viewport; actual versions recorded. | Repeat catalogue → enrollment → assignment view and instructor grade view on each target. | Core controls reachable and readable; no blocking overlap/horizontal clipping; record each browser/viewport. |
| UC-Q03 | P2 | Keyboard-only session and invalid form input. | Navigate sign-in/catalogue/assignment controls with Tab/Enter; inspect labels/focus/errors. | Core controls keyboard-operable; visible focus and meaningful field/error labels; record findings without certification claims. |
| UC-Q04 | P2 | Isolated local/staging environment; timing target agreed. | Warm up; time five sequential dashboard/catalogue/course loads; record core request errors. | No failed core requests; timings satisfy agreed target (proposed 5 seconds). Publish raw observations and environment. |

