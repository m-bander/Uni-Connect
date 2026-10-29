import bcrypt from "bcrypt";
import {eq,and,notLike} from "drizzle-orm";
import {UsersTable,RefreshTokensTable} from "../src/drizzle";

// Only retire known shared starter credentials after a real owner is present.
export async function retireStarterAccounts(db:any){
  const owner=await db.query.UsersTable.findFirst({where:and(eq(UsersTable.role,"system_admin"),eq(UsersTable.isApproved,true),notLike(UsersTable.email,"%@uniconnect.test"))});
  if(!owner)return;
  const users=await db.query.UsersTable.findMany();
  for(const user of users){
    if(user.role==="student"||!user.isApproved)continue;
    if(!/^(admin|instructor|representative|head|faculty[2-8])@uniconnect\.test$/.test(user.email))continue;
    if(!await bcrypt.compare("UniConnect123!",user.password))continue;
    await db.update(UsersTable).set({isApproved:false}).where(eq(UsersTable.id,user.id));
    await db.delete(RefreshTokensTable).where(eq(RefreshTokensTable.userId,user.id));
  }
  console.log("Website owner retained; shared privileged starter credentials retired.");
}
