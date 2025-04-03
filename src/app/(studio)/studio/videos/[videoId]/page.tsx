import { GetCategory } from "@/actions/caterogy-action";
import { getVideoById } from "@/actions/video-action";
import VideoView from "@/components/studio/video-view";
import React from "react";

interface SingleVideoProps {
  params: Promise<{ videoId: string }>;
}


const SingleVideoPage = async ({ params }: SingleVideoProps) => {

  const { videoId } = await params;

  const video = await getVideoById(videoId);
  const categories = await GetCategory();

  if (!video) {
    return <p>Video not found</p>;
  }

  return (
    <div className="p-3">
      <VideoView video={video} categories={categories}/>
    </div>
  );
};

export default SingleVideoPage;

