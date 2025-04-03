import React from "react";
import Image from "next/image";
import { Video } from "@prisma/client";

interface VideoCardProps {
  video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  return (
    <div className="border rounded-lg p-2 shadow-md w-full max-w-sm">
      {/* Video Thumbnail */}
      <div className="relative w-full h-48 rounded-lg overflow-hidden">
        <Image
          src={video.thumbnailUrl || "/placeholder.jpg"} // Uses Next.js Image optimization
          alt={video.title}
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
      </div>

      {/* Video Details */}
      <div className="p-2">
        <h3 className="text-lg font-semibold truncate">{video.title}</h3>
        <p className="text-sm text-gray-500 truncate">{video.description}</p>

        {/* Video Metadata */}
        <div className="text-xs text-gray-400 mt-1">
          <p>Uploaded by: {video.userId}</p>
          <p>{new Date(video.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
