import {test,expect} from "@playwright/test";
import {API,fixture,login,passwordKeys} from "./helpers";
// These assert required safe behavior. Real product defects remain FAIL, never silently marked expected.
test("SEC-001 student cannot change their own grade",async()=>{
 const s=await login(),f=fixture();try {
 const r=await s.client.patch("/api/courses/QA-101/assignments/"+f.assignmentId+"/submissions/"+f.submissionId,{headers:s.headers,data:{grade:100}});
 expect([401,403]).toContain(r.status());
 } finally {await s.client.patch("/api/courses/QA-101/assignments/"+f.assignmentId+"/submissions/"+f.submissionId,{headers:s.headers,data:{grade:80}});await s.client.dispose();}
});
test("SEC-002 another student cannot modify someone else's submission",async()=>{
 const s=await login("student2"),f=fixture();try {
 const r=await s.client.patch("/api/courses/QA-101/assignments/"+f.assignmentId+"/submissions/"+f.submissionId,{headers:s.headers,data:{feedback:"Unauthorized change"}});
 expect([401,403]).toContain(r.status());
 } finally {const teacher=await login("instructor");await teacher.client.patch("/api/courses/QA-101/assignments/"+f.assignmentId+"/submissions/"+f.submissionId,{headers:teacher.headers,data:{feedback:"Reviewed by QA"}});await teacher.client.dispose();await s.client.dispose();}
});
test("SEC-003 unauthenticated caller cannot read course chat",async({request})=>{
 const r=await request.get(API+"/api/groups/"+fixture().groupId+"/messages");expect([401,403]).toContain(r.status());
});
test("SEC-004 unauthenticated caller cannot impersonate a chat sender",async({request})=>{
 const f=fixture();const r=await request.post(API+"/api/groups/"+f.groupId+"/messages",{data:{content:"QA unauthorized sender probe",sender_id:f.users.instructor.id}});
 const body=await r.json();try {expect([401,403]).toContain(r.status());}finally {if(body.data?.id) await request.delete(API+"/api/groups/"+f.groupId+"/messages/"+body.data.id);}
});
test("SEC-005 user profile responses never expose password fields",async()=>{
 const s=await login(),f=fixture();const r=await s.client.get("/api/users/"+f.users.student2.id,{headers:s.headers});expect(r.status()).toBe(200);expect(passwordKeys(await r.json())).toEqual([]);await s.client.dispose();
});
test("SEC-006 course response never exposes instructors' password fields",async()=>{
 const s=await login();const r=await s.client.get("/api/courses/QA-101",{headers:s.headers});expect(r.status()).toBe(200);expect(passwordKeys(await r.json())).toEqual([]);await s.client.dispose();
});
test("SEC-007 malformed access token is rejected as an auth error",async()=>{
 const s=await login();const r=await s.client.get("/api/courses",{headers:{Authorization:"Bearer invalid-token"}});expect([401,403]).toContain(r.status());await s.client.dispose();
});
test("SEC-008 student cannot read another student's submissions",async()=>{
 const s=await login("student2"),f=fixture();const r=await s.client.get("/api/courses/QA-101/assignments/"+f.assignmentId+"/submissions?userId="+f.users.student.id+"&pageIndex=0&pageSize=10",{headers:s.headers});expect([401,403]).toContain(r.status());await s.client.dispose();
});
test("DB-001 general statistics work on a fresh database",async()=>{
 const s=await login("admin");const r=await s.client.get("/api/stats/general",{headers:s.headers});expect(r.status()).toBe(200);await s.client.dispose();
});
