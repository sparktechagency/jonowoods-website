"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { useRegisterMutation } from "@/redux/featured/auth/authApi";
import { useDispatch } from "react-redux";
import { registerSuccess } from "@/redux/featured/auth/authSlice";
import { useRouter } from "next/navigation";

export default function UserCreate() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const [registrationStatus, setRegistrationStatus] = useState("");

  const onSubmit = async (data) => {
    try {
      // First register the user
      const res = await registerUser(data).unwrap();

      // Instead of directly saving token and redirecting to dashboard,
      // redirect to the OTP verification page with email in URL
      const email = encodeURIComponent(data.email);

      // Here we're setting a verification type parameter so OTP page knows this is for account creation
      router.push(`/login`);

      // You might want to show a success message before redirecting
      setRegistrationStatus("Account created! Please verify your email.");

      // Note: We'll store the token and user data only after OTP verification
    } catch (error) {
      console.error("Registration failed:", error);
      setRegistrationStatus("Failed to create account. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row justify-center">
      {/* Left side image */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center">
        <div className="h-auto max-h-[900px] w-full max-w-[900px] p-4">
          <Image
            src="/assests/registerImage.png"
            alt="Side Illustration"
            width={900}
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

          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-white">
            Create an account
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm mb-2 text-white">
                Name*
              </label>
              <Input
                id="name"
                placeholder="Enter your full name"
                {...register("name", { required: " Name is required" })}
                className="w-full py-6 text-black bg-white border border-[#2E2E2EF5] rounded-lg"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm mb-2 text-white">
                Email Address*
              </label>
              <Input
                id="email"
                placeholder="Enter your email address"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Please enter a valid email address",
                  },
                })}
                className="w-full py-6 text-black bg-white border border-[#2E2E2EF5] rounded-lg"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm mb-2 text-white"
              >
                Password*
              </label>
              <Input
                id="password"
                placeholder="Enter your password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must have at least 8 characters",
                  },
                })}
                className="w-full py-6 text-black bg-white border border-[#2E2E2EF5] rounded-lg"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="bg-button text-white w-full h-10 md:h-12 rounded-md my-4 md:my-6"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create account"}
            </Button>
          </form>

          {registrationStatus && (
            <p className="text-center mt-4 text-red-500">
              {registrationStatus}
            </p>
          )}

          <p className="text-sm md:text-base mt-4 text-center text-white">
            If you already have an account, please{" "}
            <Link
              className="text-white font-bold md:font-black md:text-2xl ml-1 hover:text-red-400"
              href="/login"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
