// controllers/authController.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

// =========================
// REGISTER USER
// =========================
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: IUser = new User({
      name,
      email,
      password: hashedPassword,
      // default profile values will be applied from schema
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET as string, { expiresIn: "7d" });

    // return profile (without password)
    const user = await User.findById(newUser._id).select("-password");

    res.status(201).json({
      message: "User registered successfully",
      token,
      user,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// =========================
// LOGIN USER
// =========================
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    // include password explicitly
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: "7d" });

    const profile = await User.findById(user._id).select("-password");

    res.status(200).json({
      message: "Login successful",
      token,
      user: profile,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// =========================
// UPDATE USER (PROFILE + BASICS)
// =========================
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // Accept many optional profile fields
    const {
      name,
      email,
      bio,
      avatar,
      skills,
      social,
      achievements,
      projects,
      level,
      xp,
    } = req.body;

    // If email provided, check collision
    if (email) {
      const existing = await User.findOne({ email });
      if (existing && String(existing._id) !== String(userId)) {
        res.status(400).json({ message: "Email already in use" });
        return;
      }
    }

    // Build update object only with defined fields
    const updateData: any = {};
    if (typeof name !== "undefined") updateData.name = name;
    if (typeof email !== "undefined") updateData.email = email;
    if (typeof bio !== "undefined") updateData.bio = bio;
    if (typeof avatar !== "undefined") updateData.avatar = avatar;
    if (typeof skills !== "undefined") {
      // allow either comma string or array
      updateData.skills = Array.isArray(skills) ? skills : String(skills).split(",").map(s => s.trim()).filter(Boolean);
    }
    if (typeof social !== "undefined") updateData.social = social;
    if (typeof achievements !== "undefined") {
      updateData.achievements = Array.isArray(achievements) ? achievements : String(achievements).split(",").map(s => s.trim()).filter(Boolean);
    }
    if (typeof projects !== "undefined") updateData.projects = Array.isArray(projects) ? projects : [];
    if (typeof level !== "undefined") updateData.level = Number(level);
    if (typeof xp !== "undefined") updateData.xp = Number(xp);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(updatedUser);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// =========================
// CHANGE PASSWORD (OLD + NEW)
// =========================
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      res.status(400).json({ message: "Old password and new password are required" });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ message: "New password must be at least 6 characters" });
      return;
    }

    // Load user (with password)
    const user = await User.findById(userId).select("+password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Check old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Old password is incorrect" });
      return;
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    (user as any).password = hashedPassword;

    await user.save();

    res.json({ message: "Password changed successfully" });

  } catch (error: any) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};
