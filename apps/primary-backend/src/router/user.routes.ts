import { Router } from "express";
import { authMiddleware } from "../middleware/auth.midleware";

import "dotenv/config";
import {
  getCurrentUser,
  refreshAccessToken,
  signinUser,
  signoutUser,
  validateForgotPasswordOTP,
  verifyEmail,
} from "../controller/user.controller";

const router = Router();

router.post("/signin", signinUser);
router.get("/", authMiddleware, getCurrentUser); // Fetch current logged in user
router.post("/signout", authMiddleware, signoutUser); // Signout User
router.post("/refresh-access-token", refreshAccessToken); // Refreshing the Access and Refresh Token
router.post("/verify/:userId", authMiddleware, verifyEmail); //verify the user's mail address
// Forgot Password
router.post("/forgot-password-validate-otp", validateForgotPasswordOTP);

export const userRouter = router;