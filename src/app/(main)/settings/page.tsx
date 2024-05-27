"use client";
import { auth } from "@/auth";
import { useEffect, useState } from "react";
import { Session } from "next-auth";
export const maxDuration = 60;
export default function Settings() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSession() {
      const sessionData = await auth();
      setSession(sessionData);
      setLoading(false);
    }

    fetchSession();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!session?.user) return <p>No user session found</p>;

  return (
    <div>
      <p>{JSON.stringify(session)}</p>
      <p>{session.user.userRole}</p>
    </div>
  );
}
