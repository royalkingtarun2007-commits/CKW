import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const secret = process.env.JWT_SECRET || "defaultSecret";
    const decoded = jwt.verify(token, secret);
    req.user = decoded;

    next(); // ✅ move on to the next handler
  } catch (err) {
    console.error("❌ Token verification failed:", err);
    res.status(400).json({ message: "Invalid token" });
  }
};
