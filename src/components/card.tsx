"use client";

import React, { useState, useTransition } from "react";
import { VideoWithUser } from "@/actions/video-action";
import { toast } from "sonner"; // Or use any toast library
import { authClient } from "@/lib/auth-client";

interface CardProps {
  video: VideoWithUser;
}

const Card = ({ video }: CardProps) => {
  const { data: session } = authClient.useSession();
  const userId = session?.user.id; // Get user ID from session
  
  // Check if the user has already liked the video
  const hasLiked = video.likes.some((like) => like.userId === userId);

  // Optimistic update state for like count
  const [optimisticLikes, setOptimisticLikes] = useState(video._count.likes);

  // Optimistic update state for icon (thumb up/thumb down or heart)
  const [optimisticLikeStatus, setOptimisticLikeStatus] = useState(hasLiked);

  const [isPending, startTransition] = useTransition();

  // Function to handle like/unlike logic
  const toggleLike = async () => {
    if (!userId) {
      // Prompt the user to log in if they are not logged in
      toast("Log in to like this video for a better experience.");
      return;
    }

    // Optimistically update the like status and count
    setOptimisticLikeStatus((prev) => !prev); // Toggle icon (liked/unliked)
    setOptimisticLikes((prev) => (hasLiked ? prev - 1 : prev + 1)); // Update like count

    startTransition(async () => {
      try {
        const endpoint = hasLiked ? "/api/unlike" : "/api/like";
        const res = await fetch(endpoint, {
          method: "POST",
          body: JSON.stringify({ videoId: video.id }),
        });

        if (!res.ok) {
          throw new Error("Failed to update like status.");
        }
      } catch (error) {
        console.error(error);
        // If the request fails, revert the optimistic update
        toast.error("Something went wrong with the like/unlike action.");
        setOptimisticLikeStatus((prev) => !prev); // Revert icon
        setOptimisticLikes((prev) => (hasLiked ? prev + 1 : prev - 1)); // Revert like count
      }
    });
  };

  return (
    <div className="border p-4 rounded shadow mb-4">
      <h3 className="text-xl font-semibold">{video.title}</h3>
      <p className="text-gray-600">{video.description}</p>
      <p className="text-sm text-gray-500">
        Posted by: {video.user?.name || "Unknown"}
      </p>

      {/* Like/Unlike button with dynamic icon */}
      <button
        onClick={toggleLike}
        className="text-xl"
        disabled={isPending}
      >
        {/* Show filled or empty icon based on optimisticLikeStatus */}
        {optimisticLikeStatus ? (
          <span role="img" aria-label="thumb-up">👍</span>  // Filled thumb (liked)
        ) : (
          <span role="img" aria-label="thumb-up">👎</span>  // Empty thumb (unliked)
        )}
      </button>

      {/* Display the optimistic like count */}
      <p>{optimisticLikes} Like{optimisticLikes === 1 ? "" : "s"}</p>
    </div>
  );
};

export default Card;
