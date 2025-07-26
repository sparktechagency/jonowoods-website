

"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input"; 
import { Button } from "@/components/ui/button"; 
import { HiEye, HiEyeOff } from "react-icons/hi"; 
import { useRouter, useSearchParams } from "next/navigation"; 
import { toast } from "sonner"; 
import { useResetPasswordMutation } from "@/redux/featured/auth/authApi";
import Image from "next/image";

export default function ResetPasswordCom() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const email = searchParams.get("email"); 
  const router = useRouter();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  useEffect(() => {
    if (!email) {
      toast.error("Email not found. Please try again.");
      router.push("/forgot-password");
    }
  }, [email, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match. Please try again.");
      setIsSubmitting(false);
      return;
    }

    const resetToken = localStorage.getItem("verifyToken");
    if (!resetToken) {
      toast.error("You are not authorized to perform this action.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await resetPassword({
        // email,
        newPassword,
        confirmPassword,
      }).unwrap();

      toast.success("Password updated successfully!");
      router.push("/login");
    } catch (error) {
      console.error("Error during password reset:", error);
      toast.error(
        error?.data?.message || "There was an error updating your password."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row justify-center">
    {/* Left side image - hidden on small devices */}
    <div className="hidden lg:flex lg:w-1/2 items-center justify-center">
      <div className="h-auto max-h-[700px] w-full max-w-[900px] p-4">
        <Image
          src="/assests/resetImage.png"
          alt="Reset password image"
          width={700}
          height={700}
          className="object-cover w-full h-full"
          priority
        />
      </div>
    </div>

    {/* Right side form - full width on small devices */}
    <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8">
      <div className="bg-[#FCFCFC3B] border-2 border-[#A92C2C] backdrop-blur-md rounded-lg p-6 md:p-8 w-full max-w-md mx-auto">
        {/* Email icon */}
        <div className="flex items-center justify-center mb-6 md:mb-10">
          <div className="flex items-center justify-center bg-white w-12 h-12 md:w-16 md:h-16 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
            >
              <path
                d="M25.6693 6.99984C25.6693 5.7165 24.6193 4.6665 23.3359 4.6665H4.66927C3.38594 4.6665 2.33594 5.7165 2.33594 6.99984M25.6693 6.99984V20.9998C25.6693 22.2832 24.6193 23.3332 23.3359 23.3332H4.66927C3.38594 23.3332 2.33594 22.2832 2.33594 20.9998V6.99984M25.6693 6.99984L14.0026 15.1665L2.33594 6.99984"
                stroke="#656565"
                strokeWidth="2.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 md:mb-4">
            Reset Password
          </h2>
          <p className="text-center mb-4 md:mb-6 text-xs md:text-sm">
            Password must have 8 characters
          </p>

          <form onSubmit={handleSubmit}>
            {/* New Password */}
            <div className="mb-4 md:mb-6">
              <label className="block text-sm font-medium mb-2">
                New Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full py-2 md:py-6 px-4 text-black bg-white border border-[#2E2E2EF5] rounded-lg"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <HiEyeOff className="text-gray-500" />
                  ) : (
                    <HiEye className="text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-4 md:mb-6">
              <label className="block text-sm font-medium mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full py-2 md:py-6 px-4 text-black bg-white border border-[#2E2E2EF5] rounded-lg"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <HiEyeOff className="text-gray-500" />
                  ) : (
                    <HiEye className="text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-10 md:h-12 bg-button mt-6 md:mt-10"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  </div>
  );
}