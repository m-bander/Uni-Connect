import { Router } from "express";
import { eq, sql } from "drizzle-orm";
import { randomUUID, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { db } from "../drizzle/db";
import { CoursesTable, FileTable, hostedUpload, enrolledIn, Teaches, UsersTable } from "../drizzle";
import { APIRequest } from "../types/api";
import { catalogCourses, departments } from "../data/catalog";
import { verifyAuth } from "../middleware/verifyAuth";

export const campusRouter=Router();
campusRouter.get("/catalog",async (_req,res,next)=>{
  try {
    const courses=await db.select({code:CoursesTable.code,name:CoursesTable.name,year:CoursesTable.year,department:CoursesTable.department,description:CoursesTable.description,image_url:CoursesTable.image_url,students:db.$count(enrolledIn,eq(enrolledIn.courseCode,CoursesTable.code))}).from(CoursesTable).orderBy(CoursesTable.code);
    const teachers=await db.select({courseCode:Teaches.courseCode,name:sql<string>`${UsersTable.first_name} || ' ' || ${UsersTable.parent_name}`}).from(Teaches).innerJoin(UsersTable,eq(UsersTable.id,Teaches.userId));
    res.json({departments:departments.map(d=>d.name),courses:courses.map(c=>{
      const meta=catalogCourses.find(x=>x.code===c.code);
      return {...c,department:c.department,description:c.description||meta?.description||"Explore course resources, assignments, and discussions.",color:meta?.color||"#2563eb",teachers:teachers.filter(t=>t.courseCode===c.code).map(t=>t.name)};
    })});
  }catch(error){next(error)}
});

// Download links are unguessable capabilities, like the original external file URLs.
// The token is only returned to the uploader or authorized course members.
campusRouter.get("/content/:id/:token",async(req,res,next)=>{
  try {
    const id=z.uuid().safeParse(req.params.id),token=z.uuid().safeParse(req.params.token);
    if(!id.success||!token.success)return res.sendStatus(404);
    const [row]=await db.select().from(hostedUpload).innerJoin(FileTable,eq(FileTable.id,hostedUpload.fileId)).where(eq(hostedUpload.fileId,id.data));
    if(!row||!timingSafeEqual(Buffer.from(row.hosted_upload.token),Buffer.from(token.data)))return res.sendStatus(404);
    const file=row.file;
    res.setHeader("Content-Type",file.type);
    res.setHeader("X-Content-Type-Options","nosniff");
    res.setHeader("Cache-Control","private, max-age=300");
    res.setHeader("Content-Disposition",`${file.type.startsWith("image/")?"inline":"attachment"}; filename*=UTF-8''${encodeURIComponent(file.name)}`);
    res.send(Buffer.from(row.hosted_upload.content,"base64"));
  }catch(error){next(error)}
});

const uploadSchema=z.object({name:z.string().min(1).max(180),type:z.enum(["application/pdf","image/png","image/jpeg","image/webp"]),content:z.string().min(4).max(1400000)});
campusRouter.post("/uploads",verifyAuth,async(req:APIRequest,res,next)=>{
  try {
    if(!req.user)return res.sendStatus(401);
    const parsed=uploadSchema.safeParse(req.body);
    if(!parsed.success)return res.status(400).json({message:"Choose a PDF, PNG, JPEG, or WebP file up to 1 MB."});
    const data=parsed.data,bytes=Buffer.from(data.content,"base64");
    const signature=data.type==="application/pdf"?bytes.subarray(0,5).toString()==="%PDF-":data.type==="image/png"?bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])):data.type==="image/jpeg"?bytes[0]===255&&bytes[1]===216&&bytes[2]===255:bytes.subarray(0,4).toString()==="RIFF"&&bytes.subarray(8,12).toString()==="WEBP";
    if(!signature||bytes.length>1048576||bytes.length===0)return res.status(400).json({message:"Invalid file format or file larger than 1 MB."});
    const userId=req.user.userId;
    const file=await db.transaction(async tx=>{
      await tx.execute(sql`SELECT pg_advisory_xact_lock(710277)`);
      const [usage]=await tx.select({total:sql<number>`coalesce(sum(${hostedUpload.bytes}),0)`,user:sql<number>`coalesce(sum(case when ${hostedUpload.ownerId}=${userId} then ${hostedUpload.bytes} else 0 end),0)`}).from(hostedUpload);
      if(Number(usage.total)+bytes.length>100*1048576||Number(usage.user)+bytes.length>20*1048576)return null;
      const id=randomUUID(),token=randomUUID();
      const [file]=await tx.insert(FileTable).values({id,name:data.name,type:data.type,key:`db:${id}`,size:`${(bytes.length/1024).toFixed(1)} KB`,url:`/api/content/${id}/${token}`}).returning();
      await tx.insert(hostedUpload).values({fileId:id,ownerId:userId,token,bytes:bytes.length,content:bytes.toString("base64")});
      return file;
    });
    if(!file)return res.status(413).json({message:"File storage is full. Remove unused uploads before trying again."});
    res.status(201).json({name:file.name,key:file.key,ufsUrl:file.url,serverData:{success:true,image_url:file.url,file_data:file}});
  }catch(error){next(error)}
});
