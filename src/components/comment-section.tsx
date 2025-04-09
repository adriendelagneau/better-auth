import { VideoWithUser } from "@/actions/video-action";
import CommentForm from "./video/comment-form";
import CommentItem from "./video/comment-item";

interface CommentSectionProps {
  video: VideoWithUser;
}

const CommentSection = ({ video }: CommentSectionProps) => {
  return (
    <div className="mt-6">
      <div className="flex flex-col gap-6">
        <h1>
          {video._count.comments} Comment {}
        </h1>
        <CommentForm video={video} />

        {video.comments.map((comment, i) => (
          <CommentItem key={i} comment={comment}/>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
