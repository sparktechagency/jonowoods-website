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
            className="relative flex cursor-pointer items-center space-x-2 group"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            {data?.image ? (
              <Image
                src={getImageUrl(data?.image)}
                height={100}
                width={100}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
              />
            ) : (
              <FaUserCircle size={40} className="text-black" />
            )}
            
            {/* Tooltip-style name that shows on hover */}
            <span className="hidden md:inline absolute left-full ml-2 top-1/2 transform -translate-y-1/2 whitespace-nowrap bg-gray-800 text-white text-sm px-2 py-1 rounded shadow-md opacity-0 pointer-events-none transition-opacity duration-300 group-hover:opacity-100">
              {data?.name || "User"}
            </span>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{data?.name || "User"}</p>
                <p className="text-xs text-gray-500 truncate">{data?.email || "user@example.com"}</p>
              </div>
              
              <Link 
                href="/profile-dashboard" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile Dashboard
              </Link>
              
              <Link 
                href="/my-feed" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                My Feed
              </Link>
              
              <Link 
                href="/my-download" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Download Video
              </Link>
              
              <div className="border-t border-gray-100"></div>
              
              <div className="relative">
                <button
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className="flex justify-between items-center cursor-pointer w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <span>Settings</span>
                  <MdKeyboardArrowDown className={`transition-transform ${isSettingsOpen ? 'transform rotate-180' : ''}`} />
                </button>
                
                {isSettingsOpen && (
                  <div className="pl-4 bg-gray-50">
                    <Link 
                      href="/contact" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Contact us
                    </Link>
                    <Link 
                      href="/terms" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Terms & Conditions
                    </Link>
                    <Link 
                      href="/change-password" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Change Password
                    </Link>
                    <Link 
                      href="/policy" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Privacy Policy
                    </Link>
                  </div>
                )}
              </div>
              
              <div className="border-t border-gray-100"></div>
              
              <Link
                href="/login"
                onClick={() => {
                  localStorage.removeItem("user");
                  localStorage.removeItem("token");
                }}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </Link>
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