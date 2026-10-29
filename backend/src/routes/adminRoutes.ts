import { Router } from "express";
import {
  createCourse,
  deleteCourse,
  getAdminCourseMembers,
  getPaginatedCourses,
  removeCourseUser,
} from "../controllers/courseController";
import { verifyAuth } from "../middleware/verifyAuth";
import { verifyRoles } from "../middleware/verifyRoles";


// Admin Routes
const adminRouter = Router();
adminRouter.use(verifyAuth, verifyRoles("system_admin"));
adminRouter.get("/", getPaginatedCourses);
adminRouter.get("/:courseCode/members", getAdminCourseMembers);
adminRouter.route("/").post(createCourse);
adminRouter.delete("/:courseCode", deleteCourse);
adminRouter.delete("/:courseCode/users/:user_id", removeCourseUser);

export default adminRouter;