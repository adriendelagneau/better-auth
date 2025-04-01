"use client";

import { Button } from "./ui/button";
import { UserCircleIcon } from "lucide-react";
import UserButton from "./user-button";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export const AuthButton = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  return (
    <div className="w-24 text-right">
      {user ? (
        <UserButton />
      ) : (
        <Link href={"sign-in"} className="cursor-pointer">
          <Button
            variant={"ghost"}
            className="px-4 py-2 font-medium text-blue-600 hover:text-blue-500 rounded-full shadow-none border-blue-500/20"
          >
            <UserCircleIcon />
            Sign In
          </Button>
        </Link>
      )}
    </div>
  );
};
