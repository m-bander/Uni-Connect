import jwt, { TokenExpiredError } from "jsonwebtoken";
import { RequestHandler } from "express";
import "dotenv/config";
import { AccessTokenPayload, APIRequest } from "../types/api";
import { db } from "../drizzle/db";
import { RefreshTokensTable } from "../drizzle/schemas/user";
import { eq } from "drizzle-orm";

export const verifyAuth: RequestHandler = async (
  req: APIRequest<unknown>,
  res,
  next
) => {
  if(req.user&&process.env.UNICONNECT_PUBLIC_HOST==="1")return next();
  if (!req.cookies?.jwt)
    return res.status(401).json({ message: "Missing cookies." });

  const authHeader =
    req.headers["authorization"] || (req.headers["Authorization"] as string);
  if (!authHeader) return res.status(403).json({message:"Access token required.",code:"ACCESS_TOKEN_REQUIRED"});

  const [type, token] = authHeader.split(" ");

  if (type != "Bearer") return res.sendStatus(403);

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as AccessTokenPayload;

    if(process.env.UNICONNECT_PUBLIC_HOST==="1"){
      const session=await db.query.RefreshTokensTable.findFirst({where:eq(RefreshTokensTable.token,req.cookies.jwt!),with:{user:true}});
      if(!session||session.userId!==decoded.userId||!session.user?.isApproved)return res.status(401).json({message:"Session is no longer active. Sign in again."});
      req.user={...decoded,role:session.user.role,year:session.user.year,email:session.user.email};
    }else req.user = decoded;
    next();
  } catch (err) {
    if (err instanceof TokenExpiredError)
      return res.status(403).json({ message: "Expired access token.",code:"TOKEN_EXPIRED" });

    res.sendStatus(process.env.UNICONNECT_PUBLIC_HOST === "1" ? 401 : 500);
  }
};
