"use client";

import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";

interface User {
  name: string;
  id: number;
  email: string;
  image: string;
  designation: string;
  buccDepartment: string;
}

interface UserContextProps {
  user: User | null;
  isLoading: boolean;
}

const UserContext = createContext<UserContextProps>({
  user: null,
  isLoading: true,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") {
      setIsLoading(true);
    } else {
      setIsLoading(false);
      setUser((session?.user as User) || null);
    }
  }, [session, status]);

  return (
    <UserContext.Provider value={{ user, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
