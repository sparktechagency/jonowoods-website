"use client";
import { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [allNotifications, setAllNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [socket, setSocket] = useState(null);
  const { data } = useMyProfileQuery();

  // Redux queries and mutations
  const NOTIFICATIONS_PER_PAGE = 10; // Changed from 15 to 10

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

  // Calculate unread count from all notifications
  const unreadCount = allNotifications.filter((n) => !n.read).length;

  useEffect(() => {
    // Initialize Socket.IO connection
    const newSocket = io("http://10.0.60.126:6002", {
      transports: ["websocket"],
    });

    setSocket(newSocket);

    // Listen for new notifications
    newSocket.on("notification", (notification) => {
      setAllNotifications((prev) => [notification, ...prev]);
      // Refetch to get updated data
      refetch();
    });

    return () => {
      newSocket.disconnect();
    };
  }, [refetch]);

  // Update local notifications when Redux data changes
  useEffect(() => {
    if (notificationData?.data?.result) {
      const result = notificationData.data.result;

      // Set current page notifications
      setNotifications(result.result || []);

      // Set pagination info
      setTotalPages(result.totalPages || 1);
      setTotalNotifications(result.totalCount || 0);

      // Update all notifications for unread count (fetch all if needed)
      if (currentPage === 1) {
        setAllNotifications(result.result || []);
      }
    }
  }, [notificationData, currentPage]);

  // Fetch all notifications for unread count
  const { data: allNotificationData } = useGetNotificationQuery({
    page: 1,
    limit: 1000, // Large number to get all notifications for unread count
  });

  useEffect(() => {
    if (allNotificationData?.data?.result?.result) {
      setAllNotifications(allNotificationData.data.result.result);
    }
  }, [allNotificationData]);

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

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await readOneNotification(notificationId).unwrap();

      // Update local state
      setAllNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );

      // Refetch to sync with server
      refetch();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await readAllNotification().unwrap();

      // Update local state
      setAllNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true }))
      );
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true }))
      );

      // Refetch to sync with server
      refetch();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const handleNotificationClick = () => {
    setIsNotificationModalOpen(true);
    setCurrentPage(1); // Reset to first page
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <>
      <nav className="text-white fixed w-full top-0 left-0 shadow-lg z-50 bg-[#fff]">
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

          {/* Right side: Notification and Profile */}
          <div className="flex items-center space-x-4">
            {/* Notification Icon */}
            <div className="relative">
              <button
                onClick={handleNotificationClick}
                className="relative p-2 text-black hover:bg-gray-100 rounded-full transition-colors"
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

      {/* Notification Modal - Positioned below notification button */}
      <Dialog
        open={isNotificationModalOpen}
        onOpenChange={setIsNotificationModalOpen}
      >
        <DialogContent className="max-w-md w-[400px] fixed top-20 right-4 left-auto transform-none max-h-[80vh]">
          <DialogHeader>
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
                <button
                  onClick={() => setIsNotificationModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <MdClose size={24} />
                </button>
              </div>
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-3">
              {notifications.length === 0 && !isLoading ? (
                <div className="text-center py-8 text-gray-500">
                  No notifications yet
                </div>
              ) : isLoading ? (
                <div className="text-center py-8 text-gray-500">
                  Loading notifications...
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
            <div className="flex items-center justify-center space-x-2 mt-4 pt-4 border-t">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-2"
              >
                Previous
              </Button>

              <div className="flex space-x-1">
                {getPageNumbers().map((page, index) => (
                  <span key={index}>
                    {page === "..." ? (
                      <span className="px-2 py-1 text-gray-500">...</span>
                    ) : (
                      <Button
                        size="sm"
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => handlePageChange(page)}
                        className="px-2 py-1 min-w-[32px]"
                      >
                        {page}
                      </Button>
                    )}
                  </span>
                ))}
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-2"
              >
                Next
              </Button>
            </div>
          )}

          {/* Page info */}
          {totalPages > 1 && (
            <div className="text-center text-xs text-gray-500 mt-2">
              Page {currentPage} of {totalPages}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
