import { Router } from "express";
import { verifyAuth } from "../middleware/verifyAuth";
import { verifyRoles } from "../middleware/verifyRoles";
import {
  createMaterial,
  deleteMaterial,
  getAllMaterials,
  getMaterial,
  updateMaterial,
} from "../controllers/materialController";

const router = Router();

router.post(
  "/",
  verifyAuth,
  verifyRoles("class_representative", "course_head", "professor/ta"),
  createMaterial
);

router.get("/course/:courseCode", verifyAuth, getAllMaterials);

router
  .route("/:id")
  .all(verifyAuth)
  .get(getMaterial)
  .patch(
    verifyRoles("class_representative", "course_head", "professor/ta"),
    updateMaterial
  )
  .delete(
    verifyRoles("class_representative", "course_head", "professor/ta"),
    deleteMaterial
  );

export default router;
