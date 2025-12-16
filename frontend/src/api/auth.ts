import axios from "axios";

const API_URL = "https://ckw-backend.onrender.com/api/auth";

export const registerUser = (name: string, email: string, password: string) => {
  return axios.post(`${API_URL}/register`, { name, email, password });
};

export const loginUser = (email: string, password: string) => {
  return axios.post(`${API_URL}/login`, { email, password });
};

export const fetchUserProfile = (token: string) => {
  return axios.get(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateUserProfile = (token: string, payload: any) => {
  return axios.put(`${API_URL}/update`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const changePassword = (
  token: string,
  payload: { oldPassword: string; newPassword: string }
) => {
  return axios.put(`${API_URL}/change-password`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const uploadAvatarApi = (token: string, file: File) => {
  const form = new FormData();
  form.append("avatar", file);
  return axios.post(`${API_URL}/upload-avatar`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};
