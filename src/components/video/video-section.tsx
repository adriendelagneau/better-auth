"use client";

import { cn } from "@/lib/utils";
import React from "react";
import VideoPlayer from "../studio/video-player";
import VideoBanner from "./video-banner";
import VideoTopRow from "./video-top-row";
import { incrementVideoView, VideoWithUser } from "@/actions/video-action";


interface VideoSectionProps {
   video: VideoWithUser;
}
const VideoSection = ({ video }: VideoSectionProps) => {
 
  const handleVideoPlay = async () => {
    try {
      // Call the server action to create a video view
      await incrementVideoView(video.id);
      console.log("Video view tracked.");
    } catch (error) {
      console.error("Error tracking video view:", error);
    }
  };
 
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
          onPlay={handleVideoPlay}
          playbackId={video.muxPlaybackId}
          thumbnailUrl={video.thumbnailUrl}
        />
      </div>
      <VideoBanner status={video.muxStatus || ""} />
      <VideoTopRow video={video} />
    </>
  );
};

export default VideoSection;
