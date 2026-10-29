import { Router } from "express";
import {
  getCurrentInstructorCourses,
  getCurrentUserEnrolledCourses,
} from "../controllers/courseController";
import { verifyAuth } from "../middleware/verifyAuth";
import { verifyRoles } from "../middleware/verifyRoles";
import { getCurrentUserEvents } from "../controllers/eventsController";

const router = Router();

router.get(
  "/courses/teaching",
  verifyAuth,
  verifyRoles("professor/ta"),
  getCurrentInstructorCourses
);

router.get("/events", verifyAuth, getCurrentUserEvents);

router.get(
  "/courses/enrolled",
  verifyAuth,
  verifyRoles("class_representative", "course_head", "student"),
  getCurrentUserEnrolledCourses
);

export default router;
