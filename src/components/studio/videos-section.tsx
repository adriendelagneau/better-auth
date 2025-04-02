"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { snakeCaseToTitle } from "@/lib/utils";
import VideoThumbnail from "./video-thumbnail";
import Link from "next/link";
import { format } from "date-fns";
import { Globe2Icon, LockIcon } from "lucide-react";
import { Video } from "@prisma/client";

export const VideoSection = ({ videos }: { videos: Video[] }) => {
  return (
    <div className="border-y">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-6 w-[510px]">Video</TableHead>
            <TableHead>Visibility</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Views</TableHead>
            <TableHead className="text-right">Comments</TableHead>
            <TableHead className="text-right pr-6">Likes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {videos.map((video) => (
            <Link href={`/studio/videos/${video.id}`} key={video.id} legacyBehavior>
              <TableRow className="cursor-pointer">
                <TableCell className="pl-6">
                  <div className="flex items-center gap-4">
                    <div className="relative aspect-video w-36 shrink-0">
                      <VideoThumbnail
                        title={video.title}
                        imageUrl={video.thumbnailUrl}
                        previewUrl={video.previewUrl}
                        duration={video.duration || 0}
                      />
                    </div>
                    <div className="flex flex-col overflow-hidden gap-y-1">
                      <span className="text-sm line-clamp-1">{video.title}</span>
                      <span className="text-xs text-muted-foreground line-clamp-1">
                        {video.description || "No description"}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {video.visibility === "private" ? (
                      <LockIcon className="size-4 mr-2" />
                    ) : (
                      <Globe2Icon className="size-4 mr-2" />
                    )}
                    {snakeCaseToTitle(video.visibility)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {snakeCaseToTitle(video.muxStatus || "error")}
                  </div>
                </TableCell>
                <TableCell className="text-sm truncate">
                  {format(new Date(video.createdAt), "d MMM yyyy")}
                </TableCell>
                <TableCell className="text-right text-sm">{24}</TableCell>
                <TableCell className="text-right text-sm">{7}</TableCell>
                <TableCell className="text-right text-sm pr-6">{10}</TableCell>
              </TableRow>
            </Link>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
