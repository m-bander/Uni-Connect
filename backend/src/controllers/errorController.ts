import { ErrorRequestHandler } from "express";

export const handleError: ErrorRequestHandler = (error, _, response, __) => {
  console.log(error);
  const details = error.details ?? undefined;
  const status = error.statusCode || 500;
  const message = error.message;
  response.status(status).json({ message, details });
};
