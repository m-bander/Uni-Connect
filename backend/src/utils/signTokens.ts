import { AccessTokenPayload, RefreshTokenPayload } from "../types/api";
import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { tokenSecret } from "../config/runtime";

export const signAccessToken = (payload: AccessTokenPayload) => {
  return jwt.sign(payload, tokenSecret("ACCESS_TOKEN_SECRET"), {
    expiresIn: "15m",
    jwtid: randomUUID(),
  });
};

export const signRefreshToken = (payload: RefreshTokenPayload) => {
  return jwt.sign(payload, tokenSecret("REFRESH_TOKEN_SECRET"), {
    expiresIn: "1d",
    jwtid: randomUUID(),
  });
};
