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
  Upload,
  User,
} from "lucide-react";
import Image from "next/image";
import { useMyProfileQuery, useUpdateProfileMutation } from "@/redux/featured/auth/authApi";
import ProfileIcon from "./ProfileIcon";
import { getImageUrl } from "../share/imageUrl";
import { toast } from "sonner";
import { useRunningPackageQuery } from "@/redux/featured/Package/packageApi";
import Spinner from "../../app/(commonLayout)/Spinner";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { isValidPhoneNumber } from 'react-phone-number-input';

// Subscription Card Component
const SubscriptionCard = ({ packageData, userData }) => {
  const calculateDaysRemaining = () => {
    if (!packageData?.currentPeriodEnd) return 0;

    const expireDate = new Date(packageData.currentPeriodEnd);
    const today = new Date();
    const diffTime = expireDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const formatExpirationDate = () => {
    if (!packageData?.currentPeriodEnd) return "N/A";

    const expireDate = new Date(packageData.currentPeriodEnd);
    return expireDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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
    <Card className="mb-6 overflow-hidden border border-gray-200 shadow-sm">
      <CardContent className="pt-6">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
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

          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-sm font-medium text-gray-600">
                Package Price
              </span>
              <span className="text-lg font-bold text-gray-800">
                ${packagePrice}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-sm font-medium text-gray-600">
                Started On
              </span>
              <span className="text-sm text-gray-700">{formatStartDate()}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-sm font-medium text-gray-600">
                Customer ID
              </span>
              <span className="text-sm text-gray-700 font-mono">
                {packageData?.customerId?.slice(-8) || "N/A"}
              </span>
            </div>

            <Button
              className="w-full mt-4 py-5 bg-red-600 hover:bg-red-700 text-white font-medium transition-colors duration-200"
              onClick={() => (window.location.href = "/subscription-package")}
            >
              Extend Subscription
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function ProfileDashboardComponents() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { data: userData, isLoading, refetch } = useMyProfileQuery();
  const [updateProfile, { isLoading: updating }] = useUpdateProfileMutation();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [phoneError, setPhoneError] = useState("");
  console.log(userData);
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

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phone: value || "" });
    
    // Validate phone number
    if (value) {
      if (!isValidPhoneNumber(value)) {
        setPhoneError("Invalid phone number for selected country");
      } else {
        setPhoneError("");
      }
    } else {
      setPhoneError("");
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if phone is valid before submitting
    if (formData.phone && !isValidPhoneNumber(formData.phone)) {
      setPhoneError("Please enter a valid phone number for the selected country");
      return;
    }
    
    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        address: formData.address,
        phone: formData.phone,
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
        // Refetch profile data to update UI immediately
        refetch();
        setOpen(false);
        // Reset image file state
        setImageFile(null);
      } else {
        toast.error(response.toast || "Failed to update profile!");
      }
    } catch (error) {
      toast.error(
        error.data?.toast || "An error occurred while updating the profile"
      );
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 bg-white rounded-xl border border-gray-200 shadow-sm mt-6">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6 relative">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative group">
            <ProfileIcon 
              image={userData?.image}
              size={112} /* 28*4 */
              showBorder={true}
              borderColor="border-white"
              className="shadow-md"
            />
            {/* {!imagePreview && (
              <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <User className="text-white" size={24} />
              </div>
            )} */}
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800">
              {userData?.name}
            </h2>
            <p className="text-gray-600">{userData?.email}</p>
            <p className="text-gray-500 mt-1">{userData?.phone}</p>
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 shadow-sm"
            >
              Edit Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-800">
                Edit Profile
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col items-center">
                <label
                  htmlFor="image-upload"
                  className="relative cursor-pointer group"
                >
                  <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-100">
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Profile Preview"
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-gray-400">
                        <Upload size={24} className="mb-2" />
                        <span className="text-sm">Upload Image</span>
                      </div>
                    )}
                  </div>
                  {/* <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Upload className="text-white" size={20} />
                  </div> */}
                </label>
                <input
                  id="image-upload"
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Click to upload profile picture
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="py-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="py-3  cursor-not-allowed"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <PhoneInput
                    international
                    defaultCountry="US"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className={`w-full border rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                      phoneError ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {phoneError && (
                    <p className="text-sm text-red-500 mt-1">{phoneError}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <Input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="py-3"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-medium transition-colors duration-200"
                disabled={updating || (formData.phone && phoneError)}
              >
                {updating ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-red-500">
                <Flame size={24} />
              </div>
              <h3 className="font-medium text-gray-700">Streak</h3>
            </div>
            <p className="text-4xl font-bold mt-4 text-gray-800">
              {userData?.loginCount || 0} Days
            </p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-red-500">
                <Clock size={24} />
              </div>
              <h3 className="font-medium text-gray-700">Yoga Sessions</h3>
            </div>
            <p className="text-4xl font-bold mt-4 text-gray-800">
              {userData?.completedSessions?.length || 0} Session
              {userData?.completedSessions?.length !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-red-500">
                <Clock size={24} />
              </div>
              <h3 className="font-medium text-gray-700">Total Mat Time</h3>
            </div>
            <p className="text-4xl font-bold mt-4 text-gray-800">
              {userData?.matTime || 0} Min
            </p>
          </CardContent>
        </Card>
      </div>

      <SubscriptionCard packageData={packageData} userData={userData} />
    </div>
  );
}
