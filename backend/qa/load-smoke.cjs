const {request}=require("@playwright/test");
const fs=require("fs");
(async()=>{
 const api=await request.newContext({baseURL:"http://127.0.0.1:3000"});
 const login=await api.post("/api/auth/login",{data:{email:"student@uniconnect.test",password:"UniConnect123!"}});
 if(login.status()!==200) throw new Error("Fixture login failed");
 const {accessToken}=await login.json(), timings=[],statuses=[];
 const start=performance.now();
 for(let batch=0;batch<10;batch++){
   await Promise.all(Array.from({length:5},async()=>{
     const t=performance.now();
     const r=await api.get("/api/courses",{headers:{Authorization:"Bearer "+accessToken}});
     await r.body();timings.push(performance.now()-t);statuses.push(r.status());
   }));
 }
 timings.sort((a,b)=>a-b);
 const report={date:new Date().toISOString(),environment:"Local PGlite, not a production capacity test",endpoint:"GET /api/courses",requests:50,concurrency:5,successful:statuses.filter(s=>s===200).length,
 durationMs:Math.round(performance.now()-start),medianMs:Math.round(timings[24]),p95Ms:Math.round(timings[47]),maxMs:Math.round(timings[49])};
 fs.mkdirSync("qa/reports",{recursive:true});fs.writeFileSync("qa/reports/load-smoke.json",JSON.stringify(report,null,2));
 console.log(JSON.stringify(report,null,2));await api.dispose();if(report.successful!==50) process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
