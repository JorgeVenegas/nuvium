"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions/user.actions";
import Image from "next/image";
import React from "react";

const SignOutButton = () => {
  return (
    <Button type="submit" className="sign-out-button" onClick={() => signOut()}>
      <Image
        src="/assets/icons/logout.svg"
        alt="logo"
        width={24}
        height={24}
        className={"w-6"}
      />
    </Button>
  );
};

export default SignOutButton;
