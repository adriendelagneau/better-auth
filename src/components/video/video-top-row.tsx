import React from "react";
import VideoOwner from "./video-owner";
import { VideoWithUser } from "@/actions/video-action";
import VideoReactions from "./video-reactions";
import VideoMenu from "./video-menu";
import VideoDescription from "./video-description";

interface VideoTopRowProps {
  video: VideoWithUser;
}

const VideoTopRow = ({ video }: VideoTopRowProps) => {


  return (
    <div className="mt-4 flex flex-col gap-4">
      <h1 className="text-xl font-semibold">{video.title}</h1>
      <div className="text-xl font-semibold">
        <div className="mb-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <VideoOwner user={video.user} videoId={video.id} />
          <div className="-mb-2 flex gap-2 overflow-x-auto pb-2 sm:mb-0 sm:min-w-[calc(50%-6px)] sm:justify-end sm:overflow-visible sm:pb-0">
            <VideoReactions video={video}/>
            <VideoMenu videoId={video.id} variant="studio" />
          </div>
        </div>
        <VideoDescription
          description={video.description}
          publshedDate={video.createdAt}
          numberOfViews={video.videoViews}
        />
      </div>
    </div>
  );
};

export default VideoTopRow;
