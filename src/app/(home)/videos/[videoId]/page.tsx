import { getVideoById } from "@/actions/video-action";
import CommentSection from "@/components/comment-section";
import SuggestionSection from "@/components/suggestion-section";
import VideoSection from "@/components/video/video-section";

import React from "react";

interface PageProps {
  params: Promise<{ videoId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { videoId } = await params; // ✅ No need to await

  const video = await getVideoById(videoId);
  if (!video) return null;
  



  return (
    <>

    <div className="mx-auto mb-10 flex max-w-[1170px] flex-col px-4 pt-2.5">
      <div className="flex flex-col gap-6 xl:flex-row">
        <div className="min-w-0 flex-1">
          <VideoSection video={video} />
          <div className="xl:hidden block mt-4">
            <SuggestionSection/>
          </div>
          <CommentSection video={video}/>
        </div>
        <div className="hidden xl:block w-full xl:w-[380px] 2xl:w-[460px] shrink-1">
          <SuggestionSection/>
        </div>
      </div>
    </div>
    </>
  );
};

export default Page;
