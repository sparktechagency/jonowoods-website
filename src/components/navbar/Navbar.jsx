"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import { IoNotificationsOutline } from "react-icons/io5";
import { FiMenu } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Button } from "../ui/button";
import { useMyProfileQuery } from "@/redux/featured/auth/authApi";
import { getImageUrl } from "../share/imageUrl";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { data } = useMyProfileQuery()
  // console.log(data)
  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".profile-menu")) {
        setIsProfileOpen(false);
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <nav className=" text-white fixed w-full top-0 left-0 shadow-lg z-50 bg-[#fff]">
      <div className="container mx-auto flex justify-between items-center h-20 px-4">
        {/* Left: Logo */}
        <Link
          href="/"
          className="flex items-center space-x-2 text-lg font-bold"
        >
          <img src="/assests/logo.png" alt="Logo" className="w-16 h-10" />
        </Link>

        {/* Middle: Navigation Links (Hidden on mobile) */}
        <ul className="hidden md:flex space-x-6">
          {[
            { name: "Home", path: "/" },
            { name: "Favorite", path: "/favorite" },
            { name: "Explore", path: "/explore" },
            { name: "Community", path: "/community" },
          ].map((item) => (
            <li key={item.name}>
              <Link
                href={item.path}
                className={`relative pb-1 text-black transition-all duration-300 ease-in-out ${
                  pathname === item.path
                    ? "border-b-2 border-red-500 text-black"
                    : "hover:border-b-2 hover:border-red-500 text-black"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Profile Dropdown */}
        <div className="relative profile-menu">
          <button
            className="relative flex items-center space-x-2"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            {data?.image ? (
              <Image
                src={getImageUrl(data?.image)}
                height={100}
                width={100}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <FaUserCircle size={40} className="text-black" />
            )}

            {/* Name that only shows on hover */}
            <span className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 whitespace-nowrap bg-white text-black px-2 py-1 rounded shadow-md opacity-0 pointer-events-none transition-opacity duration-300 hover:opacity-100 group-hover:opacity-100">
              {data?.name || "User"}
            </span>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-60 border-2 border-[#2E2E2EF5] bg-[#fff] text-black shadow-md rounded-md">
              <ul className="py-2">
                <li>
                  <Link href="/profile-dashboard" className="block px-4 py-2">
                    Profile Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/my-feed" className="block px-4 py-2">
                    My Feed
                  </Link>
                </li>
                <li>
                  <Link href="/my-download" className="block px-4 py-2 ">
                    Download Video
                  </Link>
                </li>
                <li>
                  <button
                    className="block w-full text-left px-4 py-2 "
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  >
                    <div className="flex justify-between items-center">
                      Settings
                      <MdKeyboardArrowDown />
                    </div>
                  </button>
                  {isSettingsOpen && (
                    <ul className="pl-4">
                      <li>
                        <Link href="/contact" className="block px-4 py-2 ">
                          Contact us
                        </Link>
                      </li>
                      <li>
                        <Link href="/terms" className="block px-4 py-2 ">
                          Terms & Conditions
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/change-password"
                          className="block px-4 py-2 "
                        >
                          Change Password
                        </Link>
                      </li>
                      <li>
                        <Link href="/policy" className="block px-4 py-2 ">
                          Privacy Policy
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
                <li>
                  <Link
                    href="/login"
                    onClick={() => {
                      localStorage.removeItem("user");
                      localStorage.removeItem("token");
                    }}
                    className="block px-4 py-2 mt-10"
                  >
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="md:hidden bg-[#fff] text-black p-4 text-center space-y-3">
          {[
            { name: "Home", path: "/" },
            { name: "Favorite", path: "/favorite" },
            { name: "Explore", path: "/explore" },
            { name: "Community", path: "/community" },
          ].map((item) => (
            <li key={item.name}>
              <Link
                href={item.path}
                className="block hover:underline"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
