import { CorsOptions } from "cors";

const allowedOrigins: string[] = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  process.env.VERCEL_URL ? "https://" + process.env.VERCEL_URL : undefined,
  process.env.VERCEL_PROJECT_PRODUCTION_URL ? "https://" + process.env.VERCEL_PROJECT_PRODUCTION_URL : undefined
].filter((value): value is string => !!value);

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error("Not allowed orgin by cors"));
  },
  optionsSuccessStatus: 200,
};

export { corsOptions, allowedOrigins };
