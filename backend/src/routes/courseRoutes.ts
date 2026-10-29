import { Router } from "express";
import {
  getCourseAnnouncements,
  postCourseAnnouncement,
} from "../controllers/announcementsController";
import {
  createAssignment,
  deleteAssignment,
  editAssignment,
  getAssignment,
  getCourseAssignments,
} from "../controllers/assignmentsController";
import {
  assignCourseHead,
  assignCurrentInstructorToCourse,
  createCourse,
  deleteCourse,
  enrollInCourse,
  getPaginatedCourses,
  getCourse,
  getCourseMembers,
  getAdminCourseMembers,
  getAllCourses,
  getManageableCourses,
  getManagedCourses,
  removeCourseHead,
  removeCourseUser,
  updateCourse,
} from "../controllers/courseController";
import { verifyAuth } from "../middleware/verifyAuth";
import { verifyRoles } from "../middleware/verifyRoles";
import {
  addSubmissionFiles,
  createSubmission,
  deleteSubmission,
  deleteSubmissionFile,
  getSubmissions,
  patchSubmission,
} from "../controllers/submissionsController";
import { createCourseEvent } from "../controllers/eventsController";

// Student Routes
const studentRouter = Router();
studentRouter.post(
  "/:courseCode/assignments/:assignment_id/submissions/:submission_id/files",
  verifyAuth,
  addSubmissionFiles
);
studentRouter.delete(
  "/:courseCode/assignments/:assignment_id/submissions/:submission_id/files/:file_id",
  verifyAuth,
  deleteSubmissionFile
);

studentRouter.get("/", verifyAuth, getAllCourses);
studentRouter.get(
  "/:courseCode/announcements",
  verifyAuth,
  getCourseAnnouncements
);
studentRouter.get("/:courseCode/assignments", verifyAuth, getCourseAssignments);
studentRouter.get("/:courseCode/assignments/:assignment_id", getAssignment);

studentRouter.post(
  "/:courseCode/assignments/:assignment_id/submissions",
  verifyAuth,
  createSubmission
);
studentRouter.get(
  "/:courseCode/assignments/:assignment_id/submissions",
  verifyAuth,
  getSubmissions
);
studentRouter.delete(
  "/:courseCode/assignments/:assignment_id/submissions/:submission_id",
  verifyAuth,
  deleteSubmission
);
studentRouter.patch(
  "/:courseCode/assignments/:assignment_id/submissions/:submission_id",
  verifyAuth,
  patchSubmission
);

studentRouter.get("/:courseCode/members", verifyAuth, getCourseMembers);
studentRouter.post("/:courseCode/enrollments", verifyAuth, enrollInCourse);

// Class Rep Routes
const courseHeadRouter = Router();
courseHeadRouter.use(verifyAuth, verifyRoles("class_representative"));
courseHeadRouter.post("/assign", assignCourseHead);
courseHeadRouter.post("/remove", removeCourseHead);
courseHeadRouter.get("/managed-courses/:id", getManagedCourses);
courseHeadRouter.get("/manageable-courses/:id", getManageableCourses);

// Professor Routes
const professorRouter = Router();
professorRouter.use(verifyAuth, verifyRoles("professor/ta"));
professorRouter.route("/").post(createCourse);
professorRouter.route("/:courseCode").patch(updateCourse);
professorRouter.post(
  "/:courseCode/instructors/me",
  assignCurrentInstructorToCourse
);
professorRouter.post("/:courseCode/assignments", createAssignment);
professorRouter.delete(
  "/:courseCode/assignments/:assignment_id",
  deleteAssignment
);
professorRouter.patch(
  "/:courseCode/assignments/:assignment_id",
  editAssignment
);

const sharedRoutes = Router();
sharedRoutes.post(
  "/:courseCode/announcements",
  verifyAuth,
  verifyRoles("class_representative", "course_head", "professor/ta"),
  postCourseAnnouncement
);
sharedRoutes.get("/:courseCode", verifyAuth, getCourse);
sharedRoutes.patch(
  "/:courseCode",
  verifyAuth,
  verifyRoles(
    "class_representative",
    "course_head",
    "professor/ta",
    "system_admin"
  ),
  updateCourse
);
sharedRoutes.post(
  "/:courseCode/events",
  verifyAuth,
  verifyRoles(
    "class_representative",
    "course_head",
    "professor/ta",
    "system_admin"
  ),
  createCourseEvent
);



const router = Router();

router.use("/", sharedRoutes);
router.use("/", studentRouter);
router.use("/course-head", courseHeadRouter);
router.use("/", professorRouter);

export default router;
