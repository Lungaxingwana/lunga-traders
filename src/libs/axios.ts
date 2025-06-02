import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === "development" ? "http://localhost:5002/api" : "https://lunga-traders-backend.onrender.com/api",
  withCredentials: true,
});
