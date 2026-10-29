import { generateUploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/lib/uploadthing";
import { CampusUploader } from "./CampusUploader";

// import "@uploadthing/react/styles.css";

const OriginalUploadButton = generateUploadButton<OurFileRouter>({
  url: import.meta.env.VITE_SERVER_URL,
});
export const UploadButton = import.meta.env.VITE_HOSTED==="1" ? CampusUploader : OriginalUploadButton;
