import { Router } from "express";
import {
  addMessage,
  deleteMessage,
  getMessages,
  patchMessage,
} from "../controllers/messagesController";

const router = Router({ mergeParams: true });

router.get("/", getMessages);
router.post("/", addMessage);
router.delete("/:message_id", deleteMessage);
router.patch("/:message_id", patchMessage);

export default router;
