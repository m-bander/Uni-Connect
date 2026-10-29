import * as s from "../src/drizzle";
import bcrypt from "bcrypt";
export async function seedBase(db: any, plainPassword: string) {
  const password = await bcrypt.hash(plainPassword, 10);
  const roles = [
    ["student", "student"], ["student2", "student"], ["instructor", "professor/ta"],
    ["admin", "system_admin"], ["representative", "class_representative"],
    ["head", "course_head"], ["pending", "professor/ta"]
  ] as const;
  const users: Record<string, any> = {};
  for (const [name, role] of roles) {
    [users[name]] = await db.insert(s.UsersTable).values({
      first_name: name[0].toUpperCase()+name.slice(1), parent_name: "QA",
      email: name+"@uniconnect.test", password, role, year: "3",
      code: "QA-"+name, isApproved: name !== "pending"
    }).returning();
  }
  const [group] = await db.insert(s.group).values({name: "QA-101: Software Testing"}).returning();
  await db.insert(s.CoursesTable).values({code:"QA-101", name:"Software Testing", year:"3", group_id:group.id});
  await db.insert(s.Teaches).values({courseCode:"QA-101",userId:users.instructor.id});
  await db.insert(s.manages).values({courseCode:"QA-101",userId:users.head.id});
  for (const name of ["student","student2","representative","head"]) {
    await db.insert(s.enrolledIn).values({courseCode:"QA-101",userId:users[name].id});
  }
  const [assignment] = await db.insert(s.assignment).values({
    course_id:"QA-101", title:"Design a login test suite", description:"Create positive, negative and boundary test cases.",
    deadline_at:new Date(Date.now()+7*86400000), assigner_id:users.instructor.id,max_grade:100
  }).returning();
  const [submission] = await db.insert(s.submission).values({
    assignment_id:assignment.id,student_id:users.student.id,is_turned_in:true,turned_in_at:new Date(),grade:75,feedback:"Baseline feedback"
  }).returning();
  const [announcement] = await db.insert(s.announcement).values({
    title:"Welcome to the QA course",content:"Use the seeded accounts to test role permissions.",
    announcer_id:users.instructor.id,type:"announcement"
  }).returning();
  await db.insert(s.coursesAnnouncements).values({announcement_id:announcement.id,course_id:"QA-101"});
  await db.insert(s.event).values({title:"QA review",type:"quiz",deadline_at:new Date(Date.now()+3*86400000),course_id:"QA-101"});
  const [message] = await db.insert(s.message).values({content:"Welcome to the test group.",sender_id:users.student.id,group_id:group.id}).returning();

return {courseCode:"QA-101",groupId:group.id,assignmentId:assignment.id,submissionId:submission.id,messageId:message.id,users:Object.fromEntries(Object.entries(users).map(([name,u])=>[name,{id:u.id,email:u.email}]))};
}
