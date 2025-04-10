"use server";

import { getUser } from "@/lib/auth-session";
import db from "@/lib/prisma";
import { z } from "zod";
import Mux from "@mux/mux-node";
import { Video } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { commentSchema } from "@/lib/zod";
import { VideoWithUser } from "@/app/types";

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

export async function getUserVideos(): Promise<Video[]> {
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
export async function getVideoById(videoId: string): Promise<VideoWithUser | null> {
  try {
    const video = await db.video.findUnique({
      where: { id: videoId },
      include: {
        user: true,
        likes: true,
        dislikes: true,
        comments: {
          include: {
            user: true,
            commentLikes: true,
            commentDislikes: true,
            _count: {
              select: {
                commentLikes: true,
                commentDislikes: true,
              },
            },
          },
        },
        _count: {
          select: {
            likes: true,
            dislikes: true,
            comments: true,
          },
        },
      },
    });

    if (!video) {
      throw new Error("Video not found");
    }

    return video as unknown as VideoWithUser;
  } catch (error) {
    console.error("Error fetching video:", error);
    throw new Error("Failed to fetch video");
  }
}

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

export async function updateVideoThumbnail(videoId: string, thumbnailUrl: string) {
  try {
    await db.video.update({
      where: { id: videoId },
      data: { thumbnailUrl },
    });
  } catch (error) {
    console.error("Failed to update video thumbnail:", error);
    throw new Error("Failed to update video thumbnail");
  }
}

export async function getFilteredVideos({
  cursor,
  limit = 10,
  categoryId,
  query,
  userId,
}: {
  cursor?: string;
  limit?: number;
  categoryId?: string;
  query?: string;
  userId?: string;
}) {
  try {
    const videos = await db.video.findMany({
      take: limit + 1, // Fetch one extra to check if there's a next page
      where: {
        visibility: "public",
        ...(categoryId ? { categoryId } : {}),
        ...(userId ? { userId } : {}),
        ...(query
          ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
            ],
          }
          : {}),
      },
      orderBy: { createdAt: "desc" },
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
    });

    let nextCursor = null;
    if (videos.length > limit) {
      nextCursor = videos.pop()?.id; // Get the last item's ID as the next cursor
    }

    return { videos, nextCursor };
  } catch (error) {
    console.error("Error fetching videos:", error);
    throw new Error("Failed to fetch videos");
  }
}




const videoIdSchema = z.string().uuid(); // If your videoId is a UUID

export const incrementVideoView = async (videoId: string) => {
  const parsed = videoIdSchema.safeParse(videoId);

  if (!parsed.success) {
    console.error("Invalid videoId:", parsed.error.format());
    throw new Error("Invalid video ID");
  }
  
  try {
    const updatedVideo = await db.video.update({
      where: {
        id: parsed.data,
      },
      data: {
        videoViews: {
          increment: 1,
        },
      },
    });

    revalidatePath("/videos"); // Or more specific: `/videos/${videoId}`
    return updatedVideo;
  } catch (error) {
    console.error("Error incrementing video views:", error);
    throw new Error("Failed to increment video views");
  }
};

const toggleSubscriptionSchema = z.object({
  creatorId: z.string(), // assuming you're using UUIDs
});

export const toggleSubscription = async (rawInput: unknown) => {
  const parsed = toggleSubscriptionSchema.safeParse(rawInput);
  
  if (!parsed.success) {
    console.error(parsed.error.flatten());
    throw new Error("Invalid data");
  }
  
  const { creatorId } = parsed.data;
  const user = await getUser();
  
  if (!user) {
    throw new Error("Unauthorized");
  }
  
  if (user.id === creatorId) {
    throw new Error("You can't subscribe to yourself!");
  }
  
  const existingSub = await db.subscription.findUnique({
    where: {
      viewerId_creatorId: {
        viewerId: user.id,
        creatorId,
      },
    },
  });
  
  // Toggle the subscription
  if (existingSub) {
    // Unsubscribe
    await db.subscription.delete({
      where: {
        viewerId_creatorId: {
          viewerId: user.id,
          creatorId,
        },
      },
    });
    // Trigger revalidation for the creator’s page
    revalidatePath(`/users/${creatorId}`);
    return { status: "unsubscribed" };
  } else {
    // Subscribe
    await db.subscription.create({
      data: {
        viewerId: user.id,
        creatorId,
      },
    });
    // Trigger revalidation for the creator’s page
    revalidatePath(`/users/${creatorId}`);
    return { status: "subscribed" };
  }
};

