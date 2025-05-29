"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Clock,
  Flame,
  Calendar,
  DollarSign,
  Crown,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import {
  useMyProfileQuery,
  useUpdateProfileMutation,
} from "@/redux/featured/auth/authApi";
import { getImageUrl } from "../share/imageUrl";
import { toast } from "sonner";
import { useRunningPackageQuery } from "@/redux/featured/Package/packageApi";

// Subscription Card Component
const SubscriptionCard = ({ packageData, userData }) => {
  // Calculate days remaining from package data
  const calculateDaysRemaining = () => {
    if (!packageData?.currentPeriodEnd) return 0;

    const expireDate = new Date(packageData.currentPeriodEnd);
    const today = new Date();
    const diffTime = expireDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Format expiration date from package data
  const formatExpirationDate = () => {
    if (!packageData?.currentPeriodEnd) return "N/A";

    const expireDate = new Date(packageData.currentPeriodEnd);
    return expireDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format start date
  const formatStartDate = () => {
    if (!packageData?.currentPeriodStart) return "N/A";

    const startDate = new Date(packageData.currentPeriodStart);
    return startDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isActive = packageData?.status === "active";
  const packageTitle = packageData?.package?.title || "No Package";
  const packageDuration = packageData?.package?.duration || "";
  const packagePrice = packageData?.price || 0;

  return (
    <Card className="mb-6 overflow-hidden">
      <CardContent className="pt-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className={`${isActive ? "text-yellow-500" : "text-gray-400"}`}
            >
              {packageTitle === "Gold" ? (
                <Crown size={28} />
              ) : (
                <DollarSign size={28} />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg">
                {userData?.isFreeTrial ? "Free Trial Period" : packageTitle}
              </h3>
              {packageDuration && (
                <p className="text-sm text-gray-600">{packageDuration} plan</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle
              size={20}
              className={`${isActive ? "text-green-500" : "text-gray-400"}`}
            />
            <span
              className={`text-sm font-medium ${
                isActive ? "text-green-600" : "text-gray-500"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Days Remaining Section */}
          <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
            <p className="text-5xl font-bold text-red-500 mb-2">
              {calculateDaysRemaining()}
            </p>
            <p className="text-lg font-medium text-gray-700 mb-4">
              Days Remaining
            </p>

            <div className="flex items-center gap-2 text-gray-600">
              <Calendar size={18} />
              <p className="text-sm">Expires: {formatExpirationDate()}</p>
            </div>
          </div>

          {/* Package Details Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">
                Package Price
              </span>
              <span className="text-lg font-bold text-gray-800">
                ${packagePrice}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">
                Started On
              </span>
              <span className="text-sm text-gray-700">{formatStartDate()}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">
                Customer ID
              </span>
              <span className="text-sm text-gray-700 font-mono">
                {packageData?.customerId?.slice(-8) || "N/A"}
              </span>
            </div>

            <Button
              className="w-full mt-4 py-5 text-white font-medium "
              onClick={() => (window.location.href = "/subscription-package")}
            >
              Extend Subscription
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        {/* {packageData?.currentPeriodStart && packageData?.currentPeriodEnd && (
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Subscription Progress</span>
              <span>
                {Math.round(
                  ((new Date() - new Date(packageData.currentPeriodStart)) /
                    (new Date(packageData.currentPeriodEnd) -
                      new Date(packageData.currentPeriodStart))) *
                    100
                )}
                %
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(
                      0,
                      ((new Date() - new Date(packageData.currentPeriodStart)) /
                        (new Date(packageData.currentPeriodEnd) -
                          new Date(packageData.currentPeriodStart))) *
                        100
                    )
                  )}%`,
                }}
              />
            </div>
          </div>
        )} */}
      </CardContent>
    </Card>
  );
};

export default function ProfileDashboardComponents() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { data: userData, isLoading } = useMyProfileQuery();
  const [updateProfile, { isLoading: updating }] = useUpdateProfileMutation();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const { data: packageResponse } = useRunningPackageQuery();
  const packageData = packageResponse?.data;

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        address: userData.address || "",
      });
      setImagePreview(getImageUrl(userData.image));
    }
  }, [userData]);

  useEffect(() => {
    if (!imageFile) return;

    const previewUrl = URL.createObjectURL(imageFile);
    setImagePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [imageFile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        name: e.target.elements.name.value,
        email: e.target.elements.email.value,
        address: e.target.elements.address.value,
        phone: e.target.elements.phone?.value || "",
      };

      const formDataToSend = new FormData();
      formDataToSend.append("data", JSON.stringify(userData));

      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }
      const response = await updateProfile({ data: formDataToSend }).unwrap();

      if (response.success) {
        toast.success("Profile updated successfully!");
        if (response.token) {
          localStorage.setItem("accessToken", response.token);
        }
        setOpen(false);
      } else {
        toast.error(response.toast || "Failed to update profile!");
      }
    } catch (error) {
      toast.error(
        error.data?.toast || "An error occurred while updating the profile"
      );
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-60">Loading...</div>
    );

  return (
    <div className="max-w-4xl mx-auto p-10 bg-white rounded-lg border mt-6">
      <div className="flex items-center justify-center mb-8 relative">
        <div>
          <div className="flex items-center">
            <Image
              src={getImageUrl(userData?.image)}
              alt="Profile"
              height={100}
              width={100}
              className="w-24 h-24 rounded-full object-cover m-2 mx-auto"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{userData?.name}</h2>
            <p className="text-gray-600">{userData?.email}</p>
          </div>
        </div>

        {/* Edit Profile Button with Modal */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="destructive"
              className="bg-red absolute top-0 right-5"
            >
              Edit Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              {imagePreview && (
                <div className="flex justify-center mb-4">
                  <img
                    src={imagePreview}
                    alt="Selected Preview"
                    className="w-32 h-32 rounded-full object-cover border"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">
                  Profile Image
                </label>
                <Input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="py-6"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="py-6"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <Input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="py-6"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Address
                </label>
                <Input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="py-6"
                />
              </div>

              <Button type="submit" className="w-full py-6" disabled={updating}>
                {updating ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-red-500">
                <Flame size={24} />
              </div>
              <h3 className="font-medium">Streak</h3>
            </div>
            <p className="text-4xl font-bold mt-4">
              {userData?.loginCount || 0} Days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-red-500">
                <Clock size={24} />
              </div>
              <h3 className="font-medium">Yoga Sessions</h3>
            </div>
            <p className="text-4xl font-bold mt-4">
              {userData?.completedSessions?.length || 0} Session
              {userData?.completedSessions?.length !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-red-500">
                <Clock size={24} />
              </div>
              <h3 className="font-medium">Total Mat Time</h3>
            </div>
            <p className="text-4xl font-bold mt-4">
              {userData?.matTime || 0} Min
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Use the new Subscription Card Component */}
      <SubscriptionCard packageData={packageData} userData={userData} />
    </div>
  );
}
