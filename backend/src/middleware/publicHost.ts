import { RequestHandler } from "express";
import { and, eq } from "drizzle-orm";
import { db } from "../drizzle/db";
import { assignment, CoursesTable, enrolledIn, manages, message, submission, Teaches, MaterialTable, event, announcement, coursesAnnouncements, classesAnnouncements, pollItem, hostedUpload, blacklist } from "../drizzle";
import { z } from "zod";
import { APIRequest } from "../types/api";
import { safePayload } from "../utils/safePayload";
import { verifyAuth } from "./verifyAuth";

export const sanitizeHostedResponse: RequestHandler = (_req, res, next) => {
  const original = res.json.bind(res);
  res.json = (body) => original(safePayload(body));
  next();
};

async function courseAccess(userId: string, courseCode: string, admin: boolean) {
  if (admin) return { member: true, teacher: true, manager: true };
  const [teacher, student, manager] = await Promise.all([
    db.query.Teaches.findFirst({where: and(eq(Teaches.userId,userId),eq(Teaches.courseCode,courseCode))}),
    db.query.enrolledIn.findFirst({where: and(eq(enrolledIn.userId,userId),eq(enrolledIn.courseCode,courseCode))}),
    db.query.manages.findFirst({where: and(eq(manages.userId,userId),eq(manages.courseCode,courseCode))})
  ]);
  return {member:!!(teacher||student||manager),teacher:!!teacher,manager:!!manager};
}

