import { getUserVideos } from "@/actions/video-action";
import { VideoSection } from "@/components/studio/videos-section";
import React from "react";

const StudioPage = async () => {
  const videos = await getUserVideos();
  return (
    <div className="flex flex-col gap-y-6 pt-2.5">
    <div className="px-4">
      <h1 className="text-2xl font-bold">Channel content</h1>
      <p className="text-xs text-muted-foreground">Manage your channel content and videos</p>
    </div>
      <VideoSection videos={videos} />
    </div>
  );
};

export default StudioPage;
