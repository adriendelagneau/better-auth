"use server";

import { getUser } from "@/lib/auth-session";
import db from "@/lib/prisma";

import Mux from "@mux/mux-node";
import { Video } from "@prisma/client";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function createVideo() {
  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const userId = user.id;

  try {
    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        passthrough: userId,
        playback_policy: ["public"],
        input: [{ generated_subtitles: [{ language_code: "en", name: "English" }] }],
      },
      cors_origin: "*", // In production, set this to your domain
    });

    const video = await db.video.create({
      data: {
        userId,
        title: "Untitled",
        muxStatus: "waiting",
        muxUploadId: upload.id,
      },
    });

    return { video, url: upload.url };
  } catch (error) {
    console.error("Error creating video:", error);
    throw new Error("Failed to create video");
  }
}



export async function getVideos(): Promise<Video[]> {
  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  try {
    const videos = await db.video.findMany({
      where: { userId: user.id }, // Fetch only the logged-in user's videos
      orderBy: { createdAt: "desc" }, // Sort by latest videos first
    });

    return videos;
  } catch (error) {
    console.error("Error fetching videos:", error);
    throw new Error("Failed to fetch videos");
  }
}


export async function getVideoById(videoId: string): Promise<Video | null> {
  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  try {
    const video = await db.video.findUnique({
      where: { id: videoId, userId: user.id }, // Ensure the user owns the video
    });

    if (!video) {
      throw new Error("Video not found");
    }

    return video;
  } catch (error) {
    console.error("Error fetching video:", error);
    throw new Error("Failed to fetch video");
  }
}

// ✅ Update Video
export async function updateVideo(
  videoId: string,
  data: {
    title: string;
    description: string;
    visibility: "public" | "private";
    categoryId: string;
  }
) {
  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  try {
    const video = await db.video.update({
      where: { id: videoId, userId: user.id },
      data: {
        title: data.title,
        description: data.description,
        visibility: data.visibility,
        categoryId: data.categoryId,
      },
    });

    return video;
  } catch (error) {
    console.error("Error updating video:", error);
    throw new Error("Unable to update video");
  }
}

// ✅ Remove Video
export async function removeVideo(videoId: string) {
  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  try {
    const video = await db.video.delete({
      where: { id: videoId, userId: user.id },
    });
    return video;
  } catch (error) {
    console.error("Error deleting video:", error);
    throw new Error("Unable to delete video");
  }
}

// // ✅ Generate Thumbnail (based on Mux API)
// export async function generateThumbnail(videoId: string) {
//   const user = await getUser();
//   if (!user) {
//     throw new Error("Unauthorized");
//   }

//   try {
//     const video = await db.video.findUnique({
//       where: { id: videoId, userId: user.id },
//     });

//     if (!video) {
//       throw new Error("Video not found");
//     }

//     const muxVideo = await mux.video.assets(video.muxUploadId);

//     // Mux generates a thumbnail by default; you could interact with their API if you need specific controls.
//     const thumbnailUrl = muxVideo.data[0]?.thumbnail_url || "https://fallback-thumbnail-url.com"; // Add fallback logic if needed

//     // Update video with the new thumbnail URL
//     await db.video.update({
//       where: { id: videoId },
//       data: { thumbnailUrl },
//     });

//     return thumbnailUrl;
//   } catch (error) {
//     console.error("Error generating thumbnail:", error);
//     throw new Error("Unable to generate thumbnail");
//   }
// }

// // ✅ Restore Thumbnail (Fallback)
// export async function restoreThumbnail(videoId: string) {
//   const user = await getUser();
//   if (!user) {
//     throw new Error("Unauthorized");
//   }

//   try {
//     const video = await db.video.findUnique({
//       where: { id: videoId, userId: user.id },
//     });

//     if (!video) {
//       throw new Error("Video not found");
//     }

//     // Fallback logic for restoring thumbnail
//     const restoredThumbnailUrl = "https://your-fallback-thumbnail-url.com"; // Adjust this with actual logic if necessary

//     // Update the video to restore the thumbnail
//     await db.video.update({
//       where: { id: videoId },
//       data: { thumbnailUrl: restoredThumbnailUrl },
//     });

//     return restoredThumbnailUrl;
//   } catch (error) {
//     console.error("Error restoring thumbnail:", error);
//     throw new Error("Unable to restore thumbnail");
//   }
// }