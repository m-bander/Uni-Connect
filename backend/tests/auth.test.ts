import { before, after, test } from "node:test";
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import jwt from "jsonwebtoken";
import type { Server } from "node:http";

let server: Server, base: string;
let database: typeof import("../qa/database");
let tables: typeof import("../src/drizzle/schemas/user");
const password = "LocalTestPassword123!";
const account = { first_name: "Local", parent_name: "Test", email: "auth@example.test", password, role: "student", year: "1", code: "LOCAL-1" };
async function call(route: string, body?: unknown, headers: Record<string, string> = {}) {
  return fetch(base + "/api" + route, {
    method: body === undefined ? "GET" : "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}
function cookie(response: Response) { return response.headers.getSetCookie().slice(-1)[0].split(";")[0]; }

before(async () => {
  // Unconditionally isolate tests, even if a caller has production variables in their shell.
  delete process.env.DATABASE_URL;
  process.env.UNICONNECT_LOCAL_QA = "1";
  process.env.UNICONNECT_PUBLIC_HOST = "1";
  process.env.ACCESS_TOKEN_SECRET = randomBytes(48).toString("hex");
  process.env.REFRESH_TOKEN_SECRET = randomBytes(48).toString("hex");
  // Prevent src/index.ts from binding a second listener during import.
  process.env.VERCEL = "1";
  database = await import("../qa/database");
  await database.engine.exec(fs.readFileSync(path.join(__dirname, "../qa/schema/0000_long_stranger.sql"), "utf8"));
  tables = await import("../src/drizzle/schemas/user");
  const { app } = await import("../src/index");
  delete process.env.VERCEL;
  server = app.listen(0, "127.0.0.1");
  await new Promise<void>(resolve => server.once("listening", resolve));
  base = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
});
after(async () => {
  if (server) await new Promise<void>(resolve => server.close(() => resolve()));
  const { getIO } = await import("../src/lib/socket");
  getIO().close();
  await database?.engine.close();
  const { pool } = await import("../src/drizzle/db");
  await pool.end();
});

test("readiness checks the auth schema without needing a login", async () => {
  assert.equal((await call("/health")).status, 200);
  assert.equal((await call("/ready")).status, 200);
});
test("student signup, duplicate prevention, login, protected route, refresh and logout", async () => {
  assert.equal((await call("/users/register", account)).status, 201);
  assert.equal((await call("/users/register", account)).status, 400);
  assert.equal((await call("/auth/login", {})).status, 400);
  assert.equal((await call("/auth/login", { email: account.email, password: "wrong" })).status, 401);
  const response = await call("/auth/login", { email: account.email, password });
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.user.password, undefined);
  assert.equal(data.user.role, "student");
  const firstCookie = cookie(response);
  const profile = await call("/users/me", undefined, { Cookie: firstCookie, Authorization: `Bearer ${data.accessToken}` });
  assert.equal(profile.status, 200);
  const refreshed = await call("/auth/refresh", undefined, { Cookie: firstCookie });
  assert.equal(refreshed.status, 201);
  assert.notEqual(cookie(refreshed), firstCookie);
  assert.equal((await call("/auth/refresh", undefined, { Cookie: firstCookie })).status, 401);
  const secondCookie = cookie(refreshed);
  assert.equal((await call("/auth/logout", undefined, { Cookie: secondCookie })).status, 200);
  assert.equal((await call("/auth/refresh", undefined, { Cookie: secondCookie })).status, 401);
});
test("instructors wait for approval and signup cannot grant admin access", async () => {
  assert.equal((await call("/users/register", { ...account, email: "instructor@example.test", role: "professor/ta" })).status, 201);
  assert.equal((await call("/auth/login", { email: "instructor@example.test", password })).status, 401);
  assert.equal((await call("/users/register", { ...account, email: "admin@example.test", role: "system_admin" })).status, 400);
});
test("expired and wrongly signed stored refresh tokens return a single 401", async () => {
  const user = await database.localDb.query.UsersTable.findFirst();
  assert.ok(user);
  for (const token of [
    jwt.sign({ userId: user.id, email: user.email }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: -1 }),
    jwt.sign({ userId: user.id, email: user.email }, "wrong-test-only-secret"),
  ]) {
    await database.localDb.insert(tables.RefreshTokensTable).values({ userId: user.id, token });
    const response = await call("/auth/refresh", undefined, { Cookie: `jwt=${token}` });
    assert.equal(response.status, 401);
    assert.match(response.headers.get("set-cookie")!, /jwt=;/);
  }
});
test("revoked approval prevents refreshing an existing session", async () => {
  const login = await call("/auth/login", { email: account.email, password });
  assert.equal(login.status, 200);
  await database.engine.exec(`UPDATE users SET "isApproved" = false WHERE email = 'auth@example.test'`);
  assert.equal((await call("/auth/refresh", undefined, { Cookie: cookie(login) })).status, 401);
});
test("missing secrets fail closed, while liveness remains available", async () => {
  const { signAccessToken } = await import("../src/utils/signTokens");
  const saved = process.env.ACCESS_TOKEN_SECRET;
  delete process.env.ACCESS_TOKEN_SECRET;
  try {
    assert.throws(() => signAccessToken({ userId: "test", email: "test@example.test", role: "student", year: "1" }), /ACCESS_TOKEN_SECRET is required/);
    assert.equal((await call("/health")).status, 200);
    assert.equal((await call("/ready")).status, 503);
    assert.equal((await call("/auth/login", account)).status, 503);
    assert.equal((await call("/users/register", account)).status, 503);
  } finally { process.env.ACCESS_TOKEN_SECRET = saved; }
});
test("missing database URL and hosted local flags are configuration errors", async () => {
  const { runtimeConfigIssues } = await import("../src/config/runtime");
  delete process.env.UNICONNECT_LOCAL_QA;
  try { assert.ok(runtimeConfigIssues().includes("DATABASE_URL")); }
  finally { process.env.UNICONNECT_LOCAL_QA = "1"; }
  process.env.VERCEL = "1";
  try { assert.ok(runtimeConfigIssues().includes("LOCAL_DATABASE_FLAGS_NOT_ALLOWED")); }
  finally { delete process.env.VERCEL; }
});
test("logging omits credentials, query text and parameters", async () => {
  const { reportServerError } = await import("../src/utils/reportServerError");
  const original = console.error;
  const lines: string[] = [];
  console.error = line => lines.push(String(line));
  try { reportServerError("test", { message: "secret", query: "secret", params: ["secret"], cause: { code: "28P01", message: "secret" } }); }
  finally { console.error = original; }
  assert.deepEqual(JSON.parse(lines[0]), { operation: "test", codes: ["28P01"] });
});
test("readiness reports a missing session table without leaking SQL", async () => {
  await database.engine.exec('DROP TABLE "refreshTokens"');
  const response = await call("/ready");
  assert.equal(response.status, 503);
  assert.equal((await response.json()).code, "DATABASE_NOT_READY");
});
