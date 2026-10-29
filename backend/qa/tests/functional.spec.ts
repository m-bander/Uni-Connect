import {test,expect,request} from "@playwright/test";
import {API,fixture,login} from "./helpers";
test("AUTH-001 valid student login returns safe user and access token",async()=>{
 const s=await login();expect(s.user.role).toBe("student");expect(s.user.password).toBeUndefined();await s.client.dispose();
});
test("AUTH-002 incorrect password is rejected",async({request})=>{
 const r=await request.post(API+"/api/auth/login",{data:{email:"student@uniconnect.test",password:"WrongPassword!"}});expect(r.status()).toBe(401);
});
test("AUTH-003 pending instructor cannot log in",async({request})=>{
 const r=await request.post(API+"/api/auth/login",{data:{email:"pending@uniconnect.test",password:"UniConnect123!"}});expect(r.status()).toBe(401);
});
test("AUTH-004 missing login fields are rejected",async({request})=>{
 const r=await request.post(API+"/api/auth/login",{data:{}});expect(r.status()).toBe(400);
});
test("AUTH-005 unauthenticated course listing is rejected",async({request})=>{
 expect((await request.get(API+"/api/courses")).status()).toBe(401);
});
test("AUTH-006 refresh rotates session and returns a token",async()=>{
 const s=await login();const r=await s.client.get("/api/auth/refresh");expect(r.status()).toBe(201);expect((await r.json()).accessToken).toBeTruthy();await s.client.dispose();
});
test("AUTH-007 logout invalidates the refresh session",async()=>{
 const s=await login();expect((await s.client.get("/api/auth/logout")).status()).toBe(200);expect([400,401]).toContain((await s.client.get("/api/auth/refresh")).status());await s.client.dispose();
});
test("RBAC-001 student cannot list admin users",async()=>{
 const s=await login();expect([401,403]).toContain((await s.client.get("/api/users",{headers:s.headers})).status());await s.client.dispose();
});
test("RBAC-002 admin can list users",async()=>{
 const s=await login("admin");const r=await s.client.get("/api/users",{headers:s.headers});expect(r.status()).toBe(200);expect((await r.json()).data.users.length).toBeGreaterThan(0);await s.client.dispose();
});
test("RBAC-003 student cannot create an assignment",async()=>{
 const s=await login();const r=await s.client.post("/api/courses/QA-101/assignments",{headers:s.headers,data:{title:"Denied",deadline_at:new Date().toISOString(),max_grade:100}});expect([401,403]).toContain(r.status());await s.client.dispose();
});
test("COURSE-001 enrolled course is returned",async()=>{
 const s=await login();const r=await s.client.get("/api/me/courses/enrolled",{headers:s.headers});expect(r.status()).toBe(200);expect(await r.text()).toContain("QA-101");await s.client.dispose();
});
test("COURSE-002 course details include correct name",async()=>{
 const s=await login();const r=await s.client.get("/api/courses/QA-101",{headers:s.headers});expect(r.status()).toBe(200);expect((await r.json()).data.name).toBe("Software Testing");await s.client.dispose();
});
test("ASSIGN-001 instructor creates and retrieves an assignment",async()=>{
 const s=await login("instructor");const r=await s.client.post("/api/courses/QA-101/assignments",{headers:s.headers,data:{title:"Automated API assignment",deadline_at:new Date(Date.now()+86400000).toISOString(),max_grade:50}});
 expect(r.status()).toBe(200);const id=(await r.json()).data[0].id;const get=await s.client.get("/api/courses/QA-101/assignments/"+id,{headers:s.headers});expect(get.status()).toBe(200);expect((await get.json()).data.title).toBe("Automated API assignment");await s.client.dispose();
});
test("ASSIGN-002 instructor grades an existing submission",async()=>{
 const s=await login("instructor"),f=fixture();const r=await s.client.patch("/api/courses/QA-101/assignments/"+f.assignmentId+"/submissions/"+f.submissionId,{headers:s.headers,data:{grade:80,feedback:"Reviewed by QA"}});
 expect(r.status()).toBe(200);expect((await r.json()).data.grade).toBe(80);await s.client.dispose();
});
test("DATA-001 duplicate email registration is rejected",async({request})=>{
 const r=await request.post(API+"/api/users/register",{data:{first_name:"Duplicate",parent_name:"QA",email:"student@uniconnect.test",password:"UniConnect123!",role:"student",year:"3",code:"DUP"}});expect(r.status()).toBe(400);
});
test("DATA-002 public registration cannot create a system admin",async({request})=>{
 const r=await request.post(API+"/api/users/register",{data:{first_name:"Bad",parent_name:"QA",email:"bad-admin@uniconnect.test",password:"UniConnect123!",role:"system_admin"}});expect([400,401,403]).toContain(r.status());
});
test("DATA-003 registration and login work end to end",async({request})=>{
 const email="new-"+Date.now()+"@uniconnect.test";const r=await request.post(API+"/api/users/register",{data:{first_name:"New",parent_name:"Student",email,password:"UniConnect123!",role:"student",year:"3",code:"NEW-"+Date.now()}});expect(r.status()).toBe(201);
 expect((await request.post(API+"/api/auth/login",{data:{email,password:"UniConnect123!"}})).status()).toBe(200);
});
test("CAL-001 enrolled user can fetch calendar events",async()=>{
 const s=await login();const r=await s.client.get("/api/me/events",{headers:s.headers});expect(r.status()).toBe(200);expect(await r.text()).toContain("QA review");await s.client.dispose();
});
