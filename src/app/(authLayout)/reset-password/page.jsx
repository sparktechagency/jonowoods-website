import ResetPasswordCom from "@/components/auth/ResetPassword";
import { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
    <ResetPasswordCom />
  </Suspense>
  );
};

export default page;
