import bcrypt from "bcrypt";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import * as s from "../src/drizzle";
import { catalogCourses, departments, resourceCategories } from "../src/data/catalog";

// Original, small study guides; no external textbook copies or broken download links.
export function studyPdf(title:string, lines:string[]) {
  const escape=(v:string)=>v.replace(/[^\x20-\x7e]/g,"-").replace(/([\\()])/g,"\\$1");
  const wrapped=[title,"UniConnect | Sample learning resource","",...lines].flatMap(line=>line.match(/.{1,85}(?:\s|$)|.{1,85}/g)||[" "]);
  const stream="BT /F1 11 Tf 45 790 Td 16 TL "+wrapped.map((line,i)=>(i?"T* ":"")+`(${escape(line.trim())}) Tj`).join("\n")+" ET";
  const objects=["<< /Type /Catalog /Pages 2 0 R >>","<< /Type /Pages /Kids [3 0 R] /Count 1 >>","<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>","<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",`<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`];
  let pdf="%PDF-1.4\n";const offsets=[0];
  objects.forEach((o,i)=>{offsets.push(Buffer.byteLength(pdf));pdf+=`${i+1} 0 obj\n${o}\nendobj\n`});
  const start=Buffer.byteLength(pdf);pdf+=`xref\n0 6\n0000000000 65535 f \n`+offsets.slice(1).map(o=>String(o).padStart(10,"0")+" 00000 n \n").join("")+`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${start}\n%%EOF`;
  return Buffer.from(pdf);
}

