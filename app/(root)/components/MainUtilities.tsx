"use client";

import FileUploader from "@/app/(root)/components/FileUploader";
import SignOutButton from "@/app/(root)/components/SignOutButton";
import { cn } from "@/lib/utils";
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
      {type === "header" && <SignOutButton />}
    </div>
  );
};

export default MainUtilities;
