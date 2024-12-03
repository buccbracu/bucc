import { User, useUser } from "@/context/UserContext";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const SyncSessionWithUserProvider = () => {
  const { data: session } = useSession();
  const { setUser } = useUser();

  useEffect(() => {
    if (session?.user) {
      const mappedUser: User = {
        name: session.user.name || "",
        id: session.user.id || 0,
        email: session.user.email || "",
        image: session.user.image || "",
        designation: session.user.designation || "",
        buccDepartment: session.user.buccDepartment || "",
      };
      setUser(mappedUser);
    }
  }, [session, setUser]);

  return null;
};

export default SyncSessionWithUserProvider;
