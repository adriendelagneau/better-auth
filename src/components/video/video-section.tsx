"use client";

import { cn } from "@/lib/utils";
import { Video } from "@prisma/client";
import React from "react";
import VideoPlayer from "../studio/video-player";
import VideoBanner from "./video-banner";

interface VideoSectionProps {
  video: Video;
}
const VideoSection = ({ video }: VideoSectionProps) => {
  
  return (
    <>
    <div
      className={cn(
          "relative aspect-video overflow-hidden rounded-xl bg-black",
          video.muxStatus !== "ready" && "rounded-b-none"
        )}
        >
      <VideoPlayer
        autoPlay
        onPlay={() => {}}
        playbackId={video.muxPlaybackId}
        thumbnailUrl={video.thumbnailUrl}
        />
    </div>
      <VideoBanner status={"waiting"}/>
        </>
  );
};

export default VideoSection;
