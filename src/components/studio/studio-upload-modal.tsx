"use client";

import React, { useState, useTransition } from "react";
import { ResponsiveModal } from "@/components/resposive-dialog";
import { Button } from "@/components/ui/button";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { StudioUploader } from "./studio-uploader"; 
import { useRouter } from "next/navigation";
import { createVideo } from "@/actions/video-action";

const StudioUploadModal = () => {
  const router = useRouter();
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleCreateVideo = async () => {
    startTransition(async () => {
      try {
        const { video, url } = await createVideo();
        setVideoId(video.id);
        setUploadUrl(url);
        toast.success("Video created");
      } catch (error) {
        console.log(error);
        toast.error("Failed to create video");
      }
    });
  };

  const onSuccess = () => {
    if (!videoId) return;
    router.push(`/studio/videos/${videoId}`);
  };

  return (
    <>
      <ResponsiveModal title="Upload video" open={!!uploadUrl} onOpenChange={() => setUploadUrl(null)}>
        {uploadUrl ? (
          <StudioUploader endpoint={uploadUrl} onSuccess={onSuccess} />
        ) : (
          <Loader2Icon className="animate-spin" />
        )}
      </ResponsiveModal>

      <Button variant={"secondary"} onClick={handleCreateVideo} disabled={isPending} className="cursor-pointer">
        {isPending ? <Loader2Icon className="animate-spin" /> : <PlusIcon />}
        Create
      </Button>
    </>
  );
};

export default StudioUploadModal;
