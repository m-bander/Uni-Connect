import { Router } from "express";
import {
  deleteEvent,
  editEvent,
  getCurrentUserEvents,
} from "../controllers/eventsController";
import { verifyAuth } from "../middleware/verifyAuth";

const router = Router();

router.get("/", verifyAuth, getCurrentUserEvents);
router.delete("/:event_id", verifyAuth, deleteEvent);
router.patch("/:event_id", verifyAuth, editEvent);

export default router;
