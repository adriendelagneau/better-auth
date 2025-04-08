"use client";

import { addComment, VideoWithUser } from "@/actions/video-action";

import React from "react";
import UserAvatar from "../studio/user-avatar";
import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "../ui/form";
import { commentSchema } from "@/lib/zod";

interface CommentFormProps {
  video: VideoWithUser;
  onSuccess?: () => void;
}

const CommentForm = ({ video }: CommentFormProps) => {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      videoId: video.id,
      content: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof commentSchema>) => {
 try {
   addComment(values.videoId, values.content);

 }catch(err) {
  console.log(err);
 }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="group flex gap-4"
      >
        <UserAvatar
          imageUrl={user?.image || "/default-avatar.png"}
          size={"lg"}
          name={user?.name || "User"}
        />
        <div className="flex-1">
          <FormField
            name="content"
            control={form.control}
            render={({ field }) => (
              <Textarea
                {...field}
                className="min-h-0 resize-none overflow-hidden bg-transparent"
                placeholder="Add a comment..."
              />
            )}
          />
          <div className="mt-2 flex justify-end gap-2">
            <Button type="submit" size={"sm"}>
              Comment
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CommentForm;
