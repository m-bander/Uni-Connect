import { Router } from "express";
import { verifyAuth } from "../middleware/verifyAuth";
import { deleteVote, vote } from "../controllers/pollsController";

const router = Router();

router.post("/:poll_item_id/votes", verifyAuth, vote);
router.delete("/:poll_item_id/votes", verifyAuth, deleteVote);

export default router;
