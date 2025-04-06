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
    <div>
      <div className="border-y">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[510px] pl-6">Video</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right">Comments</TableHead>
              <TableHead className="pr-6 text-right">Likes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-pink-800">
            {videos.flatMap((video) => (
              <Link
                href={`/studio/videos/${video.id}`}
                key={video.id}
                legacyBehavior
              >
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
                      <div className="flex flex-col gap-y-1 overflow-hidden">
                        <span className="line-clamp-1 text-sm">
                          {video.title}
                        </span>
                        <span className="text-muted-foreground line-clamp-1 text-xs">
                          {video.description || "No description"}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {video.visibility === "private" ? (
                        <LockIcon className="mr-2 size-4" />
                      ) : (
                        <Globe2Icon className="mr-2 size-4" />
                      )}
                      {snakeCaseToTitle(video.visibility)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {snakeCaseToTitle(video.muxStatus || "error")}
                    </div>
                  </TableCell>
                  <TableCell className="truncate text-sm">
                    {format(new Date(video.createdAt), "d MMM yyyy")}
                  </TableCell>
                  <TableCell className="text-right text-sm">{24}</TableCell>
                  <TableCell className="text-right text-sm">{7}</TableCell>
                  <TableCell className="pr-6 text-right text-sm">
                    {10}
                  </TableCell>
                </TableRow>
              </Link>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
