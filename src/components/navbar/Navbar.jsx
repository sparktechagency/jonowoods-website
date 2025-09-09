"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import {
  FaBell,
  FaUser,
  FaRss,
  FaCog,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronRight,
  FaTrash,
  FaBars,
  FaTimes,
  FaMoneyBillWave,
  FaHandHoldingUsd,
} from "react-icons/fa";
import ProfileIcon from "../profileIcon/ProfileIcon";
import {
  MdContactSupport,
  MdSecurity,
  MdPrivacyTip,
  MdDescription,
} from "react-icons/md";
import {
  useMyProfileQuery,
  useUserDeleteAccountMutation,
} from "@/redux/featured/auth/authApi";
import {
  useGetNotificationQuery,
  useReadOneNotificationMutation,
  useReadAllNotificationMutation,
} from "@/redux/featured/notification/NotificationApi";
import { deleteAccountSuccess, logout } from "@/redux/featured/auth/authSlice";
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
import { Input } from "@/components/ui/input";
import NotificationPagination from "./PaginationInNotification";
import Spinner from "@/app/(commonLayout)/Spinner";
import { toast } from "react-hot-toast";
import { useGetMyAccessQuery } from "@/redux/featured/Package/packageApi";

export default function Navbar() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const socketRef = useRef(null);
  const profileRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const { data: accessData } = useGetMyAccessQuery();
  const access = accessData?.data;
  console.log(access);

  // Constants
  const NOTIFICATIONS_PER_PAGE = 30;
  const MAX_RECONNECTION_ATTEMPTS = 5;
  const RECONNECTION_DELAY = 3000; // 3 seconds

  // Redux queries and mutations
  const { data: userData } = useMyProfileQuery();
  const {
    data: notificationData,
    isLoading,
    refetch,
  } = useGetNotificationQuery({
    page: currentPage,
    limit: NOTIFICATIONS_PER_PAGE,
  }, {
    pollingInterval: 30000, // Poll every 30 seconds
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  console.log(notificationData);

  const [readOneNotification] = useReadOneNotificationMutation();
  const [readAllNotification] = useReadAllNotificationMutation();
  const [userDeleteAccount, { isLoading: isDeleteLoading }] =
    useUserDeleteAccountMutation();

  // Calculate unread count from API response
  const unreadCount = notificationData?.data?.unreadCount || 0;
  console.log(unreadCount);

  // Improved Socket.IO setup with better error handling and reconnection
  useEffect(() => {
    if (!userData?._id) return;

    const connectSocket = () => {
      // Clean up existing connection
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      // Initialize socket connection with improved configuration
      // socketRef.current = io("http://10.10.7.62:7000", {
      socketRef.current = io("https://api.yogawithjen.life", {
        transports: ["websocket", "polling"], // Fallback to polling if websocket fails
        upgrade: true,
        rememberUpgrade: true,
        timeout: 20000, // Connection timeout
        reconnection: true,
        reconnectionAttempts: MAX_RECONNECTION_ATTEMPTS,
        reconnectionDelay: RECONNECTION_DELAY,
        reconnectionDelayMax: 10000,
        forceNew: true, // Force a new connection
        autoConnect: true,
        query: {
          userId: userData._id,
        },
      });

      const handleNewNotification = (data) => {
        console.log("New notification received:", data);
        // Force refetch to get latest notifications
        refetch();
        
        // Show toast notification if data is provided
        if (data && data.message) {
          toast.success(`New notification: ${data.message}`);
        }
      };

      // Connection event handlers
      socketRef.current.on("connect", () => {
        console.log("Socket connected successfully with ID:", socketRef.current.id);
        setIsSocketConnected(true);
        setConnectionAttempts(0);

        // Join user-specific room with confirmation
        socketRef.current.emit("join-user-room", userData._id, (response) => {
          console.log("Joined user room response:", response);
        });
        
        // Also emit join-room event as fallback
        socketRef.current.emit("join-room", userData._id);
        
        console.log(`User ${userData._id} joined notification room`);
      });

      socketRef.current.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
        setIsSocketConnected(false);

        // Don't attempt to reconnect if it was intentional
        if (reason === "io client disconnect") return;

        // Handle automatic reconnection for other disconnect reasons
        if (connectionAttempts < MAX_RECONNECTION_ATTEMPTS) {
          setConnectionAttempts((prev) => prev + 1);
          console.log(
            `Attempting to reconnect... (${
              connectionAttempts + 1
            }/${MAX_RECONNECTION_ATTEMPTS})`
          );
        }
      });

      socketRef.current.on("connect_error", (error) => {
        console.error("Socket connection error:", error.message);
        setIsSocketConnected(false);

        // Implement exponential backoff for reconnection
        if (connectionAttempts < MAX_RECONNECTION_ATTEMPTS) {
          const delay = RECONNECTION_DELAY * Math.pow(2, connectionAttempts);
          console.log(`Retrying connection in ${delay / 1000} seconds...`);

          reconnectTimeoutRef.current = setTimeout(() => {
            setConnectionAttempts((prev) => prev + 1);
            connectSocket();
          }, delay);
        } else {
          console.error(
            "Max reconnection attempts reached. Please refresh the page."
          );
        }
      });

      socketRef.current.on("reconnect", (attemptNumber) => {
        console.log(`Reconnected after ${attemptNumber} attempts`);
        setIsSocketConnected(true);
        setConnectionAttempts(0);
      });

      socketRef.current.on("reconnect_error", (error) => {
        console.error("Reconnection error:", error.message);
      });

      socketRef.current.on("reconnect_failed", () => {
        console.error("Failed to reconnect after maximum attempts");
        setIsSocketConnected(false);
      });

      // Listen for notifications with proper event names
      socketRef.current.on(
        `notification::${userData._id}`,
        handleNewNotification
      );
      
      socketRef.current.on("new-notification", handleNewNotification);
      socketRef.current.on("notification", handleNewNotification);
      socketRef.current.on(`user-${userData._id}-notification`, handleNewNotification);
    };

    // Initial connection
    connectSocket();

    // Cleanup function
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      if (socketRef.current) {
        socketRef.current.off(`notification::${userData._id}`);
        socketRef.current.off("new-notification");
        socketRef.current.off("notification");
        socketRef.current.off(`user-${userData._id}-notification`);
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      setIsSocketConnected(false);
    };
  }, [userData?._id, refetch, connectionAttempts]);

  // Enhanced account delete handler with better debugging and error handling
  const handleDeleteAccount = async () => {
    if (!deletePassword.trim()) {
      toast.error("Please enter your password");
      return;
    }

    try {
      // Call the API
      const result = await userDeleteAccount({ password: deletePassword }).unwrap();
      
      console.log("Account deletion API response:", result);
      
      // Success - update Redux state
      dispatch(deleteAccountSuccess());
      
      toast.success("Account deleted successfully");
      setDeletePassword("");
      setOpen(false);
      
      // Disconnect socket
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      
      // Clear all storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Force redirect after a brief delay
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
      
    } catch (error) {
      console.error("=== Account Deletion Error ===");
      
      // Handle specific error cases
      let errorMessage = "Failed to delete account. Please try again.";
      
      if (error?.status === 400) {
        errorMessage = "Invalid request. Please check your password.";
      } else if (error?.status === 401) {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error?.status === 403) {
        errorMessage = "You don't have permission to delete this account.";
      } else if (error?.status === 404) {
        errorMessage = "Account not found.";
      } else if (error?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      setDeletePassword("");
    }
  };

  // Update notifications state when data changes
  useEffect(() => {
    if (notificationData?.data) {
      const data = notificationData.data;
      setNotifications(data.result || []);
      setTotalPages(data.pagination?.totalPage || 1);
      setTotalNotifications(data.pagination?.total || 0);
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
    // Disconnect socket before logout
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    // Dispatch logout action
    dispatch(logout());
    
    // Clear storage
    localStorage.clear();
    sessionStorage.clear();
    
    setIsProfileOpen(false);
    window.location.href = "/login";
  };

  // Manual reconnection function
  const handleManualReconnect = () => {
    if (userData?._id) {
      setConnectionAttempts(0);
      connectSocket();
    }
  };

  // Navigation items
  const navItems = [
    { name: "Home", path: "/" },
    { name: "favorite", path: "/favorite" },
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
    {
      icon: FaHandHoldingUsd,
      label: "My Transactions",
      href: "/transaction",
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
            <Image
              src="/assests/logo.png"
              alt="Logo"
              width={100}
              height={100}
              className="w-16 h-10"
            />
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
          <div className="flex items-center space-x-2">
            {/* Login Button - Show when no user is logged in */}
            {!userData?._id ? (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors duration-200 flex items-center gap-2">
                    <FaUser size={16} />
                    Login
                  </button>
                </Link>
                {/* Mobile Menu Button for non-logged-in users */}
                <button
                  className="md:hidden text-black p-2 rounded-md hover:bg-gray-100 transition-colors"
                  onClick={() => setIsOpen(!isOpen)}
                  aria-label="Toggle mobile menu"
                >
                  {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
              </div>
            ) : (
              /* User Controls for logged-in users - Fixed alignment */
              <div className="flex items-center space-x-1">
                {/* Notification Button */}
                <div className="relative">
                  <button
                    onClick={() => setIsNotificationModalOpen(true)}
                    className="relative p-2 text-black hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center w-10 h-10"
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
                <div className="relative" ref={profileRef}>
                  <button
                    className="relative flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 group"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    aria-expanded={isProfileOpen}
                    aria-label="User profile menu"
                  >
                    <div className="relative">
                      <ProfileIcon
                        image={userData?.image}
                        size={36}
                        showBorder={true}
                        borderColor="border-gray-200"
                        hoverEffect={true}
                      />
                    </div>

                    {/* User info - hidden on mobile */}
                    <div className="hidden lg:block text-left">
                      <p className="text-sm text-gray-900">{userData?.name}</p>
                      <p className="text-xs text-gray-500">{userData?.email}</p>
                    </div>

                    <FaChevronDown
                      className={`hidden md:block w-4 h-4 text-gray-400 transition-transform duration-200 ${
                        isProfileOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Profile Modal */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-72 bg-white border border-gray-200 shadow-xl rounded-xl z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                      {/* Header */}
                      <div className="p-4 bg-primary border-gray-100">
                        <div className="flex items-center space-x-3">
                          <ProfileIcon
                            image={userData?.image}
                            size={48}
                            showBorder={true}
                            borderColor="border-white"
                            className="shadow-sm"
                          />
                          <div>
                            <h3 className="text-white">
                              {userData?.name || "User"}
                            </h3>
                            <p className="text-sm text-white">
                              {userData?.email || "user@example.com"}
                            </p>
                            {/* Connection status */}
                            <p
                              className={`text-xs ${
                                isSocketConnected
                                  ? "text-green-200"
                                  : "text-red-200"
                              }`}
                            >
                              {isSocketConnected ? "Online" : "Offline"}
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
                            <span className="text-gray-700 group-hover:text-gray-900">
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
                              <span className="text-gray-700 group-hover:text-gray-900">
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
                              
                              {/* Delete Account in Settings */}
                              <button
                                onClick={() => {
                                  setOpen(true);
                                  setIsProfileOpen(false);
                                }}
                                className="flex items-center space-x-3 px-4 py-2.5 w-full hover:bg-red-50 transition-colors duration-150 group border-t border-gray-200 mt-2 pt-2"
                              >
                                <FaTrash className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform duration-150" />
                                <span className="text-sm text-red-700 group-hover:text-red-800">
                                  Delete Account
                                </span>
                              </button>
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
                            <span className="text-red-600 group-hover:text-red-700">
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

                {/* Mobile Menu Button - Fixed alignment and positioning */}
                <button
                  className="md:hidden text-black p-2 rounded-md hover:bg-gray-100 transition-colors flex items-center justify-center w-10 h-10"
                  onClick={() => setIsOpen(!isOpen)}
                  aria-label="Toggle mobile menu"
                >
                  {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden bg-[#fff] text-black overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <ul className="p-4 text-center space-y-3">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.path}
                  className="block hover:underline transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Notification Dialog */}
      <Dialog
        open={isNotificationModalOpen}
        onOpenChange={setIsNotificationModalOpen}
      >
        <DialogContent className="w-[400px] max-w-[400px] top-96 right-4 lg:left-auto lg:transform-none max-h-[640px] overflow-hidden">
          <DialogHeader className="px- pt-4">
            <DialogTitle className="flex items-center justify-between">
              <span>Notifications </span>
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
      
      {/* Enhanced Delete Account Modal */}
      <AlertDialog open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          setDeletePassword("");
        }
      }}>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="hidden">Delete Account</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">
              Delete Your Account
            </AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-2">
                <p>This action cannot be undone. This will permanently delete your account and remove your data from our servers.</p>
                <p className="font-medium text-gray-800">Please enter your password to confirm:</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              type="password"
              placeholder="Enter your current password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className="w-full"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && deletePassword.trim() && !isDeleteLoading) {
                  handleDeleteAccount();
                }
              }}
            />
            {/* Password validation feedback */}
            {deletePassword && deletePassword.length < 3 && (
              <p className="text-sm text-amber-600 mt-1">
                Please enter your complete password
              </p>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => setDeletePassword("")}
              disabled={isDeleteLoading}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteAccount}
              disabled={isDeleteLoading || !deletePassword.trim()}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50"
            >
              {isDeleteLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Deleting...
                </div>
              ) : (
                "Delete Account"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}