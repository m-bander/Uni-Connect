import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { Pool } = require(path.join(root, "backend/node_modules/pg"));

const encPass = encodeURIComponent("MohamedS2909#@");
const url = `postgresql://postgres.bvqokwahcqphpbdwibwb:${encPass}@aws-1-eu-west-3.pooler.supabase.com:6543/postgres`;

async function secureDatabase() {
  const pool = new Pool({ connectionString: url });
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Get all tables in public schema
    const res = await client.query(
      "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename"
    );
    const tables = res.rows.map((r) => r.tablename);
    console.log(`Found ${tables.length} tables to secure.`);

    // 2. Enable RLS on each table
    for (const t of tables) {
      await client.query(`ALTER TABLE "public"."${t}" ENABLE ROW LEVEL SECURITY;`);
      console.log(`✓ RLS enabled on table: ${t}`);
    }

    // 3. Revoke direct anon and authenticated PostgREST access
    console.log("Revoking direct API access from anon and authenticated roles...");
    await client.query("REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;");
    await client.query("REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated;");
    await client.query("REVOKE ALL ON ALL ROUTINES IN SCHEMA public FROM anon, authenticated;");

    // 4. Grant full access to postgres and service_role
    console.log("Granting full access to postgres and service_role...");
    await client.query("GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;");
    await client.query("GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role;");
    await client.query("GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, service_role;");

    await client.query("COMMIT");
    console.log("\nDATABASE FULLY SECURED! All tables now have RLS enabled and direct public API access is blocked.");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Failed to secure database:", error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

secureDatabase();
