"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForgotPasswordMutation } from "@/redux/featured/auth/authApi";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgetPassword, { isLoading, error }] = useForgotPasswordMutation();
  const router = useRouter();

  // Handle form submission
  const handleSubmit =async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Start submission

    try {
      // Call the API to send an OTP for password reset
      const response = await forgetPassword({ email });
      console.log(response)

      if (response?.data?.success) {
        // Redirect to the verify-otp page and pass email as a query parameter
        router.push(
          `/otp-verify?email=${encodeURIComponent(
            email
          )}&type=password-reset`
        );
      } else {
        console.error("Error during password reset request:", response?.error);
        toast.error(response?.error?.data?.message || "An error occurred. Please try again.");
      }
    } catch (err) {
      console.error("Error during password reset request:", err);
      toast.error(err?.data?.message || "An error occurred. Please try again.");

    } finally {
      setIsSubmitting(false); // End submission
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row justify-center">
      {/* Left side image - hidden on small devices */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center">
        <div className="h-auto max-h-[700px] w-full max-w-[700px] p-4">
          <Image
            src="/assests/forgotImage.png"
            alt="forgotten page image"
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
              Forgot Password
            </h2>
            <p className="text-center mb-4 md:mb-6 text-sm md:text-base">
              No worries, we'll send you reset instructions.
            </p>

            <form onSubmit={handleSubmit}>
              {/* Email Input */}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  <span className="">*</span> Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-2 md:py-6 px-4 rounded-lg text-black bg-white"
                  required
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-10 md:h-12 bg-button mt-4 md:mt-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending OTP..." : "Send OTP"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
