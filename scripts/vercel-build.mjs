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

// Database changes are a separate, operator-approved release step. Preview builds must never mutate production.
