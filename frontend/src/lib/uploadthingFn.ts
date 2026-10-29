import { genUploader } from "uploadthing/client";
import type { OurFileRouter } from "./uploadthing";
import type { UploadFile } from "@/types/general/files";
import api from "./axios";
const original=genUploader<OurFileRouter>({url:import.meta.env.VITE_SERVER_URL});
export type CampusUpload={name:string;key:string;ufsUrl:string;serverData:{success:boolean;image_url?:string;file_data?:UploadFile}};
export async function uploadFiles(endpoint:"imageUploader"|"materialUploader"|"assignmentUploader",options:{files:File[]}):Promise<CampusUpload[]> {
  if(import.meta.env.VITE_HOSTED!=="1")return (await original.uploadFiles(endpoint,options)).map(file=>({...file,serverData:{success:file.serverData.success,image_url:"image_url" in file.serverData?file.serverData.image_url:undefined,file_data:"file_data" in file.serverData&&file.serverData.file_data?{...file.serverData.file_data,url:file.ufsUrl}:undefined}}));
  const result:CampusUpload[]=[];
  for(const file of options.files){
    if(file.size>1048576)throw new Error("Please choose a file up to 1 MB.");
    if(!["application/pdf","image/png","image/jpeg","image/webp"].includes(file.type)||endpoint==="imageUploader"&&!file.type.startsWith("image/"))throw new Error("Choose a PDF or a PNG, JPEG, or WebP image.");
    const content=await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(",")[1]);reader.onerror=()=>reject(new Error("Could not read this file."));reader.readAsDataURL(file)});
    const response=await api.post<CampusUpload>("/api/uploads",{name:file.name,type:file.type,content});
    result.push(response.data);
  }
  return result;
}
