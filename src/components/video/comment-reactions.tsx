"use client";

import React, { useOptimistic, useTransition } from "react";
import { Button } from "../ui/button";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { authClient } from "@/lib/auth-client";
import {
  likeCommentAction,
  dislikeCommentAction,
} from "@/actions/video-action";

import { FullComment } from "@/app/types";

interface CommentReactionsProps {
  comment: FullComment;
}

const CommentReactions = ({ comment }: CommentReactionsProps) => {

  const { data: session } = authClient.useSession();
  const user = session?.user;

  const viewerReaction = comment.commentLikes.some((l) => l.userId === user?.id)
    ? "like"
    : comment.commentDislikes.some((d) => d.userId === user?.id)
      ? "dislike"
      : null;


  const [isPending, startTransition] = useTransition();
  console.log(isPending);

  const [optimisticState, updateOptimisticState] = useOptimistic(
    {
      reaction: viewerReaction,
      likeCount: comment._count.commentLikes,
      dislikeCount: comment._count.commentDislikes,
    },
    (state, newReaction: "like" | "dislike") => {
      const alreadyReacted = state.reaction === newReaction;

      if (alreadyReacted) {
        return {
          ...state,
          reaction: null,
          likeCount:
            newReaction === "like" ? state.likeCount - 1 : state.likeCount,
          dislikeCount:
            newReaction === "dislike"
              ? state.dislikeCount - 1
              : state.dislikeCount,
        };
      }

      return {
        reaction: newReaction,
        likeCount:
          newReaction === "like"
            ? state.likeCount + 1
            : state.reaction === "like"
              ? state.likeCount - 1
              : state.likeCount,
        dislikeCount:
          newReaction === "dislike"
            ? state.dislikeCount + 1
            : state.reaction === "dislike"
              ? state.dislikeCount - 1
              : state.dislikeCount,
      };
    }
  );

  const handleReaction = (type: "like" | "dislike") => {
    // Start the transition, which will include the state update inside
    startTransition(async() => {
      // Optimistically update the reaction state
      updateOptimisticState(type);
      
      // Perform the actual server-side action
      if (type === "like") {
       await likeCommentAction(comment.id, comment.videoId);
      } else {
       await dislikeCommentAction(comment.id, comment.videoId);
      }
    });
  };


  return (
    <div className="flex flex-none items-center">
      <Button
        variant="secondary"
        className="cursor-pointer gap-2 rounded-full rounded-r-none pr-4"
        onClick={() => handleReaction("like")}
        // disabled={isPending}
      >
        <ThumbsUpIcon
          className={cn(
            "size-5",
            optimisticState.reaction === "like" ? "fill-black" : "text-gray-500"
          )}
        />
        {optimisticState.likeCount}
      </Button>
      <Separator orientation="vertical" className="h-7" />
      <Button
        variant="secondary"
        className="cursor-pointer rounded-full rounded-l-none pl-3"
        onClick={() => handleReaction("dislike")}
        // disabled={isPending}
      >
        <ThumbsDownIcon
          className={cn(
            "size-5",
            optimisticState.reaction === "dislike"
              ? "fill-black"
              : "text-gray-500"
          )}
        />
        {optimisticState.dislikeCount}
      </Button>
    </div>
  );
};
export default CommentReactions;
