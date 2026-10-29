import { Router } from "express";
import {
  approveUser,
  createAdmin,
  createUser,
  deleteUser,
  getPaginatedUsers,
  getCurrentUserData,
  getUserData,
  getYearMembers,
  updateProfile,
  updateProfilePicture,
  updateUserByAdmin,
} from "../controllers/usersController";

import { verifyAuth } from "../middleware/verifyAuth";
import { verifyRoles } from "../middleware/verifyRoles";
import { getCurrentUserEnrolledCourses } from "../controllers/courseController";

const router = Router();

router.post(
  "/register/admin",
  verifyAuth,
  verifyRoles("system_admin"),
  createAdmin
);

router.post("/register", createUser);
router.post("/create", verifyAuth, verifyRoles("system_admin"), createUser);

// Admin Routes
router.get("/", verifyAuth, verifyRoles("system_admin"), getPaginatedUsers);
router.put("/:user_id/approve", verifyAuth, verifyRoles("system_admin"), approveUser)
router.delete("/:user_id", verifyAuth, verifyRoles("system_admin"), deleteUser);
router.put("/:user_id", verifyAuth, verifyRoles("system_admin"), updateUserByAdmin);

router
  .route("/me")
  .all(verifyAuth)
  .patch(updateProfile)
  .get(getCurrentUserData);

router.get("/class-members", verifyAuth, getYearMembers);

// TODO: If nothing uses this route in the front end, delete it. I will duplicate it in the "me" routes
router.get("/courses", verifyAuth, getCurrentUserEnrolledCourses);

router.get("/:user_id", verifyAuth, getUserData);

router.post("/change-picture", verifyAuth, updateProfilePicture);

export default router;
