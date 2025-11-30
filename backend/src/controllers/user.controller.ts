import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User"; // ✅ matches your file structure (capital U, singular file name)

// ✅ REGISTER USER
export const addUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // 🔹 Basic field validation
    if (!name || !email || !password) {
      res.status(400).json({ message: "All fields are required." });
      return;
    }

    // 🔹 Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "This email is already registered. Please log in." });
      return;
    }

    // 🔹 Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔹 Save new user to database
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err: any) {
    // 🔹 Gracefully handle MongoDB duplicate key error (E11000)
    if (err.code === 11000) {
      res.status(400).json({ message: "This email is already registered. Please log in." });
      return;
    }

    console.error("❌ Error creating user:", err.message);
    res.status(500).json({ message: "Error registering user", error: err.message });
  }
};

// ✅ LOGIN USER
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // 🔹 Basic validation
    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required." });
      return;
    }

    // 🔹 Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid email or password." });
      return;
    }

    // 🔹 Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid email or password." });
      return;
    }

    // 🔹 Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "defaultSecret",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err: any) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};

// ✅ GET ALL USERS (optional for testing)
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({}, "-password"); // exclude password
    res.status(200).json(users);
  } catch (err: any) {
    console.error("❌ Error fetching users:", err.message);
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
};
