import {spawnSync} from "node:child_process";
import path from "node:path";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
for(const [folder,args] of [
 ["backend",["node_modules/typescript/bin/tsc"]],
 ["frontend",["node_modules/typescript/bin/tsc","-b"]],
 ["frontend",["node_modules/vite/bin/vite.js","build"]]
]) {
 const result=spawnSync(process.execPath,args,{cwd:path.join(root,folder),stdio:"inherit",
 env:{...process.env,VITE_SERVER_URL:"",VITE_HOSTED:"1"}});
 if(result.status!==0)process.exit(result.status||1);
}

if(process.env.DATABASE_URL) {
 const init=spawnSync(process.execPath,["--import","tsx","deploy/initialize.ts"],{cwd:path.join(root,"backend"),stdio:"inherit",env:process.env});
 if(init.status!==0) process.exit(init.status||1);
}
