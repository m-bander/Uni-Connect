import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

async function main(){
  process.env.CLIENT_URL ||= "http://127.0.0.1:5173";
  process.env.UNICONNECT_PUBLIC_HOST="1";
  process.env.PORT ||= "3000";
  const folder=path.resolve(process.env.APP_DATA_DIR||path.join(__dirname,"../../.data"));
  fs.mkdirSync(folder,{recursive:true});
  const settings=path.join(folder,"session-secrets.json");
  if(!fs.existsSync(settings))fs.writeFileSync(settings,JSON.stringify({access:crypto.randomBytes(48).toString("hex"),refresh:crypto.randomBytes(48).toString("hex")}),{mode:0o600,flag:"wx"});
  const secrets=JSON.parse(fs.readFileSync(settings,"utf8"));
  process.env.ACCESS_TOKEN_SECRET ||= secrets.access;
  process.env.REFRESH_TOKEN_SECRET ||= secrets.refresh;
  if(process.env.DATABASE_URL){
    const {initializeDatabase}=await import("../deploy/initialize");
    await initializeDatabase();
  } else {
    process.env.UNICONNECT_LOCAL_APP="1";
    process.env.APP_DATA_DIR=folder;
    const {engine,localDb}=await import("./database");
    const existing=await engine.query<{existing:string|null}>("SELECT to_regclass('public.users') AS existing");
    if(!existing.rows[0].existing){
      const schema=path.join(__dirname,"../database/schema");
      for(const file of fs.readdirSync(schema).filter(f=>f.endsWith(".sql")).sort())await engine.exec(fs.readFileSync(path.join(schema,file),"utf8"));
    }
    for(const file of ["001_procedures.sql","002_full_app.sql"])await engine.exec(fs.readFileSync(path.join(__dirname,"../deploy",file),"utf8"));
    const {seedBase}=await import("../database/seed-base");
    const count=await engine.query<{count:number}>("SELECT count(*)::integer AS count FROM users");
    if(count.rows[0].count===0)await seedBase(localDb,"UniConnect123!");
    const migration=await engine.query("SELECT name FROM app_migration WHERE name='campus-content-v1'");
    if(!migration.rows.length){
      const {seedCampus}=await import("../deploy/seed-campus");
      await localDb.transaction(async tx=>{
        const {sql}=await import("drizzle-orm");
        await seedCampus(tx);
        await tx.execute(sql`INSERT INTO app_migration(name) VALUES('campus-content-v1')`);
      });
    }
    const {retireStarterAccounts}=await import("../database/application-accounts");
    await retireStarterAccounts(localDb);
    console.log("UniConnect database ready. Local data is preserved in .data.");
  }
  await import("../src/index");
}
main().catch(error=>{console.error("UniConnect startup failed:",error.message);process.exit(1)});
