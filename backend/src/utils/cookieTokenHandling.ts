import { Response } from "express";
export const createRefreshTokenCookie = (
  res: Response,
  refreshToken: string
) => {
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: process.env.UNICONNECT_LOCAL_QA === "1" || process.env.UNICONNECT_LOCAL_APP === "1" ? "lax" : "none",
    secure: process.env.UNICONNECT_LOCAL_QA !== "1" && process.env.UNICONNECT_LOCAL_APP !== "1",
  });
};

export const clearRefreshTokenCookie = (res: Response) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: process.env.UNICONNECT_LOCAL_QA === "1" || process.env.UNICONNECT_LOCAL_APP === "1" ? "lax" : "none",
    secure: process.env.UNICONNECT_LOCAL_QA !== "1" && process.env.UNICONNECT_LOCAL_APP !== "1",
  });
};
