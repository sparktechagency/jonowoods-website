"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUserCircle, FaBell } from "react-icons/fa";
import { MdKeyboardArrowDown, MdClose } from "react-icons/md";
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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".profile-menu")) {
        setIsProfileOpen(false);
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
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

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Navigation items
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Favorite", path: "/favorite" },
    { name: "Explore", path: "/explore" },
    { name: "Community", path: "/community" },
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
                  className={`relative pb-1 text-black transition-all duration-300 ease-in-out ${pathname === item.path
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

            {/* Profile Dropdown */}
            <div className="relative profile-menu">
              <button
                className="relative flex items-center space-x-2"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                aria-expanded={isProfileOpen}
                aria-label="User profile"
              >
                {userData?.image ? (
                  <Image
                    src={getImageUrl(userData?.image)}
                    height={100}
                    width={100}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <FaUserCircle size={40} className="text-black" />
                )}
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-60 border-2 border-[#2E2E2EF5] bg-[#fff] text-black shadow-md rounded-md">
                  <ul className="py-2">
                    <li>
                      <Link
                        href="/profile-dashboard"
                        className="block px-4 py-2"
                      >
                        Profile Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link href="/my-feed" className="block px-4 py-2">
                        My Feed
                      </Link>
                    </li>
                    <li>
                      <button
                        className="block w-full text-left px-4 py-2"
                        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                        aria-expanded={isSettingsOpen}
                      >
                        <div className="flex justify-between items-center">
                          Settings
                          <MdKeyboardArrowDown />
                        </div>
                      </button>
                      {isSettingsOpen && (
                        <ul className="pl-4">
                          <li>
                            <Link href="/contact" className="block px-4 py-2">
                              Contact us
                            </Link>
                          </li>
                          <li>
                            <Link href="/terms" className="block px-4 py-2">
                              Terms & Conditions
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/change-password"
                              className="block px-4 py-2"
                            >
                              Change Password
                            </Link>
                          </li>
                          <li>
                            <Link href="/policy" className="block px-4 py-2">
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
        <DialogContent className="w-[400px] max-w-[400px]  top-96 right-4 lg:left-auto lg:transform-none max-h-[640px] overflow-hidden">
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