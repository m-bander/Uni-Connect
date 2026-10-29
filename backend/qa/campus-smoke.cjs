const {request}=require('@playwright/test');
const fs=require('node:fs');
const baseURL=process.argv[2]||'http://localhost:3000';
if(new URL(baseURL).hostname==='unicomnect-test.vercel.app')throw new Error('Use an isolated local or staging website for mutation-based workflow checks. Run npm run test:public for live health checks.');
const tag=Date.now().toString(36),code='CAMPUS-'+tag;
const rows=[],clients=[],createdUsers=[],files=[];
let admin,teacher,student,courseCreated=false,submissionPath;
function check(name,ok,detail){rows.push({name,passed:!!ok,detail});if(!ok)throw new Error(name+': '+detail);}
async function client(){const c=await request.newContext({baseURL});clients.push(c);return c;}
async function status(name,response,expected){check(name,response.status()===expected,response.status()+(response.status()===expected?'':' '+(await response.text()).slice(0,300)));return response;}
async function login(email,success=true){const c=await client();const r=await c.post('/api/auth/login',{data:{email,password:'UniConnect123!'}});await status(email+' login',r,success?200:401);if(!success)return;const data=await r.json();check('No password in login response',!JSON.stringify(data).includes('"password"'),email);return {c,h:{Authorization:'Bearer '+data.accessToken},user:data.user};}
async function upload(who,name='work.pdf'){const bytes=Buffer.from('%PDF-1.4\n% UniConnect functional check\n%%EOF');const r=await who.c.post('/api/uploads',{headers:who.h,data:{name,type:'application/pdf',content:bytes.toString('base64')}});await status('Authenticated persistent upload',r,201);const data=await r.json();files.push({owner:who,id:data.serverData.file_data.id});return data;}
(async()=>{
 const guest=await client();
 let r=await guest.get('/api/catalog');await status('Public catalogue',r,200);const catalog=await r.json();check('Eight populated subject categories',catalog.departments.length===8,catalog.departments.length);check('Expanded course catalogue',catalog.courses.length>=25,catalog.courses.length);
 check('Realistic categories have courses',catalog.departments.every(d=>catalog.courses.filter(c=>c.department===d).length>=3),'At least three in each category');
 r=await guest.post('/api/users/register',{data:{email:'bad'}});await status('Invalid signup rejected',r,400);
 r=await guest.post('/api/users/register',{data:{first_name:'Functional',parent_name:'Check',email:`admin-${tag}@uniconnect.test`,password:'UniConnect123!',role:'system_admin'}});await status('Public admin registration denied',r,400);
 admin=await login('admin@uniconnect.test');
 for(const role of ['student','professor/ta']){
   const email=`${role==='student'?'learner':'teacher'}-${tag}@uniconnect.test`;
   r=await guest.post('/api/users/register',{data:{first_name:'Campus',parent_name:'Check',email,password:'UniConnect123!',role,year:'3',code:'CHECK-'+tag}});await status('Register '+role,r,201);
   if(role==='professor/ta'){
     await login(email,false);
     r=await admin.c.get('/api/users?search='+encodeURIComponent(email),{headers:admin.h});await status('Find instructor for approval',r,200);const data=await r.json();const found=data.data.users.find(u=>u.email===email);check('Pending instructor exists',!!found,'Found');createdUsers.push(found.id);
     r=await admin.c.put(`/api/users/${found.id}/approve`,{headers:admin.h});await status('Admin approves instructor',r,200);teacher=await login(email);
   }else {student=await login(email);createdUsers.push(student.user.id);}
 }
 r=await teacher.c.post('/api/courses',{headers:teacher.h,data:{code,name:'Functional workflow course',year:'3',department:'Software Engineering',description:'A temporary course used for full workflow verification.'}});await status('Instructor creates categorized course',r,201);courseCreated=true;
 r=await guest.get('/api/catalog');const added=(await r.json()).courses.find(c=>c.code===code);check('New category and description appear in catalogue',added?.department==='Software Engineering'&&added.description.includes('temporary'),added?.department);
 r=await teacher.c.patch('/api/courses/'+code,{headers:teacher.h,data:{name:'Updated workflow course',department:'Computer Science',description:'An updated course overview.'}});await status('Instructor edits course details',r,200);
 r=await guest.get('/api/catalog');const updated=(await r.json()).courses.find(c=>c.code===code);check('Course edits persist in catalogue',updated?.department==='Computer Science'&&updated.description==='An updated course overview.',updated?.department);
 r=await student.c.get('/api/courses/'+code,{headers:student.h});await status('Unenrolled course content protected',r,403);
 r=await student.c.post(`/api/courses/${code}/enrollments`,{headers:student.h});await status('Student enrolls in course',r,200);
 r=await student.c.get('/api/courses/'+code,{headers:student.h});await status('Enrolled course accessible',r,200);const course=(await r.json()).data;
 r=await student.c.post('/api/courses/CS-101/enrollments',{headers:student.h});await status('Join populated course',r,200);
 r=await student.c.get('/api/materials/course/CS-101',{headers:student.h});await status('Populated materials library',r,200);const materials=await r.json();check('All six resource categories populated',new Set(materials.map(m=>m.category)).size===6,materials.length);
 r=await guest.get(materials[0].file.url);await status('Study guide downloads',r,200);check('Actual PDF bytes', (await r.body()).subarray(0,5).toString()==='%PDF-','PDF header');
 r=await guest.get(materials[0].file.url.replace(/[^/]+$/,'00000000-0000-4000-8000-000000000000'));await status('Invalid download token denied',r,404);
 r=await guest.post('/api/uploads',{data:{}});check('Anonymous upload denied',[401,403].includes(r.status()),r.status());
 r=await student.c.post('/api/uploads',{headers:student.h,data:{name:'fake.pdf',type:'application/pdf',content:Buffer.from('not a pdf').toString('base64')}});await status('Forged file format rejected',r,400);
 const resource=await upload(teacher,'lesson.pdf');
 r=await teacher.c.post('/api/materials',{headers:teacher.h,data:{title:'Functional lesson',category:'lecture',course_code:code,file_id:resource.serverData.file_data.id}});await status('Instructor publishes uploaded material',r,201);
 r=await teacher.c.post(`/api/courses/${code}/assignments`,{headers:teacher.h,data:{title:'Workflow assignment',description:'Submit a PDF for instructor feedback.',deadline_at:new Date(Date.now()+86400000).toISOString(),max_grade:100}});await status('Instructor creates assignment',r,200);const task=(await r.json()).data[0];
 const work=await upload(student);
 r=await student.c.post(`/api/courses/${code}/assignments/${task.id}/submissions`,{headers:student.h,data:{file_ids:[work.serverData.file_data.id]}});await status('Student attaches submitted work',r,200);const submission=(await r.json()).data;submissionPath=`/api/courses/${code}/assignments/${task.id}/submissions/${submission.id}`;
 r=await student.c.patch(submissionPath,{headers:student.h,data:{is_turned_in:true}});await status('Student turns in assignment',r,200);
 r=await student.c.patch(submissionPath,{headers:student.h,data:{grade:100}});await status('Student cannot grade own work',r,403);
 r=await teacher.c.patch(submissionPath,{headers:teacher.h,data:{grade:88,feedback:'Good work. Add more examples.'}});await status('Instructor grades submitted work',r,200);
 r=await student.c.get(`/api/courses/${code}/assignments/${task.id}/submissions?userId=${student.user.id}`,{headers:student.h});await status('Student sees grade and feedback',r,200);const grade=(await r.json()).data;check('Grade and attached file persisted',grade.grade===88&&grade.files?.length===1,JSON.stringify({grade:grade.grade,files:grade.files?.length}));
 r=await student.c.post(`/api/groups/${course.group_id}/messages`,{headers:student.h,data:{content:'Functional chat check',sender_id:teacher.user.id}});await status('Course group chat works',r,201);check('Chat sender bound to signed-in user',(await r.json()).data.sender_id===student.user.id,'User identity enforced');
 r=await teacher.c.post(`/api/courses/${code}/events`,{headers:teacher.h,data:{title:'Project workshop',notes:'Bring your outline.',type:'project',deadline_at:new Date(Date.now()+86400000).toISOString()}});await status('Instructor creates calendar event',r,200);
 r=await student.c.get('/api/events',{headers:student.h});await status('Student calendar works',r,200);check('New event in student calendar',(await r.text()).includes('Project workshop'),'Event found');
 r=await teacher.c.post(`/api/courses/${code}/announcements`,{headers:teacher.h,data:{title:'Choose a workshop format',type:'poll',pollItems:['Examples','Discussion','Practice']}});await status('Instructor publishes course poll and notification',r,200);const published=(await r.json()).data;
 r=await student.c.get(`/api/courses/${code}/announcements`,{headers:student.h});let ownPoll=(await r.json()).data.find(a=>a.id===published.id);
 check('New poll is visible to enrolled students',ownPoll?.pollItems?.length===3,ownPoll?.pollItems?.length);
 r=await teacher.c.patch('/api/announcements/'+published.id,{headers:teacher.h,data:{title:'Updated workshop choices',pollItems:ownPoll.pollItems.slice(0,2).map(i=>({id:i.id,content:i.content}))}});await status('Instructor updates poll options',r,200);
 r=await student.c.get(`/api/courses/${code}/announcements`,{headers:student.h});ownPoll=(await r.json()).data.find(a=>a.id===published.id);check('Only intended poll options changed',ownPoll.pollItems.length===2,ownPoll.pollItems.length);
 r=await student.c.get('/api/notifications',{headers:student.h});await status('Student notifications accessible',r,200);check('Published poll produced notification',(await r.text()).includes('Choose a workshop format'),'Notification found');
 r=await student.c.get('/api/courses/CS-101/announcements',{headers:student.h});await status('Course announcements and polls',r,200);const announcements=(await r.json()).data;const poll=announcements.find(a=>a.type==='poll');check('Populated poll options',poll?.poll_items?.length===3||poll?.pollItems?.length===3,JSON.stringify(poll).slice(0,300));
 const option=(poll.poll_items||poll.pollItems)[1];
 r=await student.c.post(`/api/poll_items/${option.id}/votes`,{headers:student.h});await status('Student votes in course poll',r,200);
 r=await admin.c.get('/api/stats/general',{headers:admin.h});await status('Admin statistics work with expanded data',r,200);
 r=await student.c.get('/api/auth/refresh');await status('Persistent account session',r,201);
})().catch(error=>{if(rows.at(-1)?.passed!==false)rows.push({name:'Complete workflow run',passed:false,detail:error.message});console.error(error.message);process.exitCode=1}).finally(async()=>{
 try{
   if(submissionPath)await status('Clean up temporary submission',await student.c.delete(submissionPath,{headers:student.h}),200);
   if(courseCreated)await status('Clean up temporary course',await admin.c.delete('/api/admin/'+code,{headers:admin.h}),200);
   for(const f of files)await status('Clean up temporary upload',await f.owner.c.delete('/api/files/'+f.id,{headers:f.owner.h}),200);
   for(const id of createdUsers)await status('Clean up temporary account',await admin.c.delete('/api/users/'+id,{headers:admin.h}),200);
 }catch(error){console.error('Cleanup:',error.message);process.exitCode=1}
 await Promise.all(clients.map(c=>c.dispose()));
 const report={origin:baseURL,checkedAt:new Date().toISOString(),passed:rows.filter(r=>r.passed).length,failed:rows.filter(r=>!r.passed).length,checks:rows};
 fs.mkdirSync('qa/reports',{recursive:true});fs.writeFileSync('qa/reports/CAMPUS-SMOKE.json',JSON.stringify(report,null,2));console.log(`${report.passed} passed, ${report.failed} failed. Detailed result: qa/reports/CAMPUS-SMOKE.json`);
});
