"use client";


import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import React from "react";

interface LogoutButtonProps {
  children: React.ReactNode;
}

const LogoutButton = ({ children }: LogoutButtonProps) => {

  const router = useRouter();

  const handleSignout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in"); // redirect to login page
        },
      },
    });
  };
  return (
    <span onClick={handleSignout} className="cursor-pointer">
      {children}
    </span>
  );
};

export default LogoutButton;
