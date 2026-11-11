// Compatibility entry point: authentication tests use a disposable local database only.
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const result = spawnSync(process.execPath, ["--import", "tsx", "--test", "tests/auth.test.ts"], {
  cwd: path.join(root, "backend"), stdio: "inherit",
});
process.exitCode = result.status ?? 1;
