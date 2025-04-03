import { getVideoById } from "@/actions/video-action";
import VideoSection from "@/components/video/video-section";
import React from "react";

interface PageProps {
  params: Promise<{ videoId: string }>;
}

const page = async ({ params }: PageProps) => {
  const { videoId } = await params;

 
  const video = await getVideoById(videoId);
  if (!video) return;
  return (
    <div className="mx-auto mb-10 flex max-w-[1170px] flex-col px-4 pt-2.5">
      <div className="flex flex-col gap-6 xl:flex-row">
        <div className="min-w-0 flex-1">
          <VideoSection video={video} />
        </div>
      </div>
    </div>
  );
};

export default page;
