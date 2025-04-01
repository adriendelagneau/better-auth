"use client";

import React from "react";
import { ClapperboardIcon, LogOutIcon, UserRound } from "lucide-react";
import LogoutButton from "./logout-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

const UserButton = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  // Ensure image is either a valid string URL/Base64 or undefined
  const imageSrc =
    user?.image &&
    (user.image.startsWith("http") || user.image.startsWith("data:image"))
      ? user.image
      : undefined;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          {imageSrc ? (
            <AvatarImage src={imageSrc} alt="User Avatar" />
          ) : (
            <AvatarFallback className="bg-sky-500">
              <UserRound className="text-white" />
            </AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        <DropdownMenuItem>
          <Link href={"/profile"} className="flex w-full gap-x-2">
            <ClapperboardIcon className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Link href={"/studio"} className="flex w-full gap-x-2">
            <ClapperboardIcon className="mr-2 h-4 w-4" />
            Studio
          </Link>
        </DropdownMenuItem>
        <LogoutButton>
          <DropdownMenuItem className="cursor-pointer">
            <LogOutIcon className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
