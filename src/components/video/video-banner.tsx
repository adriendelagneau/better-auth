"use client";

import { AlertTriangleIcon } from "lucide-react";
import React from "react";

interface VideoBannerProps {
    status: string; // look for better type
}
const VideoBanner = ({status}: VideoBannerProps) => {

    if(status === "ready") return null;
  return (
    <div className="bg-yellow-500 py-3 px-4 ronded-b-xl flex items-center gap-2">
      <AlertTriangleIcon className="size-4 text-black shrink-0">
      <p className="text-xs md:text-sm font-medium text-black line-clamp-1">
            This video still being processed.
        </p>
      </AlertTriangleIcon>
    </div>
  );
};

export default VideoBanner;
