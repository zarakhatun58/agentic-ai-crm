import { api } from "./api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  territory?: string;
}

export const login = async (payload: LoginRequest) => {
  const { data } = await api.post("/auth/login", payload);

  // Save JWT token
  localStorage.setItem("token", data.access_token);

  return data;
};

export const register = async (payload: RegisterRequest) => {
  const { data } = await api.post("/auth/register", payload);
  return data;
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const getProfile = async () => {
  const { data } = await api.get("/auth/me");
  return data;
};