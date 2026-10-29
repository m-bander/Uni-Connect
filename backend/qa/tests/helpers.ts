import { request, expect, type APIRequestContext } from "@playwright/test";
import fs from "node:fs";
export const API = "http://127.0.0.1:3000";
export const fixture = () => JSON.parse(fs.readFileSync("qa/artifacts/fixtures.json","utf8"));
export async function login(role="student") {
  const client = await request.newContext({baseURL:API});
  const response = await client.post("/api/auth/login",{data:{email:role+"@uniconnect.test",password:"UniConnect123!"}});
  expect(response.status(),"fixture login must succeed").toBe(200);
  const data=await response.json();
  return {client,headers:{Authorization:"Bearer "+data.accessToken},user:data.user};
}
export function passwordKeys(value:unknown,prefix=""):string[] {
  if (!value || typeof value!=="object") return [];
  return Object.entries(value).flatMap(([key,v])=>[
    ...(key==="password"?[prefix+key]:[]),...passwordKeys(v,prefix+key+".")
  ]);
}
