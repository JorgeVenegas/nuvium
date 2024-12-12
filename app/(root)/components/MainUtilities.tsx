"use client";

import FileUploader from "@/app/(root)/components/FileUploader";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions/user.actions";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface MainUtilitiesProps {
  type: "mobile" | "header";
}

const MainUtilities = ({ type }: MainUtilitiesProps) => {
  return (
    <div
      className={cn(
        type === "header" && "header-wrapper",
        type === "mobile" && "mobile-wrapper"
      )}
    >
      <FileUploader />
      <Button
        type="submit"
        className={cn(
          type === "header" && "sign-out-button",
          type === "mobile" && "mobile-sign-out-button"
        )}
        onClick={() => signOut()}
      >
        <Image
          src="/assets/icons/logout.svg"
          alt="logo"
          width={24}
          height={24}
          className={cn(type === "header" && "w-6")}
        />
        {type === "mobile" && <p>Logout</p>}
      </Button>
    </div>
  );
};

export default MainUtilities;
