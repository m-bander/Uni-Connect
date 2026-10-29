import { defineConfig } from "drizzle-kit";
export default defineConfig({schema:"./src/drizzle/index.ts",out:"./qa/schema",dialect:"postgresql"});
