// routes/auth-routes.ts
import { Router } from "express";
import { registerUser, loginUser, updateUser, changePassword } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";
import { uploadAvatar } from "../middleware/upload";
import { uploadAvatar as uploadAvatarController } from "../controllers/uploadController";
import User from "../models/User";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// GET USER PROFILE
router.get("/me", authMiddleware, async (req: any, res: any) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE USER (NAME / EMAIL / BIO / OTHER FIELDS)
router.put("/update", authMiddleware, updateUser);

// CHANGE PASSWORD
router.put("/change-password", authMiddleware, changePassword);

// ⭐ NEW: UPLOAD AVATAR (multipart/form-data)
// IMPORTANT: field name must be "avatar"
router.post(
  "/upload-avatar",
  authMiddleware,
  uploadAvatar.single("avatar"),
  uploadAvatarController
);

export default router;
