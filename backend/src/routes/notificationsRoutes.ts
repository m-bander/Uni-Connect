import { Router } from "express";
import { verifyAuth } from "../middleware/verifyAuth";
import {
  getCurrentUserNotifications,
  markCurrentUserNotificationsAsRead,
} from "../controllers/notificationsController";

const router = Router();

router.patch("/", verifyAuth, markCurrentUserNotificationsAsRead);
router.get("/", verifyAuth, getCurrentUserNotifications);

export default router;
