import { createUploadthing, type FileRouter } from "uploadthing/express";

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
  }).onUploadComplete(async () => {
    try {
      return {
        success: true,
        file_data: {
          name: "",
          size: "",
          key: "",
          id: "",
        },
      };
    } catch {
      return { success: false };
    }
  }),
  submissionUploader: f({
    pdf: {
      maxFileSize: "4MB",
      maxFileCount: 5,
    },
    video: {
      maxFileSize: "256MB",
      maxFileCount: 1,
    },
  }).onUploadComplete(async () => {
    try {
      return {
        success: true,
        file_data: {
          name: "",
          size: "",
          key: "",
          id: "",
        },
      };
    } catch {
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
  }).onUploadComplete(async () => {
    try {
      return {
        success: true,
        file_data: {
          name: "",
          size: "",
          key: "",
          id: "",
          url: "",
        },
      };
    } catch {
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
