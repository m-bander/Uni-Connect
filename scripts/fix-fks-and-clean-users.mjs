import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { Pool } = require(path.join(root, "backend/node_modules/pg"));

const encPass = encodeURIComponent("MohamedS2909#@");
const url = `postgresql://postgres.bvqokwahcqphpbdwibwb:${encPass}@aws-1-eu-west-3.pooler.supabase.com:6543/postgres`;

async function run() {
  const pool = new Pool({ connectionString: url });
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Update foreign key on material table to ON DELETE CASCADE
    console.log("Updating foreign key constraint on material(uploader_id) to ON DELETE CASCADE...");
    await client.query(`
      ALTER TABLE "material" DROP CONSTRAINT IF EXISTS "material_uploader_id_users_id_fk";
      ALTER TABLE "material" ADD CONSTRAINT "material_uploader_id_users_id_fk"
        FOREIGN KEY ("uploader_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `);
    console.log("✓ material constraint updated to ON DELETE CASCADE");

    // 2. Make hamadabusiness199@gmail.com an approved system_admin
    console.log("Promoting hamadabusiness199@gmail.com to system_admin...");
    const adminUpdate = await client.query(`
      UPDATE users 
      SET role = 'system_admin', "isApproved" = true 
      WHERE email = 'hamadabusiness199@gmail.com';
    `);
    console.log(`✓ Updated hamadabusiness199@gmail.com to system_admin (${adminUpdate.rowCount} rows)`);

    // 3. Delete all dummy/sample accounts
    console.log("Deleting fake/sample users...");
    const deleteRes = await client.query(`
      DELETE FROM users 
      WHERE email LIKE '%@uniconnect.test' 
        AND email != 'admin@uniconnect.test';
    `);
    console.log(`✓ Deleted ${deleteRes.rowCount} dummy users successfully!`);

    await client.query("COMMIT");

    // 4. List remaining users
    const remaining = await client.query("SELECT id, email, first_name, role, \"isApproved\" FROM users;");
    console.log("\nRemaining real users in database:");
    remaining.rows.forEach(u => {
      console.log(`- ${u.email} (${u.first_name}) | Role: ${u.role} | Approved: ${u.isApproved}`);
    });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error:", error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

run();
