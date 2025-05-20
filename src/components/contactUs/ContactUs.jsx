"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useContactUsMutation } from "@/redux/featured/contact/contactUsApi";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [contactUs, { isLoading }] = useContactUsMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
    };

    try {
      const result = await contactUs(payload).unwrap();
      toast.success("Message sent successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send message.");
    }
  };

  return (
    <Card className="w-full max-w-5xl mx-auto border border-gray-200 shadow-sm rounded-lg my-10">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold flex items-center">
            <span className="mr-2 text-gray-700">♦</span> Get In Touch
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Unleash a range of possibilities enriches life, blending vigor with
            balance. The result is a lifestyle that's not only dynamic but also
            deeply rewarding.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="rounded-md py-7"
            />
            <Input
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="rounded-md py-7"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="email"
              type="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="rounded-md py-7"
            />
            <Input
              name="phone"
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="rounded-md py-7"
            />
          </div>

          <Input
            name="subject"
            placeholder="Write Your Subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="rounded-md py-7"
          />

          <Textarea
            name="message"
            placeholder="Write Your Message"
            value={formData.message}
            onChange={handleChange}
            required
            className="min-h-32 rounded-md py-7"
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red text-white rounded-md py-7 mt-10"
          >
            {isLoading ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
