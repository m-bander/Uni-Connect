import { AccessTokenPayload, RefreshTokenPayload } from "../types/api";
import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import "dotenv/config";

const ACCESS_SECRET =
  process.env.ACCESS_TOKEN_SECRET ||
  "uniconnect_default_access_token_secret_key_2026_x99_sec";
const REFRESH_SECRET =
  process.env.REFRESH_TOKEN_SECRET ||
  "uniconnect_default_refresh_token_secret_key_2026_x99_sec";

export const signAccessToken = (payload: AccessTokenPayload) => {
  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: "15m",
    jwtid: randomUUID(),
  });
};

export const signRefreshToken = (payload: RefreshTokenPayload) => {
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: "1d",
    jwtid: randomUUID(),
  });
};
