"use client";

import Image from "next/image";
import React, { useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import UserInfo from "@/app/(root)/components/UserInfo";
import { Separator } from "@/components/ui/separator";
import NavMenu from "@/app/(root)/components/NavMenu";
import MainUtilities from "@/app/(root)/components/MainUtilities";

const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header className="mobile-header">
      <Image
        src="/assets/icons/logo-full-brand.svg"
        alt="logo"
        width={120}
        height={52}
        className="h-auto"
      />

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger>
          <Image
            src="/assets/icons/menu.svg"
            alt="logo"
            width={30}
            height={30}
            className="h-auto"
          />
        </SheetTrigger>
        <SheetContent className="shad-sheet h-screen px-3">
          <SheetTitle>
            <UserInfo type="mobile" />
            <Separator className="mb-4 bg-light-200/20" />
          </SheetTitle>
          <NavMenu type="mobile" />
          <Separator className="my-5 bg-light-200/20" />
          <MainUtilities type="mobile" />
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default MobileNavigation;
