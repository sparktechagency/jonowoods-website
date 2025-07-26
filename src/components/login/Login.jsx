"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useLoginMutation } from "@/redux/featured/auth/authApi";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/redux/featured/auth/authSlice"; // Import your authSlice actions
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginUser() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleTogglePassword = () => setShowPassword((prev) => !prev);


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await login({ email, password }).unwrap();
      const { accessToken, refreshToken } = res.data;
      // Save tokens and dispatch success
      localStorage.setItem("token", accessToken);
      dispatch(loginSuccess(accessToken));
  
      toast.success("Login successful! Welcome back.");
      router.push("/");
    } catch (error) {
      console.error("Login failed:", error);
  
      // Show error toast message
      // const errorMessage = error?.message || "An error occurred while logging in.";
      toast.error(error); 
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row justify-center">
      {/* Left side image */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center">
        <div className="h-auto max-h-[700px] w-full max-w-[700px] p-4">
          <Image
            src="/assests/loginImage.png"
            alt="Side Illustration"
            width={700}
            height={700}
            className="object-cover w-full h-full"
            priority
          />
        </div>
      </div>

      {/* Right side form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8">
        <div className="bg-[#FCFCFC3B] border-2 border-[#A92C2C] backdrop-blur-md rounded-lg p-6 md:p-8 w-full max-w-md mx-auto">
          <div className="flex justify-center mb-4">
            <Image
              src="/assests/logo.png"
              height={120}
              width={160}
              alt="Logo"
              className="mx-auto"
            />
          </div>

          <h2 className="font-bold text-center mb-6 text-white text-xl md:text-2xl">
            Welcome back! Enter your information
          </h2>

          <form onSubmit={handleSubmit}>
            {/* User Name or Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm mb-2 text-white">
                User name or email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full py-2 md:py-6 text-black bg-white border border-red-700"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm mb-2 text-white"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full py-2 md:py-6 text-black bg-white border border-red-700"
                  required
                />
                <button
                  type="button"
                  onClick={handleTogglePassword}
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 text-black"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              className="w-full h-10 md:h-12 bg-button text-white rounded-md"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>

            {/* Links */}
            <div className="flex justify-between text-sm text-center mt-6 md:mt-8 gap-4 md:gap-0">
              <Link href="/register" className="text-white hover:text-red-400">
                Create account
              </Link>
              <Link
                href="/forgot-password"
                className="text-white hover:text-red-400"
              >
                Forgot password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
