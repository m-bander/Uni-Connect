import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import * as schema from "../src/drizzle";
export const engine = new PGlite();
export const localDb = drizzle(engine, { schema });
