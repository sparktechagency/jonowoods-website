import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  return (
    <div className="flex flex-col border-t mt-6 md:mt-20 ">
      {/* Header */}
      <header className="container py-6 lg:py-10 px-4 rounded-md  max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
          {/* Logo and Mobile Navigation */}
          <div className="flex flex-col items-center lg:items-start w-full lg:w-auto">
            <Image
              src="/assests/logo.png"
              width={150}
              height={150}
              sizes="(max-width: 768px) 120px, 150px"
              alt="logo"
              quality={90}
              loading="lazy"
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
                href="https://apps.apple.com/us/app/yoga-with-jen/id6747931843"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-1/2 sm:mx-0 lg:w-full"
              >
            
                <Image
                  src="/assests/app-store.png"
                  width={180}
                  height={60}
                  sizes="(max-width: 768px) 150px, 180px"
                  alt="apple"
                  className="m-auto"
                  quality={85}
                  loading="lazy"
                />
              </Link>
              <Link
                href="https://play.google.com/store/apps/details?id=com.yoga.users"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-1/2 sm:mx-0 lg:w-full"
              >
                
                <Image
                  src="/assests/google-play.png"
                  width={180}
                  height={60}
                  sizes="(max-width: 768px) 150px, 180px"
                  alt="google-play"
                  className="m-auto"
                  quality={85}
                  loading="lazy"
                />
              </Link>
            </div>
          </div>

         
        </div>
      </header>

      {/* Footer */}
      <footer className="  py-3  lg:py-6 border-t border-gray-200">
        <div className="container  max-w-6xl mx-auto">
          <div className="flex justify-center ">
           
              <p className="text-sm text-gray-600 text-center md:text-left">
                © {new Date().getFullYear()} yogawebapp@gmail.com. All rights
                reserved.
              </p>
        
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
