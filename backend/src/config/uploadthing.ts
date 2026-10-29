import { createUploadthing, type FileRouter } from "uploadthing/express";
import { UTApi } from "uploadthing/server";
import { db } from "../drizzle/db";
import { FileTable, hostedUpload } from "../drizzle";
import { inArray } from "drizzle-orm";
import { formatFileSize } from "../utils/fileSize";

const externalUploadApi = new UTApi({
  token: process.env.UPLOADTHING_TOKEN,
});
export const uploadThingApi = {
  async deleteFiles(keys: string[]) {
    const local=keys.filter(k=>k?.startsWith("db:")).map(k=>k.slice(3));
    const external=keys.filter(k=>k&&!k.startsWith("db:"));
    if(local.length)await db.delete(hostedUpload).where(inArray(hostedUpload.fileId,local));
    const result=external.length?await externalUploadApi.deleteFiles(external):{deletedCount:0,success:true};
    return {...result,deletedCount:result.deletedCount+local.length};
  }
};
export function imageStorageKey(url:string){
  const local=url.match(/\/api\/content\/([0-9a-f-]+)\//);
  return local?`db:${local[1]}`:url.split("/f/")[1];
}

const f = createUploadthing();

export const uploadRouter = {
  materialUploader: f({
    pdf: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
    video: {
      maxFileSize: "256MB",
      maxFileCount: 1,
    },
  }).onUploadComplete(async (data) => {
    try {
      const [file] = await db
        .insert(FileTable)
        .values({
          key: data.file.key,
          size: formatFileSize(data.file.size),
          name: data.file.name,
          type: data.file.type,
          url: data.file.ufsUrl,
        })
        .returning();

      return {
        success: true,
        file_data: {
          name: file.name,
          size: file.size,
          key: file.key,
          id: file.id,
        },
      };
    } catch (err) {
      console.log(err);
      return { success: false };
    }
  }),
  assignmentUploader: f({
    pdf: {
      maxFileSize: "4MB",
      maxFileCount: 5,
    },
    video: {
      maxFileSize: "256MB",
      maxFileCount: 1,
    },
  }).onUploadComplete(async (data) => {
    try {
      const [file] = await db
        .insert(FileTable)
        .values({
          key: data.file.key,
          size: formatFileSize(data.file.size),
          name: data.file.name,
          type: data.file.type,
          url: data.file.ufsUrl,
        })
        .returning();

      return {
        success: true,
        file_data: {
          name: file.name,
          size: file.size,
          key: file.key,
          id: file.id,
          url: file.url,
        },
      };
    } catch (err) {
      console.log(err);
      return { success: false };
    }
  }),
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  }).onUploadComplete((data) => {
    try {
      return {
        success: true,
        image_url: data.file.ufsUrl,
      };
    } catch (err) {
      console.log(err);
      return { success: false };
    }
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
