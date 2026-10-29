import { Router } from "express";
import {
  getAssignmentCompletionRate,
  getAverageCourseGrade,
  getDailyUsersStats,
  getGeneralStats,
  getMostActiveGroups,
  getSessionDurationStats,
  getStudentsByYear,
  recordSessionDuration,
} from "../controllers/statsController";
import { verifyAuth } from "../middleware/verifyAuth";

const router = Router();

router.get("/general", getGeneralStats);
router.get("/students-by-year", getStudentsByYear);
router.get("/most-active-groups", getMostActiveGroups);
router.get("/average-course-grades", getAverageCourseGrade);
router.get("/assignment-completion-rate", getAssignmentCompletionRate);
router.get("/daily-users-usage", getDailyUsersStats);
router.get("/session-duration", getSessionDurationStats);

router.post("/record-session-duration", verifyAuth, recordSessionDuration);

export default router;
