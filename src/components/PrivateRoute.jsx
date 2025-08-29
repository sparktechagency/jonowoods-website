"use client";
import Spinner from "@/app/(commonLayout)/Spinner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetMyAccessQuery } from "@/redux/featured/Package/packageApi";

const PrivateRoute = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { data: accessData, isLoading: accessLoading } = useGetMyAccessQuery();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Save the current path to redirect back after login
      localStorage.setItem("redirectPath", window.location.pathname);
      router.push("/login");
      return;
    }

    // Wait for access data to load
    if (!accessLoading && accessData) {
      const hasAccess = accessData?.data?.hasAccess;
      
      if (!hasAccess) {
        // If user doesn't have access, redirect to subscription page
        router.push("/subscription");
      } else {
        setLoading(false);
      }
    }
  }, [router, accessData, accessLoading]);

  // Show loading while checking token or access
  if (loading || accessLoading) {
    return <Spinner />;
  }

  return children;
};

export default PrivateRoute;