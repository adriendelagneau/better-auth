import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";


const userInfoVariants = cva("flex items-center gap-1", {
  variants: {
    size: {
      default: "[&_p]:text-sm [&_svg]:size-4",
      sm: "[&_p]:text-xs [&_svg]:size-3.5 ",
      lg: "[&_p]:text-base [&_svg]:size-5 [&_p]:font-medium [&_p]:text-black",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface UserInfoProps extends VariantProps<typeof userInfoVariants> {
  name: string;
  className?: string;
};

const UserInfo = ({name, className, size}: UserInfoProps) => {
  return(
      <div className={cn(userInfoVariants({size, className}))}>
        <Tooltip>
            <TooltipTrigger asChild>
                <p className="text-gray-500 hover:text-gray-800 line-clamp-1">
                    {name}
                </p>
            </TooltipTrigger>
            <TooltipContent align="center" className="bg-black/70">
                <p>{name}</p>
            </TooltipContent>
        </Tooltip>
      </div>
    ) ;
};

export default UserInfo;
