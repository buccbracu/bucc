"use client";

import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

export interface User {
  name: string;
  id: number;
  email: string;
  image: string;
  designation: string;
  buccDepartment: string;
}

interface UserContextProps {
  user: any | null;
  isLoading: boolean;
  setUser: (user: any | null) => void;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextProps>({
  user: null,
  isLoading: true,
  setUser: () => {},
  refreshUser: async () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const sessionData = useSession();
  const session = sessionData?.data;
  const status = sessionData?.status;
  const update = sessionData?.update;

  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      if (update) {
        const newSession = await update();
        if (newSession?.user) {
          setUser(newSession.user);
          return;
        }
      }
      const fresh = await authClient.getSession();
      if (fresh?.data?.user) {
        setUser(fresh.data.user);
      }
    } catch (e) {
      console.error("Failed to refresh user:", e);
    }
  };

  useEffect(() => {
    if (status === "loading") {
      setIsLoading(true);
    } else {
      setIsLoading(false);
      setUser(session?.user || null);
    }
  }, [session, status]);

  return (
    <UserContext.Provider value={{ user, isLoading, setUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
