"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* 404 Number */}
        <div className="space-y-2">
          <h1 className="text-9xl font-bold text-primary opacity-20">
            404
          </h1>
          <h2 className="text-3xl font-bold text-foreground">
            Page Not Found
          </h2>
        </div>

        {/* Error Message */}
        <div className="space-y-2">
          <p className="text-muted-foreground text-lg">
            Oops! The page you're looking for doesn't exist.
          </p>
          <p className="text-muted-foreground text-sm">
            It might have been moved, deleted, or the URL might be incorrect.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button
            onClick={() => router.back()}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
          >
            Go Back
          </Button>
          <Link href="/" className="w-full sm:w-auto">
            <Button
              variant="default"
              size="lg"
              className="w-full bg-button hover:bg-primary/90"
            >
              Go to Homepage
            </Button>
          </Link>
        </div>

       
      </div>
    </div>
  );
}

