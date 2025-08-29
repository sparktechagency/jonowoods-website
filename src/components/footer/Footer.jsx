import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  return (
    <div className="flex flex-col border-t mt-12 md:mt-20">
      {/* Header */}
      <header className="container mx-auto py-10 px-4 rounded-md">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Logo and Mobile Navigation */}
          <div className="flex flex-col items-center lg:items-start w-full lg:w-auto">
            <Image
              src="/assests/logo.png"
              width={150}
              height={150}
              alt="logo"
            />

            {/* Mobile Navigation - Shows on small screens */}
            <nav className="mt-4 lg:hidden grid grid-cols-3 gap-4">
              <Link
                href="/"
                className="text-gray-800 hover:text-gray-600 text-sm"
              >
                Home
              </Link>
              <Link
                href="/community"
                className="text-gray-800 hover:text-gray-600 text-sm"
              >
                Community
              </Link>
              <Link
                href="/favorite"
                className="text-gray-800 hover:text-gray-600 text-sm"
              >
                favorite
              </Link>
              <Link
                href="/explore"
                className="text-gray-800 hover:text-gray-600 text-sm"
              >
                Explore
              </Link>
              <Link
                href="/contact"
                className="text-gray-800 hover:text-gray-600 text-sm"
              >
                Contact us
              </Link>
            </nav>
          </div>

          {/* Desktop Navigation - Shows on larger screens */}
          <nav className="hidden lg:grid grid-cols-2 gap-4 md:gap-8 lg:gap-x-12 lg:gap-y-6">
            <Link href="/" className="text-gray-800 hover:text-gray-600">
              Home
            </Link>
            <Link
              href="/community"
              className="text-gray-800 hover:text-gray-600"
            >
              Community
            </Link>
            <Link
              href="/favorite"
              className="text-gray-800 hover:text-gray-600"
            >
              favorite
            </Link>
            <Link href="/explore" className="text-gray-800 hover:text-gray-600">
              Explore
            </Link>
            <Link href="/contact" className="text-gray-800 hover:text-gray-600">
              Contact us
            </Link>
          </nav>

          {/* Mobile App Section - Stacked on mobile, side by side on larger screens */}
          <div className="w-full lg:w-auto">
            <h3 className="text-lg font-medium mb-3 text-center lg:text-left">
              Our Mobile App
            </h3>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-4">
              <Link
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-1/2 sm:mx-0 lg:w-full"
              >
                <Button
                  variant="outline"
                  className="w-full border-gray-300 items-center justify-center h-16"
                >
                  <div className="flex items-center justify-center text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      className="shrink-0 mr-2"
                    >
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                    <span className="text-center font-bold">
                      Download on the
                      <br />
                      Apple Store
                    </span>
                  </div>
                </Button>
              </Link>
              <Link
                href="https://play.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-1/2 sm:mx-0 lg:w-full"
              >
                <Button
                  variant="outline"
                  className="w-full border-gray-300 items-center justify-center h-16"
                >
                  <div className="flex items-center justify-center text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      className="shrink-0 mr-2"
                    >
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                    </svg>
                    <span className="text-center font-bold">
                      Get it on
                      <br />
                      Google Play
                    </span>
                  </div>
                </Button>
              </Link>
            </div>
          </div>

          {/* Email Signup Form - Full width on mobile, fixed width on larger screens */}
          <div className="w-full lg:w-96">
            <h3 className="text-xl lg:text-2xl font-medium mb-4 text-center lg:text-left">
              Join Our Yoga Community
            </h3>
            <div className="flex flex-col sm:flex-row">
              <Input
                type="email"
                placeholder="Your email"
                className="py-6 flex-grow md:rounded-r-none"
              />
              <Button className="h-12 mt-4 md:mt-0 bg-red md:rounded-l-none">
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Footer */}
      <footer className="py-6 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="order-2 md:order-1">
              <p className="text-sm text-gray-600 text-center md:text-left">
                © {new Date().getFullYear()} yogawebapp@gmail.com. All rights
                reserved.
              </p>
            </div>
            {/* <div className="order-1 md:order-2 flex flex-wrap justify-center gap-x-4 gap-y-2">
              <Link
                href="/terms"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Terms & Conditions
              </Link>
              <span className="text-gray-600 hidden md:inline">•</span>
              <Link
                href="/privacy"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Privacy Notice
              </Link>
            </div> */}
          </div>
        </div>
      </footer>
    </div>
  );
}
