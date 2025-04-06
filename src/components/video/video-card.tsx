import React from "react";
import Image from "next/image";
import { Video } from "@prisma/client";

interface VideoCardProps {
  video: Video;
}

const VideoCard = ({ video }: VideoCardProps) => {
  return (
    <div className="w-full max-w-sm rounded-lg border p-2 shadow-md">
      {/* Video Thumbnail */}
      <div className="relative h-48 w-full overflow-hidden rounded-lg">
        <Image
          src={video.thumbnailUrl || "/placeholder.jpg"} // Uses Next.js Image optimization
          alt={video.title}
          width={500} // Define the width explicitly
          height={300} // Define the height explicitly
          className="rounded-lg object-cover"
        />
      </div>

      {/* Video Details */}
      <div className="p-2">
        <h3 className="truncate text-lg font-semibold">{video.title}</h3>
        <p className="line-clamp-1 text-sm text-gray-500">
          {video.description}
        </p>

        {/* Video Metadata */}
        <div className="mt-1 text-xs text-gray-400">
          <p>Uploaded by: {video.userId}</p>
          <p>{new Date(video.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
