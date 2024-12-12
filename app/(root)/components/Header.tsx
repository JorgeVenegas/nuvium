import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

const Header = () => {
  return (
    <header className="header">
      Search
      <div className="header-wrapper">
        FileUploader
        <Button type="submit" className="sign-out-button">
          <Image
            src="/assets/icons/logout.svg"
            alt="logo"
            width={24}
            height={24}
            className="w-6"
          />
        </Button>
      </div>
    </header>
  );
};

export default Header;
