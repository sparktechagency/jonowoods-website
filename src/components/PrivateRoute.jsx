"use client";
import Spinner from "@/app/(commonLayout)/Spinner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// import Loading from "./Loading";

const PrivateRoute = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Save the current path to redirect back after login
      localStorage.setItem("redirectPath", window.location.pathname);
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, []);

  return loading ? <Spinner /> : (
    children
  );
};

export default PrivateRoute;