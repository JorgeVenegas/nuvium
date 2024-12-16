"use client";

import React, { createContext, useContext } from "react";

interface UserContextProps {
  fullName: string;
  email: string;
  avatar: string;
  accountId: string;
  $id: string;
}

const UserContext = createContext<UserContextProps | null>(null);

export const useUser = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

const UserProvider = ({
  children,
  currentUser,
}: {
  children: React.ReactNode;
  currentUser: UserContextProps;
}) => {
  return (
    <UserContext.Provider value={currentUser}>{children}</UserContext.Provider>
  );
};

export default UserProvider;
