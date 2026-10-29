import { AccessTokenPayload, RefreshTokenPayload } from "../types/api";
import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const signAccessToken = (payload: AccessTokenPayload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "15m",
    jwtid: randomUUID(),
  });
};

export const signRefreshToken = (payload: RefreshTokenPayload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "1d",
    jwtid: randomUUID(),
  });
};
