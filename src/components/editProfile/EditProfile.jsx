"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { getImageUrl } from "../share/imageUrl";
import ProfileIcon from "../profileIcon/ProfileIcon";

export default function ProfileWithEditModal() {
  // State for user data
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    profilePicture: "",
  });
  const [open, setOpen] = useState(false);
  console.log(user)
  // Load user data (Demo user for now)
  useEffect(() => {
    const fetchedUser = {
      name: "Md Jowel Ahmed",
      email: "jowel@example.com",
      contact: "+8801712345678",
      profilePicture: "/assests/profile.png",
    };
    setUser(fetchedUser);
    setFormData(fetchedUser);
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle profile picture selection
  const handleProfileClick = () => {
    document.getElementById("profileInput").click();
  };

  // Handle file change (for profile picture)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePicture: URL.createObjectURL(file) });
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Data:", formData);
    setUser(formData);
    setOpen(false); // Close the modal after submission
  };

  return (
    <div className="flex flex-col items-center p-8 bg-gray-100 min-h-screen">
      {/* User Profile Display */}
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col items-center">
          <div className="mb-4">
            <div className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 cursor-pointer">
              <ProfileIcon 
                image={user?.profilePicture}
                size={120}
                className="rounded-full object-cover"
                hasBorder={true}
              />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">{user?.name}</h2>
          <p className="text-gray-600 mb-1">{user?.email}</p>
          <p className="text-gray-600">{user?.contact}</p>

          {/* Edit Profile Button - Now opens a modal */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                className="mt-4 bg-red-500 hover:bg-red-600"
              >
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>

              {user ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Profile Picture */}
                  <div className="flex justify-center">
                    <div className="w-24 h-24 rounded-full border-2 border-gray-300 cursor-pointer" onClick={handleProfileClick}>
                      <ProfileIcon 
                        image={formData.profilePicture}
                        size={100}
                        className="rounded-full object-cover"
                      />
                    </div>
                  </div>
                  <input
                    type="file"
                    id="profileInput"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-medium">Name</label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Contact Number Field */}
                  <div>
                    <label className="block text-sm font-medium">
                      Contact Number
                    </label>
                    <Input
                      type="text"
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600"
                  >
                    Update Profile
                  </Button>
                </form>
              ) : (
                <p className="text-center text-gray-500">No user found!</p>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
