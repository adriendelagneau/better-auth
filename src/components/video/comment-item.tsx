"use client";

import Link from "next/link";
import React, { useState, useTransition } from "react";
import UserAvatar from "../studio/user-avatar";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MessageSquareIcon, MoreVerticalIcon, Trash2Icon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { deleteComment } from "@/actions/video-action";
import { Comment } from "@/app/types";


interface CommentItemProps {
  comment: Comment
}

const CommentItem = ({ comment: initialComment }: CommentItemProps) => {
  const [comment] = useState(initialComment);
  const { data: session } = authClient.useSession();
  const userId = session?.user.id;

  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    if (!userId) return;
    startTransition(async () => {
      try {
        await deleteComment(comment.id);
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    });
  };



  return (
    <div>
      <div className="flex gap-4">
        <Link href={`/users/${comment.userId}`}>
          <UserAvatar
            size={"lg"}
            imageUrl={comment.user.image || "/default-avatar.png"}
            name={comment.user.name || "john doe"}
          />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="gab-6 mb-0.5 flex items-center">
            <div className="pb-0.5 text-sm font-medium pr-3">
              {comment.user.name}
            </div>
            <div className="text-muted-foreground text-xs">
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
              })}
            </div>
          </div>

          <p className="text-sm">{comment.content}</p>
          {/* <CommentReactions comment={comment} onUpdate={setComment} /> */}
        </div>

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} size={"icon"} className="size-8 cursor-pointer">
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => {}}>
              <MessageSquareIcon className="size-4" />
              Reply
            </DropdownMenuItem>
            {comment.userId === userId && (
              <DropdownMenuItem onClick={handleDelete} disabled={isPending}>
                <Trash2Icon className="size-4" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default CommentItem;
