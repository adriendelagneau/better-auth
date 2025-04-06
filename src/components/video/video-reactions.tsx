import React from "react";
import { Button } from "../ui/button";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";

const VideoReactions = () => {
    const viewerReaction = "like";
  return (
    <div className="flex items-center flex-none">
      <Button variant={"secondary"} className="rounded-full rounded-r-none gap-2 pr-4">
        <ThumbsUpIcon className={cn("size-5", viewerReaction === "like" ? "fill-black" : "text-gray-500")} />
        {1}
      </Button>
        <Separator orientation="vertical" className="h-7"/>
        <Button variant={"secondary"} className="rounded-full rounded-l-none pl-3">
        <ThumbsDownIcon className={cn("size-5", viewerReaction !== "like" ? "fill-black" : "text-gray-500")} />
        {1}
      </Button>
    </div>
  );
};

export default VideoReactions;
