"use client";

import { updateVideoThumbnail } from "@/actions/video-action";
import { ResponsiveModal } from "@/components/resposive-dialog";
import { UploadDropzone } from "@/lib/uploadThing";
import { useRouter } from "next/navigation";

interface ThumbnailUploadModalProps {
  videoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface UploadResponse {
  url: string;
}

const ThumbnailUploadModal = ({
  videoId,
  open,
  onOpenChange,
}: ThumbnailUploadModalProps) => {

  const router = useRouter();

  const onUploadComplete = async (res: UploadResponse[]) => {
    try {
      await updateVideoThumbnail(videoId, res[0].url);
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating thumbnail:", error);
    }
  };

  return (
    <ResponsiveModal
      title="Upload a thumbnail"
      open={open}
      onOpenChange={onOpenChange}
    >
      <UploadDropzone
        endpoint="thumbnailUploader"
        input={{ videoId }}
        onClientUploadComplete={onUploadComplete}
      />
    </ResponsiveModal>
  );
};

export default ThumbnailUploadModal;
