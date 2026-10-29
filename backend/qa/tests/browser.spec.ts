import {test,expect,type Page} from "@playwright/test";
async function signIn(page:Page,role:string) {
 await page.goto("/login");
 await page.getByLabel("E-Mail").fill(role+"@uniconnect.test");
 await page.getByLabel("Password",{exact:true}).fill("UniConnect123!");
 await page.getByRole("button",{name:"Login",exact:true}).click();
}
test("UI-001 unauthenticated student route redirects to login",async({page})=>{
 await page.goto("/student/courses");await expect(page).toHaveURL(/\/login$/);await expect(page.getByRole("heading",{name:"Welcome Back!"})).toBeVisible();
});
test("UI-002 student can log in and see the enrolled course",async({page})=>{
 await signIn(page,"student");await expect(page).toHaveURL(/\/student\/dashboard$/);
 await page.goto("/student/courses");await expect(page.getByText("Software Testing",{exact:true}).first()).toBeVisible();
});
test("UI-003 instructor can log in and see their course",async({page})=>{
 await signIn(page,"instructor");await expect(page).toHaveURL(/\/instructor\/courses$/);await expect(page.getByText("Software Testing",{exact:true}).first()).toBeVisible();
});
test("UI-004 admin can log in and see course management",async({page})=>{
 await signIn(page,"admin");await expect(page).toHaveURL(/\/admin\/courses$/);await expect(page.getByText("Software Testing",{exact:true}).first()).toBeVisible();
});
test("UI-005 student is blocked from admin pages",async({page})=>{
 await signIn(page,"student");await expect(page).toHaveURL(/\/student\/dashboard$/);await page.goto("/admin/users");await expect(page).toHaveURL(/\/unauthorized$/);
});
test("UI-006 pending instructor sees an approval error",async({page})=>{
 await signIn(page,"pending");await expect(page.getByText("Your account hasn't been approved by the admin yet.")).toBeVisible();await expect(page).toHaveURL(/\/login$/);
});
test("UI-007 student course page renders without an uncaught error",async({page})=>{
 const errors:string[]=[];page.on("pageerror",e=>errors.push(e.message));
 await signIn(page,"student");await expect(page).toHaveURL(/\/student\/dashboard$/);await page.goto("/student/courses/QA-101");
 await expect(page.getByText("Software Testing",{exact:true}).first()).toBeVisible();expect(errors).toEqual([]);
});
