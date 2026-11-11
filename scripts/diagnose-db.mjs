// Operator-only, read-only database diagnosis. Supply DATABASE_URL privately via the environment.
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { Pool } = require(path.join(root, "backend/node_modules/pg"));
if (!process.env.DATABASE_URL?.trim()) {
  console.error("DATABASE_URL is required. Supply it privately; do not paste it into reports.");
  process.exitCode = 1;
} else {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 1, connectionTimeoutMillis: 10000, statement_timeout: 10000 });
  let client;
  let stage = "connect";
  try {
    client = await pool.connect();
    await client.query("BEGIN READ ONLY");
    stage = "auth-schema-and-select-permissions";
    await client.query('SELECT id, email, password, "isApproved", role, year FROM public.users LIMIT 0');
    await client.query('SELECT "userId", token FROM public."refreshTokens" LIMIT 0');
    stage = "role-and-rls-metadata";
    const role = await client.query("SELECT rolsuper OR rolbypassrls AS bypasses_rls FROM pg_roles WHERE rolname = current_user");
    const tables = await client.query(`SELECT c.relname AS table_name, c.relrowsecurity AS rls_enabled,
      c.relforcerowsecurity AS rls_forced, pg_get_userbyid(c.relowner) = current_user AS owns_table,
      has_table_privilege(c.oid, 'SELECT') AS can_select,
      has_table_privilege(c.oid, 'INSERT') AS can_insert,
      has_table_privilege(c.oid, 'DELETE') AS can_delete
      FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public' AND c.relname IN ('users', 'refreshTokens')`);
    console.log(JSON.stringify({ status: "auth-schema-readable", bypasses_rls: role.rows[0]?.bypasses_rls, tables: tables.rows,
      note: "Review policies if RLS applies. This does not test writes or prove the Vercel runtime has identical configuration." }, null, 2));
    await client.query("ROLLBACK");
  } catch (error) {
    const code = typeof error.code === "string" && /^[A-Z0-9_]{2,40}$/.test(error.code) ? error.code : "UNCLASSIFIED";
    console.error(JSON.stringify({ status: "failed", stage, code }));
    process.exitCode = 1;
  } finally {
    if (client) {
      await client.query("ROLLBACK").catch(() => {});
      client.release();
    }
    await pool.end();
  }
}