// This guard is opt-in for the internet-facing copy. The original local defect baseline remains reproducible.
export const hostedAccess: RequestHandler = (req: APIRequest, res, next) => {
  if (["/auth/login","/auth/refresh","/auth/logout","/health","/catalog"].includes(req.path) || (req.method==="GET" && req.path.startsWith("/content/"))) return next();
  if (req.path === "/users/register" && req.method==="POST") {
    const parsed=z.object({first_name:z.string().trim().min(1).max(255),parent_name:z.string().trim().min(1).max(255),grandparent_name:z.string().max(255).optional(),family_name:z.string().max(255).optional(),email:z.email().max(255).transform(v=>v.toLowerCase()),password:z.string().min(8).max(128),role:z.enum(["student","professor/ta"]),year:z.enum(["1","2","3","4","5"]).optional(),code:z.string().min(1).max(255).optional()}).safeParse(req.body);
    if(!parsed.success)return res.status(400).json({message:"Enter valid account details and a password of at least eight characters."});
    req.body=parsed.data;
    return next();
  }
  verifyAuth(req,res,async () => {
    try {
      if (!req.user) return res.status(401).json({message:"Sign in first."});
      const userId=req.user.userId, admin=req.user.role==="system_admin";
      const deny=()=>res.status(403).json({message:"You do not have permission for this record."});
      if(req.path.startsWith("/stats/")&&req.path!=="/stats/record-session-duration"&&!admin)return deny();
      const writable=(access:{teacher:boolean,manager:boolean})=>access.teacher||access.manager||req.user?.role==="class_representative";
      const requireCourse=async(code:string,write=false)=>{
        const access=await courseAccess(userId,code,admin);
        return access.member&&(!write||writable(access));
      };
      const body=req.body as Record<string,unknown>;
      // Uploaded files must belong to the person attaching them.
      const fileIds=[...(Array.isArray(body?.file_ids)?body.file_ids:[]),...(Array.isArray(body?.files_ids)?body.files_ids:[]),...(Array.isArray(body?.attached_files_ids)?body.attached_files_ids:[]),...(typeof body?.file_id==="string"?[body.file_id]:[])];
      for(const id of fileIds){const file=await db.query.hostedUpload.findFirst({where:eq(hostedUpload.fileId,id)});if(!file||(!admin&&file.ownerId!==userId))return deny();}
      if(req.path.startsWith("/materials")) {
        let code=typeof body?.course_code==="string"?body.course_code:undefined;
        const listing=req.path.match(/^\/materials\/course\/([^/]+)$/);
        if(listing)code=decodeURIComponent(listing[1]);
        else if(req.path!=="/materials"&&req.path!=="/materials/"){const material=await db.query.MaterialTable.findFirst({where:eq(MaterialTable.id,req.path.split("/")[2])});code=material?.course_code;}
        if(!code||!await requireCourse(code,!["GET","HEAD"].includes(req.method)))return deny();
      }
      if(/^\/events\/[^/]+/.test(req.path)&&req.method!=="GET"){
        const item=await db.query.event.findFirst({where:eq(event.id,req.path.split("/")[2])});
        if(!item||!await requireCourse(item.course_id,true))return deny();
      }
      const notice=req.path.match(/^\/announcements\/([^/]+)$/),poll=req.path.match(/^\/poll_items\/([^/]+)\/votes$/);
      if(notice||poll){
        let id=notice?.[1];
        if(poll){const option=await db.query.pollItem.findFirst({where:eq(pollItem.id,poll[1])});id=option?.announcement_id||undefined;}
        if(!id)return deny();
        const [course,year,item]=await Promise.all([db.query.coursesAnnouncements.findFirst({where:eq(coursesAnnouncements.announcement_id,id)}),db.query.classesAnnouncements.findFirst({where:eq(classesAnnouncements.announcement_id,id)}),db.query.announcement.findFirst({where:eq(announcement.id,id)})]);
        if(!admin&&!(course&&await requireCourse(course.course_id,!!notice))&&!(year&&year.class===req.user.year&&(!notice||item?.announcer_id===userId)))return deny();
      }
      const deletion=req.path.match(/^\/files\/([^/]+)$/);
      if(deletion&&req.method==="DELETE"){
        const file=await db.query.hostedUpload.findFirst({where:eq(hostedUpload.fileId,deletion[1])});
        if(!file||(!admin&&file.ownerId!==userId))return deny();
      }
      const courseMatch=req.path.match(/^\/courses\/([^/]+)(?:\/|$)/);
      if (courseMatch && courseMatch[1]!=="course-head") {
        const code=decodeURIComponent(courseMatch[1]);
        const access=await courseAccess(userId,code,admin);
        const enrolling=req.method==="POST" && /\/enrollments$/.test(req.path);
        if(enrolling&&await db.query.blacklist.findFirst({where:and(eq(blacklist.courseCode,code),eq(blacklist.userId,userId))}))return deny();
        const joining=req.method==="POST" && /\/instructors\/me$/.test(req.path) && req.user.role==="professor/ta";
        if (!access.member && !enrolling && !joining) return deny();
        const assignmentMatch=req.path.match(/\/assignments\/([^/]+)/);
        if(assignmentMatch){const item=await db.query.assignment.findFirst({where:eq(assignment.id,assignmentMatch[1])});if(!item||item.course_id!==code)return deny();}
        const submissionsMatch=req.path.match(/\/assignments\/([^/]+)\/submissions(?:\/([^/]+))?/);
        if (submissionsMatch) {
          const item=await db.query.assignment.findFirst({where:eq(assignment.id,submissionsMatch[1])});
          if (!item || item.course_id!==code) return deny();
          const id=submissionsMatch[2];
          if (id) {
            const record=await db.query.submission.findFirst({where:eq(submission.id,id)});
            if (!record || record.assignment_id!==item.id) return deny();
            if (!access.teacher && record.student_id!==userId) return deny();
            if (!access.teacher && req.method==="PATCH" &&
                ("grade" in (req.body||{}) || "feedback" in (req.body||{}))) return deny();
          } else if (req.method==="GET" && !access.teacher && req.query.userId!==userId) return deny();
        } else if (!["GET","HEAD"].includes(req.method) && !enrolling &&
                   !joining && !writable(access)) return deny();
      }
      const chat=req.path.match(/^\/groups\/([^/]+)\/messages(?:\/([^/]+))?/);
      const groupInfo=req.path.match(/^\/groups\/([^/]+)$/);
      if(groupInfo){const course=await db.query.CoursesTable.findFirst({where:eq(CoursesTable.group_id,groupInfo[1])});if(!course||!(await courseAccess(userId,course.code,admin)).member)return deny();}
      if (chat) {
        const course=await db.query.CoursesTable.findFirst({where:eq(CoursesTable.group_id,chat[1])});
        if (!course || !(await courseAccess(userId,course.code,admin)).member) return deny();
        if (req.method==="POST") req.body={...req.body,sender_id:userId};
        if (chat[2] && ["PATCH","DELETE"].includes(req.method)) {
          const record=await db.query.message.findFirst({where:eq(message.id,chat[2])});
          if (!record || record.group_id!==chat[1] || (!admin && record.sender_id!==userId)) return deny();
        }
      }
      next();
    } catch { res.status(400).json({message:"Invalid record request."}); }
  });
};
