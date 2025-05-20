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
import { Clock, Flame, Calendar, DollarSign } from "lucide-react";
import Image from "next/image";
import {
  useMyProfileQuery,
  useUpdateProfileMutation,
} from "@/redux/featured/auth/authApi";
import { getImageUrl } from "../share/imageUrl";
import { toast } from "sonner";

export default function ProfileDashboardComponents() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // preview URL state
  const { data: userData, isLoading } = useMyProfileQuery();
  const [updateProfile, { isLoading: updating }] = useUpdateProfileMutation();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        address: userData.address || "",
      });
      setImagePreview(getImageUrl(userData.image)); // initial preview to current user image
    }
  }, [userData]);

  // Create preview URL when imageFile changes
  useEffect(() => {
    if (!imageFile) return;

    const previewUrl = URL.createObjectURL(imageFile);
    setImagePreview(previewUrl);

    // Cleanup preview URL to avoid memory leaks
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

  // Calculate days remaining in trial
  const calculateDaysRemaining = () => {
    if (!userData?.trialExpireAt) return 0;

    const expireDate = new Date(userData.trialExpireAt);
    const today = new Date();
    const diffTime = expireDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Format expiration date nicely
  const formatExpirationDate = () => {
    if (!userData?.trialExpireAt) return "N/A";

    const expireDate = new Date(userData.trialExpireAt);
    return expireDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
              {/* Image Preview */}
              {imagePreview && (
                <div className="flex justify-center mb-4">
                  <img
                    src={imagePreview}
                    alt="Selected Preview"
                    className="w-32 h-32 rounded-full object-cover border"
                  />
                </div>
              )}

              {/* Profile Image Input */}
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

              {/* Name Input */}
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

              {/* Email Input */}
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

              {/* Phone Input */}
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

              {/* Address Input */}
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

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600 py-6"
                disabled={updating}
              >
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

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-red-500">
              <DollarSign size={24} />
            </div>
            <h3 className="font-medium">
              {userData?.isFreeTrial
                ? "Free Trial Period"
                : userData?.packageName || "No Active Plan"}
            </h3>
          </div>

          <div className="flex flex-col items-center justify-center py-4">
            <p className="text-6xl font-bold text-red-500 mb-4">
              {calculateDaysRemaining()}
            </p>
            <p className="text-xl mb-4">Days Remaining</p>

            <div className="flex items-center gap-2">
              <Calendar className="text-gray-700" size={20} />
              <p className="text-lg">Expires On {formatExpirationDate()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
