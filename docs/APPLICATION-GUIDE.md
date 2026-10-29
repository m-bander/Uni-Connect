# UniConnect application guide

UniConnect is a working university learning and communication website with saved accounts,
course materials, assignments, grades and discussions. Testing tools are separate.

**[Open the website](https://unicomnect-test.vercel.app)**

- [What the website does and how to use it](product/WEBSITE-GUIDE.md).
- [Features, subject categories and limits](product/FEATURES-AND-LIMITS.md).
- [Install and run on your device](setup/LOCAL-DEVELOPMENT.md).
- [Understand the architecture](technical/ARCHITECTURE.md).
- [Perform testing separately](testing/README.md).
- [All documentation](README.md).

Students create accounts and enroll in courses. Instructors register and wait for approval.
The owner's personal account has administrator access. After a role change, sign out and sign
in again. Shared privileged starter credentials are disabled on the hosted site after a real owner exists.

Normal local data persists in `.data/`; hosted data persists in Neon PostgreSQL.
Local devices and the live website have independent databases.
