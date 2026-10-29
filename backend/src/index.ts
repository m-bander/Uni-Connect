import { createServer } from "node:http";
import { hostedAccess, sanitizeHostedResponse } from "./middleware/publicHost";
import { campusRouter } from "./routes/campusRoutes";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import authRoutes from "./routes/authRoutes";
import coursesRoutes from "./routes/courseRoutes";
import groupsRoutes from "./routes/groupsRoutes";
import messagesRoutes from "./routes/messagesRoutes";
import notificationsRoutes from "./routes/notificationsRoutes";
import eventsRoutes from "./routes/eventsRoutes";
import materialRoutes from "./routes/materialRoutes";
import usersRoute from "./routes/usersRoutes";
import announcementsRoutes from "./routes/announcementsRoutes";
import pollItemsRoutes from "./routes/pollRoutes";
import fileRoutes from "./routes/fileRoutes";
import yearsRoutes from "./routes/yearsRoutes";
import meRoutes from "./routes/meRoutes";
import statsRoutes from "./routes/statsRoutes";
import adminRoutes from "./routes/adminRoutes";

import { corsOptions } from "./config/corsOptions";
import { credentials } from "./middleware/credentials";

import { handleError } from "./controllers/errorController";
import { createRouteHandler } from "uploadthing/express";
import { uploadRouter } from "./config/uploadthing";
import { initializeWebSocketServer } from "./lib/socket";

if (process.env.VERCEL || process.env.UNICONNECT_LEGACY_BASELINE !== "1") process.env.UNICONNECT_PUBLIC_HOST = "1";
const app = express();

app.use(credentials);
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_req,res) => res.json({status:"ok"}));
if (process.env.UNICONNECT_PUBLIC_HOST === "1") {
  app.use("/api", sanitizeHostedResponse, hostedAccess);
  app.use("/api", campusRouter);
}

if (process.env.UNICONNECT_LOCAL_QA !== "1" && process.env.UNICONNECT_PUBLIC_HOST !== "1") app.use(
  "/api/uploadthing",
  createRouteHandler({
    router: uploadRouter,
    config: {
      token: process.env.UPLOADTHING_TOKEN,
      isDev: true,
      logLevel: "None",
    },
  })
);
app.use("/api/users", usersRoute);
app.use("/api/auth", authRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/groups/:group_id/messages", messagesRoutes);
app.use("/api/groups", groupsRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/announcements", announcementsRoutes);
app.use("/api/poll_items", pollItemsRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/years", yearsRoutes);
app.use("/api/me", meRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/admin", adminRoutes);


// Error Middleware
app.use(handleError);

export const server = createServer(app);
initializeWebSocketServer(server);
export { app };
if (!process.env.VERCEL) {
  const port = Number(process.env.PORT || 3000);
  const host = process.env.UNICONNECT_LOCAL_QA === "1" || process.env.UNICONNECT_LOCAL_APP === "1" ? "127.0.0.1" : "0.0.0.0";
  server.listen(port, host, () => console.log("SERVER RUNNING ON PORT " + port));
}
