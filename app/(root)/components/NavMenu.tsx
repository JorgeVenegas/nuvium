"use client";

import { navItems } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface NavMenuProps {
  type: "mobile" | "sidebar";
}

const NavMenu = ({ type }: NavMenuProps) => {
  const pathname = usePathname();
  return (
    <nav
      className={cn(
        type === "sidebar" && "sidebar-nav",
        type === "mobile" && "mobile-nav"
      )}
    >
      <ul
        className={cn(
          type === "sidebar" && "sidebar-nav-list",
          type === "mobile" && "mobile-nav-list"
        )}
      >
        {navItems.map(({ url, name, icon }) => (
          <Link key={name} href={url} className="lg:w-full">
            <li
              className={cn(
                type === "sidebar" && "sidebar-nav-item",
                type === "mobile" && "mobile-nav-item",
                pathname === url && "shad-active"
              )}
            >
              <Image
                src={icon}
                alt={name}
                width={24}
                height={24}
                className={cn(
                  "nav-icon",
                  pathname === url && "nav-icon-active"
                )}
              />
              <p className={cn(
                type === "sidebar" && "hidden lg:block"
              )}>{name}</p>
            </li>
          </Link>
        ))}
      </ul>
    </nav>
  );
};

export default NavMenu;
