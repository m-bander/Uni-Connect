import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./index";
import "dotenv/config";
import { Pool } from "pg";
import { reportServerError } from "../utils/reportServerError";

// Explicit pool bounds avoid unlimited waits and excessive serverless connections.
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 3,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 10000,
  statement_timeout: 15000,
  allowExitOnIdle: true,
});
pool.on("error", error => reportServerError("database.pool", error));

// Opt in only through the isolated local QA launcher.
export const db: ReturnType<typeof drizzle<typeof schema>> =
  process.env.UNICONNECT_LOCAL_QA === "1"
    ? require("../../qa/database").localDb
    : process.env.UNICONNECT_LOCAL_APP === "1"
      ? require("../../app/database").localDb
      : drizzle(pool, { schema });
