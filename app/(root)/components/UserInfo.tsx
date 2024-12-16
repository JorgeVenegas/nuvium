"use client";

import SignOutButton from "@/app/(root)/components/SignOutButton";
import { useUser } from "@/app/(root)/components/UserProvider";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface UserInfoProps {
  type: "mobile" | "sidebar";
}

const UserInfo = ({ type }: UserInfoProps) => {
  const { avatar, fullName, email } = useUser();
  return (
    <div
      className={cn(
        type === "sidebar" && "sidebar-user-info",
        type === "mobile" && "header-user"
      )}
    >
      <Image
        src={
          avatar ||
          "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/default-avatar-profile-picture-male-icon.png"
        }
        alt="Avatar"
        width={44}
        height={44}
        className={cn(
          type === "sidebar" && "sidebar-user-avatar",
          type === "mobile" && "header-user-avatar"
        )}
      />
      <div className="sm:hidden lg:block flex-1">
        <p className="subtitle-2 capitalize">{fullName}</p>
        <p className="caption">{email}</p>
      </div>
      {type === "mobile" && <SignOutButton />}
    </div>
  );
};

export default UserInfo;
