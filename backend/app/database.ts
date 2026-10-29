import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import * as schema from "../src/drizzle";
export const engine = new PGlite(path.join(process.env.APP_DATA_DIR!,"postgres"));
export const localDb = drizzle(engine,{schema});
