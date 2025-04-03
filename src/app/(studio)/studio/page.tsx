import { getUserVideos } from "@/actions/video-action";
import { VideoSection } from "@/components/studio/videos-section";
import React from "react";

const StudioPage = async () => {
  const videos = await getUserVideos();
  return (
    <div>
      <VideoSection videos={videos} />
    </div>
  );
};

export default StudioPage;
