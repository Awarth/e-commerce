import { Router } from "express";
import {
  createAUser,
  loginAUser,
  logoutUser,
  refreshAccessToken,
  changeUserPassword,
  deleteUser,
  getCurrentUser,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/").get(authMiddleware,getCurrentUser);
router.route("/register").post(createAUser);
router.route("/login").post(loginAUser);
router.route("/logout").post(authMiddleware, logoutUser);
router.route("/refresh-token").post(authMiddleware, refreshAccessToken);
router.route("/change-password").patch(authMiddleware, changeUserPassword);
router.route("/delete").delete(authMiddleware, deleteUser);

export default router;
