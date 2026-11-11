import { ErrorRequestHandler } from "express";
import { reportServerError } from "../utils/reportServerError";

export const handleError: ErrorRequestHandler = (error, _, response, __) => {
  reportServerError("request.failed", error);
  const details = error.details ?? undefined;
  const status = error.statusCode || 500;
  if (status >= 500) {
    return response.status(500).json({ message: "Unexpected server error" });
  }
  const message = error.message;
  response.status(status).json({ message, details });
};
