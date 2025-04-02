import Link from "next/link";
import React from "react";
import { AuthButton } from "./auth-button";
import Image from "next/image";

const Navbar = () => {
  return (
    <nav className="absolute top-0 left-0 z-5 flex h-14 w-full items-center justify-between border-b px-3">
      <div>
        <Link href={"/"}>
          <Image src={"/lock.png"} alt="Lock" width={32} height={10} />
        </Link>
      </div>
      <div>
        <AuthButton />
      </div>
    </nav>
  );
};

export default Navbar;
