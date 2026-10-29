import { Router } from "express";
import { verifyAuth } from "../middleware/verifyAuth";
import { verifyRoles } from "../middleware/verifyRoles";
import {
  deleteAnnouncement,
  getCurrentUserAnnouncements,
  patchAnnouncement,
} from "../controllers/announcementsController";

const router = Router();

router.delete(
  "/:announcementId",
  verifyAuth,
  verifyRoles("class_representative", "course_head", "professor/ta"),
  deleteAnnouncement
);

router.patch(
  "/:announcementId",
  verifyAuth,
  verifyRoles("class_representative", "course_head", "professor/ta"),
  patchAnnouncement
);

router.get(
  "/",
  verifyAuth,
  verifyRoles("class_representative", "course_head", "student"),
  getCurrentUserAnnouncements
);

export default router;
