import Link from "next/link";
import React from "react";
import { AuthButton } from "./auth-button";

const Navbar = () => {
  return (
    <nav className="absolute top-0 left-0 z-5 flex h-14 w-full items-center justify-between  px-3 ">
      <div>
        <Link href={"/"}>Logo</Link>
      </div>
      <div>
        <AuthButton />
      </div>
    </nav>
  );
};

export default Navbar;
