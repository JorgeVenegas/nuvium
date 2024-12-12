import Header from "@/app/(root)/components/Header";
import MobileNavigation from "@/app/(root)/components/MobileNavigation";
import Sidebar from "@/app/(root)/components/Sidebar";
import { getCurrentuser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import React from "react";

const Layout = async ({ children }: { children: React.ReactNode }) => {

  const currentUser = await getCurrentuser();

  if (!currentUser) redirect("/sign-in")

  return (
    <main className="flex h-screen">
      <Sidebar {...currentUser}/>
      <section className="flex h-full flex-1 flex-col">
        <MobileNavigation />
        <Header />
        <div className="main-content"> {children}</div>
      </section>
    </main>
  );
};

export default Layout;
