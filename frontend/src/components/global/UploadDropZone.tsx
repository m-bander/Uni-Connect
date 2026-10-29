import type { OurFileRouter } from "@/lib/uploadthing";
import { generateUploadDropzone } from "@uploadthing/react";
import { CampusUploader } from "./CampusUploader";

const OriginalUploadDropZone = generateUploadDropzone<OurFileRouter>({
  url: import.meta.env.VITE_SERVER_URL,
});
export const UploadDropZone = import.meta.env.VITE_HOSTED==="1" ? CampusUploader : OriginalUploadDropZone;
