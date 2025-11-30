export interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Project {
  title: string;
  description?: string;
  link?: string;
}

export interface Social {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
}

export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  skills?: string[];
  social?: Social;
  achievements?: string[];
  projects?: Project[];
  level?: number;
  xp?: number;
  createdAt?: string;
  updatedAt?: string;
  token?: string;
}
