import { RequestHandler } from "express";
import { APIRequest, userRolesType } from "../types/api";

export const verifyRoles = (...allowedRoles: userRolesType[]) => {
  const handler: RequestHandler = (req: APIRequest<unknown>, res, next) => {
    if (!req?.user)
      return res.status(401).json({ message: "User not authenticated" });

    if(req.user.role === "system_admin") return next();

    if (!allowedRoles.includes(req.user.role))
      return res.status(401).json({
        message: `Insufficient user roles. Only ${allowedRoles} are allowed`,
      });

    next();
  };
  return handler;
};
