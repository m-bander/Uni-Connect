import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir:"./qa/tests",workers:1,fullyParallel:false,retries:0,timeout:30000,
  outputDir:"qa/test-results",
  reporter:[["list"],["html",{outputFolder:"qa/artifacts/html",open:"never"}],["json",{outputFile:"qa/artifacts/results.json"}]],
  use:{baseURL:"http://localhost:5173",browserName:"chromium",channel:process.env.PLAYWRIGHT_CHANNEL || undefined,trace:"retain-on-failure",screenshot:"only-on-failure"},
  webServer:[
    {command:"node --import tsx qa/start.ts",url:"http://127.0.0.1:3000/api/auth/refresh",reuseExistingServer:false,timeout:60000},
    {command:"node ../frontend/node_modules/vite/bin/vite.js ../frontend --host localhost --port 5173 --strictPort",url:"http://localhost:5173",reuseExistingServer:false,timeout:60000}
  ]
});
