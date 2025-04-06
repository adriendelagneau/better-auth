import React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

import { Button } from "../ui/button";
import { ListPlusIcon, MoreHorizontalIcon, ShareIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

interface VideoMenuProps {
    videoId: string;
    variant?: "ghost" | "studio";
    onRemove?: () => void;
};

const VideoMenu = ({videoId, variant, onRemove}: VideoMenuProps) => {
    const onShare = () => {
        const fullUrl = `${process.env.VERCEL_URL || "http://localhost:3000"}/videos/${videoId}`;
        navigator.clipboard.writeText(fullUrl);
        toast("Successfull copied");
    };


  return (
   <DropdownMenu>
    <DropdownMenuTrigger asChild>
        <Button variant={variant === "studio" ? "ghost" : variant} size="icon" className="rounded-full">
            <MoreHorizontalIcon/>
        </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuItem onClick={onShare}>
            <ShareIcon className="mr-2 size-4"/>
            Share
        </DropdownMenuItem>
        <DropdownMenuItem onClick={()=> {}}>
            <ListPlusIcon className="mr-2 size-4"/>
            Add to playlist                 
        </DropdownMenuItem>
        {onRemove && (
        <DropdownMenuItem onClick={()=> {}}>
            <Trash2Icon className="mr-2 size-4"/>
            Remove
        </DropdownMenuItem>
        )}
    </DropdownMenuContent>
   </DropdownMenu>
  );
};

export default VideoMenu;
