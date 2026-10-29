import { RequestHandler } from "express";
import { allowedOrigins } from "../config/corsOptions";

export const credentials: RequestHandler = (req, res, next) => {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin))
    res.setHeader("Access-Control-Allow-Credentials", "true");

  next();
};
