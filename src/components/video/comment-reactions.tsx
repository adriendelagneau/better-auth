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
import { User } from "@prisma/client";

interface CommentReactionsProps {
  comment: {
    id: string;
    userId: string;
    videoId: string;
    content: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    user: User;
    commentLikes: { userId: string }[];
    commentDislikes: { userId: string }[];
    _count: {
      commentLikes: number;
      commentDislikes: number;
    };
  };
  onUpdate?: (updated: CommentReactionsProps["comment"]) => void;
}

const CommentReactions = ({ comment, onUpdate }: CommentReactionsProps) => {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const viewerReaction = comment.commentLikes.some(
    (l) => l.userId === user?.id
  )
    ? "like"
    : comment.commentDislikes.some((d) => d.userId === user?.id)
    ? "dislike"
    : null;

  const [, startTransition] = useTransition();

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
    startTransition(() => {
      updateOptimisticState(type);

      const action = type === "like" ? likeCommentAction : dislikeCommentAction;

      action(comment.id, comment.videoId).then((updatedComment) => {
        if (onUpdate) onUpdate(updatedComment);
      });
    });
  };

  return (
    <div className="mt-2 flex items-center">
      <Button
        variant="ghost"
        className="gap-2 rounded-full rounded-r-none pr-4"
        onClick={() => handleReaction("like")}
      >
        <ThumbsUpIcon
          className={cn(
            "size-5",
            optimisticState.reaction === "like" ? "fill-black" : "text-gray-500"
          )}
        />
        {optimisticState.likeCount}
      </Button>
      <Separator orientation="vertical" className="h-5" />
      <Button
        variant="ghost"
        className="rounded-full rounded-l-none pl-3"
        onClick={() => handleReaction("dislike")}
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
