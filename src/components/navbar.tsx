import Link from "next/link";
import React from "react";
import UserButton from "./user-button";

const Navbar = () => {
  return (
    <nav className="flex h-14 w-full items-center absolute top-0 left-0 z-5 justify-between bg-sky-800 px-3 text-white">
      <div>
        <Link href={"/"}>Logo</Link>
      </div>
      <div>
       <UserButton/>
      </div>
    </nav>
  );
};

export default Navbar;
