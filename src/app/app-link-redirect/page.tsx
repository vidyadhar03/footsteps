"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function AppLinkRedirect() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const type = searchParams?.get("type") || "";
  const id = searchParams?.get("id") || "";

  const getContentMessage = () => {
    switch (type) {
      case "story":
        return id
          ? "This story is only available in the Footsteps app."
          : "You've been invited to view a story in the Footsteps app.";
      case "journey":
        return id
          ? "This journey is only available in the Footsteps app."
          : "You've been invited to view a journey in the Footsteps app.";
      case "user":
        return id
          ? "This user profile is only available in the Footsteps app."
          : "You've been invited to view a profile in the Footsteps app.";
      default:
        return "You've been invited to view content in the Footsteps app.";
    }
  };

  const getTitle = () => {
    switch (type) {
      case "story":
        return "View Story in Footsteps App";
      case "journey":
        return "View Journey in Footsteps App";
      case "user":
        return "View Profile in Footsteps App";
      default:
        return "Open Footsteps App";
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="max-w-2xl w-full text-center">
        {/* Logo/Icon */}
        <div className="mb-8 flex justify-center">
          <Image
            src="/mainIcon.png"
            alt="Footsteps Logo"
            width={120}
            height={120}
            className="rounded-3xl shadow-lg"
          />
        </div>

        {/* Main Message */}
        <h1 className="text-3xl lg:text-4xl xl:text-5xl font-black text-primary mb-6 tracking-tight">
          {getTitle()}
        </h1>

        <p className="text-lg lg:text-xl text-subtle mb-8 max-w-lg mx-auto">
          {getContentMessage()}
        </p>

        {/* Store Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <a
            href="https://play.google.com/store/apps"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-brand text-white px-8 lg:px-10 py-4 lg:py-5 rounded-full text-lg lg:text-xl font-bold transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl hover:bg-brand/90 flex items-center justify-center gap-3"
          >
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
            </svg>
            Open in Play Store
          </a>

          <a
            href="https://apps.apple.com/us/genre/ios/id36"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-brand text-white px-8 lg:px-10 py-4 lg:py-5 rounded-full text-lg lg:text-xl font-bold transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl hover:bg-brand/90 flex items-center justify-center gap-3"
          >
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
            </svg>
            Open in App Store
          </a>
        </div>

        {/* Back to Home Link */}
        <Link
          href="/"
          className="inline-block text-subtle hover:text-brand transition-colors font-medium"
        >
          ← Back to Footsteps Home
        </Link>
      </div>
    </div>
  );
}

