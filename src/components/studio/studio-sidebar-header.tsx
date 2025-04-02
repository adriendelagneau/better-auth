
import {
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import UserAvatar from "./user-avatar";
import { User } from "@prisma/client";

import Link from "next/link";
import React from "react";

interface StudioSidebarHeaderProps {
  user: User | null;
}


const StudioSidebarHeader =  ({user}: StudioSidebarHeaderProps) => {
   

  const { state } = useSidebar();



  if (state === "collapsed") {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton tooltip="Your profile" asChild className="flex justify-center" >
          <Link href={"/users/current"} >
            <UserAvatar
              imageUrl={user?.image  || "/avatar-default.png"}
              name={user?.name ?? "John"}
              size={"sm"}
            />
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }
  return (
    <SidebarHeader className="flex items-center justify-center pb-4">
      <Link href={"/users/current"}>
        <UserAvatar
          imageUrl={user?.image || "/avatar-default.png"}
          name={user?.name ?? "John"}
          className="size-[112px] hover:opacity:80 transition"
          //   onClick={() => {}}
        />
      </Link>
      <div className="flex flex-col items-center mt-2 gap-y-1">
        <p className="text-sm font-medium">Your profile</p>
        <p className="text-xs text-muted-foreground">{user?.name}</p>
      </div>
    </SidebarHeader>
  );
};

export default StudioSidebarHeader;
