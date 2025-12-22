"use client";
import Spinner from "@/app/(commonLayout)/Spinner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetMyAccessQuery } from "@/redux/featured/Package/packageApi";

const PrivateRoute = ({ children }) => {
  const router = useRouter();
  
  // Helper to check if token is valid
  const checkToken = () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      return token && token !== "undefined" && token !== "null";
    }
    return false;
  };
  
  // State to track token - will be updated when token changes
  const [hasToken, setHasToken] = useState(checkToken());
  
  // Update token state periodically to catch login updates
  useEffect(() => {
    const updateTokenState = () => {
      const currentHasToken = checkToken();
      if (currentHasToken !== hasToken) {
        setHasToken(currentHasToken);
      }
    };
    
    // Check immediately
    updateTokenState();
    
    // Check after a short delay to catch token updates from login
    const timeout = setTimeout(updateTokenState, 300);
    
    return () => clearTimeout(timeout);
  }, [hasToken]);
  
  // Skip the query if there's no token - RTK Query will auto-refetch when skip changes from true to false
  const { data: accessData, isLoading: accessLoading, error, refetch } = useGetMyAccessQuery(
    undefined,
    { skip: !hasToken }
  );
  
  // Refetch when token becomes available
  useEffect(() => {
    if (hasToken && !accessData && !accessLoading) {
      refetch();
    }
  }, [hasToken, accessData, accessLoading, refetch]);
  
  useEffect(() => {
    if (!hasToken) {
      // Save the current path to redirect back after login
      if (typeof window !== "undefined") {
        localStorage.setItem("redirectPath", window.location.pathname);
      }
      router.push("/login");
      return;
    }
    
    // Wait for the access query to complete
    if (accessLoading) {
      return; // Keep loading
    }
    
    // Handle error case
    if (error) {
      const status = error?.status;
      if (status === 401 || status === 403) {
        localStorage.removeItem("token");
        setHasToken(false);
        router.push("/login");
        return;
      }
      return;
    }
    
    // Now we have the access data and can make decisions
    if (accessData) {
      // const hasAccess = accessData?.data?.hasAccess;
      const subscribed = accessData?.data?.isSubscribed;
      
      // console.log("Access check:", { hasAccess, accessData });
      
      if (subscribed === false) { // Explicitly check for false
        // If user doesn't have access, redirect to subscription page
        router.push("/subscription");
      }
      // Remove the else if condition that was redirecting to home page
      // This allows users to stay on their current page after reload
      // If hasAccess is undefined, keep loading until we get a definitive answer
    }
  }, [router, accessData, accessLoading, error, hasToken]);
  
  // Show loading while checking token, access, or if access data is still undefined
  if (!hasToken || accessLoading) {
    return <Spinner />;
  }
  
  return children;
};

export default PrivateRoute;



