"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface UserContextValue {
  user?: User | null;
}

const UserContext = createContext<UserContextValue>({
  user: null,
});

export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const supabase = createClient();

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user;
    },
    staleTime: Infinity,
  });

  console.log(user);

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