export async function seedCampus(db:any) {
  const password=await bcrypt.hash("UniConnect123!",10);
  const sample=await db.query.UsersTable.findMany();
  const primary=sample.find((u:any)=>u.email==="student@uniconnect.test");
  const instructor=sample.find((u:any)=>u.email==="instructor@uniconnect.test");
  const head=sample.find((u:any)=>u.email==="head@uniconnect.test");
  const rep=sample.find((u:any)=>u.email==="representative@uniconnect.test");
  const teachers:any[]=[];const students:any[]=[];
  for(const [email,first_name,parent_name] of [["student","Layla","Ahmed"],["student2","Adam","Saeed"],["instructor","Salma","Hassan"],["representative","Reem","Khaled"],["head","Ali","Ibrahim"]]) {
    const user=sample.find((u:any)=>u.email===`${email}@uniconnect.test`);
    if(user?.parent_name==="QA"){await db.update(s.UsersTable).set({first_name,parent_name}).where(eq(s.UsersTable.id,user.id));user.first_name=first_name;user.parent_name=parent_name;}
  }
  const faculty=[["Salma","Hassan"],["Omar","Farouk"],["Nour","Adel"],["Youssef","Ibrahim"],["Mariam","Nabil"],["Kareem","Samir"],["Dina","Mahmoud"],["Ahmed","Fathy"]];
  for(let i=0;i<faculty.length;i++) {
    if(i===0&&instructor){teachers.push(instructor);continue}
    const [user]=await db.insert(s.UsersTable).values({first_name:faculty[i][0],parent_name:faculty[i][1],email:`faculty${i+1}@uniconnect.test`,password,role:"professor/ta",isApproved:true}).returning();teachers.push(user);
  }
  const first=["Layla","Adam","Malak","Hassan","Farida","Ziad","Hana","Mostafa","Jana","Ali","Reem","Amr"];
  const last=["Ahmed","Saeed","Hassan","Ibrahim","Khaled"];
  for(let i=0;i<48;i++) {
    const [user]=await db.insert(s.UsersTable).values({first_name:first[i%first.length],parent_name:last[Math.floor(i/first.length)],email:`learner${i+1}@uniconnect.test`,password,role:"student",year:String(i%4+1),code:`UC-${2026000+i+1}`,isApproved:true}).returning();students.push(user);
  }
  const future=(days:number)=>new Date(Date.now()+days*86400000);
  for(let i=0;i<catalogCourses.length;i++) {
    const c=catalogCourses[i], teacher=teachers[Math.floor(i/3)];
    // Existing courses and user-created records are preserved.
    if(await db.query.CoursesTable.findFirst({where:eq(s.CoursesTable.code,c.code)}))continue;
    const [group]=await db.insert(s.group).values({name:`${c.code}: ${c.name}`}).returning();
    await db.insert(s.CoursesTable).values({code:c.code,name:c.name,year:c.year,department:c.department,description:c.description,group_id:group.id,image_url:`/subjects/subject-${Math.floor(i/3)}.svg`});
    await db.insert(s.Teaches).values({courseCode:c.code,userId:teacher.id});
    // The primary instructor can explore all the populated teaching tools.
    if(instructor&&teacher.id!==instructor.id)await db.insert(s.Teaches).values({courseCode:c.code,userId:instructor.id});
    const members=students.filter((u:any,j:number)=>u.year===c.year || (j+i)%6===0);
    const featured=[0,1,4,7,10,13,16,19,22].includes(i);
    if(featured&&primary)members.push(primary);
    if(featured&&head){members.push(head);await db.insert(s.manages).values({courseCode:c.code,userId:head.id});}
    if(featured&&rep)members.push(rep);
    for(const member of members)await db.insert(s.enrolledIn).values({courseCode:c.code,userId:member.id}).onConflictDoNothing();
    for(const category of resourceCategories) {
      const title=`${c.name} - ${category[0].toUpperCase()+category.slice(1)} guide`;
      const exercise=category==="quiz"?"Practice quiz: define the key terms, explain one use case, and compare two approaches.":category==="sheet"?"Problem sheet: choose a practical problem, outline a solution, and explain how you would evaluate it.":category==="assignment"?"Assignment brief: research a real application, prepare a short report, and cite your sources.":category==="tutorial"?"Tutorial: review the course overview, build a small example, test your understanding, and document your results.":category==="textbook"?"Reading companion: build a glossary, keep chapter summaries, and connect the concepts to a practical example.":"Lecture outline: foundations, worked examples, guided discussion, and independent practice.";
      const bytes=studyPdf(title,[c.description,"",exercise,"","Learning activities:","1. Identify three important ideas in this subject.","2. Apply one idea to a real situation and explain your reasoning.","3. Discuss the limitations of your approach with your group.","4. Prepare two questions for your instructor.","","Assessment: clear reasoning (40%), application (40%), presentation (20%).","","This is original illustrative study content for a fictional campus."]);
      const token=randomUUID();const id=randomUUID();
      const [file]=await db.insert(s.FileTable).values({id,name:`${c.code}-${category}.pdf`,type:"application/pdf",key:`db:${id}`,size:`${(bytes.length/1024).toFixed(1)} KB`,url:`/api/content/${id}/${token}`}).returning();
      await db.insert(s.hostedUpload).values({fileId:id,ownerId:teacher.id,token,bytes:bytes.length,content:bytes.toString("base64")});
      await db.insert(s.MaterialTable).values({title,category,uploader_id:teacher.id,file_id:file.id,course_code:c.code});
    }
    for(let a=0;a<3;a++) {
      const [assignment]=await db.insert(s.assignment).values({course_id:c.code,title:["Foundations practice","Applied case study","Team project proposal"][a],description:`${c.description}\n${["Explain the core ideas using your own examples. Submit a short PDF report.","Apply the course concepts to a practical case. Include your method and findings.","Work with your team to propose a project, milestones, and success criteria."][a]}`,deadline_at:future(4+a*7+i%4),assigner_id:teacher.id,max_grade:100}).returning();
      if(a===0)for(const member of members.slice(0,4))await db.insert(s.submission).values({assignment_id:assignment.id,student_id:member.id,is_turned_in:true,turned_in_at:new Date(),grade:72+i%25,feedback:"Clear approach. Add more supporting examples in your next report."});
    }
    const [notice]=await db.insert(s.announcement).values({title:`Welcome to ${c.name}`,content:`${c.description} Your six resource folders are ready. Check the calendar for upcoming assessments and introduce yourself in the course group.`,announcer_id:teacher.id,type:"announcement"}).returning();
    await db.insert(s.coursesAnnouncements).values({announcement_id:notice.id,course_id:c.code});
    const [poll]=await db.insert(s.announcement).values({title:"Which revision format would help you most?",announcer_id:teacher.id,type:"poll"}).returning();
    await db.insert(s.coursesAnnouncements).values({announcement_id:poll.id,course_id:c.code});
    for(const content of ["Worked examples","Practice questions","Group discussion"]){const [item]=await db.insert(s.pollItem).values({announcement_id:poll.id,content}).returning();if(content==="Worked examples"&&members[0])await db.insert(s.vote).values({poll_item_id:item.id,voter_id:members[0].id});}
    for(let e=0;e<2;e++)await db.insert(s.event).values({title:e?`${c.name}: project workshop`:`${c.name}: revision quiz`,notes:e?"Bring your project outline and questions.":"Review the lecture guide and practice questions.",type:e?"project":"quiz",deadline_at:future(2+e*8+i%5),course_id:c.code});
    await db.insert(s.message).values([{content:`Welcome! Use this group for questions about ${c.name}. Office hours are on Tuesday, 2-3 pm.`,sender_id:teacher.id,group_id:group.id},{content:"I have downloaded the study guide. Would anyone like to form a study group?",sender_id:members[0].id,group_id:group.id},{content:"Start with the practice questions, then share your approach here.",sender_id:teacher.id,group_id:group.id}]);
  }
  for(const year of ["1","2","3","4"])if(rep){const [notice]=await db.insert(s.announcement).values({title:`Year ${year}: campus learning week`,content:"Join our study sessions, peer mentoring, and project showcase. Browse the course catalogue to find your next subject.",announcer_id:rep.id,type:"announcement"}).returning();await db.insert(s.classesAnnouncements).values({announcement_id:notice.id,class:year});}
  console.log(`Campus populated: ${catalogCourses.length} courses, ${departments.length} subject categories, 144 study resources, 48 learners.`);
}
