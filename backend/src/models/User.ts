// models/User.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IProject {
  title: string;
  description?: string;
  link?: string;
}

export interface ISocial {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  bio?: string;
  avatar?: string;
  skills?: string[];
  social?: ISocial;
  achievements?: string[];
  projects?: IProject[];
  level?: number;
  xp?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    link: { type: String },
  },
  { _id: false }
);

const SocialSchema: Schema = new Schema(
  {
    github: { type: String },
    linkedin: { type: String },
    twitter: { type: String },
    website: { type: String },
  },
  { _id: false }
);

const userSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    // do not return password by default
    password: { type: String, required: true, select: false },

    // profile fields
    bio: { type: String, default: "" },
    avatar: { type: String, default: "" }, // store URL or path
    skills: { type: [String], default: [] },
    social: { type: SocialSchema, default: {} },
    achievements: { type: [String], default: [] },
    projects: { type: [ProjectSchema], default: [] },

    // gamification
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
