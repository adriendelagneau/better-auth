"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import millify from "millify";

interface VideoDescriptionProps {
  numberOfViews: number;
  publshedDate: Date;
  description?: string | null;
}

const VideoDescription = ({
  numberOfViews,
  publshedDate,
  description,
}: VideoDescriptionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const formatedDate = formatDistanceToNow(publshedDate, { addSuffix: true });
  return (
    <div
      onClick={() => setIsExpanded((current) => !current)}
      className="bg-secondary/50 hover:bg-secondary/70 cursor-pointer rounded-xl p-3 transition"
    >
      <div className="mb-2 flex gap-2 text-sm">
        <span className="font-medium">{millify(numberOfViews)} views</span>
        <span className="font-medium">{formatedDate}</span>
      </div>
      <div className="relative">
        <p
          className={cn(
            "text-sm whitespace-pre-wrap",
            !isExpanded && "line-clamp-2"
          )}
        >
          {description || "No description"}
        </p>
        <div className="mt-4 flex items-center gap-1 text-sm font-medium">
          {isExpanded ? (
            <>
              Show less <ChevronUpIcon className="size-4" />
            </>
          ) : (
            <>
              Show more <ChevronDownIcon className="size-4" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoDescription;
