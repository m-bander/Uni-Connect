const {request}=require("@playwright/test");
const fs=require("fs");
const baseURL=process.argv[2];
if(!baseURL||!baseURL.startsWith("https://"))throw new Error("Pass the public HTTPS origin");
function passwordKeys(value){if(!value||typeof value!=="object")return[];return Object.entries(value).flatMap(([k,v])=>[...(k==="password"?[k]:[]),...passwordKeys(v)]);}
(async()=>{
 const rows=[];
 function check(name,passed,details){rows.push({name,passed,details});if(!passed)throw new Error(name+": "+details);}
 const guest=await request.newContext({baseURL});
 let r=await guest.get("/");check("Public landing page",r.status()===200,r.status());
 r=await guest.get("/api/health");check("API health",r.status()===200&& (await r.json()).status==="ok",r.status());
 async function login(name){
  const client=await request.newContext({baseURL});
  const response=await client.post("/api/auth/login",{data:{email:name+"@uniconnect.test",password:"UniConnect123!"}});
  check(name+" login",response.status()===200,response.status());
  const data=await response.json();check(name+" safe login payload",passwordKeys(data).length===0,"password fields: "+passwordKeys(data).length);
  return {client,headers:{Authorization:"Bearer "+data.accessToken},user:data.user};
 }
 const student=await login("student");
 r=await student.client.get("/api/courses/QA-101",{headers:student.headers});
 check("Course API",r.status()===200,r.status());const course=await r.json();
 check("Seeded course",course.data.name==="Software Testing",course.data.name);
 check("Safe instructor records",passwordKeys(course).length===0,"password fields: "+passwordKeys(course).length);
 r=await student.client.get("/api/me/courses/enrolled",{headers:student.headers});
 check("Enrollment survives separate request",r.status()===200&&(await r.text()).includes("QA-101"),r.status());
 r=await student.client.get("/api/courses/QA-101/assignments",{headers:student.headers});
 check("Assignments API",r.status()===200,r.status());const assignment=(await r.json()).data.find(a=>a.title==="Design a login test suite");
 check("Seeded assignment",!!assignment,assignment?.title);
 const submissions="/api/courses/QA-101/assignments/"+assignment.id+"/submissions";
 r=await student.client.get(submissions+"?userId="+student.user.id+"&pageIndex=0&pageSize=10",{headers:student.headers});
 check("Own submission access",r.status()===200,r.status());const own=(await r.json()).data;
 r=await student.client.patch(submissions+"/"+own.id,{headers:student.headers,data:{grade:own.grade}});
 check("Student grade change denied",r.status()===403,r.status());
 const other=await login("student2");
 r=await other.client.get(submissions+"?userId="+student.user.id+"&pageIndex=0&pageSize=10",{headers:other.headers});
 check("Cross-student submission access denied",r.status()===403,r.status());
 r=await guest.get("/api/groups/"+course.data.group_id+"/messages");
 check("Anonymous chat denied",[401,403].includes(r.status()),r.status());
 const admin=await login("admin");
 r=await admin.client.get("/api/stats/general",{headers:admin.headers});
 check("Hosted statistics procedures",r.status()===200,r.status());
 r=await guest.post("/api/users/register",{data:{email:"disabled-signup@uniconnect.test"}});
 check("Incomplete registration rejected",r.status()===400,r.status());
 r=await student.client.get("/api/auth/refresh");
 check("Persistent refresh session",r.status()===201,r.status());
 await Promise.all([guest.dispose(),student.client.dispose(),other.client.dispose(),admin.client.dispose()]);
 const report={origin:baseURL,checkedAt:new Date().toISOString(),passed:rows.filter(r=>r.passed).length,failed:rows.filter(r=>!r.passed).length,checks:rows};
 fs.writeFileSync("qa/reports/PUBLIC-SMOKE.json",JSON.stringify(report,null,2));
 console.log(JSON.stringify(report,null,2));
})().catch(error=>{console.error(error.message);process.exitCode=1});
