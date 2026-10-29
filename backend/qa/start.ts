import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
process.env.UNICONNECT_LOCAL_QA = "1";
if(process.env.UNICONNECT_LEGACY_BASELINE!=="1")process.env.UNICONNECT_PUBLIC_HOST="1";
process.env.CLIENT_URL ||= "http://localhost:5173";
process.env.ACCESS_TOKEN_SECRET = crypto.randomBytes(48).toString("hex");
process.env.REFRESH_TOKEN_SECRET = crypto.randomBytes(48).toString("hex");
process.env.PORT = "3000";
async function main() {
  const { engine, localDb: db } = await import("./database");
  const s = await import("../src/drizzle");
  const bcrypt = await import("bcrypt");
  const migrations = path.join(__dirname, "schema");
  for (const file of fs.readdirSync(migrations).filter(f => f.endsWith(".sql")).sort()) {
    await engine.exec(fs.readFileSync(path.join(migrations, file), "utf8"));
  }
  await engine.exec(fs.readFileSync(path.resolve(__dirname,"../deploy/002_full_app.sql"),"utf8"));
  if(process.env.UNICONNECT_PUBLIC_HOST === "1") {
    await engine.exec(fs.readFileSync(path.resolve(__dirname,"../deploy/001_procedures.sql"),"utf8"));
  }
  const {seedFixture}=await import("./seed-fixture");
  const fixture=await seedFixture(db,"UniConnect123!");
  if(process.env.UNICONNECT_CAMPUS==="1") {
    const {seedCampus}=await import("../deploy/seed-campus");
    await seedCampus(db);
  }
  fs.mkdirSync(path.join(__dirname,"artifacts"),{recursive:true});
  fs.writeFileSync(path.join(__dirname,"artifacts","fixtures.json"),JSON.stringify(fixture,null,2));
  await import("../src/index");
  console.log("QA fixture ready. Password for all accounts: UniConnect123!");
}
main().catch(err=>{console.error(err);process.exit(1);});
