import express from "express";
import { verifyRole, verifyToken } from "../../middlewares/authMiddleware.js";
import { AuthController } from "./authController.js";
import { upload } from "../../utils/sendImageToCloudinary.js";

const router = express.Router();


import passport from "../../config/passport.js";


// ========================
// GOOGLE ROUTES
// ========================
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed`,
  }),
  AuthController.socialAuthCallback
);

// ========================
// FACEBOOK ROUTES
// ========================
router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["email"],
    session: false,
  })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=facebook_failed`,
  }),
  AuthController.socialAuthCallback
);


router.get("/me", verifyToken, AuthController.getMe);
router.get("/", verifyToken, verifyRole("admin"), AuthController.getAllUser);
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/logout", verifyToken, AuthController.logout);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password/:token", AuthController.resetPassword);
router.patch("/change-password", verifyToken, AuthController.changePassword);
router.post("/refresh-token", AuthController.refreshToken);
router.patch("/update-profile", verifyToken, upload.single("thumbnail"), AuthController.updateProfile);
router.delete("/:id", verifyToken, verifyRole("admin"), AuthController.deleteUser);

export const AuthRoutes = router;

