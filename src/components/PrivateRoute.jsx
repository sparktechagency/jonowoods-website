"use client";
import Spinner from "@/app/(commonLayout)/Spinner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetMyAccessQuery } from "@/redux/featured/Package/packageApi";

const PrivateRoute = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { data: accessData, isLoading: accessLoading, error } = useGetMyAccessQuery();
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      // Save the current path to redirect back after login
      localStorage.setItem("redirectPath", window.location.pathname);
      router.push("/login");
      return;
    }
    
    // Wait for the access query to complete
    if (accessLoading) {
      return; // Keep loading
    }
    
    // Handle error case
    if (error) {
      console.error("Error fetching access data:", error);
      // If there's an error, you might want to redirect to login or show an error message
      localStorage.removeItem("token"); // Clear invalid token
      router.push("/login");
      return;
    }
    
    // Now we have the access data and can make decisions
    if (accessData) {
      // const hasAccess = accessData?.data?.hasAccess;
      const subscribed=accessData?.data?.isSubscribed;
      
      // console.log("Access check:", { hasAccess, accessData });
      
      if (subscribed === false) { // Explicitly check for false
        // If user doesn't have access, redirect to subscription page
        router.push("/subscription");
      } else if ( subscribed === true) {
        router.push("/");
      }
      // If hasAccess is undefined, keep loading until we get a definitive answer
    }
  }, [router, accessData, accessLoading, error]);
  
  // Show loading while checking token, access, or if access data is still undefined
  if (accessLoading) {
    return <Spinner />;
  }
  
  return children;
};

export default PrivateRoute;