"use client";
import React, { useState } from "react";
import Image from "next/image";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { FiLogIn } from "react-icons/fi";
import { FaUserPlus } from "react-icons/fa";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const { login, isLoggingIn } = useAuthStore();
  const router = useRouter();

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!form.email) newErrors.email = "Email is required";
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email))
      newErrors.email = "Invalid email address";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.type]: e.target.value });
    setErrors({ ...errors, [e.target.type]: undefined, general: undefined });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    try {
      const formData = new FormData();
      formData.append("email", form.email);
      formData.append("password", form.password);
      await login({ data: formData, navigate: (path) => router.push(path) });
    } catch {
      setErrors({ general: "Login failed. Please try again." });
    } 
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-stone-400 via-stone-100 to-stone-300">
      <span className="opacity-60 mb-4">Login</span>
      <div className="bg-white shadow-2xl shadow-black border border-stone-300 backdrop-blur-md rounded-xl p-8 w-full max-w-md flex flex-col items-center space-y-6">
        {/* Company Logo */}
        <Image
          src="/background/lunga-trader.png"
          alt="Company Logo"
          width={200}
          height={200}
          className="h-36 w-36 rounded-full shadow-lg"
          priority
        />
        <form className="space-y-6 w-full" onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <MdEmail size={20} />
            </span>
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-2 rounded-lg bg-white/80 focus:bg-white outline-none shadow-lg shadow-black/40 ${
                errors.email ? "border border-red-400" : ""
              }`}
              required
              autoComplete="email"
            />
            {errors.email && (
              <span className="text-xs text-red-500 text-center w-full left-0 bottom-[-20px] mt-1 absolute">
                {errors.email}
              </span>
            )}
          </div>
          {/* Password */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <RiLockPasswordLine size={20} />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className={`w-full pl-10 pr-10 py-2 rounded-lg bg-white/80 focus:bg-white outline-none shadow-lg shadow-black/40 ${
                errors.password ? "border border-red-400" : ""
              }`}
              required
              autoComplete="current-password"
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={0}
              role="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <HiEye size={22} /> : <HiEyeOff size={22} />}
            </span>
            {errors.password && (
              <span className="text-xs text-red-500 text-center w-full left-0 bottom-[-20px] mt-1 absolute">
                {errors.password}
              </span>
            )}
          </div>
          {/* General Error */}
          {errors.general && (
            <div className="text-center text-sm text-red-500">
              {errors.general}
            </div>
          )}
          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-white bg-gradient-to-r from-stone-700 via-stone-500 to-stone-700 hover:opacity-80 active:opacity-60 shadow-black shadow-lg transition disabled:opacity-50"
          >
            <FiLogIn size={20} />
            {isLoggingIn ? "Loggin in..." : "Login"}
          </button>
        </form>
      </div>
      {/* Signup Link */}
      <div className="mt-4 text-center">
        <span className="opacity-60">Don&#39;t have an account?</span>
        <a
          href="/signup"
          className=" text-stone-600 font-bold hover:underline flex items-center justify-center gap-1"
        >
          <FaUserPlus size={18} />
          Sign up
        </a>
      </div>
    </div>
  );
}
