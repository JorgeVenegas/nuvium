import NavMenu from "@/app/(root)/components/NavMenu";
import UserInfo from "@/app/(root)/components/UserInfo";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <Link href="/">
        <Image
          src="/assets/icons/logo-full-brand.svg"
          alt="logo"
          width={160}
          height={50}
          className="hidden h-auto lg:block"
        />
        <Image
          src="/assets/icons/logo-brand.svg"
          alt="logo"
          width={52}
          height={52}
          className="lg:hidden"
        />
      </Link>

      <NavMenu type="sidebar" />

      <Image
        src={"/assets/images/files-2.png"}
        alt="logo"
        width={506}
        height={418}
        className="w-full"
      />

      <UserInfo type="sidebar" />
    </aside>
  );
};

export default Sidebar;
