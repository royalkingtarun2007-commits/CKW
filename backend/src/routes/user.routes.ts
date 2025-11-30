import { Router } from "express";
import { addUser, loginUser, getAllUsers } from "../controllers/user.controller";
import { verifyToken } from "../middleware/auth"; // ✅ import middleware

const router = Router();

/**
 * @route   POST /api/users/add-user
 * @desc    Register a new user
 * @access  Public
 */
router.post("/add-user", addUser);

/**
 * @route   POST /api/users/login
 * @desc    Authenticate user and return JWT token
 * @access  Public
 */
router.post("/login", loginUser);

/**
 * @route   GET /api/users
 * @desc    Get all users (for testing)
 * @access  Public (you can protect later)
 */
router.get("/users", getAllUsers);

/**
 * @route   GET /api/users/profile
 * @desc    Access protected profile route
 * @access  Private (requires valid JWT token)
 */
router.get("/profile", verifyToken, (req, res) => {
  res.status(200).json({
    message: "✅ You have accessed a protected route!",
    user: (req as any).user, // decoded user info from token
  });
});

export default router;
