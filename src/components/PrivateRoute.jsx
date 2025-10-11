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



// "use client";
// import Spinner from "@/app/(commonLayout)/Spinner";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { useGetMyAccessQuery } from "@/redux/featured/Package/packageApi";

// const PrivateRoute = ({ children }) => {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);

//   // fetch access & user info (adjust hook name as you have)
//   const { data: accessData, isLoading: accessLoading, error } = useGetMyAccessQuery();

//   useEffect(() => {
//     // 1) check token first
//     const token = localStorage.getItem("token");
//     if (!token) {
//       // Save current path to redirect back after login
//       try {
//         localStorage.setItem("redirectPath", window.location.pathname);
//       } catch (e) {
//         // ignore if window not available (should be client only)
//       }
//       router.push("/login");
//       return;
//     }

//     // 2) still fetching access info -> wait
//     if (accessLoading) {
//       return;
//     }

//     // 3) handle fetch error -> treat as unauthenticated
//     if (error) {
//       console.error("Error fetching access data:", error);
//       localStorage.removeItem("token");
//       router.push("/login");
//       return;
//     }

//     // 4) if we have accessData decide
//     if (accessData) {
//       // try several common shapes for role & subscription flags
//       const role =
//         accessData?.data?.role ||
//         accessData?.role ||
//         accessData?.data?.user?.role ||
//         accessData?.user?.role ||
//         "";

//       // subscription flag might be named differently; try a few
//       const subscribed =
//         accessData?.data?.isSubscribed ??
//         accessData?.data?.subscribed ??
//         accessData?.isSubscribed ??
//         accessData?.subscribed ??
//         false;

//       // normalize role string and check admin variants
//       const roleNormalized = String(role).toLowerCase();

//       const adminRoles = new Set([
//         "admin",
//         "superadmin",
//         "super_admin",
//         "administrator",
//         "owner",
//       ]);

//       // If admin/superadmin => allow everything (no payment required)
//       if (adminRoles.has(roleNormalized)) {
//         setLoading(false);
//         return;
//       }

//       // If subscribed (paid) => allow
//       if (subscribed === true || subscribed === "true") {
//         setLoading(false);
//         return;
//       }

//       // If subscription explicitly false => redirect to subscription
//       if (subscribed === false || subscribed === "false") {
//         router.push("/subscription");
//         return;
//       }

//       // If we can't determine (fallback) - treat as not allowed (redirect to subscription)
//       router.push("/subscription");
//       return;
//     }
//   }, [router, accessData, accessLoading, error]);

//   // show spinner while we're determining access
//   if (loading || accessLoading) {
//     return <Spinner />;
//   }

//   // allowed
//   return children;
// };

// export default PrivateRoute;
