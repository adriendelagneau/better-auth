import { User } from "@prisma/client";
import Link from "next/link";
import React from "react";
import UserAvatar from "../studio/user-avatar";

import { Button } from "../ui/button";
import SubscriptionButton from "../subscription-button";
import { authClient } from "@/lib/auth-client";
import UserInfo from "./user-info";
import { useTransition, useOptimistic } from "react";
import { toggleSubscription } from "@/actions/video-action";

interface VideoOwnerProps {
  user: User;
  videoId: string;
}
const VideoOwner = ({ user, videoId }: VideoOwnerProps) => {
  const { data: session } = authClient.useSession();
  const [isPending, startTransition] = useTransition();
  const [optimisticSubscribed, setOptimisticSubscribed] = useOptimistic(false);

  const handleSubscription = () => {
    if (!session?.user) {
      // Show login/register popup
      return alert("Please sign in to subscribe.");
    }

    setOptimisticSubscribed((prev) => !prev);

    startTransition(async () => {
      // Call your server action to toggle subscription
      await toggleSubscription(videoId);
      // Optionally revalidatePath()
    });
  };

  const isOwner = session?.user?.id === user.id;

  return (
    <div className="flex min-w-0 items-center justify-between gap-3 sm:items-start sm:justify-start">
      <Link href={`/users/${user.id}`}>
        <div className="flex min-w-0 items-center gap-3">
          <UserAvatar
            size="lg"
            imageUrl={user.image || ""}
            name={user.name || "Unknown User"}
          />
          <div className="flex min-w-0 flex-col gap-1">
            <UserInfo size="lg" name={user.name || "Unknown User"} />
            <span className="text-muted-foreground line-clamp-1 text-sm">
              {123} subscribers {/* Replace with real count */}
            </span>
          </div>
        </div>
      </Link>

      {isOwner ? (
        <Button variant="secondary" className="rounded-full" asChild>
          <Link href={`/studio/videos/${videoId}`}>Edit video</Link>
        </Button>
      ) : (
        <SubscriptionButton
          onClick={handleSubscription}
          disabled={isPending}
          isSubscribed={optimisticSubscribed}
          className="flex-none"
        />
      )}
    </div>
  );
};

export default VideoOwner;