import OTPVerify from "@/components/auth/OTPVerify";
import React, { Suspense } from "react";

const OTPVerifyPage = () => {
  return (
    <div>
      <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
        <OTPVerify />
      </Suspense>
    </div>
  );
};

export default OTPVerifyPage;
