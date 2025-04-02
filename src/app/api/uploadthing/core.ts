import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";
import { z } from "zod";

import db from "@/lib/prisma";
import { getUser } from "@/lib/auth-session";


const f = createUploadthing();

export const ourFileRouter = {
  thumbnailUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .input(
      z.object({
        videoId: z.string().uuid(),
      })
    )
    .middleware(async ({ input }) => {
      // Authenticate user using Clerk
      const user = await getUser();

      if (!user) {
        throw new UploadThingError("Unauthorized");
      }

      // Check if the video exists and retrieve its thumbnailKey
      const existingVideo = await db.video.findFirst({
        where: {
          id: input.videoId,
          userId: user.id,
        },
        select: {
          thumbnailKey: true,
        },
      });

      if (!existingVideo) {
        throw new UploadThingError("NOT_FOUND");
      }

      // If the video already has a thumbnail, delete the previous one
      if (existingVideo.thumbnailKey) {
        const utapi = new UTApi();
        await utapi.deleteFiles(existingVideo.thumbnailKey);
        
        // Update video to remove old thumbnail info
        await db.video.update({
          where: { id: input.videoId },
          data: { thumbnailKey: null, thumbnailUrl: null },
        });
      }

      // Return input and user data
      return { user, ...input };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Update the video in db with new thumbnail information
      await db.video.update({
        where: { id: metadata.videoId },
        data: {
          thumbnailUrl: file.url,
          thumbnailKey: file.key,
        },
      });

      // Return the user who uploaded the file
      return { uploadedBy: metadata.user.id };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
