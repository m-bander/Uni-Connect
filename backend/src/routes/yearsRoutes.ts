import { Router } from "express";
import {
  createYearAnnouncement,
  getYearAnnouncements,
  getYearStudents,
} from "../controllers/yearsController";
import { verifyAuth } from "../middleware/verifyAuth";
import { verifyRoles } from "../middleware/verifyRoles";

const router = Router();

router.get("/:year/announcements", getYearAnnouncements);
router.get("/:year/students", getYearStudents);
router.post(
  "/:year/announcements",
  verifyAuth,
  verifyRoles("class_representative"),
  createYearAnnouncement
);

export default router;
