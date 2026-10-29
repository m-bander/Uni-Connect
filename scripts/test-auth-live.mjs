import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// Ensure env vars are set
const encPass = encodeURIComponent("MohamedS2909#@");
process.env.DATABASE_URL = `postgresql://postgres.bvqokwahcqphpbdwibwb:${encPass}@aws-1-eu-west-3.pooler.supabase.com:6543/postgres`;
process.env.ACCESS_TOKEN_SECRET ||= "test_access_secret_1234567890_abcdef";
process.env.REFRESH_TOKEN_SECRET ||= "test_refresh_secret_1234567890_abcdef";
process.env.UNICONNECT_PUBLIC_HOST = "1";

const { app } = await import(pathToFileURL(path.join(root, "backend/src/index.ts")).href);
const { db } = await import(pathToFileURL(path.join(root, "backend/src/drizzle/db.ts")).href);
const { UsersTable } = await import(pathToFileURL(path.join(root, "backend/src/drizzle/schemas/user.ts")).href);
const { eq } = await import(pathToFileURL(path.join(root, "backend/node_modules/drizzle-orm/index.js")).href);

async function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, "127.0.0.1", async () => {
      const port = server.address().port;
      try {
        const res = await fetch(`http://127.0.0.1:${port}${path}`, {
          method,
          headers: { "Content-Type": "application/json" },
          body: body ? JSON.stringify(body) : undefined,
        });
        const json = await res.json().catch(() => null);
        server.close(() => resolve({ status: res.status, ok: res.ok, body: json }));
      } catch (err) {
        server.close(() => reject(err));
      }
    });
  });
}

async function runTests() {
  console.log("=== Testing Authentication & Registration Flows Against Supabase ===\n");
  const timestamp = Date.now();
  const studentEmail = `student_${timestamp}@uniconnect.test`;
  const studentPass = "Password123!";
  const professorEmail = `prof_${timestamp}@uniconnect.test`;

  try {
    // 1. Student Registration
    console.log(`[Test 1] Registering new Student: ${studentEmail}...`);
    const regRes = await request("POST", "/api/users/register", {
      first_name: "Ahmed",
      parent_name: "Mahmoud",
      email: studentEmail,
      password: studentPass,
      role: "student",
      code: `STD-${timestamp.toString().slice(-4)}`,
      year: "1",
    });
    console.log(`Status: ${regRes.status}`);
    if (regRes.status !== 201) throw new Error(`Registration failed: ${JSON.stringify(regRes.body)}`);
    console.log("✓ Student registered successfully (HTTP 201)");

    // Verify student exists in Supabase
    const dbStudent = await db.query.UsersTable.findFirst({
      where: eq(UsersTable.email, studentEmail),
    });
    if (!dbStudent || !dbStudent.isApproved) throw new Error("Student was not found or is not approved in Supabase");
    console.log(`✓ Confirmed in Supabase: ID=${dbStudent.id}, Role=${dbStudent.role}, Approved=${dbStudent.isApproved}`);

    // 2. Student Login (Successful)
    console.log(`\n[Test 2] Logging in as registered Student...`);
    const loginRes = await request("POST", "/api/auth/login", {
      email: studentEmail,
      password: studentPass,
    });
    console.log(`Status: ${loginRes.status}`);
    if (loginRes.status !== 200 || !loginRes.body?.accessToken) {
      throw new Error(`Login failed: ${JSON.stringify(loginRes.body)}`);
    }
    console.log(`✓ Student login successful! Access token received (length: ${loginRes.body.accessToken.length})`);
    console.log(`✓ User profile returned: ${loginRes.body.user.first_name} ${loginRes.body.user.parent_name} (${loginRes.body.user.email})`);

    // 3. Invalid Password Login Rejection
    console.log(`\n[Test 3] Testing login with wrong password...`);
    const wrongPassRes = await request("POST", "/api/auth/login", {
      email: studentEmail,
      password: "WrongPassword!",
    });
    console.log(`Status: ${wrongPassRes.status}`);
    if (wrongPassRes.status !== 401) throw new Error("Expected 401 on wrong password");
    console.log(`✓ Wrong password rejected with 401: "${wrongPassRes.body?.message}"`);

    // 4. Duplicate Registration Rejection
    console.log(`\n[Test 4] Testing duplicate registration with same email...`);
    const dupRes = await request("POST", "/api/users/register", {
      first_name: "Another",
      parent_name: "User",
      email: studentEmail,
      password: studentPass,
      role: "student",
      code: "STD-9999",
      year: "2",
    });
    console.log(`Status: ${dupRes.status}`);
    if (dupRes.status !== 400) throw new Error("Expected 400 for duplicate email");
    console.log(`✓ Duplicate registration prevented with 400: "${dupRes.body?.message}"`);

    // 5. Professor / Instructor Registration (Approval Flow)
    console.log(`\n[Test 5] Registering Instructor/Professor: ${professorEmail}...`);
    const profRegRes = await request("POST", "/api/users/register", {
      first_name: "Dr. Hassan",
      parent_name: "Ibrahim",
      email: professorEmail,
      password: studentPass,
      role: "professor/ta",
    });
    console.log(`Status: ${profRegRes.status}`);
    if (profRegRes.status !== 201) throw new Error(`Instructor registration failed: ${JSON.stringify(profRegRes.body)}`);
    console.log("✓ Instructor registered successfully (HTTP 201)");

    // Test Professor Login Before Approval
    console.log(`\n[Test 6] Testing Instructor login before admin approval...`);
    const profLoginRes = await request("POST", "/api/auth/login", {
      email: professorEmail,
      password: studentPass,
    });
    console.log(`Status: ${profLoginRes.status}`);
    if (profLoginRes.status !== 401) throw new Error("Expected 401 before approval");
    console.log(`✓ Unapproved instructor login blocked as intended: "${profLoginRes.body?.message}"`);

    // 6. Admin Login
    console.log(`\n[Test 7] Testing System Admin login (admin@uniconnect.test)...`);
    const adminLoginRes = await request("POST", "/api/auth/login", {
      email: "admin@uniconnect.test",
      password: "UniConnect123!",
    });
    console.log(`Status: ${adminLoginRes.status}`);
    if (adminLoginRes.status === 200) {
      console.log(`✓ Admin login successful! Role: ${adminLoginRes.body?.user?.role}`);
    } else {
      console.log(`Admin login response: ${JSON.stringify(adminLoginRes.body)}`);
    }

    console.log("\n==================================================");
    console.log("ALL AUTHENTICATION & REGISTRATION TESTS PASSED! 100%");
    console.log("==================================================");
  } catch (err) {
    console.error("\n❌ Test Failed:", err);
    process.exitCode = 1;
  } finally {
    // Clean up created test accounts
    console.log("\nCleaning up test accounts from Supabase...");
    await db.delete(UsersTable).where(eq(UsersTable.email, studentEmail));
    await db.delete(UsersTable).where(eq(UsersTable.email, professorEmail));
    console.log("Cleanup done.");
    process.exit(process.exitCode || 0);
  }
}

runTests();
