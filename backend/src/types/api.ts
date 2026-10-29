import { type Request } from "express";
import { USER_ROLES } from "../drizzle/enums/roles";
import { STUDENT_YEARS } from "../drizzle";

export type userRolesType = (typeof USER_ROLES)[number];

export type AccessTokenPayload = {
  userId: string;
  email: string;
  role: userRolesType;
  year: (typeof STUDENT_YEARS)[number] | null;
};

export type RefreshTokenPayload = {
  userId: string;
  email: string;
};

export interface APIRequest<T = {}> extends Request {
  body: T;
  user?: AccessTokenPayload;
  cookies: {
    jwt?: string;
  };
}
