import React from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const ProfilePage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

  console.log(session);
  
  return <div>ProfilePage</div>;
};

export default ProfilePage;
