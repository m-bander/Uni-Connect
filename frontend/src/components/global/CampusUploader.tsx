import { useState } from "react";
import { uploadFiles, type CampusUpload } from "@/lib/uploadthingFn";
type Props={endpoint:"materialUploader"|"assignmentUploader";onClientUploadComplete?:(files:CampusUpload[])=>unknown;onUploadError?:(error:Error)=>unknown;onUploadBegin?:()=>unknown;config?:unknown;uploadProgressGranularity?:string};
export function CampusUploader({endpoint,onClientUploadComplete,onUploadError,onUploadBegin}:Props){
  const [busy,setBusy]=useState(false),[error,setError]=useState("");
  return <div className="rounded-lg border border-dashed p-4 space-y-2">
    <label className="block text-sm font-medium" htmlFor={`upload-${endpoint}`}>Attach files</label>
    <input id={`upload-${endpoint}`} type="file" accept="application/pdf,image/png,image/jpeg,image/webp" multiple={endpoint==="assignmentUploader"} disabled={busy} className="block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:p-2 file:text-primary-foreground" onChange={async e=>{
      const input=e.currentTarget,files=Array.from(input.files||[]);if(!files.length)return;
      setBusy(true);setError("");
      try{onUploadBegin?.();const uploaded=await uploadFiles(endpoint,{files});await onClientUploadComplete?.(uploaded)}
      catch(err){const problem=err instanceof Error?err:new Error("Upload failed.");setError(problem.message);onUploadError?.(problem)}
      finally{setBusy(false);input.value=""}
    }}/>
    <p className="text-xs text-muted-foreground" role="status">{busy?"Uploading…":"PDF, PNG, JPEG, or WebP · Up to 1 MB per file"}</p>
    {error&&<p role="alert" className="text-sm text-destructive">{error}</p>}
  </div>;
}