export async function likeVideoAction(videoId: string) {
  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  
  const userId = user.id;
  
  const existingLike = await db.like.findUnique({
    where: {
      userId_videoId: {
        userId,
        videoId,
      },
    },
  });
  
  const existingDislike = await db.dislike.findUnique({
    where: {
      userId_videoId: {
        userId,
        videoId,
      },
    },
  });

  // Toggle like
  if (existingLike) {
    await db.like.delete({
      where: { userId_videoId: { userId, videoId } },
    });
  } else {
    if (existingDislike) {
      await db.dislike.delete({
        where: { userId_videoId: { userId, videoId } },
      });
    }
    await db.like.create({
      data: { userId, videoId },
    });
  }
  revalidatePath(`/videos/${videoId}`);
}

export async function dislikeVideoAction(videoId: string) {
  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  
  const userId = user.id;
  
  const existingDislike = await db.dislike.findUnique({
    where: {
      userId_videoId: {
        userId,
        videoId,
      },
    },
  });
  
  const existingLike = await db.like.findUnique({
    where: {
      userId_videoId: {
        userId,
        videoId,
      },
    },
  });
  
  // Toggle dislike
  if (existingDislike) {
    await db.dislike.delete({
      where: { userId_videoId: { userId, videoId } },
    });
  } else {
    if (existingLike) {
      await db.like.delete({
        where: { userId_videoId: { userId, videoId } },
      });
    }
    await db.dislike.create({
      data: { userId, videoId },
    });
  }
  
  revalidatePath(`/videos/${videoId}`);
}

export async function addComment(videoId: string, content: string) {
  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  
  const parsed = commentSchema.safeParse({ videoId, content });
  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message || "Invalid input");
  }

  const { videoId: validVideoId, content: validContent } = parsed.data;
  
  const newComment = await db.comment.create({
    data: {
      content: validContent,
      videoId: validVideoId,
      userId: user.id,
    },
  });
  
  revalidatePath(`/videos/${videoId}`);
  return newComment;
}
// actions/comments-actions.ts
export async function deleteComment(commentId: string) {
  const user = await getUser(); // Get the currently logged-in user
  
  if (!user) {
    throw new Error("Unauthorized");
  }
  
  // Fetch the comment to ensure the user is the owner
  const comment = await db.comment.findUnique({
    where: { id: commentId },
  });
  
  if (!comment) {
    throw new Error("Comment not found");
  }
  
  // Check if the current user is the owner of the comment
  if (comment.userId !== user.id) {
    throw new Error("You can only delete your own comments");
  }
  
  try {
    // If the user is authorized, delete the comment
    await db.comment.delete({
      where: { id: commentId },
    });
    
    revalidatePath(`/videos/${comment.videoId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete comment:", error);
    return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" };
  }
}

export async function getCommentsByVideoId(videoId: string) {
  try {
    const comments = await db.comment.findMany({
      where: { videoId },
      orderBy: {
        createdAt: "desc", // latest first
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
    
    return comments;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    return [];
  }
}



export async function likeCommentAction(commentId: string, videoId: string) {
  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const userId = user.id;

  const existingLike = await db.commentLike.findUnique({
    where: {
      userId_commentId: {
        userId,
        commentId,
      },
    },
  });

  const existingDislike = await db.commentDislike.findUnique({
    where: {
      userId_commentId: {
        userId,
        commentId,
      },
    },
  });

  if (existingLike) {
    await db.commentLike.delete({
      where: { userId_commentId: { userId, commentId } },
    });


  } else {
    if (existingDislike) {
      await db.commentDislike.delete({
        where: { userId_commentId: { userId, commentId } },
      });
    }
    await db.commentLike.create({
      data: { userId, commentId },
    });


  }
  revalidatePath(`/videos/${videoId}`);

}


export async function dislikeCommentAction(commentId: string, videoId: string) {
  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const userId = user.id;

  const existingDislike = await db.commentDislike.findUnique({
    where: {
      userId_commentId: {
        userId,
        commentId,
      },
    },
  });

  const existingLike = await db.commentLike.findUnique({
    where: {
      userId_commentId: {
        userId,
        commentId,
      },
    },
  });

  if (existingDislike) {
    await db.commentDislike.delete({
      where: { userId_commentId: { userId, commentId } },
    });
  } else {
    if (existingLike) {
      await db.commentLike.delete({
        where: { userId_commentId: { userId, commentId } },
      });


    }
    await db.commentDislike.create({
      data: { userId, commentId },
    });
 
  }

  revalidatePath(`/videos/${videoId}`);

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