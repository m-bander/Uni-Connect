import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../src/drizzle";
import { seedBase } from "../database/seed-base";
import { seedCampus } from "./seed-campus";
import { retireStarterAccounts } from "../database/application-accounts";

export async function initializeDatabase() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");
  const pool = new Pool({connectionString:process.env.DATABASE_URL,max:1});
  const client=await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock(710276)");
    const result=await client.query("SELECT to_regclass('public.users') AS existing");
    if (!result.rows[0].existing) {
      const folder=path.resolve(__dirname,"../database/schema");
      for(const file of fs.readdirSync(folder).filter(f=>f.endsWith(".sql")).sort()) {
        await client.query(fs.readFileSync(path.join(folder,file),"utf8"));
      }
    }
    await client.query(fs.readFileSync(path.join(__dirname,"001_procedures.sql"),"utf8"));
    await client.query(fs.readFileSync(path.join(__dirname,"002_full_app.sql"),"utf8"));
    const count=await client.query("SELECT count(*)::integer AS count FROM users");
    if(count.rows[0].count===0) {
      await seedBase(drizzle(client,{schema}), process.env.DEMO_PASSWORD || "UniConnect123!");
      console.log("Hosted sample accounts and course initialized.");
    } else console.log("Existing users preserved; no sample records overwritten.");
    const migration=await client.query("SELECT name FROM app_migration WHERE name='campus-content-v1'");
    if(!migration.rowCount) {
      await seedCampus(drizzle(client,{schema}));
      await client.query("INSERT INTO app_migration(name) VALUES('campus-content-v1')");
    }
    await retireStarterAccounts(drizzle(client,{schema}));
    await client.query("COMMIT");
  }catch(error){await client.query("ROLLBACK");throw error}
  finally{client.release();await pool.end()}
}
if(require.main===module)initializeDatabase().catch(error=>{console.error("Database initialization failed:",error.message);process.exitCode=1});
