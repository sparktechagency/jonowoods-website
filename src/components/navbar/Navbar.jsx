"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaUserCircle,
  FaBell,
  FaUser,
  FaRss,
  FaCog,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import {
  MdContactSupport,
  MdSecurity,
  MdPrivacyTip,
  MdDescription,
} from "react-icons/md";
import { useMyProfileQuery } from "@/redux/featured/auth/authApi";
import {
  useGetNotificationQuery,
  useReadOneNotificationMutation,
  useReadAllNotificationMutation,
} from "@/redux/featured/notification/NotificationApi";
import { getImageUrl } from "../share/imageUrl";
import Image from "next/image";
import io from "socket.io-client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import NotificationPagination from "./PaginationInNotification";
import Spinner from "@/app/(commonLayout)/Spinner";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const socketRef = useRef(null);
  const profileRef = useRef(null);

  // Constants
  const NOTIFICATIONS_PER_PAGE = 30;

  // Redux queries and mutations
  const { data: userData } = useMyProfileQuery();
  const {
    data: notificationData,
    isLoading,
    refetch,
  } = useGetNotificationQuery({
    page: currentPage,
    limit: NOTIFICATIONS_PER_PAGE,
  });

  const [readOneNotification] = useReadOneNotificationMutation();
  const [readAllNotification] = useReadAllNotificationMutation();

  // Calculate unread count from API response
  const unreadCount = notificationData?.data?.result?.unreadCount || 0;

  // Socket.IO setup for real-time notifications
  useEffect(() => {
    if (!userData?._id) return;

    // Initialize socket connection
    socketRef.current = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://10.0.60.126:6002"
    );

    const handleNewNotification = () => {
      refetch();
    };

    socketRef.current.on("connect", () => {
      console.log("Socket connected");
    });

    socketRef.current.on(
      `notification::${userData._id}`,
      handleNewNotification
    );

    socketRef.current.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off(
          `notification::${userData._id}`,
          handleNewNotification
        );
        socketRef.current.disconnect();
      }
    };
  }, [userData?._id, refetch]);

  // Update notifications state when data changes
  useEffect(() => {
    if (notificationData?.data?.result) {
      const result = notificationData.data.result;
      setNotifications(result.result || []);
      setTotalPages(result.meta?.totalPage || 1);
      setTotalNotifications(result.meta?.total || 0);
    }
  }, [notificationData]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Helper functions
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await readOneNotification(notificationId).unwrap();
      refetch();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await readAllNotification().unwrap();
      refetch();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setIsProfileOpen(false);
    window.location.href = "/login";
  };

  // Navigation items
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Favorite", path: "/favorite" },
    { name: "Explore", path: "/explore" },
    { name: "Community", path: "/community" },
  ];

  // Profile menu items with icons
  const profileMenuItems = [
    {
      icon: FaUser,
      label: "Profile Dashboard",
      href: "/profile-dashboard",
      color: "text-blue-600",
    },
    {
      icon: FaRss,
      label: "My Feed",
      href: "/my-feed",
      color: "text-green-600",
    },
  ];

  const settingsItems = [
    {
      icon: MdContactSupport,
      label: "Contact us",
      href: "/contact",
    },
    {
      icon: MdDescription,
      label: "Terms & Conditions",
      href: "/terms",
    },
    {
      icon: MdSecurity,
      label: "Change Password",
      href: "/change-password",
    },
    {
      icon: MdPrivacyTip,
      label: "Privacy Policy",
      href: "/policy",
    },
  ];

  return (
    <>
      <nav className="text-white fixed w-full top-0 left-0 shadow-lg z-50 bg-[#fff]">
        <div className="container mx-auto flex justify-between items-center h-20 px-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 text-lg font-bold"
          >
            <img src="/assests/logo.png" alt="Logo" className="w-16 h-10" />
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex space-x-6">
            {navItems.map((item) => (
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

          {/* User Controls */}
          <div className="flex items-center space-x-4">
            {/* Notification Button */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationModalOpen(true)}
                className="relative p-2 text-black hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Notifications"
              >
                <FaBell size={20} />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center rounded-full p-0">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </Badge>
                )}
              </button>
            </div>

            {/* Profile Dropdown - Updated Design */}
            <div className="relative" ref={profileRef}>
              <button
                className="relative flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 group"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                aria-expanded={isProfileOpen}
                aria-label="User profile menu"
              >
                <div className="relative">
                  {userData?.image ? (
                    <Image
                      src={getImageUrl(userData?.image)}
                      height={40}
                      width={40}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 group-hover:border-blue-400 transition-colors duration-200"
                    />
                  ) : (
                    <FaUserCircle
                      size={40}
                      className="text-gray-600 group-hover:text-blue-600 transition-colors duration-200"
                    />
                  )}
                  {/* Online indicator */}
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>

                {/* User info - hidden on mobile */}
                <div className="hidden lg:block text-left">
                  <p className="text-sm  text-gray-900">
                    {userData?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {userData?.email || "user@example.com"}
                  </p>
                </div>

                <FaChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Modal - Updated Design */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white border border-gray-200 shadow-xl rounded-xl z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                  {/* Header */}
                  <div className="p-4 bg-primary  border-gray-100">
                    <div className="flex items-center space-x-3">
                      {userData?.image ? (
                        <Image
                          src={getImageUrl(userData?.image)}
                          height={48}
                          width={48}
                          alt="Profile"
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                      ) : (
                        <FaUserCircle size={48} className="text-gray-600" />
                      )}
                      <div>
                        <h3 className=" text-white">
                          {userData?.name || "User"}
                        </h3>
                        <p className="text-sm text-white">
                          {userData?.email || "user@example.com"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    {profileMenuItems.map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-150 group"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <item.icon
                          className={`w-5 h-5 ${item.color} group-hover:scale-110 transition-transform duration-150`}
                        />
                        <span className="text-gray-700 group-hover:text-gray-900 ">
                          {item.label}
                        </span>
                      </Link>
                    ))}

                    {/* Settings Dropdown */}
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50 transition-colors duration-150 group"
                        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                        aria-expanded={isSettingsOpen}
                      >
                        <div className="flex items-center space-x-3">
                          <FaCog className="w-5 h-5 text-gray-600 group-hover:text-blue-600 group-hover:rotate-90 transition-all duration-200" />
                          <span className="text-gray-700 group-hover:text-gray-900 ">
                            Settings
                          </span>
                        </div>
                        <FaChevronRight
                          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                            isSettingsOpen ? "rotate-90" : ""
                          }`}
                        />
                      </button>

                      {/* Settings Submenu */}
                      {isSettingsOpen && (
                        <div className="bg-gray-50 border-l-2 border-blue-200 ml-4">
                          {settingsItems.map((item, index) => (
                            <Link
                              key={index}
                              href={item.href}
                              className="flex items-center space-x-3 px-4 py-2.5 hover:bg-white transition-colors duration-150 group"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              <item.icon className="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors duration-150" />
                              <span className="text-sm text-gray-600 group-hover:text-gray-800">
                                {item.label}
                              </span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-3 w-full hover:bg-red-50 transition-colors duration-150 group"
                      >
                        <FaSignOutAlt className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform duration-150" />
                        <span className="text-red-600 group-hover:text-red-700 ">
                          Logout
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                    <p className="text-xs text-gray-500 text-center">
                      Last login: Today
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <ul className="md:hidden bg-[#fff] text-black p-4 text-center space-y-3">
            {navItems.map((item) => (
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

      {/* Notification Dialog */}
      <Dialog
        open={isNotificationModalOpen}
        onOpenChange={setIsNotificationModalOpen}
      >
        <DialogContent className="w-[400px] max-w-[400px] top-96 right-4 lg:left-auto lg:transform-none max-h-[640px] overflow-hidden">
          <DialogHeader className="px- pt-4">
            <DialogTitle className="flex items-center justify-between">
              <span>Notifications ({totalNotifications})</span>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    Mark All Read
                  </Button>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col h-[calc(630px-120px)]">
            <ScrollArea className="flex-1 pr-4 overflow-y-auto">
              <div className="space-y-3">
                {notifications.length === 0 && !isLoading ? (
                  <div className="text-center py-8 text-gray-500">
                    No notifications yet
                  </div>
                ) : isLoading ? (
                  <div className="text-center py-8 text-gray-500">
                    <Spinner />
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`p-4 rounded-lg border transition-colors ${
                        notification.read
                          ? "bg-gray-50 border-gray-200"
                          : "bg-blue-50 border-blue-200"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-sm text-gray-800 mb-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(notification.createdAt)}
                          </p>
                        </div>
                        {!notification.read && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => markAsRead(notification._id)}
                            className="ml-2 text-xs"
                          >
                            Mark as Read
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 pt-4 border-t">
                <NotificationPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
