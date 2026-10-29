import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./index";
import "dotenv/config";

// Opt in only through the isolated local QA launcher.
export const db: ReturnType<typeof drizzle<typeof schema>> =
  process.env.UNICONNECT_LOCAL_QA === "1"
    ? require("../../qa/database").localDb
    : process.env.UNICONNECT_LOCAL_APP === "1"
      ? require("../../app/database").localDb
      : drizzle(process.env.DATABASE_URL!, { schema });
