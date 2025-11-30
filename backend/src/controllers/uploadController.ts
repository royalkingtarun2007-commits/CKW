// backend/controllers/uploadController.ts
import { Request, Response } from "express";
import path from "path";
import User from "../models/User";

// NOTE: authMiddleware must have set req.user.id
export const uploadAvatar = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    // Build an accessible URL path. Adjust if your server serves /uploads statically.
    const fileName = (req.file as any).filename;
    const avatarUrl = `/uploads/avatars/${fileName}`;

    const updated = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarUrl },
      { new: true }
    ).select("-password");

    if (!updated) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({ message: "Avatar uploaded", user: updated, avatar: avatarUrl });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};
