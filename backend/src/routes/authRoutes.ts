import { Router } from "express";
import {
  changePassword,
  handleRefreshToken,
  login,
  logout,
} from "../controllers/authController";
import { verifyAuth } from "../middleware/verifyAuth";

const router = Router();

router.post("/login", login);

router.post("/change-password", verifyAuth, changePassword);

router.get("/refresh", handleRefreshToken);

router.get("/logout", logout);

export default router;
