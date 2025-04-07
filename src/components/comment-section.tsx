"use client";

import { VideoWithUser } from "@/actions/video-action";
import CommentForm from "./video/comment-form";

interface CommentSectionProps {
  video: VideoWithUser;
}

const CommentSection = ({ video }: CommentSectionProps) => {

  return (
    <div className="mt-6">
      <div className="flex-col gap-6 flex">
        <h1>{video._count.comments} Comment {}</h1>
        <CommentForm video={video} />
      </div>
    </div>
  );
};

export default CommentSection;
