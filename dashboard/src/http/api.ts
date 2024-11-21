import axios from "axios";
import useTokenStore from "@/store";
const api = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.request.use((config) => {
  const token = useTokenStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
//End Point - register user
export const register = async (data: {
  name: string;
  email: string;
  password: string;
}) => api.post("/api/v1/user/register", data);
//login user
export const login = async (data: { email: string; password: string }) =>
  api.post("/api/v1/user/login", data);
//get books
export const getBooks = async () => api.get("/api/v1/book");
//create book
export const createBook = async (data: FormData) => {
  api.post("/api/v1/book/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
