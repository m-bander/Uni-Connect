import { Router } from "express";
import { getGroup, getGroups } from "../controllers/groupsController";
import { verifyAuth } from "../middleware/verifyAuth";

const router = Router();

router.get("/:group_id", verifyAuth, getGroup);
router.get("/", verifyAuth, getGroups);

export default router;
