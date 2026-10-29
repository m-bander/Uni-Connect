import {
  announcement,
  CoursesTable,
  group,
  pollItem,
  UsersTable,
  vote,
} from "./drizzle";
import { db } from "./drizzle/db";
import { faker } from "@faker-js/faker";
import { userRolesType } from "./types/api";

const seed = async () => {
  // Create 5 instructors
  const instructors = await db
    .insert(UsersTable)
    .values(
      Array.from({ length: 5 }).map(() => ({
        first_name: faker.person.firstName(),
        parent_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: "professor/ta" as userRolesType,
        isApproved: true,
      }))
    )
    .returning();

  //   const [_group] = await db
  //     .insert(group)
  //     .values({
  //       name: "DBMS group",
  //     })
  //     .returning();

  //   await db.insert(CoursesTable).values({
  //     code: "CMPG-303",
  //     group_id: _group.id,
  //     name: "DBMS",
  //     year: "3",
  //   });

  //   const [_announcement] = await db
  //     .insert(announcement)
  //     .values({
  //       announcer_id: "5dff18b2-e6c5-4dad-b071-c1647dd6e5f2",
  //       type: "poll",
  //       content: "test",
  //       title: "test",
  //     })
  //     .returning();

  //   const [_pollItem1] = await db
  //     .insert(pollItem)
  //     .values({
  //       content: "test1",
  //       announcement_id: _announcement.id,
  //     })
  //     .returning();

  //   const [_pollItem2] = await db
  //     .insert(pollItem)
  //     .values({
  //       content: "test2",
  //       announcement_id: _announcement.id,
  //     })
  //     .returning();

  const [student] = await db
    .insert(UsersTable)
    .values({
      first_name: "Mazen",
      parent_name: "Ahmed",
      email: "mazen@test.com",
      password: "broken_password",
      role: "student",
      isApproved: true,
      code: Math.random().toString(),
      year: "3",
    })
    .returning();

  await db.insert(vote).values({
    poll_item_id: "673d9fcc-19cc-4f34-8c77-a110016f8234",
    voter_id: student.id,
  });

  await db.insert(vote).values({
    poll_item_id: "c1d7b016-7be7-4ccf-a3f3-a12c81b5c6e7",
    voter_id: student.id,
  });

  console.log("done");
};

console.log("seeding...");
seed();
