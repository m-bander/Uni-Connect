import { Router } from "express";
import { verifyAuth } from "../middleware/verifyAuth";
import { deleteFile } from "../controllers/fileController";

const router = Router();

router.delete("/:fileId", verifyAuth, deleteFile);

export default router;
