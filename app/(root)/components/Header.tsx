import MainUtilities from "@/app/(root)/components/MainUtilities";
import Search from "@/app/(root)/components/Search";
import React from "react";

const Header = () => {
  return (
    <header className="header">
      <Search />
      <MainUtilities type="header" />
    </header>
  );
};

export default Header;
