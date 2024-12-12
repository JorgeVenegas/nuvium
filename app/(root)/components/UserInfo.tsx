import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface UserInfoProps {
  type: "mobile" | "sidebar";
  avatar: string;
  fullName: string;
  email: string;
}

const UserInfo = ({ type, avatar, fullName, email }: UserInfoProps) => {
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
      <div className="sm:hidden lg:block">
        <p className="subtitle-2 capitalize">{fullName}</p>
        <p className="caption">{email}</p>
      </div>
    </div>
  );
};

export default UserInfo;
